---
title: Athena.player.appearance
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### BaseStyle

Ƭ **BaseStyle**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `color` | `number` |
| `opacity` | `number` |
| `style` | `number` |

#### Defined in

[server/player/appearance.ts:7](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L7)

___

### Decorator

Ƭ **Decorator**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `collection` | `string` |
| `overlay` | `string` |

#### Defined in

[server/player/appearance.ts:5](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L5)

___

### HairStyle

Ƭ **HairStyle**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `color1` | `number` |
| `color2` | `number` |
| `decorator` | [`Decorator`](server_player_appearance.md#Decorator) |
| `dlc?` | `string` \| `number` |
| `hair` | `number` |

#### Defined in

[server/player/appearance.ts:6](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L6)

## Functions

### clearSkin

::: tip Usage
Athena.player.appearance.**clearSkin**(`player`): `Promise`<`void`\>
:::

Clear player custom model.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/player/appearance.ts:142](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L142)

___

### override

::: tip Usage
Athena.player.appearance.**override**(`functionName`, `callback`): `any`
:::

Used to override any appearance setter functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setHairStyle"`` |
| `callback` | (`player`: `Player`, `style`: [`HairStyle`](server_player_appearance.md#HairStyle)) => `any` |

#### Returns

`any`

#### Defined in

[server/player/appearance.ts:254](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L254)

::: tip Usage
Athena.player.appearance.**override**(`functionName`, `callback`): `any`
:::

Used to override any appearance setter functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setFacialHair"`` |
| `callback` | (`player`: `Player`, `choice`: [`BaseStyle`](server_player_appearance.md#BaseStyle)) => `any` |

#### Returns

`any`

#### Defined in

[server/player/appearance.ts:255](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L255)

::: tip Usage
Athena.player.appearance.**override**(`functionName`, `callback`): `any`
:::

Used to override any appearance setter functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setHeadBlendData"`` |
| `callback` | (`player`: `Player`, `faceData`: { `faceFather`: `number` ; `faceMix`: `number` ; `faceMother`: `number` ; `skinFather`: `number` ; `skinMix`: `number` ; `skinMother`: `number`  }) => `any` |

#### Returns

`any`

#### Defined in

[server/player/appearance.ts:256](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L256)

::: tip Usage
Athena.player.appearance.**override**(`functionName`, `callback`): `any`
:::

Used to override any appearance setter functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setEyebrows"`` |
| `callback` | (`player`: `Player`, `choice`: [`BaseStyle`](server_player_appearance.md#BaseStyle)) => `any` |

#### Returns

`any`

#### Defined in

[server/player/appearance.ts:257](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L257)

::: tip Usage
Athena.player.appearance.**override**(`functionName`, `callback`): `any`
:::

Used to override any appearance setter functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setModel"`` |
| `callback` | (`player`: `Player`, `isFeminine`: `boolean`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/appearance.ts:258](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L258)

::: tip Usage
Athena.player.appearance.**override**(`functionName`, `callback`): `any`
:::

Used to override any appearance setter functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setEyeColor"`` |
| `callback` | (`player`: `Player`, `color`: `number`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/appearance.ts:259](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L259)

::: tip Usage
Athena.player.appearance.**override**(`functionName`, `callback`): `any`
:::

Used to override any appearance setter functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"updateTattoos"`` |
| `callback` | (`player`: `Player`, `decorators?`: [`Decorator`](server_player_appearance.md#Decorator)[]) => `any` |

#### Returns

`any`

#### Defined in

[server/player/appearance.ts:260](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L260)

___

### setEyeColor

::: tip Usage
Athena.player.appearance.**setEyeColor**(`player`, `color`): `any`
:::

Set an eye color on a player.

Automatically saves to database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `color` | `number` |  |

#### Returns

`any`

#### Defined in

[server/player/appearance.ts:156](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L156)

___

### setEyebrows

::: tip Usage
Athena.player.appearance.**setEyebrows**(`player`, `choice`): `any`
:::

Update eyebrow style for a player.

Automatically saves to the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `choice` | [`BaseStyle`](server_player_appearance.md#BaseStyle) |  |

#### Returns

`any`

#### Defined in

[server/player/appearance.ts:84](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L84)

___

### setFacialHair

::: tip Usage
Athena.player.appearance.**setFacialHair**(`player`, `choice`): `any`
:::

Apply facial hair style to a player.

Automatically saves to database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `choice` | [`BaseStyle`](server_player_appearance.md#BaseStyle) | - |

#### Returns

`any`

#### Defined in

[server/player/appearance.ts:57](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L57)

___

### setHairStyle

::: tip Usage
Athena.player.appearance.**setHairStyle**(`player`, `style`): `any`
:::

Set a player's hairstyle.

Automatically saves it to Database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `style` | [`HairStyle`](server_player_appearance.md#HairStyle) |  |

#### Returns

`any`

#### Defined in

[server/player/appearance.ts:19](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L19)

___

### setHeadBlendData

::: tip Usage
Athena.player.appearance.**setHeadBlendData**(`player`, `faceData`): `any`
:::

Change the player's face

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `faceData` | `Object` |
| `faceData.faceFather` | `number` |
| `faceData.faceMix` | `number` |
| `faceData.faceMother` | `number` |
| `faceData.skinFather` | `number` |
| `faceData.skinMix` | `number` |
| `faceData.skinMother` | `number` |

#### Returns

`any`

#### Defined in

[server/player/appearance.ts:185](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L185)

___

### setModel

::: tip Usage
Athena.player.appearance.**setModel**(`player`, `isFeminine`): `any`
:::

Change the base model of the player to either a masculine base, or feminine base.

Automatically saves to database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `isFeminine` | `boolean` |  |

#### Returns

`any`

#### Defined in

[server/player/appearance.ts:111](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L111)

___

### setSkin

::: tip Usage
Athena.player.appearance.**setSkin**(`player`, `model`): `Promise`<`void`\>
:::

Set player appearance to a skin / model / ped.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `model` | `string` \| `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/player/appearance.ts:132](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L132)

___

### updateTattoos

::: tip Usage
Athena.player.appearance.**updateTattoos**(`player`, `decorators?`): `any`
:::

Used to update tattoos, and a hair overlay if present.
Add the 'decorators' paramater to override player appearance.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | An alt:V Player Entity |
| `decorators?` | [`Decorator`](server_player_appearance.md#Decorator)[] | `undefined` |  |

#### Returns

`any`

#### Defined in

[server/player/appearance.ts:217](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/server/player/appearance.ts#L217)
