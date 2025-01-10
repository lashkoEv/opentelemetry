"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startLocalTracing = void 0;
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const sdk_node_1 = require("@opentelemetry/sdk-node");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const exporter_jaeger_1 = require("@opentelemetry/exporter-jaeger");
const instrumentation_http_1 = require("@opentelemetry/instrumentation-http");
const instrumentation_express_1 = require("@opentelemetry/instrumentation-express");
const instrumentation_nestjs_core_1 = require("@opentelemetry/instrumentation-nestjs-core");
const opentelemetry_instrumentation_sequelize_1 = require("opentelemetry-instrumentation-sequelize");
const services = [];
const startLocalTracing = async (serviceName, exporterEndpoint = 'http://localhost:14268/api/traces') => {
    const jaegerExporter = new exporter_jaeger_1.JaegerExporter({
        endpoint: exporterEndpoint,
    });
    console.log(`[Tracing] Starting tracing for service: ${serviceName}`);
    const tracingSDK = new sdk_node_1.NodeSDK({
        resource: new resources_1.Resource({
            [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
        spanProcessor: new sdk_trace_base_1.SimpleSpanProcessor(jaegerExporter),
        instrumentations: [
            new instrumentation_http_1.HttpInstrumentation(),
            new instrumentation_express_1.ExpressInstrumentation(),
            new instrumentation_nestjs_core_1.NestInstrumentation(),
            new opentelemetry_instrumentation_sequelize_1.SequelizeInstrumentation(),
        ],
    });
    try {
        await tracingSDK.start();
        console.log(`[Tracing] Tracing started successfully for service: ${serviceName}`);
    }
    catch (err) {
        console.error(`[Tracing] Failed to start tracing for service: ${serviceName}`, err);
    }
};
exports.startLocalTracing = startLocalTracing;
