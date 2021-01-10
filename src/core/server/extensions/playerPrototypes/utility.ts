import { Player_Status } from '../../../shared/enums/player';

export function freezePrototype(value: boolean): void {
    this.emit(Player_Status.SetFreeze, value);
}
