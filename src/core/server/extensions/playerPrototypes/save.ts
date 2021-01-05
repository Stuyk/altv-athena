import { Database, getDatabase } from 'simplymongo';
import { Character } from '../../../shared/interfaces/Character';

const db: Database = getDatabase();

export async function saveFieldPrototype(fieldName: string, fieldValue: any): Promise<void> {
    await db.updatePartialData(this.data._id, { [fieldName]: fieldValue }, 'characters');
}

export async function savePartialPrototype(dataObject: Partial<Character>): Promise<void> {
    await db.updatePartialData(this.data._id, { ...dataObject }, 'characters');
}

export async function saveOnTickPrototype(): Promise<void> {
    // Update Server Data First
    this.data.pos = this.pos;
    this.data.health = this.health;
    this.data.armour = this.armour;

    // Update Database
    this.saveField('pos', this.data.pos);
    this.saveField('health', this.data.health);
    this.saveField('armour', this.data.armour);
}
