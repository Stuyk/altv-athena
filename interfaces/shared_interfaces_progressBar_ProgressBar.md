---
title: AthenaShared.interfaces.progressBar.ProgressBar
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/progressBar](../modules/shared_interfaces_progressBar.md).ProgressBar

Used to create and show a progress bar. Used in server to client.

**`Interface`**

ProgressBar

## Properties

### color

• **color**: `RGBA`

The color of the progress bar.

#### Defined in

[shared/interfaces/progressBar.ts:30](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/shared/interfaces/progressBar.ts#L30)

___

### distance

• **distance**: `number`

The distance in which the progress bar can be seen.

#### Defined in

[shared/interfaces/progressBar.ts:44](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/shared/interfaces/progressBar.ts#L44)

___

### finalTime

• `Optional` **finalTime**: `number`

Do not set this. Leave it alone.

#### Defined in

[shared/interfaces/progressBar.ts:67](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/shared/interfaces/progressBar.ts#L67)

___

### milliseconds

• **milliseconds**: `number`

How long this progress bar should last.

#### Defined in

[shared/interfaces/progressBar.ts:37](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/shared/interfaces/progressBar.ts#L37)

___

### percentageEnabled

• `Optional` **percentageEnabled**: `boolean`

#### Defined in

[shared/interfaces/progressBar.ts:53](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/shared/interfaces/progressBar.ts#L53)

___

### position

• **position**: `Object`

The position in a 3D space to show the progress bar.
Only a single client will see it.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Defined in

[shared/interfaces/progressBar.ts:23](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/shared/interfaces/progressBar.ts#L23)

___

### startTime

• `Optional` **startTime**: `number`

Do not set this. Leave it alone.

#### Defined in

[shared/interfaces/progressBar.ts:60](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/shared/interfaces/progressBar.ts#L60)

___

### text

• `Optional` **text**: `string`

The text to display on the progress bar.

#### Defined in

[shared/interfaces/progressBar.ts:51](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/shared/interfaces/progressBar.ts#L51)

___

### uid

• `Optional` **uid**: `string`

A unique identifier to remove the progress bar early.

#### Defined in

[shared/interfaces/progressBar.ts:15](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/shared/interfaces/progressBar.ts#L15)
