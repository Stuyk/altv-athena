---
title: AthenaClient.screen.progressBar
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### clear

::: tip Usage
AthenaClient.screen.progressBar.**clear**(): `void`
:::

Clear the progress bar if there are no more bars to show.

#### Returns

`void`

None

#### Defined in

[client/screen/progressBar.ts:105](https://github.com/Stuyk/altv-athena/blob/8499342/src/core/client/screen/progressBar.ts#L105)

___

### create

::: tip Usage
AthenaClient.screen.progressBar.**create**(`progressBar`): `void`
:::

Create a new progress bar.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `progressBar` | `ProgressBar` | ProgressBar |

#### Returns

`void`

None

#### Defined in

[client/screen/progressBar.ts:64](https://github.com/Stuyk/altv-athena/blob/8499342/src/core/client/screen/progressBar.ts#L64)

___

### remove

::: tip Usage
AthenaClient.screen.progressBar.**remove**(`uid`): `void`
:::

`removeBar` removes a bar from the `bars` array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uid` | `string` | A unique string - The unique identifier of the bar. |

#### Returns

`void`

The function that is being returned is the function that is being called.

#### Defined in

[client/screen/progressBar.ts:87](https://github.com/Stuyk/altv-athena/blob/8499342/src/core/client/screen/progressBar.ts#L87)
