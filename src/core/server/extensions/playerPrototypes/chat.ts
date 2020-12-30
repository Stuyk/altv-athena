import { View_Events_Chat } from '../../../shared/enums/views';

export function sendPrototype(message: string) {
    this.emit(View_Events_Chat.Append, message);
}
