---
title: Athena.utility.math
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
| `getMissingNumber` | (`arr`: `number`[], `startIndex?`: `number`) => `number` |

#### Defined in

[server/utility/math.ts:25](https://github.com/Stuyk/altv-athena/blob/e51302d/src/core/server/utility/math.ts#L25)

## Functions

### getMissingNumber

::: tip Usage
Athena.utility.math.**getMissingNumber**(`arr`, `startIndex?`): `number`
:::

Takes an array of numbers and attempts to determine which number is missing given a range.
Returns the first missing number.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `arr` | `number`[] | `undefined` |
| `startIndex?` | `number` | `0` |

#### Returns

`number`

#### Defined in

[server/utility/math.ts:10](https://github.com/Stuyk/altv-athena/blob/e51302d/src/core/server/utility/math.ts#L10)
