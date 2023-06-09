---
title: Athena.controllers.doors
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### append

::: tip Usage
Athena.controllers.doors.**append**(`door`): `string`
:::

Append door information to be controlled.

Returns the door uid to remove all door controls if necessary.

All doors in the game are already added to the gamemode by default.

#### Example
```ts
const uid = Athena.controllers.doors.append({
  uid: 'my-cool-door-or-whatever',
  description: 'Pacific Standard Bank Main Right Door',
  isUnlocked: true,
  model: 110411286,
  pos: { x: 232.6054, y: 214.1584, z: 106.4049 },
});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `door` | `Door` |

#### Returns

`string`

#### Defined in

[server/controllers/doors.ts:71](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/server/controllers/doors.ts#L71)

___

### override

::: tip Usage
Athena.controllers.doors.**override**(`functionName`, `callback`): `any`
:::

Used to override any door streamer functionaltiy

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"append"`` |
| `callback` | (`door`: `Door`) => `string` |

#### Returns

`any`

#### Defined in

[server/controllers/doors.ts:157](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/server/controllers/doors.ts#L157)

::: tip Usage
Athena.controllers.doors.**override**(`functionName`, `callback`): `any`
:::

Used to override any door streamer functionaltiy

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"remove"`` |
| `callback` | (`uid`: `string`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/controllers/doors.ts:158](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/server/controllers/doors.ts#L158)

::: tip Usage
Athena.controllers.doors.**override**(`functionName`, `callback`): `any`
:::

Used to override any door streamer functionaltiy

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"update"`` |
| `callback` | (`uid`: `string`, `isUnlocked`: `boolean`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/controllers/doors.ts:159](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/server/controllers/doors.ts#L159)

___

### remove

::: tip Usage
Athena.controllers.doors.**remove**(`uid`): `boolean`
:::

Remove all controls from a door.

#### Example
```ts
// uid is a variable here
Athena.controllers.doors.remove(uid);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uid` | `string` | A unique string |

#### Returns

`boolean`

#### Defined in

[server/controllers/doors.ts:97](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/server/controllers/doors.ts#L97)

___

### update

::: tip Usage
Athena.controllers.doors.**update**(`uid`, `isUnlocked`): `Promise`<`boolean`\>
:::

Update door lock status.

Call this function to change door lock status.

#### Example
```ts
// set to true to unlock
Athena.controllers.doors.update('117', true);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uid` | `string` | A unique string |
| `isUnlocked` | `boolean` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/controllers/doors.ts:127](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/server/controllers/doors.ts#L127)
