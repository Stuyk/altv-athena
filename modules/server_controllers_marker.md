---
title: Athena.controllers.marker
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### addToPlayer

▸ **addToPlayer**(`player`, `marker`): `string`

Add a marker to a single local player.

**`Example`**

```ts
Athena.controllers.marker.addToPlayer(somePlayer, {
     type: 1,
     color: new alt.RGBA(0, 255, 0, 100),
     pos: { x: 0, y: 0, z: 0}
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `marker` | [`Marker`](../interfaces/shared_interfaces_marker_Marker.md) |  |

#### Returns

`string`

uid A unique string for marker

#### Defined in

[server/controllers/marker.ts:150](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/controllers/marker.ts#L150)

___

### append

▸ **append**(`marker`): `string`

Adds a global marker for all players.

Returns a uid or generates one if not specified.

- [See alt:V Marker List](https://docs.altv.mp/gta/articles/references/markers.html)

**`Example`**

```ts
const uid = Athena.controllers.marker.append({
     type: 1,
     color: new alt.RGBA(0, 255, 0, 100),
     pos: { x: 0, y: 0, z: 0}
});

Athena.controllers.marker.append({
    uid: 'the-uid-you-specified',
     type: 1,
     color: new alt.RGBA(0, 255, 0, 100),
     pos: { x: 0, y: 0, z: 0}
});

```

#### Parameters

| Name | Type |
| :------ | :------ |
| `marker` | [`Marker`](../interfaces/shared_interfaces_marker_Marker.md) |

#### Returns

`string`

uid A unique string for marker

#### Defined in

[server/controllers/marker.ts:67](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/controllers/marker.ts#L67)

___

### override

▸ **override**(`functionName`, `callback`): `any`

Used to override any marker streamer functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"append"`` |
| `callback` | (`marker`: [`Marker`](../interfaces/shared_interfaces_marker_Marker.md)) => `string` |

#### Returns

`any`

#### Defined in

[server/controllers/marker.ts:169](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/controllers/marker.ts#L169)

▸ **override**(`functionName`, `callback`): `any`

Used to override any marker streamer functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"remove"`` |
| `callback` | (`uid`: `string`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/controllers/marker.ts:170](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/controllers/marker.ts#L170)

▸ **override**(`functionName`, `callback`): `any`

Used to override any marker streamer functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addToPlayer"`` |
| `callback` | (`player`: `Player`, `marker`: [`Marker`](../interfaces/shared_interfaces_marker_Marker.md)) => `string` |

#### Returns

`any`

#### Defined in

[server/controllers/marker.ts:171](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/controllers/marker.ts#L171)

▸ **override**(`functionName`, `callback`): `any`

Used to override any marker streamer functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"removeFromPlayer"`` |
| `callback` | (`player`: `Player`, `uid`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/controllers/marker.ts:172](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/controllers/marker.ts#L172)

___

### remove

▸ **remove**(`uid`): `boolean`

Removes a global marker from all players based on the global uid.

**`Example`**

```ts
Athena.controllers.marker.remove(someUid);

Athena.controllers.marker.remove('the-uid-you-specified');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uid` | `string` | A unique string |

#### Returns

`boolean`

#### Defined in

[server/controllers/marker.ts:94](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/controllers/marker.ts#L94)

___

### removeFromPlayer

▸ **removeFromPlayer**(`player`, `uid`): `any`

Remove a marker from a single local player.

Returns a uid or generates one if not specified.

**`Example`**

```ts
Athena.controllers.marker.removeFromPlayer(somePlayer, someUid);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `uid` | `string` | A unique string |

#### Returns

`any`

#### Defined in

[server/controllers/marker.ts:122](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/controllers/marker.ts#L122)
