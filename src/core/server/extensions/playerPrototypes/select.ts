import * as alt from 'alt-server';
import { Character } from '../../../shared/interfaces/Character';
import { Events_Misc } from '../../../shared/enums/events';
import { System_Events_Voice, System_Events_World } from '../../../shared/enums/system';

export interface SelectPrototype {
    character(characterData: Partial<Character>): Promise<void>;
}

export function bind(): SelectPrototype {
    const _this = this;
    _this.character = character;
    return _this;
}

async function character(characterData: Partial<Character>): Promise<void> {
    const p: alt.Player = (this as unknown) as alt.Player;

    await p.set().character({ ...characterData });
    p.sync().appearance();
    p.emit().event(Events_Misc.StartTicks);

    // Set player dimension to zero.
    p.dimension = 0;
    p.set().frozen(true);

    alt.setTimeout(() => {
        p.safe().setPosition(p.data.pos.x, p.data.pos.y, p.data.pos.z);
        p.safe().addHealth(p.data.health, true);
        p.safe().addArmour(p.data.armour, true);
        p.sync().currencyData();

        // Resets their death status and logs them in as dead.
        if (p.data.isDead) {
            p.data.isDead = false;
            p.safe().addHealth(0, true);
        }

        alt.emit(System_Events_Voice.AddToVoice, p);
        alt.emit(System_Events_World.UpdateWeather, p);
    }, 500);

    // Delete unused data from the Player.
    delete p.currentCharacters;
}
