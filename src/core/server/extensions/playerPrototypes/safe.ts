import * as alt from 'alt-server';

const interfaceName = 'safe';

export interface SafePrototype {
    setPosition(x: number, y: number, z: number): void;
    addHealth(value: number, exactValue: boolean): void;
    addArmour(value: number, exactValue: boolean): void;
}

export function bind(): SafePrototype {
    const _this = this;
    _this.addArmour = addArmour;
    _this.addHealth = addHealth;
    _this.setPosition = setPosition;
    return _this;
}

function setPosition(x: number, y: number, z: number): void {
    const p: alt.Player = (this as unknown) as alt.Player;

    if (!p.hasModel) {
        p.hasModel = true;
        p.spawn(x, y, z, 0);
        p.model = `mp_m_freemode_01`;
    }

    p.acPosition = new alt.Vector3(x, y, z);
    p.pos = new alt.Vector3(x, y, z);
}

function addHealth(value: number, exactValue: boolean = false) {
    const p: alt.Player = (this as unknown) as alt.Player;

    if (exactValue) {
        p.acHealth = value;
        p.health = value;
        return;
    }

    if (p.health + value > 200) {
        p.acHealth = 200;
        p.health = 200;
        return;
    }

    p.acHealth = p.health + value;
    p.health += value;
}

function addArmour(value: number, exactValue: boolean = false): void {
    const p: alt.Player = (this as unknown) as alt.Player;

    if (exactValue) {
        p.acArmour = value;
        p.armour = value;
        return;
    }

    if (p.armour + value > 100) {
        p.acArmour = 100;
        p.armour = 100;
        return;
    }

    p.acArmour = p.armour + value;
    p.armour += value;
}
