---
title: AthenaClient.screen.minimap
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### convertToPercentage

::: tip Usage
AthenaClient.screen.minimap.**convertToPercentage**(`value`, `isXAxis?`): `number`
:::

Convert Pixel Values to Percentages

**`Static`**

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `value` | `number` | `undefined` |
| `isXAxis?` | `boolean` | `true` |

#### Returns

`number`

#### Defined in

[client/screen/minimap.ts:150](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/client/screen/minimap.ts#L150)

___

### getBottomLeft

::: tip Usage
AthenaClient.screen.minimap.**getBottomLeft**(`asPercent?`): `alt.IVector2`
:::

Get bottom left of the MiniMap

**`Static`**

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `asPercent?` | `boolean` | `false` | Convert to percentage? |

#### Returns

`alt.IVector2`

#### Defined in

[client/screen/minimap.ts:90](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/client/screen/minimap.ts#L90)

___

### getBottomRight

::: tip Usage
AthenaClient.screen.minimap.**getBottomRight**(`asPercent?`): `alt.IVector2`
:::

Get Bottom Right of MiniMap

**`Static`**

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `asPercent?` | `boolean` | `false` | Conver to percentage? |

#### Returns

`alt.IVector2`

#### Defined in

[client/screen/minimap.ts:110](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/client/screen/minimap.ts#L110)

___

### getHeight

::: tip Usage
AthenaClient.screen.minimap.**getHeight**(`asPercent?`): `number`
:::

Get the height of the MiniMap

**`Static`**

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `asPercent?` | `boolean` | `false` | Convert to percentage? |

#### Returns

`number`

#### Defined in

[client/screen/minimap.ts:30](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/client/screen/minimap.ts#L30)

___

### getSafeZoneSize

::: tip Usage
AthenaClient.screen.minimap.**getSafeZoneSize**(): `number`
:::

#### Returns

`number`

#### Defined in

[client/screen/minimap.ts:123](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/client/screen/minimap.ts#L123)

___

### getScreenAspectRatio

::: tip Usage
AthenaClient.screen.minimap.**getScreenAspectRatio**(): `number`
:::

#### Returns

`number`

#### Defined in

[client/screen/minimap.ts:127](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/client/screen/minimap.ts#L127)

___

### getScreenResolution

::: tip Usage
AthenaClient.screen.minimap.**getScreenResolution**(): `alt.IVector2`
:::

Get current screen resolution

#### Returns

`alt.IVector2`

#### Defined in

[client/screen/minimap.ts:137](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/client/screen/minimap.ts#L137)

___

### getTopLeft

::: tip Usage
AthenaClient.screen.minimap.**getTopLeft**(`asPercent?`): `alt.IVector2`
:::

Get the Top Left of the MiniMap

**`Static`**

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `asPercent?` | `boolean` | `false` | Convert to percentage? |

#### Returns

`alt.IVector2`

#### Defined in

[client/screen/minimap.ts:48](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/client/screen/minimap.ts#L48)

___

### getTopRight

::: tip Usage
AthenaClient.screen.minimap.**getTopRight**(`asPercent?`): `alt.IVector2`
:::

Get the top right of the MiniMap

**`Static`**

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `asPercent?` | `boolean` | `false` | Convert to percentage? |

#### Returns

`alt.IVector2`

#### Defined in

[client/screen/minimap.ts:70](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/client/screen/minimap.ts#L70)

___

### getWidth

::: tip Usage
AthenaClient.screen.minimap.**getWidth**(`asPercent?`): `number`
:::

Get the width of the MiniMap

**`Static`**

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `asPercent?` | `boolean` | `false` | Convert to percentage? |

#### Returns

`number`

#### Defined in

[client/screen/minimap.ts:11](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/client/screen/minimap.ts#L11)
