import { default as express } from "@feathersjs/express";
import feathers from "@feathersjs/feathers";
import feathersConfiguration from "@feathersjs/configuration";
import feathersSocketIO from "@feathersjs/socketio";

import logger from "./logger";

const app = express(feathers());

// configuration
app.configure(feathersConfiguration());

// plugins
app.configure(feathersSocketIO());

// error handling
app.use(express.errorHandler({ logger }));

export default app;
