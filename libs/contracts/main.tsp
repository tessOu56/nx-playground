// Entry point: single contract source of truth.
// Each module declares its own @service namespace; the openapi3 emitter
// emits one OpenAPI document per service into ../api-client/specs/.
import "./catalog.tsp";
import "./event.tsp";
import "./media.tsp";
