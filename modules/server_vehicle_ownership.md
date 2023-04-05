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

[server/vehicle/ownership.ts:230](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L230)

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

[server/vehicle/ownership.ts:239](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L239)

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

[server/vehicle/ownership.ts:189](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L189)

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

[server/vehicle/ownership.ts:209](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L209)

___

### hasGroupPermission

::: tip Usage
Athena.vehicle.ownership.**hasGroupPermission**(`player`, `vehicle`): `boolean`
:::

It's checking if the player has a group permission for the vehicle.

If both the player and the vehicle are in the same group and have at least one matching perm, vehicle access is allowed.

**`Name`**

hasGroupPermission

**`Exports`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `vehicle` | `Vehicle` |

#### Returns

`boolean`

#### Defined in

[server/vehicle/ownership.ts:105](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L105)

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

[server/vehicle/ownership.ts:160](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L160)

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

[server/vehicle/ownership.ts:77](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L77)

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
| `options.includeGroupPermissions?` | `boolean` | - |
| `options.includeKeys?` | `boolean` | - |
| `options.includePermissions?` | `boolean` | - |
| `options.preventWhileAttached?` | `boolean` | - |

#### Returns

`boolean`

#### Defined in

[server/vehicle/ownership.ts:17](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L17)

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
| `callback` | (`player`: `Player`, `vehicle`: `Vehicle`, `options`: { `includeAdminOverride?`: `boolean` ; `includeGroupPermissions?`: `boolean` ; `includeKeys?`: `boolean` ; `includePermissions?`: `boolean` ; `preventWhileAttached?`: `boolean`  }) => `boolean` |

#### Returns

`any`

#### Defined in

[server/vehicle/ownership.ts:374](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L374)

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

[server/vehicle/ownership.ts:375](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L375)

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

[server/vehicle/ownership.ts:376](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L376)

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

[server/vehicle/ownership.ts:377](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L377)

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

[server/vehicle/ownership.ts:378](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L378)

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

[server/vehicle/ownership.ts:379](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L379)

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

[server/vehicle/ownership.ts:380](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L380)

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

[server/vehicle/ownership.ts:381](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L381)

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

[server/vehicle/ownership.ts:300](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L300)

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

[server/vehicle/ownership.ts:341](https://github.com/Stuyk/altv-athena/blob/f69c9e6/src/core/server/vehicle/ownership.ts#L341)
