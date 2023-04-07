---
title: Athena.controllers.textlabel
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Modules

- [Internal](server_controllers_textlabel_Internal.md)

## Functions

### addToPlayer

::: tip Usage
Athena.controllers.textlabel.**addToPlayer**(`player`, `textLabel`): `string`
:::

Add a local text label to player.

#### Example
```ts
const uid = Athena.controllers.textLabel.addToPlayer(somePlayer, { text: 'Hello World!', pos: { x: 0, y: 0, z: 0 }});

Athena.controllers.textLabel.addToPlayer(somePlayer, { uid: 'uid-you-specify', text: 'Hello World!', pos: { x: 0, y: 0, z: 0 }});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `textLabel` | [`TextLabel`](../interfaces/shared_interfaces_textLabel_TextLabel.md) |  |

#### Returns

`string`

uid A unique string for removal

#### Defined in

[server/controllers/textlabel.ts:190](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/server/controllers/textlabel.ts#L190)

___

### append

::: tip Usage
Athena.controllers.textlabel.**append**(`label`): `string`
:::

Adds a text label to the global streamer.

Returns a uid or generates one if not specified.

#### Example
```ts
const uid = Athena.controllers.textLabel.append({ text: 'Hello World!', pos: { x: 0, y: 0, z: 0 }});

Athena.controllers.textLabel.append({ uid: 'uid-you-specify', text: 'Hello World!', pos: { x: 0, y: 0, z: 0 }});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `label` | [`TextLabel`](../interfaces/shared_interfaces_textLabel_TextLabel.md) |

#### Returns

`string`

uid A unique string for removal

#### Defined in

[server/controllers/textlabel.ts:58](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/server/controllers/textlabel.ts#L58)

___

### override

::: tip Usage
Athena.controllers.textlabel.**override**(`functionName`, `callback`): `any`
:::

Used to override any text label streamer functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"append"`` |
| `callback` | (`label`: [`TextLabel`](../interfaces/shared_interfaces_textLabel_TextLabel.md)) => `string` |

#### Returns

`any`

#### Defined in

[server/controllers/textlabel.ts:216](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/server/controllers/textlabel.ts#L216)

::: tip Usage
Athena.controllers.textlabel.**override**(`functionName`, `callback`): `any`
:::

Used to override any text label streamer functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"remove"`` |
| `callback` | (`uid`: `string`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/controllers/textlabel.ts:217](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/server/controllers/textlabel.ts#L217)

::: tip Usage
Athena.controllers.textlabel.**override**(`functionName`, `callback`): `any`
:::

Used to override any text label streamer functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addToPlayer"`` |
| `callback` | (`player`: `Player`, `textLabel`: [`TextLabel`](../interfaces/shared_interfaces_textLabel_TextLabel.md)) => `string` |

#### Returns

`any`

#### Defined in

[server/controllers/textlabel.ts:218](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/server/controllers/textlabel.ts#L218)

::: tip Usage
Athena.controllers.textlabel.**override**(`functionName`, `callback`): `any`
:::

Used to override any text label streamer functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"removeFromPlayer"`` |
| `callback` | (`player`: `Player`, `uid`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/controllers/textlabel.ts:219](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/server/controllers/textlabel.ts#L219)

::: tip Usage
Athena.controllers.textlabel.**override**(`functionName`, `callback`): `any`
:::

Used to override any text label streamer functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"update"`` |
| `callback` | (`uid`: `string`, `label`: [`Partial`](server_controllers_textlabel_Internal.md#Partial)<[`TextLabel`](../interfaces/shared_interfaces_textLabel_TextLabel.md)\>, `player?`: `Player`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/controllers/textlabel.ts:220](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/server/controllers/textlabel.ts#L220)

___

### remove

::: tip Usage
Athena.controllers.textlabel.**remove**(`uid`): `boolean`
:::

Removes a text label based on uid from the global streamer

#### Example
```ts
Athena.controllers.textLabel.remove(someUid);

Athena.controllers.textLabel.remove('uid-you-specify');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uid` | `string` | A unique string |

#### Returns

`boolean`

#### Defined in

[server/controllers/textlabel.ts:136](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/server/controllers/textlabel.ts#L136)

___

### removeFromPlayer

::: tip Usage
Athena.controllers.textlabel.**removeFromPlayer**(`player`, `uid`): `any`
:::

Remove a local text label from a player.

#### Example
```ts
Athena.controllers.textLabel.removeFromPlayer(somePlayer, someUid);

Athena.controllers.textLabel.removeFromPlayer(somePlayer, 'uid-you-specify');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `uid` | `string` | A unique string |

#### Returns

`any`

#### Defined in

[server/controllers/textlabel.ts:164](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/server/controllers/textlabel.ts#L164)

___

### update

::: tip Usage
Athena.controllers.textlabel.**update**(`uid`, `label`, `player?`): `boolean`
:::

Update a text label globally, or for a player.

Not defining the player tries to update the label globally.

Try not to perfrom this updates in an everyTick, and only update text labels.

Specify player as the last parameter to update their instance; otherwise updates all players if uid matches.

#### Example
```ts
Athena.controllers.textLabel.update(someUid, { text: 'Hello World!' });

Athena.controllers.textLabel.update('uid-you-specify', { text: 'Hello World!' });

Athena.controllers.textLabel.update('uid-you-specify', { text: 'Hello World!' }, somePlayer);
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `uid` | `string` | `undefined` | A unique string |
| `label` | [`Partial`](server_controllers_textlabel_Internal.md#Partial)<[`TextLabel`](../interfaces/shared_interfaces_textLabel_TextLabel.md)\> | `undefined` | - |
| `player?` | `Player` | `undefined` |  |

#### Returns

`boolean`

#### Defined in

[server/controllers/textlabel.ts:101](https://github.com/Stuyk/altv-athena/blob/106130f/src/core/server/controllers/textlabel.ts#L101)
