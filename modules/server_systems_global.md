---
title: Athena.systems.global
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [IGlobal](../interfaces/server_systems_global_IGlobal.md)

## Functions

### decrease

::: tip Usage
Athena.systems.global.**decrease**(`key`, `decreaseByValue?`, `startValue?`): `Promise`<`boolean`\>
:::

Decrease the value of a key in the document by a given value

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `string` | `undefined` | The key of the field you want to update. |
| `decreaseByValue?` | `number` | `1` | The amount to decrease the value by. |
| `startValue` | `number` | `undefined` | The value to start the counter at. |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/systems/global.ts:113](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/systems/global.ts#L113)

___

### get

::: tip Usage
Athena.systems.global.**get**<`IGlobal`\>(): `Promise`<`IGlobal`\>
:::

It fetches the singleton document from the database.

#### Type parameters

| Name |
| :------ |
| `IGlobal` |

#### Returns

`Promise`<`IGlobal`\>

A promise of an IGlobal object.

#### Defined in

[server/systems/global.ts:80](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/systems/global.ts#L80)

___

### getKey

::: tip Usage
Athena.systems.global.**getKey**<`T`\>(`key`): `Promise`<`T`\>
:::

`get` returns the value of the specified key from the specified document

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key to fetch from the database. |

#### Returns

`Promise`<`T`\>

The value of the key.

#### Defined in

[server/systems/global.ts:70](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/systems/global.ts#L70)

___

### increase

::: tip Usage
Athena.systems.global.**increase**(`key`, `increaseByValue?`, `startValue?`): `Promise`<`boolean`\>
:::

Increase the value of a key in a document by a given value

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `string` | `undefined` | The key to increase. |
| `increaseByValue?` | `number` | `1` | The amount to increase the value by. |
| `startValue?` | `number` | `0` | The value to start the counter at. |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/systems/global.ts:90](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/systems/global.ts#L90)

___

### isReady

::: tip Usage
Athena.systems.global.**isReady**(): `Promise`<`boolean`\>
:::

Checks if the Global document is ready for handling requests.

#### Returns

`Promise`<`boolean`\>

The `isReady` function returns a `Promise` that resolves to `true` when the `uid` is
defined.

#### Defined in

[server/systems/global.ts:37](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/systems/global.ts#L37)

___

### setKey

::: tip Usage
Athena.systems.global.**setKey**<`T`\>(`key`, `value`): `Promise`<`void`\>
:::

It sets and overrides the value of the key in the database.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key to set. |
| `value` | `T` | The value to be set. |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/systems/global.ts:60](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/systems/global.ts#L60)
