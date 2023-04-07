---
title: AthenaShared.utility.buffer.AthenaBuffer
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/utility/buffer](../modules/shared_utility_buffer.md).AthenaBuffer

## Constructors

### constructor

• **new AthenaBuffer**()

## Methods

### fromBuffer

::: tip Usage
AthenaShared.utility.buffer.AthenaBuffer.`Static` **fromBuffer**(`data`): `string`
:::

Turns a buffer into a string.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string`[] |

#### Returns

`string`

#### Defined in

[shared/utility/buffer.ts:23](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/shared/utility/buffer.ts#L23)

___

### toBuffer

::: tip Usage
AthenaShared.utility.buffer.AthenaBuffer.`Static` **toBuffer**(`data`, `size?`): `string`[]
:::

Create a String Buffer from a string.
Splits huge strings into a larger array.

**`Static`**

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `string` | `undefined` |
| `size` | `number` | `512` |

#### Returns

`string`[]

#### Defined in

[shared/utility/buffer.ts:11](https://github.com/Stuyk/altv-athena/blob/6beb5a6/src/core/shared/utility/buffer.ts#L11)
