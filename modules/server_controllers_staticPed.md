---
title: Athena.controllers.staticPed
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### addToPlayer

::: tip Usage
Athena.controllers.staticPed.**addToPlayer**(`player`, `pedData`): `string`
:::

Add a single ped that only a single player can see

Returns a uid or generates one if not specified.

#### Example
```ts
const uid = Athena.controllers.staticPed.addToPlayer(somePlayer, { model: 'g_f_importexport_01', pos: { x: 0, y: 0, z: 0} })

Athena.controllers.staticPed.addToPlayer(somePlayer, { uid: 'the-id-you-specified', model: 'g_f_importexport_01', pos: { x: 0, y: 0, z: 0} })
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `pedData` | [`IPed`](../interfaces/shared_interfaces_iPed_IPed.md) |  |

#### Returns

`string`

#### Defined in

[server/controllers/staticPed.ts:138](https://github.com/Stuyk/altv-athena/blob/ce61c7c/src/core/server/controllers/staticPed.ts#L138)

___

### append

::: tip Usage
Athena.controllers.staticPed.**append**(`pedData`): `string`
:::

Create a global static ped for the server.

A static pedestrian does not move, and simply stands there.

 * Returns a uid or generates one if not specified.

#### Example
```ts
const uid = Athena.controllers.staticPed.append({ model: 'g_f_importexport_01', pos: { x: 0, y: 0, z: 0} })

Athena.controllers.staticPed.append({ uid: 'the-id-you-specified', model: 'g_f_importexport_01', pos: { x: 0, y: 0, z: 0} })
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `pedData` | [`IPed`](../interfaces/shared_interfaces_iPed_IPed.md) |

#### Returns

`string`

uid A unique string for the ped

#### Defined in

[server/controllers/staticPed.ts:53](https://github.com/Stuyk/altv-athena/blob/ce61c7c/src/core/server/controllers/staticPed.ts#L53)

___

### override

::: tip Usage
Athena.controllers.staticPed.**override**(`functionName`, `callback`): `any`
:::

Used to override any static ped streamer functionality.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"append"`` |
| `callback` | (`pedData`: [`IPed`](../interfaces/shared_interfaces_iPed_IPed.md)) => `string` |

#### Returns

`any`

#### Defined in

[server/controllers/staticPed.ts:180](https://github.com/Stuyk/altv-athena/blob/ce61c7c/src/core/server/controllers/staticPed.ts#L180)

::: tip Usage
Athena.controllers.staticPed.**override**(`functionName`, `callback`): `any`
:::

Used to override any static ped streamer functionality.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"remove"`` |
| `callback` | (`uid`: `string`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/controllers/staticPed.ts:181](https://github.com/Stuyk/altv-athena/blob/ce61c7c/src/core/server/controllers/staticPed.ts#L181)

::: tip Usage
Athena.controllers.staticPed.**override**(`functionName`, `callback`): `any`
:::

Used to override any static ped streamer functionality.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addToPlayer"`` |
| `callback` | (`player`: `Player`, `pedData`: [`IPed`](../interfaces/shared_interfaces_iPed_IPed.md)) => `string` |

#### Returns

`any`

#### Defined in

[server/controllers/staticPed.ts:182](https://github.com/Stuyk/altv-athena/blob/ce61c7c/src/core/server/controllers/staticPed.ts#L182)

::: tip Usage
Athena.controllers.staticPed.**override**(`functionName`, `callback`): `any`
:::

Used to override any static ped streamer functionality.

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"removeFromPlayer"`` |
| `callback` | (`player`: `Player`, `uid`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/controllers/staticPed.ts:183](https://github.com/Stuyk/altv-athena/blob/ce61c7c/src/core/server/controllers/staticPed.ts#L183)

___

### playAnimation

::: tip Usage
Athena.controllers.staticPed.**playAnimation**(`uid`, `animation`): `void`
:::

Make a pedestrian play a specific animation.

#### Example
```ts
Athena.controllers.staticPed.playAnimation('the-id-you-specified', playAnimation('test', [
     {
         dict: 'mp_ped_interaction',
         name: 'hugs_guy_a',
         duration: 2000,
         flags: 0,
     },
]);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uid` | `string` | A unique string |
| `animation` | [`Animation`](../interfaces/shared_interfaces_animation_Animation.md)[] |  |

#### Returns

`void`

#### Defined in

[server/controllers/staticPed.ts:170](https://github.com/Stuyk/altv-athena/blob/ce61c7c/src/core/server/controllers/staticPed.ts#L170)

___

### remove

::: tip Usage
Athena.controllers.staticPed.**remove**(`uid`): `boolean`
:::

Remove a global pedestrian

#### Example
```ts
Athena.controllers.staticPed.remove(someUid)

Athena.controllers.staticPed.remove('the-id-you-specified');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uid` | `string` | A unique string |

#### Returns

`boolean`

#### Defined in

[server/controllers/staticPed.ts:80](https://github.com/Stuyk/altv-athena/blob/ce61c7c/src/core/server/controllers/staticPed.ts#L80)

___

### removeFromPlayer

::: tip Usage
Athena.controllers.staticPed.**removeFromPlayer**(`player`, `uid`): `any`
:::

Remove a pedestrian from a player.

#### Example
```ts
Athena.controllers.staticPed.removeFromPlayer(somePlayer, someUid)

Athena.controllers.staticPed.removeFromPlayer(somePlayer, 'the-id-you-specified');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `uid` | `string` | A unique string |

#### Returns

`any`

#### Defined in

[server/controllers/staticPed.ts:110](https://github.com/Stuyk/altv-athena/blob/ce61c7c/src/core/server/controllers/staticPed.ts#L110)
