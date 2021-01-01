import * as alt from 'alt-server';
import { Database, getDatabase } from 'simplymongo';
import { Events_Misc } from '../../../shared/enums/events';
import { Appearance } from '../../../shared/interfaces/Appearance';
import { Character, CharacterDefaults } from '../../../shared/interfaces/Character';
import { CharacterInfo } from '../../../shared/interfaces/CharacterInfo';
import { Account } from '../../interface/Account';
import { Permissions } from '../../../shared/enums/permissions';
import { View_Events_Creator } from '../../../shared/enums/views';

const db: Database = getDatabase();

export async function createNewCharacterPrototype(
    appearanceData: Partial<Appearance>,
    infoData: Partial<CharacterInfo>,
    name: string
): Promise<void> {
    const newDocument: Partial<Character> = { ...CharacterDefaults };
    newDocument.appearance = appearanceData;
    newDocument.info = infoData;
    newDocument.account_id = this.accountData.id;
    newDocument.name = name;

    const document = await db.insertData(newDocument, 'characters', true);
    document._id = document._id.toString(); // Re-cast id object as string.
    this.selectCharacter(document);
}

export async function selectCharacterPrototype(characterData: Partial<Character>): Promise<void> {
    await this.setCharacterData({ ...characterData });
    this.updateAppearance();
    this.emit(Events_Misc.StartTicks);

    // Set player dimension to zero.
    this.dimension = 0;

    alt.setTimeout(() => {
        this.safeSetPosition(this.data.pos.x, this.data.pos.y, this.data.pos.z);
    }, 1000);

    // Delete unused data from the Player.
    delete this.currentCharacters;
}

export async function setAccountDataPrototype(accountData: Partial<Account>): Promise<void> {
    if (!accountData.permissionLevel) {
        accountData.permissionLevel = Permissions.None;
    }

    this.emitMeta('permissionLevel', accountData.permissionLevel);
    this.accountData = accountData;
}

export function setCharacterDataPrototype(characterData: Partial<Character>): void {
    this.data = characterData;
}

export function updateAppearancePrototype(): void {
    if (this.data.appearance.sex === 0) {
        this.model = 'mp_f_freemode_01';
    } else {
        this.model = 'mp_m_freemode_01';
    }

    this.setSyncedMeta('Name', this.data.name);
    this.emitMeta('appearance', this.data.appearance);
    this.emit(View_Events_Creator.Sync, this.data.appearance);
}
