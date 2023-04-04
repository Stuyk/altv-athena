---
title: Athena.systems.identifier
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### IdentifierStrategy

Ƭ **IdentifierStrategy**: ``"account_id"`` \| ``"character_id"`` \| ``"server_id"``

#### Defined in

[server/systems/identifier.ts:5](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/server/systems/identifier.ts#L5)

## Functions

### getIdByStrategy

::: tip Usage
Athena.systems.identifier.**getIdByStrategy**(`player`): `number`
:::

Returns the current numerical identifier based on current strategy.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`number`

#### Defined in

[server/systems/identifier.ts:108](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/server/systems/identifier.ts#L108)

___

### getPlayer

::: tip Usage
Athena.systems.identifier.**getPlayer**(`id`): `alt.Player`
:::

Returns the player by the currently set identification strategy.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` \| `number` |

#### Returns

`alt.Player`

#### Defined in

[server/systems/identifier.ts:62](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/server/systems/identifier.ts#L62)

___

### override

::: tip Usage
Athena.systems.identifier.**override**(`functionName`, `callback`): `any`
:::

Used to override identification strategy functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setIdentificationStrategy"`` |
| `callback` | (`_strategy`: [`IdentifierStrategy`](server_systems_identifier.md#IdentifierStrategy)) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/identifier.ts:145](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/server/systems/identifier.ts#L145)

::: tip Usage
Athena.systems.identifier.**override**(`functionName`, `callback`): `any`
:::

Used to override identification strategy functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setPlayerIdentifier"`` |
| `callback` | (`player`: `Player`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/identifier.ts:146](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/server/systems/identifier.ts#L146)

::: tip Usage
Athena.systems.identifier.**override**(`functionName`, `callback`): `any`
:::

Used to override identification strategy functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getPlayer"`` |
| `callback` | (`id`: `string` \| `number`) => `alt.Player` |

#### Returns

`any`

#### Defined in

[server/systems/identifier.ts:147](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/server/systems/identifier.ts#L147)

::: tip Usage
Athena.systems.identifier.**override**(`functionName`, `callback`): `any`
:::

Used to override identification strategy functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getIdByStrategy"`` |
| `callback` | (`player`: `Player`) => `number` |

#### Returns

`any`

#### Defined in

[server/systems/identifier.ts:148](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/server/systems/identifier.ts#L148)

___

### setIdentificationStrategy

::: tip Usage
Athena.systems.identifier.**setIdentificationStrategy**(`_strategy`): `any`
:::

Should be set during the server startup phase to change player identification strategies.

This will apply to all players when they select a character.

DO NOT CHANGE THIS AFTER SERVER STARTUP.

#### Parameters

| Name | Type |
| :------ | :------ |
| `_strategy` | [`IdentifierStrategy`](server_systems_identifier.md#IdentifierStrategy) |

#### Returns

`any`

#### Defined in

[server/systems/identifier.ts:26](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/server/systems/identifier.ts#L26)

___

### setPlayerIdentifier

::: tip Usage
Athena.systems.identifier.**setPlayerIdentifier**(`player`): `any`
:::

Automatically sets the player identification by strategy to the synced meta.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/systems/identifier.ts:39](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/server/systems/identifier.ts#L39)
