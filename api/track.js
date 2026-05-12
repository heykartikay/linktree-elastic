const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { Resource } = require('@opentelemetry/resources');
const { trace, SpanKind, SpanStatusCode } = require('@opentelemetry/api');

// Parse OTEL_EXPORTER_OTLP_HEADERS="Authorization=ApiKey xxx,X-Other=val"
function parseHeaders(str) {
  const out = {};
  if (!str) return out;
  for (const part of str.split(',')) {
    const idx = part.indexOf('=');
    if (idx > -1) out[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  }
  return out;
}

// Parse OTEL_RESOURCE_ATTRIBUTES="service.name=x,service.version=y"
function parseAttrs(str) {
  const out = {};
  if (!str) return out;
  for (const part of str.split(',')) {
    const idx = part.indexOf('=');
    if (idx > -1) out[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  }
  return out;
}

// Provider is cached across warm invocations
let _provider;
function getProvider() {
  if (_provider) return _provider;

  const exporter = new OTLPTraceExporter({
    url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
    headers: parseHeaders(process.env.OTEL_EXPORTER_OTLP_HEADERS),
  });

  _provider = new NodeTracerProvider({
    resource: new Resource(parseAttrs(process.env.OTEL_RESOURCE_ATTRIBUTES)),
  });

  _provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  _provider.register();
  return _provider;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, region, link, url, referrer } = req.body || {};
  if (!type) return res.status(400).json({ error: 'Missing type' });

  const provider = getProvider();
  const tracer = trace.getTracer('elastic-community-links', '1.0.0');

  const spanName = type === 'page_view' ? 'page.view' : 'link.click';

  const span = tracer.startSpan(spanName, { kind: SpanKind.SERVER });
  span.setAttributes({
    'page.region': region || 'index',
    'event.type': type,
    ...(link     && { 'link.title': link }),
    ...(url      && { 'link.url': url }),
    ...(referrer && { 'http.referrer': referrer }),
  });
  span.setStatus({ code: SpanStatusCode.OK });
  span.end();

  // Flush before the function shuts down
  await provider.forceFlush();

  return res.status(200).json({ ok: true });
};
