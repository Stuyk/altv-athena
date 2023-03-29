---
title: AthenaClient.streamers.object
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### CreatedObject

Ƭ **CreatedObject**: [`player`](server_config.md#player) & { `createdObject?`: `alt.Object`  }

#### Defined in

[client/streamers/object.ts:6](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/client/streamers/object.ts#L6)

## Functions

### addObject

::: tip Usage
AthenaClient.streamers.object.**addObject**(`newObject`): `void`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `newObject` | `IObject` |

#### Returns

`void`

#### Defined in

[client/streamers/object.ts:132](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/client/streamers/object.ts#L132)

___

### getFromScriptId

::: tip Usage
AthenaClient.streamers.object.**getFromScriptId**(`scriptId`): [`CreatedObject`](client_streamers_object.md#CreatedObject) \| `undefined`
:::

Used to obtain a CreatedObject instance from a generic scriptID

#### Parameters

| Name | Type |
| :------ | :------ |
| `scriptId` | `number` |

#### Returns

[`CreatedObject`](client_streamers_object.md#CreatedObject) \| `undefined`

#### Defined in

[client/streamers/object.ts:175](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/client/streamers/object.ts#L175)

___

### removeObject

::: tip Usage
AthenaClient.streamers.object.**removeObject**(`uid`): `void`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |

#### Returns

`void`

#### Defined in

[client/streamers/object.ts:156](https://github.com/Stuyk/altv-athena/blob/97e73cc/src/core/client/streamers/object.ts#L156)
