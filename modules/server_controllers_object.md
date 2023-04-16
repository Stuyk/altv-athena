---
title: Athena.controllers.object
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### addToPlayer

::: tip Usage
Athena.controllers.object.**addToPlayer**(`player`, `objectData`): `string`
:::

Add an object to the player that only they can see.

Returns a uid or generates one if not specified.

#### Example
```ts
const uid = Athena.controllers.object.addToPlayer(somePlayer, {
     model: 'prop_pizza_oven_01',
     pos: { x: 0, y: 0, z: 0}
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `objectData` | [`IObject`](../interfaces/shared_interfaces_iObject_IObject.md) |  |

#### Returns

`string`

uid A unique string for object

#### Defined in

[server/controllers/object.ts:164](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/object.ts#L164)

___

### append

::: tip Usage
Athena.controllers.object.**append**(`objectData`): `string`
:::

Add an object to the global world.

These objects should not be used to construct interiors.

Create an MLO, or use something like CodeWalker to create large scale map changes.

Returns a uid or generates one if not specified.

#### Example
```ts
const uid = Athena.controllers.object.append({
     model: 'prop_pizza_oven_01',
     pos: { x: 0, y: 0, z: 0}
});

Athena.controllers.object.append({
     uid: 'the-uid-you-specified',
     model: 'prop_pizza_oven_01',
     pos: { x: 0, y: 0, z: 0}
});

```

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectData` | [`IObject`](../interfaces/shared_interfaces_iObject_IObject.md) |

#### Returns

`string`

uid A unique string for object

#### Defined in

[server/controllers/object.ts:70](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/object.ts#L70)

___

### override

::: tip Usage
Athena.controllers.object.**override**(`functionName`, `callback`): `any`
:::

Used to override any object streamer functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"append"`` |
| `callback` | (`objectData`: [`IObject`](../interfaces/shared_interfaces_iObject_IObject.md)) => `string` |

#### Returns

`any`

#### Defined in

[server/controllers/object.ts:246](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/object.ts#L246)

::: tip Usage
Athena.controllers.object.**override**(`functionName`, `callback`): `any`
:::

Used to override any object streamer functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"remove"`` |
| `callback` | (`uid`: `string`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/controllers/object.ts:247](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/object.ts#L247)

::: tip Usage
Athena.controllers.object.**override**(`functionName`, `callback`): `any`
:::

Used to override any object streamer functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addToPlayer"`` |
| `callback` | (`player`: `Player`, `objectData`: [`IObject`](../interfaces/shared_interfaces_iObject_IObject.md)) => `string` |

#### Returns

`any`

#### Defined in

[server/controllers/object.ts:248](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/object.ts#L248)

::: tip Usage
Athena.controllers.object.**override**(`functionName`, `callback`): `any`
:::

Used to override any object streamer functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"removeFromPlayer"`` |
| `callback` | (`player`: `Player`, `uid`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/controllers/object.ts:249](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/object.ts#L249)

::: tip Usage
Athena.controllers.object.**override**(`functionName`, `callback`): `any`
:::

Used to override any object streamer functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"updatePosition"`` |
| `callback` | (`uid`: `string`, `pos`: `IVector3`, `player?`: `Player`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/controllers/object.ts:250](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/object.ts#L250)

::: tip Usage
Athena.controllers.object.**override**(`functionName`, `callback`): `any`
:::

Used to override any object streamer functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"updateModel"`` |
| `callback` | (`uid`: `string`, `model`: `string`, `player`: `Player`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/controllers/object.ts:251](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/object.ts#L251)

___

### remove

::: tip Usage
Athena.controllers.object.**remove**(`uid`): `boolean`
:::

Removes an object from the global world.

If the object was found and removed this will return true.

#### Example
```ts
const result = Athena.controllers.object.remove(someUid);

Athena.controllers.object.remove('the-uid-you-specified');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uid` | `string` | A unique string |

#### Returns

`boolean`

#### Defined in

[server/controllers/object.ts:100](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/object.ts#L100)

___

### removeFromPlayer

::: tip Usage
Athena.controllers.object.**removeFromPlayer**(`player`, `uid`): `any`
:::

Remove an object from the player that only they can see.

#### Example
```ts
Athena.controllers.object.removeFromPlayer(somePlayer, someUid);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `uid` | `string` | A unique string |

#### Returns

`any`

#### Defined in

[server/controllers/object.ts:135](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/object.ts#L135)

___

### updateModel

::: tip Usage
Athena.controllers.object.**updateModel**(`uid`, `model`, `player?`): `boolean`
:::

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `uid` | `string` | `undefined` |
| `model` | `string` | `undefined` |
| `player` | `Player` | `undefined` |

#### Returns

`boolean`

#### Defined in

[server/controllers/object.ts:220](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/object.ts#L220)

___

### updatePosition

::: tip Usage
Athena.controllers.object.**updatePosition**(`uid`, `pos`, `player?`): `boolean`
:::

Updates the position for an object.

> NOT ALL OBJECTS CAN BE MOVED DYNAMICALLY.

#### Example

### Non-Player Object

```ts
Athena.controllers.object.updatePosition(someUid, { x: 0, y: 0, z: 0});
```

### Player Object

```ts
Athena.controllers.object.updatePosition(someUid, { x: 0, y: 0, z: 0}, somePlayer);
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `uid` | `string` | `undefined` | A unique string |
| `pos` | `IVector3` | `undefined` | A position in the world. |
| `player?` | `Player` | `undefined` |  |

#### Returns

`boolean`

#### Defined in

[server/controllers/object.ts:200](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/controllers/object.ts#L200)
