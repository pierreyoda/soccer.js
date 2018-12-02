import app from "./app";
import logger from "./logger";

const port = app.get("port");
const server = app.listen(port);

process.on("unhandledRejection", (reason: any, p: any) =>
  logger.error(`Unhandled Rejection at: Promise ${p}: ${reason}.`),
);

server.on("listening", () =>
  logger.info(`Soccer.js server started on ${app.get("host")}:${port}`),
);
