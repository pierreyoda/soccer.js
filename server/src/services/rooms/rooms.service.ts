import { ClientCreateRoom } from "../../../../core/src/payloads";
import { Room } from "../../soccer";

export default class RoomsService {
  protected rooms: Room[] = [];

  public async find(params: any) {
    return this.rooms;
  }

  public async get(id: string, params: any) {
    const room = this.rooms.find(r => r.id === id);
    if (!room) {
      throw new Error(`RoomsService: Room with ID "${id}" not found.`);
    }
    return room;
  }

  public async create(data: ClientCreateRoom, params: any): Promise<Room> {
    const randomId = (): string =>
      Math.random()
        .toString(36)
        .substr(2, 9);
    let id = randomId();
    while (!!this.rooms.find(r => r.id === id)) {
      id = randomId();
    }

    const room = new Room(
      id,
      data.name,
      data.maxPlayers,
      data.showInList,
      data.password,
    );
    this.rooms.push(room);
    return room;
  }
}
