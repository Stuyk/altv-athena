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

::: tip Usage
Athena.document.character.(`player`, `newValue`, `oldValue`): `void`
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `alt.Player` |
| `newValue` | `any` |
| `oldValue` | `any` |

##### Returns

`void`

#### Defined in

[server/document/character.ts:8](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/document/character.ts#L8)

## Functions

### bind

::: tip Usage
Athena.document.character.**bind**(`player`, `document`): `any`
:::

Binds a player identifier to a Character document.

This document is cleared on disconnected automatically.

This should be the first thing you do after having a user authenticate and select a character.

#### Example

```ts
import Database from '@stuyk/ezmongodb';

async function doSomething(somePlayer: alt.Player, someMongoDBId: string) {
    const someData = await Database.fetchData('_id', someMongoDBId, 'characters')
    Athena.document.character.bind(somePlayer, someData);
}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `document` | `Character` |  |

#### Returns

`any`

#### Defined in

[server/document/character.ts:35](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/document/character.ts#L35)

___

### get

::: tip Usage
Athena.document.character.**get**<`T`\>(`player`): `T` \| `undefined`
:::

Return current player data and their associated character object.

Can also append custom objects to the generic type to obtain custom data from the database.

#### Example
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

[server/document/character.ts:96](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/document/character.ts#L96)

___

### getField

::: tip Usage
Athena.document.character.**getField**<`T`, `ReturnType`\>(`player`, `fieldName`): `ReturnType` \| `undefined`
:::

Get the current value of a specific field inside of the player data object.
Can be extended to obtain any value easily.

#### Example

Get a default value.

```ts
const cash = Athena.document.character.getField<{}, number>(somePlayer, 'cash');
if (typeof cash === 'undefined') {
    return;
}
```

Alternatively, pass a custom interface.

```ts
interface CustomData {
    bitcoin: number
}

const bitcoins = Athena.document.character.getField<CustomData, number>(somePlayer, 'bitcoin');
if (typeof bitcoins === 'undefined') {
    return;
}
```

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

[server/document/character.ts:137](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/document/character.ts#L137)

___

### onChange

::: tip Usage
Athena.document.character.**onChange**<`T`\>(`fieldName`, `callback`): `any`
:::

Invokes the callback function when a document with a specific field name has changed.

#### Example
```ts
Athena.document.character.onChange('cash', (player: alt.Player, newValue: number, oldValue: number) => {
    // Do whatever you want with it.
    // Never, ever update the same document value twice in a row.
    // It creates an endless loop
})
```

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

[server/document/character.ts:283](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/document/character.ts#L283)

___

### override

::: tip Usage
Athena.document.character.**override**(`functionName`, `callback`): `any`
:::

Used to override any character document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"bind"`` |
| `callback` | (`player`: `Player`, `document`: `Character`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:323](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/document/character.ts#L323)

::: tip Usage
Athena.document.character.**override**(`functionName`, `callback`): `any`
:::

Used to override any character document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"unbind"`` |
| `callback` | (`id`: `number`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:324](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/document/character.ts#L324)

::: tip Usage
Athena.document.character.**override**(`functionName`, `callback`): `any`
:::

Used to override any character document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"get"`` |
| `callback` | <T\>(`player`: `Player`) => `T` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:325](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/document/character.ts#L325)

::: tip Usage
Athena.document.character.**override**(`functionName`, `callback`): `any`
:::

Used to override any character document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getField"`` |
| `callback` | <T, ReturnType\>(`player`: `Player`, `fieldName`: `string` \| `number` \| `symbol`) => `ReturnType` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:326](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/document/character.ts#L326)

::: tip Usage
Athena.document.character.**override**(`functionName`, `callback`): `any`
:::

Used to override any character document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"set"`` |
| `callback` | <T, Keys\>(`player`: `Player`, `fieldName`: `Keys`, `value`: `any`, `skipCallbacks`: `boolean`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:327](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/document/character.ts#L327)

::: tip Usage
Athena.document.character.**override**(`functionName`, `callback`): `any`
:::

Used to override any character document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setBulk"`` |
| `callback` | <T, Keys\>(`player`: `Player`, `fields`: `Keys`) => `any` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:328](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/document/character.ts#L328)

::: tip Usage
Athena.document.character.**override**(`functionName`, `callback`): `any`
:::

Used to override any character document functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"onChange"`` |
| `callback` | <T\>(`fieldName`: `string` \| `number` \| `symbol`, `callback`: [`KeyChangeCallback`](server_document_character.md#KeyChangeCallback)) => `any` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:329](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/document/character.ts#L329)

___

### set

::: tip Usage
Athena.document.character.**set**<`T`, `Keys`\>(`player`, `fieldName`, `value`, `skipCallbacks?`): `any`
:::

Sets a player document value, and saves it automatically to the selected character's database.

Automatically calls all callbacks associated with the field name.

#### Example
```ts
await Athena.document.character.set(somePlayer, 'cash', 50);
```

Alternatively, pass a custom interface.

```ts
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

[server/document/character.ts:178](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/document/character.ts#L178)

___

### setBulk

::: tip Usage
Athena.document.character.**setBulk**<`T`, `Keys`\>(`player`, `fields`): `any`
:::

Sets player document values, and saves it automatically to the selected character's database.

Automatically calls all callbacks associated with the field name.

#### Example

```ts
await Athena.document.character.setBulk(player, { cash: 25, bank: 100 });
```

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

[server/document/character.ts:241](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/document/character.ts#L241)

___

### unbind

::: tip Usage
Athena.document.character.**unbind**(`id`): `any`
:::

Unbind stored player character cache data.

#### Example

```ts
Athena.document.character.unbind(1);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`any`

#### Defined in

[server/document/character.ts:60](https://github.com/Stuyk/altv-athena/blob/d2642d1/src/core/server/document/character.ts#L60)
