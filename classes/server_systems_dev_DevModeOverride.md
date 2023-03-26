---
title: Athena.systems.dev.DevModeOverride
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/systems/dev](../modules/server_systems_dev.md).DevModeOverride

## Constructors

### constructor

• **new DevModeOverride**()

## Methods

### login

▸ `Static` **login**(`player`): `Promise`<`void`\>

Overrides the default login and uses a single account for all users.
This acts a way to login to multiple accounts under multiple instances of GTA:V.

Used as a way to setup general player info for dev mode.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | alt.Player - The player that is logging in. |

#### Returns

`Promise`<`void`\>

None

#### Defined in

[server/systems/dev.ts:20](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/systems/dev.ts#L20)

___

### setDevAccountCallback

▸ `Static` **setDevAccountCallback**(`cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`player`: `Player`) => `Promise`<`void`\> |

#### Returns

`void`

#### Defined in

[server/systems/dev.ts:7](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/systems/dev.ts#L7)
