---
title: Athena.player.safe
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### addArmour

::: Tip
Athena.player.safe.**addArmour**(`player`, `value`, `exactValue?`, `doNotInvokeEventCall?`): `void`
:::

Safely add armour to this player.

**`Memberof`**

SafePrototype

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | - |
| `value` | `number` | `undefined` | 1-100 |
| `exactValue` | `boolean` | `false` |  |
| `doNotInvokeEventCall` | `boolean` | `false` | - |

#### Returns

`void`

#### Defined in

[server/player/safe.ts:108](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/safe.ts#L108)

___

### addHealth

::: Tip
Athena.player.safe.**addHealth**(`player`, `value`, `exactValue?`, `doNotInvokeEventCall?`): `any`
:::

Safely add health to this player.

**`Memberof`**

SafePrototype

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | An alt:V Player Entity |
| `value` | `number` | `undefined` | 99-199 |
| `exactValue` | `boolean` | `false` |  |
| `doNotInvokeEventCall` | `boolean` | `false` | - |

#### Returns

`any`

#### Defined in

[server/player/safe.ts:41](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/safe.ts#L41)

___

### override

::: Tip
Athena.player.safe.**override**(`functionName`, `callback`): `any`
:::

Used to override any internal safe setter functions

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setPosition"`` |
| `callback` | (`player`: `Player`, `x`: `number`, `y`: `number`, `z`: `number`, `doNotInvokeEventCall`: `boolean`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/safe.ts:196](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/safe.ts#L196)

::: Tip
Athena.player.safe.**override**(`functionName`, `callback`): `any`
:::

Used to override any internal safe setter functions

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addHealth"`` |
| `callback` | (`player`: `Player`, `value`: `number`, `exactValue`: `boolean`, `doNotInvokeEventCall`: `boolean`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/safe.ts:197](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/safe.ts#L197)

::: Tip
Athena.player.safe.**override**(`functionName`, `callback`): `any`
:::

Used to override any internal safe setter functions

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"subHealth"`` |
| `callback` | (`player`: `Player`, `value`: `number`, `exactValue`: `boolean`, `doNotInvokeEventCall`: `boolean`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/safe.ts:198](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/safe.ts#L198)

::: Tip
Athena.player.safe.**override**(`functionName`, `callback`): `any`
:::

Used to override any internal safe setter functions

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addArmour"`` |
| `callback` | (`player`: `Player`, `value`: `number`, `exactValue`: `boolean`, `doNotInvokeEventCall`: `boolean`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/safe.ts:199](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/safe.ts#L199)

::: Tip
Athena.player.safe.**override**(`functionName`, `callback`): `any`
:::

Used to override any internal safe setter functions

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"subArmour"`` |
| `callback` | (`player`: `Player`, `value`: `number`, `exactValue`: `boolean`, `doNotInvokeEventCall`: `boolean`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/safe.ts:200](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/safe.ts#L200)

::: Tip
Athena.player.safe.**override**(`functionName`, `callback`): `any`
:::

Used to override any internal safe setter functions

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setDimension"`` |
| `callback` | (`player`: `Player`, `value`: `number`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/safe.ts:201](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/safe.ts#L201)

___

### setDimension

::: Tip
Athena.player.safe.**setDimension**(`player`, `value`): `any`
:::

Set the player's dimension safely.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `value` | `number` |  |

#### Returns

`any`

#### Defined in

[server/player/safe.ts:176](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/safe.ts#L176)

___

### setPosition

::: Tip
Athena.player.safe.**setPosition**(`player`, `x`, `y`, `z`, `doNotInvokeEventCall?`): `void`
:::

Safely set a player's position.

**`Memberof`**

SafePrototype

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `player` | `Player` | `undefined` |
| `x` | `number` | `undefined` |
| `y` | `number` | `undefined` |
| `z` | `number` | `undefined` |
| `doNotInvokeEventCall` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

[server/player/safe.ts:12](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/safe.ts#L12)

___

### subArmour

::: Tip
Athena.player.safe.**subArmour**(`player`, `value`, `exactValue?`, `doNotInvokeEventCall?`): `void`
:::

Safely subtracts armour to this player.

**`Memberof`**

SafePrototype

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | - |
| `value` | `number` | `undefined` | 1-100 |
| `exactValue` | `boolean` | `false` |  |
| `doNotInvokeEventCall` | `boolean` | `false` | - |

#### Returns

`void`

#### Defined in

[server/player/safe.ts:141](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/safe.ts#L141)

___

### subHealth

::: Tip
Athena.player.safe.**subHealth**(`player`, `value`, `exactValue?`, `doNotInvokeEventCall?`): `any`
:::

Safely subtract health to this player.

**`Memberof`**

SafePrototype

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | An alt:V Player Entity |
| `value` | `number` | `undefined` | 99-199 |
| `exactValue` | `boolean` | `false` |  |
| `doNotInvokeEventCall` | `boolean` | `false` | - |

#### Returns

`any`

#### Defined in

[server/player/safe.ts:75](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/safe.ts#L75)
