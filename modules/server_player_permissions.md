---
title: Athena.player.permissions
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### addAcountPermissions

::: tip Usage
Athena.player.permissions.**addAcountPermissions**(`player`, `permission`): `Promise`<`any`\>
:::

Add a permission to the given player's account.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `permission` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[server/player/permissions.ts:27](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/player/permissions.ts#L27)

___

### addGroupPerm

::: tip Usage
Athena.player.permissions.**addGroupPerm**(`player`, `groupName`, `permission`): `Promise`<`boolean`\>
:::

Add a group permission to a character.

If a player group permission, and a vehicle group permission intercept, then vehicle control is granted.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `groupName` | `string` |
| `permission` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/player/permissions.ts:133](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/player/permissions.ts#L133)

___

### addPermission

::: tip Usage
Athena.player.permissions.**addPermission**(`player`, `permission`): `Promise`<`any`\>
:::

Adds a permission to the given player character.

**`Async`**

**`Name`**

addPermission

**`Exports`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `permission` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[server/player/permissions.ts:15](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/player/permissions.ts#L15)

___

### hasAccountPermission

::: tip Usage
Athena.player.permissions.**hasAccountPermission**(`player`, `permission`): `any`
:::

Check if the player has an account permission.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `permission` | `string` |

#### Returns

`any`

#### Defined in

[server/player/permissions.ts:77](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/player/permissions.ts#L77)

___

### hasCommonGroupPermission

::: tip Usage
Athena.player.permissions.**hasCommonGroupPermission**(`player`, `document`, `groupName`, `permission`): `any`
:::

Check if a player has any matching permissions against another document.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `document` | `PermissionGroup` |
| `groupName` | `string` |
| `permission` | `string` |

#### Returns

`any`

#### Defined in

[server/player/permissions.ts:108](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/player/permissions.ts#L108)

___

### hasGroupPermission

::: tip Usage
Athena.player.permissions.**hasGroupPermission**(`player`, `groupName`, `permission`): `any`
:::

Check if a player character has a group permission.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `groupName` | `string` |
| `permission` | `string` |

#### Returns

`any`

#### Defined in

[server/player/permissions.ts:90](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/player/permissions.ts#L90)

___

### hasPermission

::: tip Usage
Athena.player.permissions.**hasPermission**(`player`, `permission`): `any`
:::

Check if the current player character has a permission.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `permission` | `string` |

#### Returns

`any`

#### Defined in

[server/player/permissions.ts:65](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/player/permissions.ts#L65)

___

### removeAccountPermission

::: tip Usage
Athena.player.permissions.**removeAccountPermission**(`player`, `permission`): `Promise`<`any`\>
:::

Remove a permission to the given player's account.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `permission` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[server/player/permissions.ts:53](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/player/permissions.ts#L53)

___

### removePermission

::: tip Usage
Athena.player.permissions.**removePermission**(`player`, `permission`): `Promise`<`any`\>
:::

Removes a permission from the given player character.

**`Async`**

**`Name`**

removePermission

**`Exports`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `permission` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[server/player/permissions.ts:41](https://github.com/Stuyk/altv-athena/blob/6d21f39/src/core/server/player/permissions.ts#L41)
