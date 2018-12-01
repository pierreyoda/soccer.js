import app from "./app";
import logger from "./logger";

const port = app.get("port");
const server = app.listen(port);

server.on("listening", () =>
  logger.info(`Soccer.js server started on "${app.get("host")}:${port}"`),
);
