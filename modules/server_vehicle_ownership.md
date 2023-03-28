---
title: Athena.vehicle.ownership
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### addCharacter

::: tip Usage
Athena.vehicle.ownership.**addCharacter**(`vehicle`, `player`): `Promise`<`boolean`\>
:::

Add a character to the owned vehicle

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/vehicle/ownership.ts:168](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L168)

::: tip Usage
Athena.vehicle.ownership.**addCharacter**(`vehicle`, `id`): `Promise`<`boolean`\>
:::

Add a character to the owned vehicle

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `id` | `string` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/vehicle/ownership.ts:177](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L177)

___

### get

::: tip Usage
Athena.vehicle.ownership.**get**(`vehicle`): `string` \| `undefined`
:::

Return the owner of a vehicle's database identifier

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`string` \| `undefined`

#### Defined in

[server/vehicle/ownership.ts:127](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L127)

___

### getAsPlayer

::: tip Usage
Athena.vehicle.ownership.**getAsPlayer**(`vehicle`): `alt.Player` \| `undefined`
:::

Return the owner of a vehicle based on player

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`alt.Player` \| `undefined`

#### Defined in

[server/vehicle/ownership.ts:147](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L147)

___

### hasKeys

::: tip Usage
Athena.vehicle.ownership.**hasKeys**(`player`, `vehicle`): `boolean`
:::

Checks if a player's character has a matching permission for a vehicle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`boolean`

#### Defined in

[server/vehicle/ownership.ts:98](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L98)

___

### hasPermission

::: tip Usage
Athena.vehicle.ownership.**hasPermission**(`player`, `vehicle`): `boolean`
:::

Checks if a player's character has a matching permission for a vehicle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`boolean`

#### Defined in

[server/vehicle/ownership.ts:73](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L73)

___

### isOwner

::: tip Usage
Athena.vehicle.ownership.**isOwner**(`player`, `vehicle`, `options?`): `boolean`
:::

A catch all handler for vehicle ownership.

This checks if a player is the true owner of a vehicle.

Options can be specified to check if a passenger has keys and so on and so forth.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `options` | `Object` | - |
| `options.includeAdminOverride?` | `boolean` | - |
| `options.includeKeys?` | `boolean` | - |
| `options.includePermissions?` | `boolean` | - |
| `options.preventWhileAttached?` | `boolean` | - |

#### Returns

`boolean`

#### Defined in

[server/vehicle/ownership.ts:18](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L18)

___

### override

::: tip Usage
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"isOwner"`` |
| `callback` | (`player`: `Player`, `vehicle`: `Vehicle`, `options`: { `includeAdminOverride?`: `boolean` ; `includeKeys?`: `boolean` ; `includePermissions?`: `boolean` ; `preventWhileAttached?`: `boolean`  }) => `boolean` |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:311](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L311)

::: tip Usage
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"hasPermission"`` |
| `callback` | (`player`: `Player`, `vehicle`: `Vehicle`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:312](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L312)

::: tip Usage
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"hasKeys"`` |
| `callback` | (`player`: `Player`, `vehicle`: `Vehicle`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:313](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L313)

::: tip Usage
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"get"`` |
| `callback` | (`vehicle`: `Vehicle`) => `string` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:314](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L314)

::: tip Usage
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getAsPlayer"`` |
| `callback` | (`vehicle`: `Vehicle`) => `alt.Player` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:315](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L315)

::: tip Usage
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addCharacter"`` |
| `callback` | (`vehicle`: `Vehicle`, `player`: `Player`) => `Promise`<`boolean`\>(`vehicle`: `Vehicle`, `id`: `string`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:316](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L316)

::: tip Usage
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"removeCharacter"`` |
| `callback` | (`vehicle`: `Vehicle`, `_id`: `string`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:317](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L317)

::: tip Usage
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"transfer"`` |
| `callback` | (`vehicle`: `Vehicle`, `_id`: `string`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:318](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L318)

___

### removeCharacter

::: tip Usage
Athena.vehicle.ownership.**removeCharacter**(`vehicle`, `_id`): `Promise`<`boolean`\>
:::

Remove a character from the owned vehicle keys.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `_id` | `string` | - |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/vehicle/ownership.ts:238](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L238)

___

### transfer

::: tip Usage
Athena.vehicle.ownership.**transfer**(`vehicle`, `_id`): `Promise`<`boolean`\>
:::

Transfer ownership of a vehicle.

Assign a vehicle to a specific character id.

Automatically wipes keys on transfer.

Returns true if successfully transferred.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `_id` | `string` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/vehicle/ownership.ts:279](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/server/vehicle/ownership.ts#L279)
