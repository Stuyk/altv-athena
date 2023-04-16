---
title: Athena.systems.adminControl
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Modules

- [Internal](server_systems_adminControl_Internal.md)

## Functions

### addControl

::: tip Usage
Athena.systems.adminControl.**addControl**(`control`, `callback`): `boolean`
:::

Creates a restricted admin control function.

When a function is invoked it is automatically checked for proper permissions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `control` | `AdminControl` |
| `callback` | [`PlayerCallback`](server_systems_adminControl_Internal.md#PlayerCallback) |

#### Returns

`boolean`

#### Defined in

[server/systems/adminControl.ts:18](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/server/systems/adminControl.ts#L18)

___

### getControls

::: tip Usage
Athena.systems.adminControl.**getControls**(`player`): `any`
:::

Get all admin controls available for a player.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`any`

#### Defined in

[server/systems/adminControl.ts:40](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/server/systems/adminControl.ts#L40)

___

### updateControls

::: tip Usage
Athena.systems.adminControl.**updateControls**(`player`): `void`
:::

Parses controls and pushes them down to the client. Updating their control list.

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`void`

#### Defined in

[server/systems/adminControl.ts:63](https://github.com/Stuyk/altv-athena/blob/a762ea7/src/core/server/systems/adminControl.ts#L63)
