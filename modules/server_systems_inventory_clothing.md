---
title: Athena.systems.inventory.clothing
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### clearSkin

::: tip Usage
Athena.systems.inventory.clothing.**clearSkin**(`player`): `any`
:::

Clears a custom model on a player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/systems/inventory/clothing.ts:112](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L112)

___

### clearUniform

::: tip Usage
Athena.systems.inventory.clothing.**clearUniform**(`player`): `Promise`<`void`\>
:::

Used to clear a uniform on a player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/systems/inventory/clothing.ts:72](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L72)

___

### outfitFromDlc

::: tip Usage
Athena.systems.inventory.clothing.**outfitFromDlc**(`sex`, `componentList`): [`player`](server_config.md#player)<[`player`](server_config.md#player)\>
:::

Create a clothing item from DLC components.

If you know the relative ids for dlc clothing; this is how you generate the item or an outfit from it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `sex` | ``0`` \| ``1`` |
| `componentList` | `ClothingComponent`[] |

#### Returns

[`player`](server_config.md#player)<[`player`](server_config.md#player)\>

#### Defined in

[server/systems/inventory/clothing.ts:130](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L130)

___

### outfitFromPlayer

::: tip Usage
Athena.systems.inventory.clothing.**outfitFromPlayer**(`player`, `components`, `setEquipToTrue?`): [`player`](server_config.md#player) \| `undefined`
:::

Create a clothing item from the current clothes applies to a player.

Specify which ids you want to include in the outfit; and mark whichever as props.

You should apply 'absolute' values to the player before running this function.

Use the normal player.setClothes functions, and then call this function to generate an outfit from it.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | An alt:V Player Entity |
| `components` | { `id`: `number` ; `isProp?`: `boolean`  }[] | `undefined` |  |
| `setEquipToTrue` | `boolean` | `false` | - |

#### Returns

[`player`](server_config.md#player) \| `undefined`

#### Defined in

[server/systems/inventory/clothing.ts:162](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L162)

___

### override

::: tip Usage
Athena.systems.inventory.clothing.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory clothing functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"clearSkin"`` |
| `callback` | (`player`: `Player`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/clothing.ts:354](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L354)

::: tip Usage
Athena.systems.inventory.clothing.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory clothing functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"clearUniform"`` |
| `callback` | (`player`: `Player`) => `Promise`<`void`\> |

#### Returns

`any`

#### Defined in

[server/systems/inventory/clothing.ts:355](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L355)

::: tip Usage
Athena.systems.inventory.clothing.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory clothing functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"outfitFromDlc"`` |
| `callback` | (`sex`: ``0`` \| ``1``, `componentList`: `ClothingComponent`[]) => [`player`](server_config.md#player)<[`player`](server_config.md#player)\> |

#### Returns

`any`

#### Defined in

[server/systems/inventory/clothing.ts:356](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L356)

::: tip Usage
Athena.systems.inventory.clothing.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory clothing functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"outfitFromPlayer"`` |
| `callback` | (`player`: `Player`, `components`: { `id`: `number` ; `isProp?`: `boolean`  }[], `setEquipToTrue`: `boolean`) => [`player`](server_config.md#player) \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/clothing.ts:357](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L357)

::: tip Usage
Athena.systems.inventory.clothing.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory clothing functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setDefaults"`` |
| `callback` | (`sex`: ``0`` \| ``1``, `clothes`: { `0`: `number` = 1; `11`: `number` = 91; `3`: `number` = 15; `4`: `number` = 14; `5`: `number` = 0; `6`: `number` = 34; `7`: `number` = 0; `8`: `number` = 15; `9`: `number` = 0 } \| { `0`: `number` = 1; `11`: `number` = 15; `3`: `number` = 15; `4`: `number` = 14; `5`: `number` = 0; `6`: `number` = 35; `7`: `number` = 0; `8`: `number` = 15; `9`: `number` = 0 }) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/clothing.ts:358](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L358)

::: tip Usage
Athena.systems.inventory.clothing.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory clothing functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setSkin"`` |
| `callback` | (`player`: `Player`, `model`: `string` \| `number`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/clothing.ts:359](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L359)

::: tip Usage
Athena.systems.inventory.clothing.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory clothing functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setUniform"`` |
| `callback` | (`player`: `Player`, `components`: `ClothingComponent`[]) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/systems/inventory/clothing.ts:360](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L360)

::: tip Usage
Athena.systems.inventory.clothing.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory clothing functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"update"`` |
| `callback` | (`player`: `Player`, `document`: `Character`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/clothing.ts:361](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L361)

___

### setDefaults

::: tip Usage
Athena.systems.inventory.clothing.**setDefaults**(`sex`, `clothes`): `any`
:::

Used to change default clothing for either male or female.

#### Example
```ts
Athena.systems.inventory.clothing.setDefaults('female', {
    0: 1, // mask
    3: 15, // torso
    4: 14, // pants
    5: 0, // bag
    6: 35, // shoes
    7: 0, // accessories
    8: 15, // undershirt
    9: 0, // body armour
    11: 15, // top
});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `sex` | ``0`` \| ``1`` |
| `clothes` | { `0`: `number` = 1; `11`: `number` = 91; `3`: `number` = 15; `4`: `number` = 14; `5`: `number` = 0; `6`: `number` = 34; `7`: `number` = 0; `8`: `number` = 15; `9`: `number` = 0 } \| { `0`: `number` = 1; `11`: `number` = 15; `3`: `number` = 15; `4`: `number` = 14; `5`: `number` = 0; `6`: `number` = 35; `7`: `number` = 0; `8`: `number` = 15; `9`: `number` = 0 } |

#### Returns

`any`

#### Defined in

[server/systems/inventory/clothing.ts:327](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L327)

___

### setSkin

::: tip Usage
Athena.systems.inventory.clothing.**setSkin**(`player`, `model`): `any`
:::

Set a custom model on a player.

If a custom model is set; no appearance or clothing updates will be called.

Uniforms are also ignored if a skin is set.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `model` | `string` \| `number` |  |

#### Returns

`any`

#### Defined in

[server/systems/inventory/clothing.ts:92](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L92)

___

### setUniform

::: tip Usage
Athena.systems.inventory.clothing.**setUniform**(`player`, `components`): `Promise`<`boolean`\>
:::

Used to set a uniform on a player.

The uniform overrides all other clothing on a multiplayer ped model.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `components` | `ClothingComponent`[] |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/systems/inventory/clothing.ts:51](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L51)

___

### update

::: tip Usage
Athena.systems.inventory.clothing.**update**(`player`, `document?`): `any`
:::

Loop through all isEquipped items; and synchronize appearance.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | An alt:V Player Entity |
| `document` | `Character` | `undefined` | - |

#### Returns

`any`

#### Defined in

[server/systems/inventory/clothing.ts:208](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/server/systems/inventory/clothing.ts#L208)
