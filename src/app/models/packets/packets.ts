import {Message} from "../chat-stores/message.model";
export class ChatPacket{
  constructor(public messages: Message[]) {
  }
}
