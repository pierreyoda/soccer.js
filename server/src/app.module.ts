import { Module } from "@nestjs/common";

import { PlayersModule } from './players/players.module';
import { RoomsModule } from './rooms/rooms.module';
import { AppGateway } from "./app.gateway";

@Module({
  imports: [
    PlayersModule,
    RoomsModule,
  ],
  providers: [
    AppGateway,
  ],
})
export class AppModule {}
