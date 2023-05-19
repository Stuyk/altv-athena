---
title: Athena.controllers.interaction
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### append

::: tip Usage
Athena.controllers.interaction.**append**(`interaction`): `string`
:::

Add an interaction to the scene.

An interaction is where a player can walk up to an invisible marker and press the interaction key to trigger a callback.

Interactions are accessible by all players.

Additional options may be added to the example interaction below.

See type interface in VSCode for more information.

> Always subtract 1 from the 'z' axis when getting positions in-game.

Returns a uid or generates one if not specified.

#### Example
```ts
const uid = Athena.controllers.interaction.append({
   position: { x: 0, y: 0, z: 0 },
   isPlayerOnly: true,
   isVehicleOnly: false,
   callback(player: alt.Player) {
       alt.log(`${player.id} interacted with an interaction!`)
   }
});

Athena.controllers.interaction.append({
   uid: 'the-uid-you-specified',
   position: { x: 0, y: 0, z: 0 },
   isPlayerOnly: true,
   isVehicleOnly: false,
   callback(player: alt.Player) {
       alt.log(`${player.id} interacted with an interaction!`)
   }
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `interaction` | `Interaction` | The interaction object to be added. |

#### Returns

`string`

A string representing the uid of the interaction.

#### Defined in

[server/controllers/interaction.ts:307](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/controllers/interaction.ts#L307)

___

### get

::: tip Usage
Athena.controllers.interaction.**get**(`uid`): [`InteractionShape`](../classes/server_extensions_extColshape_InteractionShape.md) \| `undefined`
:::

Returns interaction information.

This includes the internal ColShapes as well.

#### Example
```ts
const interaction = Athena.controllers.interaction.get('the-uid-you-specified');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uid` | `string` | A unique string - The unique identifier of the interaction. |

#### Returns

[`InteractionShape`](../classes/server_extensions_extColshape_InteractionShape.md) \| `undefined`

The InteractionShape object.

#### Defined in

[server/controllers/interaction.ts:376](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/controllers/interaction.ts#L376)

___

### getBindings

::: tip Usage
Athena.controllers.interaction.**getBindings**(): `Object`
:::

Used to obtain current interactions that are bound to a player id.

#### Returns

`Object`

#### Defined in

[server/controllers/interaction.ts:395](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/controllers/interaction.ts#L395)

___

### override

::: tip Usage
Athena.controllers.interaction.**override**(`functionName`, `callback`): `any`
:::

Used to override any interaction controller function.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"append"`` |
| `callback` | (`interaction`: `Interaction`) => `string` |

#### Returns

`any`

#### Defined in

[server/controllers/interaction.ts:430](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/controllers/interaction.ts#L430)

::: tip Usage
Athena.controllers.interaction.**override**(`functionName`, `callback`): `any`
:::

Used to override any interaction controller function.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"remove"`` |
| `callback` | (`uid`: `string`) => `void` |

#### Returns

`any`

#### Defined in

[server/controllers/interaction.ts:431](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/controllers/interaction.ts#L431)

::: tip Usage
Athena.controllers.interaction.**override**(`functionName`, `callback`): `any`
:::

Used to override any interaction controller function.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"get"`` |
| `callback` | (`uid`: `string`) => [`InteractionShape`](../classes/server_extensions_extColshape_InteractionShape.md) \| `undefined` |

#### Returns

`any`

#### Defined in

[server/controllers/interaction.ts:432](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/controllers/interaction.ts#L432)

::: tip Usage
Athena.controllers.interaction.**override**(`functionName`, `callback`): `any`
:::

Used to override any interaction controller function.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getBindings"`` |
| `callback` | () => { `[player_id: string]`: [`InteractionShape`](../classes/server_extensions_extColshape_InteractionShape.md);  } |

#### Returns

`any`

#### Defined in

[server/controllers/interaction.ts:433](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/controllers/interaction.ts#L433)

___

### overrideInternal

::: tip Usage
Athena.controllers.interaction.**overrideInternal**(`functionName`, `callback`): `any`
:::

Used to override any internal interaction controller function.
Handles things such as entering colshapes, leaving, and trigger them.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"trigger"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/controllers/interaction.ts:445](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/controllers/interaction.ts#L445)

::: tip Usage
Athena.controllers.interaction.**overrideInternal**(`functionName`, `callback`): `any`
:::

Used to override any internal interaction controller function.
Handles things such as entering colshapes, leaving, and trigger them.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"leave"`` |
| `callback` | (`colshape`: [`InteractionShape`](../classes/server_extensions_extColshape_InteractionShape.md), `entity`: `Entity`) => `any` |

#### Returns

`any`

#### Defined in

[server/controllers/interaction.ts:446](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/controllers/interaction.ts#L446)

::: tip Usage
Athena.controllers.interaction.**overrideInternal**(`functionName`, `callback`): `any`
:::

Used to override any internal interaction controller function.
Handles things such as entering colshapes, leaving, and trigger them.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"enter"`` |
| `callback` | (`colshape`: [`InteractionShape`](../classes/server_extensions_extColshape_InteractionShape.md), `entity`: `Entity`) => `any` |

#### Returns

`any`

#### Defined in

[server/controllers/interaction.ts:447](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/controllers/interaction.ts#L447)

___

### remove

::: tip Usage
Athena.controllers.interaction.**remove**(`uid`): `void`
:::

Removes an interaction from existence.

Removes the associated ColShape as well.

#### Example
```ts
Athena.controllers.interaction.remove(someUid);

Athena.controllers.interaction.remove('the-uid-you-specified');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uid` | `string` | A unique string - The unique identifier of the interaction to remove. |

#### Returns

`void`

None

#### Defined in

[server/controllers/interaction.ts:355](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/server/controllers/interaction.ts#L355)
