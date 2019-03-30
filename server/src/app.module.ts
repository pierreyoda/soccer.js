import { Module } from "@nestjs/common";

import { PlayersModule } from './players/players.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    PlayersModule,
    RoomsModule,
  ],
})
export class AppModule {}
