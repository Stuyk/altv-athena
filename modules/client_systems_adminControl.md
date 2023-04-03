---
title: AthenaClient.systems.adminControl
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Modules

- [Internal](client_systems_adminControl_Internal.md)

## Functions

### getControls

::: tip Usage
AthenaClient.systems.adminControl.**getControls**(): typeof [`AdminControls`](client_systems_adminControl_Internal.md#AdminControls)
:::

Return all admin controls the player has access to currently

**`Export`**

#### Returns

typeof [`AdminControls`](client_systems_adminControl_Internal.md#AdminControls)

#### Defined in

[client/systems/adminControl.ts:24](https://github.com/Stuyk/altv-athena/blob/ce61c7c/src/core/client/systems/adminControl.ts#L24)

___

### invoke

::: tip Usage
AthenaClient.systems.adminControl.**invoke**(`uid`, `...args`): `void`
:::

Invoke an admin control based on its uid.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[client/systems/adminControl.ts:14](https://github.com/Stuyk/altv-athena/blob/ce61c7c/src/core/client/systems/adminControl.ts#L14)

___

### onControlUpdate

::: tip Usage
AthenaClient.systems.adminControl.**onControlUpdate**(`callback`): `void`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`controls`: `AdminControl`[]) => `void` |

#### Returns

`void`

#### Defined in

[client/systems/adminControl.ts:28](https://github.com/Stuyk/altv-athena/blob/ce61c7c/src/core/client/systems/adminControl.ts#L28)
