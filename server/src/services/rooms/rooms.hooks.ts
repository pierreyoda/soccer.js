import { HooksObject, HookContext } from "@feathersjs/feathers";
import logger from "../../logger";

const hooks: HooksObject = {
  before: {
  },
  after: {
  },
  error: {
    all: (context: HookContext) => {
      logger.error(`RoomsService: error in ${context.path} for ${context.method} method: ${context.error}`);
    },
  },
};

export default hooks;
