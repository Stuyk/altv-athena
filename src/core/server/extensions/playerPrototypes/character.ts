import * as alt from 'alt-server';
import { Database, getDatabase } from 'simplymongo';
import { Events_Misc } from '../../../shared/enums/events';
import { Appearance } from '../../../shared/interfaces/Appearance';
import { Character, CharacterDefaults } from '../../../shared/interfaces/Character';
import { CharacterInfo } from '../../../shared/interfaces/CharacterInfo';
import { Account } from '../../interface/Account';
import { Permissions } from '../../../shared/enums/permissions';
import { View_Events_Creator } from '../../../shared/enums/views';
import { System_Events_Voice, System_Events_World } from '../../../shared/enums/system';
import { Permission } from 'alt-client';
import { getUniquePlayerHash } from '../../utility/encryption';

const db: Database = getDatabase();

export async function createNewCharacterPrototype(
    appearanceData: Partial<Appearance>,
    infoData: Partial<CharacterInfo>,
    name: string
): Promise<void> {
    const newDocument: Partial<Character> = { ...CharacterDefaults };
    newDocument.appearance = appearanceData;
    newDocument.info = infoData;
    newDocument.account_id = this.accountData._id;
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
    this.freeze(true);

    alt.setTimeout(() => {
        this.safeSetPosition(this.data.pos.x, this.data.pos.y, this.data.pos.z);
        this.safeAddHealth(this.data.health, true);
        this.safeAddArmour(this.data.armour, true);
        this.currencyUpdate();

        // Resets their death status and logs them in as dead.
        if (this.data.isDead) {
            this.data.isDead = false;
            this.setHealth = 0;
        }

        alt.emit(System_Events_Voice.AddToVoice, this);
        alt.emit(System_Events_World.UpdateWeather, this);
    }, 500);

    // Delete unused data from the Player.
    delete this.currentCharacters;
}

export async function setAccountDataPrototype(accountData: Partial<Account>): Promise<void> {
    if (!accountData.permissionLevel) {
        accountData.permissionLevel = Permissions.None;
        db.updatePartialData(accountData._id, { permissionLevel: Permissions.None }, 'accounts');
    }

    if (!accountData.quickToken || Date.now() > accountData.quickTokenExpiration) {
        const qt: string = getUniquePlayerHash(this, this.discord.id);

        db.updatePartialData(
            accountData._id,
            {
                quickToken: qt,
                quickTokenExpiration: Date.now() + 60000 * 60 * 48 // 48 Hours
            },
            'accounts'
        );

        this.emit(Events_Misc.DiscordTokenUpdate, this.discord.id);
    }

    this.emitMeta('permissionLevel', accountData.permissionLevel);
    this.accountData = accountData;
}

export function setCharacterDataPrototype(characterData: Partial<Character>): void {
    this.data = characterData;

    if (this.data.isDead) {
        this.nextDeathSpawn = Date.now() + 30000;
        this.emitMeta('isDead', true);
    } else {
        this.emitMeta('isDead', false);
    }
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
