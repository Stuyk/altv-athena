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

[server/document/vehicle.ts:8](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L8)

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

[server/document/vehicle.ts:33](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L33)

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

[server/document/vehicle.ts:203](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L203)

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

[server/document/vehicle.ts:52](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L52)

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

[server/document/vehicle.ts:69](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L69)

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

[server/document/vehicle.ts:182](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L182)

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

[server/document/vehicle.ts:228](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L228)

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

[server/document/vehicle.ts:229](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L229)

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

[server/document/vehicle.ts:230](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L230)

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

[server/document/vehicle.ts:231](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L231)

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

[server/document/vehicle.ts:232](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L232)

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

[server/document/vehicle.ts:233](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L233)

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

[server/document/vehicle.ts:234](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L234)

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

[server/document/vehicle.ts:235](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L235)

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

[server/document/vehicle.ts:95](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L95)

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

[server/document/vehicle.ts:150](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L150)

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

[server/document/vehicle.ts:19](https://github.com/Stuyk/altv-athena/blob/94f5f1a/src/core/server/document/vehicle.ts#L19)
