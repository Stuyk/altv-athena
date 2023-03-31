---
title: Athena.systems.character
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### create

::: tip Usage
Athena.systems.character.**create**(`player`, `appearance`, `info`, `name`): `Promise`<`boolean`\>
:::

Create a new character for a specific player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `appearance` | `Appearance` |  |
| `info` | `CharacterInfo` |  |
| `name` | `string` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/systems/character.ts:61](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/character.ts#L61)

___

### getCharacters

::: tip Usage
Athena.systems.character.**getCharacters**(`account_id`): `Promise`<[`player`](server_config.md#player)[]\>
:::

Get all characters that belong to an account by account identifier.

#### Parameters

| Name | Type |
| :------ | :------ |
| `account_id` | `string` |

#### Returns

`Promise`<[`player`](server_config.md#player)[]\>

#### Defined in

[server/systems/character.ts:222](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/character.ts#L222)

___

### invokeCreator

::: tip Usage
Athena.systems.character.**invokeCreator**(`player`, `...args`): `any`
:::

Invokes the custom creator to be opened.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `...args` | `any`[] |  |

#### Returns

`any`

#### Defined in

[server/systems/character.ts:38](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/character.ts#L38)

___

### isNameTaken

::: tip Usage
Athena.systems.character.**isNameTaken**(`name`): `Promise`<`boolean`\>
:::

Check if a character name is taken.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/systems/character.ts:207](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/character.ts#L207)

___

### override

::: tip Usage
Athena.systems.character.**override**(`functionName`, `callback`): `any`
:::

Used to override character creation / management internally.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"create"`` |
| `callback` | (`player`: `Player`, `appearance`: `Appearance`, `info`: `CharacterInfo`, `name`: `string`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/systems/character.ts:272](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/character.ts#L272)

::: tip Usage
Athena.systems.character.**override**(`functionName`, `callback`): `any`
:::

Used to override character creation / management internally.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setCreatorCallback"`` |
| `callback` | (`callback`: (`player`: `Player`, ...`args`: `any`[]) => `void`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/character.ts:273](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/character.ts#L273)

::: tip Usage
Athena.systems.character.**override**(`functionName`, `callback`): `any`
:::

Used to override character creation / management internally.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"invokeCreator"`` |
| `callback` | (`player`: `Player`, ...`args`: `any`[]) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/character.ts:274](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/character.ts#L274)

::: tip Usage
Athena.systems.character.**override**(`functionName`, `callback`): `any`
:::

Used to override character creation / management internally.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"select"`` |
| `callback` | (`player`: `Player`, `character`: `Character`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/character.ts:275](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/character.ts#L275)

::: tip Usage
Athena.systems.character.**override**(`functionName`, `callback`): `any`
:::

Used to override character creation / management internally.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"isNameTaken"`` |
| `callback` | (`name`: `string`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/systems/character.ts:276](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/character.ts#L276)

::: tip Usage
Athena.systems.character.**override**(`functionName`, `callback`): `any`
:::

Used to override character creation / management internally.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getCharacters"`` |
| `callback` | (`account_id`: `string`) => `Promise`<[`player`](server_config.md#player)[]\> |

#### Returns

`any`

#### Defined in

[server/systems/character.ts:277](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/character.ts#L277)

___

### select

::: tip Usage
Athena.systems.character.**select**(`player`, `character`): `any`
:::

The final step in the character selection system.

After this step the player is spawned and synchronized.

Always call this function last in login flow modifications.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `character` | `Character` |  |

#### Returns

`any`

#### Defined in

[server/systems/character.ts:105](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/character.ts#L105)

___

### setCreatorCallback

::: tip Usage
Athena.systems.character.**setCreatorCallback**(`callback`): `any`
:::

Allows a custom character creator to be shown.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`player`: `Player`, ...`args`: `any`[]) => `void` |

#### Returns

`any`

#### Defined in

[server/systems/character.ts:23](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/character.ts#L23)
