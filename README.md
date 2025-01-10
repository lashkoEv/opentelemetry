# Opentelemetry

### Adding to the application
To add OpenTelemetry to your application, add a dependency to `package.json`:

```
"dependencies": {
    ...
    "opentelemetry": "git+https://<token>@gitlab.cleveroad.com/internal/web/modules/opentelemetry.git"
}
```

### Usage

1. Import `createTracingSDK` from `opentelemetry` module **first** among all dependencies in `local-nest-app.ts`.
```
import { createTracingSDK } from 'opentelemetry';

import { NestFactory } from '@nestjs/core';
...
```
2. Call the `createTracingSDK` method and pass it the application name, then start tracing. Tracing should be started before creating the application instance.
```
const tracingSDK = createTracingSDK(<app-name>);
tracingSDK.start();
```
3. Run Jaeger via docker using the following command:
```
docker run -d --name jaeger -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 -e COLLECTOR_OTLP_ENABLED=true -p 6831:6831/udp -p 6832:6832/udp -p 5778:5778 -p 16686:16686 -p 4317:4317 -p 4318:4318 -p 14250:14250 -p 14268:14268 -p 14269:14269 -p 9411:9411 jaegertracing/all-in-one:1.41
```
4. Launch the application.
5. The trace for your application is available at http://localhost:16686/