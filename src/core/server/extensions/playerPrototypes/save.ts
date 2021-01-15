import * as alt from 'alt-server';
import { Database, getDatabase } from 'simplymongo';
import { Character } from '../../../shared/interfaces/Character';

const db: Database = getDatabase();

export interface SavePrototype {
    field(fieldName: string, fieldValue: any): Promise<void>;
    partial(dataObject: Partial<Character>): Promise<void>;
    onTick(): Promise<void>;
}

export function bind(): SavePrototype {
    const _this = this;
    _this.field = field;
    _this.partial = partial;
    _this.onTick = onTick;
    return _this;
}

async function field(fieldName: string, fieldValue: any): Promise<void> {
    const p: alt.Player = (this as unknown) as alt.Player;
    await db.updatePartialData(p.data._id, { [fieldName]: fieldValue }, 'characters');
}

async function partial(dataObject: Partial<Character>): Promise<void> {
    const p: alt.Player = (this as unknown) as alt.Player;
    await db.updatePartialData(p.data._id, { ...dataObject }, 'characters');
}

async function onTick(): Promise<void> {
    const p: alt.Player = (this as unknown) as alt.Player;

    // Update Server Data First
    p.data.pos = p.pos;
    p.data.health = p.health;
    p.data.armour = p.armour;

    // Update Database
    p.save().field('pos', p.data.pos);
    p.save().field('health', p.data.health);
    p.save().field('armour', p.data.armour);
}
