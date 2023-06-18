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

[server/systems/inventory/clothing.ts:111](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L111)

___

### clearUniform

::: tip Usage
Athena.systems.inventory.clothing.**clearUniform**(`player`): `Promise`<`void`\>
:::

This function clears a player's uniform and triggers an event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | The "player" parameter is an instance of the alt.Player class, which represents a player in the game. It is used to identify which player's uniform should be cleared. |

#### Returns

`Promise`<`void`\>

a Promise that resolves to void (i.e., nothing).

#### Defined in

[server/systems/inventory/clothing.ts:71](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L71)

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

[server/systems/inventory/clothing.ts:129](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L129)

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

[server/systems/inventory/clothing.ts:161](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L161)

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

[server/systems/inventory/clothing.ts:360](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L360)

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

[server/systems/inventory/clothing.ts:361](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L361)

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

[server/systems/inventory/clothing.ts:362](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L362)

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

[server/systems/inventory/clothing.ts:363](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L363)

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

[server/systems/inventory/clothing.ts:364](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L364)

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

[server/systems/inventory/clothing.ts:365](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L365)

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

[server/systems/inventory/clothing.ts:366](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L366)

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

[server/systems/inventory/clothing.ts:367](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L367)

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

[server/systems/inventory/clothing.ts:333](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L333)

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

[server/systems/inventory/clothing.ts:91](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L91)

___

### setUniform

::: tip Usage
Athena.systems.inventory.clothing.**setUniform**(`player`, `components`): `Promise`<`boolean`\>
:::

This TypeScript function sets a uniform for a player in a game.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | The player parameter is an instance of the alt.Player class, which represents a player in the game. It is used to identify the player for whom the uniform is being set. |
| `components` | `ClothingComponent`[] | An array of ClothingComponent objects that represent the clothing items to be set as the player's uniform. |

#### Returns

`Promise`<`boolean`\>

a Promise that resolves to a boolean value.

#### Defined in

[server/systems/inventory/clothing.ts:48](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L48)

___

### update

::: tip Usage
Athena.systems.inventory.clothing.**update**(`player`, `document?`): `any`
:::

This function updates a player's appearance and clothing based on their character data.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | An object representing a player in the game. |
| `document` | `Character` | `undefined` | The `document` parameter is an optional parameter of type `Character`. If it is not provided, the function will retrieve the character data for the player from the `Athena.document.character` object. If it is provided, the function will use the provided `Character` object instead. |

#### Returns

`any`

The function does not always return a value. It may return the result of the
`Overrides.update` function if it exists and is called, but otherwise it may not return anything.

#### Defined in

[server/systems/inventory/clothing.ts:214](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/systems/inventory/clothing.ts#L214)
