---
title: AthenaClient.views.wheelMenu
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### open

::: tip Usage
AthenaClient.views.wheelMenu.**open**(`label`, `options`, `setMouseToCenter?`): `Promise`<`void`\>
:::

Open the wheel menu and inject various options to show.
When a user clicks on an option it executes that option based on whatever events, callbacks, etc. are passed.

**`Static`**

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `label` | `string` | `undefined` |
| `options` | `IWheelOptionExt`[] | `undefined` |
| `setMouseToCenter` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/views/wheelMenu.ts:111](https://github.com/Stuyk/altv-athena/blob/7cb341a/src/core/client/views/wheelMenu.ts#L111)

___

### update

::: tip Usage
AthenaClient.views.wheelMenu.**update**(`label`, `options`, `setMouseToCenter?`): `void`
:::

Does not close the wheel menu but instead overwrites its current options.

**`Static`**

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `label` | `string` | `undefined` |
| `options` | `IWheelOptionExt`[] | `undefined` |
| `setMouseToCenter?` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

[client/views/wheelMenu.ts:161](https://github.com/Stuyk/altv-athena/blob/7cb341a/src/core/client/views/wheelMenu.ts#L161)
