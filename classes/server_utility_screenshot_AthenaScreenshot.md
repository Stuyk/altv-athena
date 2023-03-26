---
title: Athena.utility.screenshot.AthenaScreenshot
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/utility/screenshot](../modules/server_utility_screenshot.md).AthenaScreenshot

## Constructors

### constructor

• **new AthenaScreenshot**()

## Methods

### buildData

▸ `Static` **buildData**(`player`, `data`, `index`, `lengthOfData`): `Promise`<`void`\>

Builds data from a screenshot event.

**`Static`**

**`Memberof`**

AthenaScreenshot

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `data` | `string` |  |
| `index` | `number` |  |
| `lengthOfData` | `number` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/utility/screenshot.ts:59](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/utility/screenshot.ts#L59)

___

### takeScreenshot

▸ `Static` **takeScreenshot**(`player`): `Promise`<`string`\>

Take a screenshot of the player screen.
If the data becomes corrupted or does not retrieve in time it will return null.

**`Static`**

**`Memberof`**

AthenaScreenshot

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`Promise`<`string`\>

#### Defined in

[server/utility/screenshot.ts:23](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/utility/screenshot.ts#L23)
