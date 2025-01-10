import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { SequelizeInstrumentation } from 'opentelemetry-instrumentation-sequelize';

const startLocalTracing = async (serviceName: string, exporterEndpoint: string = 'http://localhost:14268/api/traces') => {
    const jaegerExporter = new JaegerExporter({
        endpoint: exporterEndpoint,
    });

    console.log(`[Tracing] Starting tracing for service: ${serviceName}`);

    const tracingSDK = new NodeSDK({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
        spanProcessor: new SimpleSpanProcessor(jaegerExporter),
        instrumentations: [
            new HttpInstrumentation(),
            new ExpressInstrumentation(),
            new NestInstrumentation(),
            new SequelizeInstrumentation(),
        ],
    });

    try {
        await tracingSDK.start();
        console.log(`[Tracing] Tracing started successfully for service: ${serviceName}`);
    } catch (err) {
        console.error(`[Tracing] Failed to start tracing for service: ${serviceName}`, err);
    }
};

export { startLocalTracing };
