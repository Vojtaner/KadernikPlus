import { Counter, Registry } from "prom-client";
import promBundle from "express-prom-bundle";

const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: {
    project_name: "hello_world",
    project_type: "test_metrics_labels",
  },
  promClient: {
    collectDefaultMetrics: {},
  },
});
const register = new Registry();

const httpRequests = new Counter({
  name: "http_requests_total",
  help: "Počet HTTP requestů",
  labelNames: ["method", "status"],
});

export { metricsMiddleware, register, httpRequests };
