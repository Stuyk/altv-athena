---
title: AthenaClient.camera.switch
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### switchToMultiSecondpart

::: tip Usage
AthenaClient.camera.switch.**switchToMultiSecondpart**(`timeInMs`, `switchType?`): `Promise`<`boolean`\>
:::

Zoom all the way out. Then zoom all the way in from the sky.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `timeInMs` | `number` | `undefined` |
| `switchType` | `SWITCHOUT_TYPES` | `SWITCHOUT_TYPES.THREE_STEPS` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[client/camera/switch.ts:14](https://github.com/Stuyk/altv-athena/blob/76e36de/src/core/client/camera/switch.ts#L14)
