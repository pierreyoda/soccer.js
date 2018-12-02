import { default as express } from "@feathersjs/express";
import feathers from "@feathersjs/feathers";
import configuration from "@feathersjs/configuration";
import socketio from "@feathersjs/socketio";

import logger from "./logger";
import channels from "./channels";
import services from "./services";

const app = express(feathers());

// configuration
app.configure(configuration());

// plugins
app.configure(socketio(channels));

// services
app.configure(services);

// error handling
app.use(express.errorHandler({ logger }));

export default app;
