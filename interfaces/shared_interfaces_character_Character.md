---
title: AthenaShared.interfaces.character.Character
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/character](../modules/shared_interfaces_character.md).Character

Used as the main interface for storing character data.

**`Interface`**

Character

## Indexable

▪ [key: `string`]: `any`

## Properties

### \_id

• `Optional` **\_id**: `any`

The character identifier in the database.

#### Defined in

[shared/interfaces/character.ts:21](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L21)

___

### account\_id

• **account\_id**: `any`

The account id associated with this character.

#### Defined in

[shared/interfaces/character.ts:36](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L36)

___

### appearance

• **appearance**: [`Appearance`](shared_interfaces_appearance_Appearance.md) \| [`Partial`](../modules/server_controllers_textlabel_Internal.md#Partial)<[`Appearance`](shared_interfaces_appearance_Appearance.md)\>

Appearance data for how this character looks.

#### Defined in

[shared/interfaces/character.ts:131](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L131)

___

### armour

• **armour**: `number`

The amount of armour the player last had.

#### Defined in

[shared/interfaces/character.ts:88](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L88)

___

### bank

• **bank**: `number`

The amount of cash in the bank this character has.

#### Defined in

[shared/interfaces/character.ts:74](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L74)

___

### cash

• **cash**: `number`

The amount of cash this character has.

#### Defined in

[shared/interfaces/character.ts:67](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L67)

___

### character\_id

• `Optional` **character\_id**: `number`

An incremental numerical identifier that increases with each character created.
Does not fill gaps. Do not use as a way to save character information.

#### Defined in

[shared/interfaces/character.ts:29](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L29)

___

### dimension

• **dimension**: `number`

The current dimension of the player. When they spawn
they are automatically moved into this dimension.

#### Defined in

[shared/interfaces/character.ts:45](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L45)

___

### food

• **food**: `number`

The amount of food the player has.

#### Defined in

[shared/interfaces/character.ts:95](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L95)

___

### groups

• `Optional` **groups**: `Object`

A key value pair that contains a list of permissions a character has for a group.

**`Memberof`**

Character

#### Index signature

▪ [key: `string`]: `string`[]

#### Defined in

[shared/interfaces/character.ts:197](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L197)

___

### health

• **health**: `number`

The amount of health the player last had.

#### Defined in

[shared/interfaces/character.ts:81](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L81)

___

### hours

• **hours**: `number`

Amount of hours the player has played.

#### Defined in

[shared/interfaces/character.ts:117](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L117)

___

### info

• **info**: [`Partial`](../modules/server_controllers_textlabel_Internal.md#Partial)<[`CharacterInfo`](shared_interfaces_characterInfo_CharacterInfo.md)\>

Character info. Will eventually be used for ID cards.

#### Defined in

[shared/interfaces/character.ts:138](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L138)

___

### interior

• **interior**: `number`

Current player interior number. Usually bound to dimension.

#### Defined in

[shared/interfaces/character.ts:146](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L146)

___

### inventory

• **inventory**: `StoredItem`[]

Individual item references that the player currently has on-hand.

#### Defined in

[shared/interfaces/character.ts:162](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L162)

___

### isDead

• **isDead**: `boolean`

Is this player dead or not.
Health does not dictate whether a player is alive or dead.

#### Defined in

[shared/interfaces/character.ts:110](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L110)

___

### name

• **name**: `string`

The name of this character to display to other users.

#### Defined in

[shared/interfaces/character.ts:60](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L60)

___

### permissions

• **permissions**: `string`[]

Permissions for a given user.

#### Defined in

[shared/interfaces/character.ts:154](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L154)

___

### pos

• **pos**: `IVector3`

The position that this character last logged out at.
This also updates every 5s or so.

#### Defined in

[shared/interfaces/character.ts:53](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L53)

___

### skin

• `Optional` **skin**: `string` \| `number`

A custom model that can be applied to the player.
If this is set; the clothing items will never be applied.
This also goes for appearance as well.

#### Defined in

[shared/interfaces/character.ts:189](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L189)

___

### toolbar

• **toolbar**: `StoredItem`[]

Individual item references that the player may access through the 1-4 keys

#### Defined in

[shared/interfaces/character.ts:170](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L170)

___

### uniform

• `Optional` **uniform**: `ClothingComponent`[]

Clothes that will be applied to the player last.
Uniforms should be used in tandem with typical inventory clothing.

#### Defined in

[shared/interfaces/character.ts:179](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L179)

___

### wanted

• **wanted**: `number`

Wanted stars to display.

#### Defined in

[shared/interfaces/character.ts:124](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L124)

___

### water

• **water**: `number`

The amount of water the player has.

#### Defined in

[shared/interfaces/character.ts:102](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/shared/interfaces/character.ts#L102)
