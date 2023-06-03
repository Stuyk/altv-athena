---
title: AthenaShared.utility.hashLookup.vehicle
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Variables

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hash` | (`hash`: `number`) => [`player`](server_config.md#player) |
| `hexHash` | (`hash`: `string`) => [`player`](server_config.md#player) |
| `signedHash` | (`hash`: `number`) => [`player`](server_config.md#player) |

#### Defined in

[shared/utility/hashLookup/vehicle.ts:43](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/shared/utility/hashLookup/vehicle.ts#L43)

## Functions

### hash

::: tip Usage
AthenaShared.utility.hashLookup.vehicle.**hash**(`hash`): [`player`](server_config.md#player)
:::

Get the VehicleInfo corresponding to a hash.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `number` |

#### Returns

[`player`](server_config.md#player)

#### Defined in

[shared/utility/hashLookup/vehicle.ts:11](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/shared/utility/hashLookup/vehicle.ts#L11)

___

### hexHash

::: tip Usage
AthenaShared.utility.hashLookup.vehicle.**hexHash**(`hash`): [`player`](server_config.md#player)
:::

Get the VehicleInfo corresponding to a hex hash.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `string` |

#### Returns

[`player`](server_config.md#player)

#### Defined in

[shared/utility/hashLookup/vehicle.ts:37](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/shared/utility/hashLookup/vehicle.ts#L37)

___

### signedHash

::: tip Usage
AthenaShared.utility.hashLookup.vehicle.**signedHash**(`hash`): [`player`](server_config.md#player)
:::

Get the VehicleInfo corresponding to a signed hash.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `hash` | `number` |

#### Returns

[`player`](server_config.md#player)

#### Defined in

[shared/utility/hashLookup/vehicle.ts:24](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/shared/utility/hashLookup/vehicle.ts#L24)
