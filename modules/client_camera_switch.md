---
title: AthenaClient.camera.switch
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### override

::: tip Usage
AthenaClient.camera.switch.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"switchToMultiSecondpart"`` |
| `callback` | (`timeInMs`: `number`, `switchType`: `SWITCHOUT_TYPES`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[client/camera/switch.ts:38](https://github.com/Stuyk/altv-athena/blob/2435881/src/core/client/camera/switch.ts#L38)

___

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

[client/camera/switch.ts:14](https://github.com/Stuyk/altv-athena/blob/2435881/src/core/client/camera/switch.ts#L14)
