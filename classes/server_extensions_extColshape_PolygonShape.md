---
title: Athena.extensions.extColshape.PolygonShape
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/extensions/extColshape](../modules/server_extensions_extColshape.md).PolygonShape

## Hierarchy

- [`player`](../modules/server_config.md#player)

  ↳ **`PolygonShape`**

## Constructors

### constructor

• **new PolygonShape**(`minZ`, `maxZ`, `vertices`, `isPlayerOnly`, `isVehicleOnly`, `debug?`)

Creates an expensive instance of PolygonShape.

Enter / Exit can be fetched with 'entityEnterColshape' and 'entityLeaveColshape' events

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `minZ` | `number` | `undefined` | The floor level of the polygon |
| `maxZ` | `number` | `undefined` | The max height of the polygon |
| `vertices` | `IVector2`[] \| `IVector3`[] | `undefined` | An array of `x, y` to determine where to draw the polygon around |
| `isPlayerOnly` | `boolean` | `undefined` | - |
| `isVehicleOnly` | `boolean` | `undefined` | - |
| `debug` | `boolean` | `false` | - |

#### Overrides

alt.ColshapePolygon.constructor

#### Defined in

[server/extensions/extColshape.ts:77](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/extensions/extColshape.ts#L77)

## Properties

### enterCallbacks

• `Private` **enterCallbacks**: (`shape`: [`PolygonShape`](server_extensions_extColshape_PolygonShape.md), `entity`: `any`) => `void`[] = `[]`

#### Defined in

[server/extensions/extColshape.ts:64](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/extensions/extColshape.ts#L64)

___

### isDebug

• **isDebug**: `boolean` = `false`

#### Defined in

[server/extensions/extColshape.ts:62](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/extensions/extColshape.ts#L62)

___

### isPlayerOnly

• **isPlayerOnly**: `boolean`

#### Defined in

[server/extensions/extColshape.ts:59](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/extensions/extColshape.ts#L59)

___

### isPolygonShape

• **isPolygonShape**: `boolean` = `true`

#### Defined in

[server/extensions/extColshape.ts:61](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/extensions/extColshape.ts#L61)

___

### isVehicleOnly

• **isVehicleOnly**: `boolean`

#### Defined in

[server/extensions/extColshape.ts:60](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/extensions/extColshape.ts#L60)

___

### leaveCallbacks

• `Private` **leaveCallbacks**: (`shape`: [`PolygonShape`](server_extensions_extColshape_PolygonShape.md), `entity`: `any`) => `void`[] = `[]`

#### Defined in

[server/extensions/extColshape.ts:65](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/extensions/extColshape.ts#L65)

___

### uid

• **uid**: `string`

#### Defined in

[server/extensions/extColshape.ts:57](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/extensions/extColshape.ts#L57)

___

### vertices

• **vertices**: `IVector2`[]

#### Defined in

[server/extensions/extColshape.ts:58](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/extensions/extColshape.ts#L58)

## Methods

### addEnterCallback

::: tip Usage
Athena.extensions.extColshape.PolygonShape.**addEnterCallback**(`callback`): `void`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`shape`: [`PolygonShape`](server_extensions_extColshape_PolygonShape.md), `entity`: `any`) => `void` |

#### Returns

`void`

#### Defined in

[server/extensions/extColshape.ts:98](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/extensions/extColshape.ts#L98)

___

### addLeaveCallback

::: tip Usage
Athena.extensions.extColshape.PolygonShape.**addLeaveCallback**(`callback`): `void`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`shape`: [`PolygonShape`](server_extensions_extColshape_PolygonShape.md), `entity`: `any`) => `void` |

#### Returns

`void`

#### Defined in

[server/extensions/extColshape.ts:102](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/extensions/extColshape.ts#L102)

___

### invokeEnterCallbacks

::: tip Usage
Athena.extensions.extColshape.PolygonShape.**invokeEnterCallbacks**(`entity`): `void`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `Entity` |

#### Returns

`void`

#### Defined in

[server/extensions/extColshape.ts:106](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/extensions/extColshape.ts#L106)

___

### invokeLeaveCallbacks

::: tip Usage
Athena.extensions.extColshape.PolygonShape.**invokeLeaveCallbacks**(`entity`): `void`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `Entity` |

#### Returns

`void`

#### Defined in

[server/extensions/extColshape.ts:112](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/extensions/extColshape.ts#L112)
