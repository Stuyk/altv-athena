---
title: Athena.database.singleton
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### create

::: tip Usage
Athena.database.singleton.**create**<`T`\>(`collection`, `data`): `Promise`<{ `_id`: `string`  } & `T`\>
:::

Creates a single document to be stored in a collection.

Only one document may ever exist for a collection.

Returns the existing singleton if already present.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `collection` | `string` |
| `data` | `T` |

#### Returns

`Promise`<{ `_id`: `string`  } & `T`\>

#### Defined in

[server/database/singleton.ts:28](https://github.com/Stuyk/altv-athena/blob/16c490d/src/core/server/database/singleton.ts#L28)

___

### get

::: tip Usage
Athena.database.singleton.**get**<`T`\>(`collection`): `Promise`<{ `_id`: `string`  } & `T`\>
:::

Returns a singleton document if it exists.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `collection` | `string` |

#### Returns

`Promise`<{ `_id`: `string`  } & `T`\>

#### Defined in

[server/database/singleton.ts:11](https://github.com/Stuyk/altv-athena/blob/16c490d/src/core/server/database/singleton.ts#L11)

___

### updateBulk

::: tip Usage
Athena.database.singleton.**updateBulk**<`T`\>(`collection`, `data`): `Promise`<`boolean`\>
:::

Update all the data from a single document in a collection.

Only one document may ever exist for a collection.

This takes the data from the database and applies your data on top of it.

Returns true if updated successfully

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `collection` | `string` |
| `data` | [`Partial`](server_controllers_textlabel_Internal.md#Partial)<`T`\> |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/database/singleton.ts:77](https://github.com/Stuyk/altv-athena/blob/16c490d/src/core/server/database/singleton.ts#L77)

___

### updateField

::: tip Usage
Athena.database.singleton.**updateField**(`collection`, `fieldName`, `fieldValue`): `Promise`<`boolean`\>
:::

Update / insert a single document into a collection.

Only one document may ever exist for a collection.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `collection` | `string` |
| `fieldName` | `string` |
| `fieldValue` | `any` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/database/singleton.ts:53](https://github.com/Stuyk/altv-athena/blob/16c490d/src/core/server/database/singleton.ts#L53)
