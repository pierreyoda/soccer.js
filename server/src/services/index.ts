import { Application } from "@feathersjs/feathers";
import RoomsService from "./rooms/rooms.service";
import hooks from "./rooms/rooms.hooks";

const services = (app: Application<object>) => {
  app.use("/rooms", new RoomsService());
  app.service("rooms").hooks(hooks);
};

export default services;
