import { Database, getDatabase } from 'simplymongo';
import { Character } from '../../../shared/interfaces/Character';

const db: Database = getDatabase();

export async function saveFieldPrototype(fieldName: string, fieldValue: any) {
    await db.updatePartialData(this.data._id, { [fieldName]: fieldValue }, 'characters');
}

export async function savePartialPrototype(dataObject: Partial<Character>) {
    await db.updatePartialData(this.data._id, { ...dataObject }, 'characters');
}
