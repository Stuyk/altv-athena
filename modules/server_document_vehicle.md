---
title: Athena.document.vehicle
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### KeyChangeCallback

Ƭ **KeyChangeCallback**: (`vehicle`: `alt.Vehicle`, `newValue`: `any`, `oldValue`: `any`) => `void`

#### Type declaration

::: tip Usage
Athena.document.vehicle.(`vehicle`, `newValue`, `oldValue`): `void`
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `vehicle` | `alt.Vehicle` |
| `newValue` | `any` |
| `oldValue` | `any` |

##### Returns

`void`

#### Defined in

[server/document/vehicle.ts:8](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L8)

## Functions

### bind

::: tip Usage
Athena.document.vehicle.**bind**(`vehicle`, `document`): `any`
:::

Used to bind a vehicle document to a vehicle entity

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `document` | `OwnedVehicle` |  |

#### Returns

`any`

#### Defined in

[server/document/vehicle.ts:41](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L41)

___

### exists

::: tip Usage
Athena.document.vehicle.**exists**(`_id`): `boolean`
:::

Check if a vehicle document already exists and a vehicle is attached to it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `_id` | `string` |

#### Returns

`boolean`

#### Defined in

[server/document/vehicle.ts:235](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L235)

___

### get

::: tip Usage
Athena.document.vehicle.**get**<`T`\>(`vehicle`): `T` \| `undefined`
:::

Get a vehicle document attached to a vehicle

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `OwnedVehicle` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`T` \| `undefined`

#### Defined in

[server/document/vehicle.ts:60](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L60)

___

### getAllOnline

::: tip Usage
Athena.document.vehicle.**getAllOnline**<`T`\>(): { `document`: [`player`](server_config.md#player) & `T` ; `id`: `number`  }[]
:::

Return all available vehicles, and their associated alt:V vehicle ids.

The vehicle can be fetched with alt.Vehicle.all.find(x => x.id === someResult.id);

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |

#### Returns

{ `document`: [`player`](server_config.md#player) & `T` ; `id`: `number`  }[]

#### Defined in

[server/document/vehicle.ts:214](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L214)

___

### getField

::: tip Usage
Athena.document.vehicle.**getField**<`T`, `ReturnType`\>(`vehicle`, `fieldName`): `ReturnType` \| `undefined`
:::

Get a field directly for a vehicle document

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |
| `ReturnType` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `fieldName` | `string` \| `number` \| `symbol` |  |

#### Returns

`ReturnType` \| `undefined`

#### Defined in

[server/document/vehicle.ts:77](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L77)

___

### onChange

::: tip Usage
Athena.document.vehicle.**onChange**<`T`\>(`fieldName`, `callback`): `any`
:::

Listen for individual vehicle document changes.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fieldName` | `string` \| `number` \| `symbol` |
| `callback` | [`KeyChangeCallback`](server_document_vehicle.md#KeyChangeCallback) |

#### Returns

`any`

#### Defined in

[server/document/vehicle.ts:191](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L191)

___

### override

::: tip Usage
Athena.document.vehicle.**override**(`functionName`, `callback`): `any`
:::

Used to override any vehicle document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"exists"`` |
| `callback` | (`_id`: `string`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/document/vehicle.ts:261](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L261)

::: tip Usage
Athena.document.vehicle.**override**(`functionName`, `callback`): `any`
:::

Used to override any vehicle document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"bind"`` |
| `callback` | (`vehicle`: `Vehicle`, `document`: `OwnedVehicle`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/vehicle.ts:262](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L262)

::: tip Usage
Athena.document.vehicle.**override**(`functionName`, `callback`): `any`
:::

Used to override any vehicle document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"unbind"`` |
| `callback` | (`id`: `number`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/vehicle.ts:263](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L263)

::: tip Usage
Athena.document.vehicle.**override**(`functionName`, `callback`): `any`
:::

Used to override any vehicle document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"get"`` |
| `callback` | <T\>(`vehicle`: `Vehicle`) => `T` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/document/vehicle.ts:264](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L264)

::: tip Usage
Athena.document.vehicle.**override**(`functionName`, `callback`): `any`
:::

Used to override any vehicle document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getField"`` |
| `callback` | <T, ReturnType\>(`vehicle`: `Vehicle`, `fieldName`: `string` \| `number` \| `symbol`) => `ReturnType` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/document/vehicle.ts:265](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L265)

::: tip Usage
Athena.document.vehicle.**override**(`functionName`, `callback`): `any`
:::

Used to override any vehicle document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"set"`` |
| `callback` | <T, Keys\>(`vehicle`: `Vehicle`, `fieldName`: `Keys`, `value`: `any`, `skipCallbacks?`: `boolean`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/vehicle.ts:266](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L266)

::: tip Usage
Athena.document.vehicle.**override**(`functionName`, `callback`): `any`
:::

Used to override any vehicle document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setBulk"`` |
| `callback` | <T, Keys\>(`vehicle`: `Vehicle`, `fields`: `Keys`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/vehicle.ts:267](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L267)

::: tip Usage
Athena.document.vehicle.**override**(`functionName`, `callback`): `any`
:::

Used to override any vehicle document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"onChange"`` |
| `callback` | <T\>(`fieldName`: `string` \| `number` \| `symbol`, `callback`: [`KeyChangeCallback`](server_document_vehicle.md#KeyChangeCallback)) => `any` |

#### Returns

`any`

#### Defined in

[server/document/vehicle.ts:268](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L268)

___

### set

::: tip Usage
Athena.document.vehicle.**set**<`T`, `Keys`\>(`vehicle`, `fieldName`, `value`, `skipCallbacks?`): `any`
:::

Set vehicle data for a given field, automatically saves to database.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |
| `Keys` | `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `vehicle` | `Vehicle` | `undefined` | An alt:V Vehicle Entity |
| `fieldName` | `Keys` | `undefined` |  |
| `value` | `any` | `undefined` |  |
| `skipCallbacks?` | `boolean` | `false` |  |

#### Returns

`any`

#### Defined in

[server/document/vehicle.ts:103](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L103)

___

### setBulk

::: tip Usage
Athena.document.vehicle.**setBulk**<`T`, `Keys`\>(`vehicle`, `fields`): `any`
:::

Set bulk data for a vehicle document.
Automatically saves to database.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |
| `Keys` | [`Partial`](server_controllers_textlabel_Internal.md#Partial)<`any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `fields` | `Keys` |  |

#### Returns

`any`

#### Defined in

[server/document/vehicle.ts:152](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L152)

___

### unbind

::: tip Usage
Athena.document.vehicle.**unbind**(`id`): `any`
:::

Used to unbind vehicle cache for an id once the vehicle is deleted

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`any`

#### Defined in

[server/document/vehicle.ts:27](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/server/document/vehicle.ts#L27)
