---
title: Athena.session.vehicle
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### clearAll

::: tip Usage
Athena.session.vehicle.**clearAll**(`vehicle`): `void`
:::

Clear all keys, and remove all data for a session.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `vehicle` | `Vehicle` |

#### Returns

`void`

#### Defined in

[server/session/vehicle.ts:122](https://github.com/Stuyk/altv-athena/blob/fc54439/src/core/server/session/vehicle.ts#L122)

___

### clearKey

::: tip Usage
Athena.session.vehicle.**clearKey**(`vehicle`, `key`): `void`
:::

Clear a key from the vehicle.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `vehicle` | `any` |
| `key` | keyof `Vehicle` |

#### Returns

`void`

#### Defined in

[server/session/vehicle.ts:100](https://github.com/Stuyk/altv-athena/blob/fc54439/src/core/server/session/vehicle.ts#L100)

___

### get

::: tip Usage
Athena.session.vehicle.**get**<`K`\>(`vehicle`, `key`): `AthenaSession.Vehicle`[`K`] \| `undefined`
:::

Retrieve data from a vehicle's session storage.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `Vehicle` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` |  |
| `key` | `K` | The value you want to get from the vehicle. |

#### Returns

`AthenaSession.Vehicle`[`K`] \| `undefined`

Any type of value, can be specified with a generic type.

#### Defined in

[server/session/vehicle.ts:78](https://github.com/Stuyk/altv-athena/blob/fc54439/src/core/server/session/vehicle.ts#L78)

___

### getAll

::: tip Usage
Athena.session.vehicle.**getAll**<`K`\>(`key`): `AthenaSession.Vehicle`[`K`][]
:::

Get all vehicles's that have a specific key.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `Vehicle` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

`AthenaSession.Vehicle`[`K`][]

#### Defined in

[server/session/vehicle.ts:140](https://github.com/Stuyk/altv-athena/blob/fc54439/src/core/server/session/vehicle.ts#L140)

___

### has

::: tip Usage
Athena.session.vehicle.**has**(`vehicle`, `key`): `boolean`
:::

Returns true, if it has any value set for a given key.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `vehicle` | `Vehicle` |
| `key` | `string` |

#### Returns

`boolean`

#### Defined in

[server/session/vehicle.ts:59](https://github.com/Stuyk/altv-athena/blob/fc54439/src/core/server/session/vehicle.ts#L59)

___

### set

::: tip Usage
Athena.session.vehicle.**set**<`K`\>(`vehicle`, `key`, `value`): `void`
:::

Set data for a vehicle's session

This data is not persistent, and automatically clears on disconnect / vehicle destroy

#### Example
```ts
declare global {
    namespace AthenaSession {
        export interface Vehicle {
            myCustomValue: boolean;
        }
    }
}

Athena.session.vehicle.set(someVehicle, 'myCustomValue', true);
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `Vehicle` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` |  |
| `key` | keyof `Vehicle` | The key you want to put the value under |
| `value` | `Vehicle`[`K`] | The value you want to set |

#### Returns

`void`

Any type of value, can be specified with a generic type.

#### Defined in

[server/session/vehicle.ts:36](https://github.com/Stuyk/altv-athena/blob/fc54439/src/core/server/session/vehicle.ts#L36)
