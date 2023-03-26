---
title: Athena.document.character
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### KeyChangeCallback

Ƭ **KeyChangeCallback**: (`player`: `alt.Player`, `newValue`: `any`, `oldValue`: `any`) => `void`

#### Type declaration

▸ (`player`, `newValue`, `oldValue`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `alt.Player` |
| `newValue` | `any` |
| `oldValue` | `any` |

##### Returns

`void`

#### Defined in

[server/document/character.ts:7](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/document/character.ts#L7)

## Functions

### bind

▸ **bind**(`player`, `document`): `any`

Binds a player identifier to a Character document.

This document is cleared on disconnected automatically.

This should be the first thing you do after having a user authenticate and select a character.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `document` | `Character` |  |

#### Returns

`any`

#### Defined in

[server/document/character.ts:23](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/document/character.ts#L23)

___

### get

▸ **get**<`T`\>(`player`): `T` \| `undefined`

Return current player data and their associated character object.

Can also append custom objects to the generic type to obtain custom data from the database.

**`Example`**

```ts
interface Testing {
    myProperty: string;
}

function someFunction(player: alt.Player) {
     const data = Athena.document.character.get<Testing>(player);
     if (typeof data === 'undefined') {
         // Player likely not logged in...
         return;
     }

     if (data.myProperty) {
         console.log(data.myProperty);
     }
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `Character` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`T` \| `undefined`

#### Defined in

[server/document/character.ts:76](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/document/character.ts#L76)

___

### getField

▸ **getField**<`T`, `ReturnType`\>(`player`, `fieldName`): `ReturnType` \| `undefined`

Get the current value of a specific field inside of the player data object.
Can be extended to obtain any value easily.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |
| `ReturnType` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `fieldName` | `string` \| `number` \| `symbol` |  |

#### Returns

`ReturnType` \| `undefined`

#### Defined in

[server/document/character.ts:93](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/document/character.ts#L93)

___

### onChange

▸ **onChange**<`T`\>(`fieldName`, `callback`): `any`

Invokes the callback function when a document with a specific field name has changed.

**`Function`**

**`Name`**

onChange

**`Exports`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fieldName` | `string` \| `number` \| `symbol` |
| `callback` | [`KeyChangeCallback`](server_document_character.md#KeyChangeCallback) |

#### Returns

`any`

#### Defined in

[server/document/character.ts:223](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/document/character.ts#L223)

___

### override

▸ **override**(`functionName`, `callback`): `any`

Used to override any character document functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"bind"`` |
| `callback` | (`player`: `Player`, `document`: `Character`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:263](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/document/character.ts#L263)

▸ **override**(`functionName`, `callback`): `any`

Used to override any character document functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"unbind"`` |
| `callback` | (`id`: `number`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:264](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/document/character.ts#L264)

▸ **override**(`functionName`, `callback`): `any`

Used to override any character document functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"get"`` |
| `callback` | <T\>(`player`: `Player`) => `T` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:265](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/document/character.ts#L265)

▸ **override**(`functionName`, `callback`): `any`

Used to override any character document functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getField"`` |
| `callback` | <T, ReturnType\>(`player`: `Player`, `fieldName`: `string` \| `number` \| `symbol`) => `ReturnType` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:266](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/document/character.ts#L266)

▸ **override**(`functionName`, `callback`): `any`

Used to override any character document functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"set"`` |
| `callback` | <T, Keys\>(`player`: `Player`, `fieldName`: `Keys`, `value`: `any`, `skipCallbacks`: `boolean`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:267](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/document/character.ts#L267)

▸ **override**(`functionName`, `callback`): `any`

Used to override any character document functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setBulk"`` |
| `callback` | <T, Keys\>(`player`: `Player`, `fields`: `Keys`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:268](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/document/character.ts#L268)

▸ **override**(`functionName`, `callback`): `any`

Used to override any character document functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"onChange"`` |
| `callback` | <T\>(`fieldName`: `string` \| `number` \| `symbol`, `callback`: [`KeyChangeCallback`](server_document_character.md#KeyChangeCallback)) => `any` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:269](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/document/character.ts#L269)

___

### set

▸ **set**<`T`, `Keys`\>(`player`, `fieldName`, `value`, `skipCallbacks?`): `any`

Sets a player document value, and saves it automatically to the selected character's database.

Automatically calls all callbacks associated with the field name.

**`Example`**

```ts
await Athena.document.character.set(somePlayer, 'cash', 50);

// Alternatively

interface CustomCharacter {
     someKey: string;
}

await Athena.document.character.set<CustomCharacter>(somePlayer, 'someKey', 'hello world');
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |
| `Keys` | `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | An alt:V Player Entity |
| `fieldName` | `Keys` | `undefined` |  |
| `value` | `any` | `undefined` |  |
| `skipCallbacks` | `boolean` | `false` | - |

#### Returns

`any`

#### Defined in

[server/document/character.ts:132](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/document/character.ts#L132)

___

### setBulk

▸ **setBulk**<`T`, `Keys`\>(`player`, `fields`): `any`

Sets player document values, and saves it automatically to the selected character's database.
Automatically calls all callbacks associated with the field name.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |
| `Keys` | [`Partial`](server_controllers_textlabel_Internal.md#Partial)<`any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `fields` | `Keys` |  |

#### Returns

`any`

#### Defined in

[server/document/character.ts:187](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/document/character.ts#L187)

___

### unbind

▸ **unbind**(`id`): `any`

Unbind stored player character cache data.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:40](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/document/character.ts#L40)
