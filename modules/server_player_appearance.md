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

[server/player/appearance.ts:7](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/appearance.ts#L7)

___

### Decorator

Ƭ **Decorator**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `collection` | `string` |
| `overlay` | `string` |

#### Defined in

[server/player/appearance.ts:5](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/appearance.ts#L5)

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

[server/player/appearance.ts:6](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/appearance.ts#L6)

## Functions

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

[server/player/appearance.ts:193](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/appearance.ts#L193)

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

[server/player/appearance.ts:194](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/appearance.ts#L194)

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

[server/player/appearance.ts:195](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/appearance.ts#L195)

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

[server/player/appearance.ts:196](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/appearance.ts#L196)

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

[server/player/appearance.ts:197](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/appearance.ts#L197)

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

[server/player/appearance.ts:198](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/appearance.ts#L198)

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

[server/player/appearance.ts:135](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/appearance.ts#L135)

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

[server/player/appearance.ts:84](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/appearance.ts#L84)

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

[server/player/appearance.ts:57](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/appearance.ts#L57)

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

[server/player/appearance.ts:19](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/appearance.ts#L19)

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

[server/player/appearance.ts:111](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/appearance.ts#L111)

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

[server/player/appearance.ts:157](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/player/appearance.ts#L157)
