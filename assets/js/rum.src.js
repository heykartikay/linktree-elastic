import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { ExceptionInstrumentation } from '@opentelemetry/instrumentation-web-exception';
import { WebVitalsInstrumentation } from '@opentelemetry/browser-instrumentation/experimental/web-vitals';
import { Resource } from '@opentelemetry/resources';

// Injected at build time by esbuild define — never hardcoded in source
const endpoint = __OTLP_ENDPOINT__;
const headers  = __OTLP_HEADERS__;

if (!endpoint) {
  console.warn('[RUM] OTEL_EXPORTER_OTLP_ENDPOINT not set — skipping RUM init');
} else {
  // Parse "Authorization=ApiKey xxx" header string
  const parsedHeaders = {};
  String(headers || '').split(',').forEach(h => {
    const idx = h.indexOf('=');
    if (idx > -1) parsedHeaders[h.slice(0, idx).trim()] = h.slice(idx + 1).trim();
  });

  const provider = new WebTracerProvider({
    resource: new Resource({
      'service.name':            'elastic-community-vercel',
      'service.version':         '1.0.0',
      'deployment.environment':  'production',
      'telemetry.sdk.language':  'webjs',
    }),
  });

  provider.addSpanProcessor(
    new BatchSpanProcessor(
      new OTLPTraceExporter({
        url:     `${endpoint}/v1/traces`,
        headers: parsedHeaders,
      })
    )
  );

  provider.register();

  registerInstrumentations({
    instrumentations: [
      // Page load timings — populates "page load and visits" section
      new DocumentLoadInstrumentation(),

      // Unhandled JS errors — populates "errors" section
      new ExceptionInstrumentation(),

      // LCP, FID, CLS, FCP, TTFB — populates "web vitals" section
      new WebVitalsInstrumentation(),
    ],
  });
}
