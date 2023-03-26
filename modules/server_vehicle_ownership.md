---
title: Athena.vehicle.ownership
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### addCharacter

::: Tip
Athena.vehicle.ownership.**addCharacter**(`vehicle`, `player`): `Promise`<`boolean`\>
:::

Add a character to the owned vehicle

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/vehicle/ownership.ts:168](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L168)

::: Tip
Athena.vehicle.ownership.**addCharacter**(`vehicle`, `id`): `Promise`<`boolean`\>
:::

Add a character to the owned vehicle

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `id` | `string` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/vehicle/ownership.ts:177](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L177)

___

### get

::: Tip
Athena.vehicle.ownership.**get**(`vehicle`): `string` \| `undefined`
:::

Return the owner of a vehicle's database identifier

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`string` \| `undefined`

#### Defined in

[server/vehicle/ownership.ts:127](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L127)

___

### getAsPlayer

::: Tip
Athena.vehicle.ownership.**getAsPlayer**(`vehicle`): `alt.Player` \| `undefined`
:::

Return the owner of a vehicle based on player

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`alt.Player` \| `undefined`

#### Defined in

[server/vehicle/ownership.ts:147](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L147)

___

### hasKeys

::: Tip
Athena.vehicle.ownership.**hasKeys**(`player`, `vehicle`): `boolean`
:::

Checks if a player's character has a matching permission for a vehicle.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`boolean`

#### Defined in

[server/vehicle/ownership.ts:98](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L98)

___

### hasPermission

::: Tip
Athena.vehicle.ownership.**hasPermission**(`player`, `vehicle`): `boolean`
:::

Checks if a player's character has a matching permission for a vehicle.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`boolean`

#### Defined in

[server/vehicle/ownership.ts:73](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L73)

___

### isOwner

::: Tip
Athena.vehicle.ownership.**isOwner**(`player`, `vehicle`, `options?`): `boolean`
:::

A catch all handler for vehicle ownership.

This checks if a player is the true owner of a vehicle.

Options can be specified to check if a passenger has keys and so on and so forth.

**`Export`**

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

[server/vehicle/ownership.ts:18](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L18)

___

### override

::: Tip
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"isOwner"`` |
| `callback` | (`player`: `Player`, `vehicle`: `Vehicle`, `options`: { `includeAdminOverride?`: `boolean` ; `includeKeys?`: `boolean` ; `includePermissions?`: `boolean` ; `preventWhileAttached?`: `boolean`  }) => `boolean` |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:311](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L311)

::: Tip
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"hasPermission"`` |
| `callback` | (`player`: `Player`, `vehicle`: `Vehicle`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:312](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L312)

::: Tip
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"hasKeys"`` |
| `callback` | (`player`: `Player`, `vehicle`: `Vehicle`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:313](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L313)

::: Tip
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"get"`` |
| `callback` | (`vehicle`: `Vehicle`) => `string` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:314](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L314)

::: Tip
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getAsPlayer"`` |
| `callback` | (`vehicle`: `Vehicle`) => `alt.Player` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:315](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L315)

::: Tip
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addCharacter"`` |
| `callback` | (`vehicle`: `Vehicle`, `player`: `Player`) => `Promise`<`boolean`\>(`vehicle`: `Vehicle`, `id`: `string`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:316](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L316)

::: Tip
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"removeCharacter"`` |
| `callback` | (`vehicle`: `Vehicle`, `_id`: `string`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:317](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L317)

::: Tip
Athena.vehicle.ownership.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle ownership functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"transfer"`` |
| `callback` | (`vehicle`: `Vehicle`, `_id`: `string`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:318](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L318)

___

### removeCharacter

::: Tip
Athena.vehicle.ownership.**removeCharacter**(`vehicle`, `_id`): `Promise`<`boolean`\>
:::

Remove a character from the owned vehicle keys.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `_id` | `string` | - |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/vehicle/ownership.ts:238](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L238)

___

### transfer

::: Tip
Athena.vehicle.ownership.**transfer**(`vehicle`, `_id`): `Promise`<`boolean`\>
:::

Transfer ownership of a vehicle.

Assign a vehicle to a specific character id.

Automatically wipes keys on transfer.

Returns true if successfully transferred.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `_id` | `string` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/vehicle/ownership.ts:279](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/ownership.ts#L279)
