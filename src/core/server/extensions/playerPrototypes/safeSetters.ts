export function safeSetPositionPrototype(x: number, y: number, z: number) {
    if (!this.hasModel) {
        this.hasModel = true;
        this.spawn(x, y, z, 0);
        this.model = `mp_m_freemode_01`;
    }

    this.acPosition = { x, y, z };
    this.pos = { x, y, z };
}

export function safeAddHealthPrototype(value: number, exactValue: boolean = false) {
    if (exactValue) {
        this.acHealth = value;
        this.health = value;
        return;
    }

    if (this.health + value > 200) {
        this.acHealth = 200;
        this.health = 200;
        return;
    }

    this.acHealth = this.health + value;
    this.health += value;
}

export function safeAddArmourPrototype(value: number, exactValue: boolean = false) {
    if (exactValue) {
        this.acArmour = value;
        this.armour = value;
        return;
    }

    if (this.armour + value > 100) {
        this.acArmour = 100;
        this.armour = 100;
        return;
    }

    this.acArmour = this.armour + value;
    this.armour += value;
}
