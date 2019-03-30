import { Module } from "@nestjs/common";

import { RoomsService } from "./rooms.service";

@Module({
  imports: [],
  providers: [
    RoomsService,
  ],
})
export class RoomsModule {}
