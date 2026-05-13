import { init as initApm } from '@elastic/apm-rum';

// Injected at build time by esbuild define
const serverUrl = __APM_SERVER_URL__;
const apiKey    = __APM_API_KEY__;

if (!serverUrl) {
  console.warn('[APM RUM] APM_SERVER_URL not set — skipping RUM init');
} else {
  initApm({
    serviceName:    'elastic-community-vercel',
    serverUrl,
    apiKey,
    serviceVersion: '1.0.0',
    environment:    'production',
  });
}
