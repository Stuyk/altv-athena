---
title: Athena.systems.permission
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### DefaultPerms

Ƭ **DefaultPerms**: ``"admin"`` \| ``"moderator"``

#### Defined in

[server/systems/permission.ts:7](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/permission.ts#L7)

___

### SupportedDocuments

Ƭ **SupportedDocuments**: ``"account"`` \| ``"character"``

#### Defined in

[server/systems/permission.ts:8](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/permission.ts#L8)

## Variables

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `add` | <CustomPerms\>(`type`: ``"account"`` \| ``"character"``, `player`: `Player`, `perm`: `CustomPerms` \| [`DefaultPerms`](server_systems_permission.md#DefaultPerms)) => `Promise`<`boolean`\> |
| `clear` | (`type`: ``"account"`` \| ``"character"``, `player`: `Player`) => `Promise`<`void`\> |
| `getAll` | <CustomPerms\>(`type`: ``"account"`` \| ``"character"``, `perm`: [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`) => `Promise`<[`player`](server_config.md#player)[] \| [`player`](server_config.md#player)[]\> |
| `has` | <CustomPerms\>(`type`: ``"account"`` \| ``"character"``, `player`: `Player`, `perm`: [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`) => `boolean` |
| `hasAll` | <CustomPerms\>(`type`: ``"account"`` \| ``"character"``, `player`: `Player`, `perms`: ([`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`)[]) => `boolean` |
| `hasOne` | <CustomPerms\>(`type`: ``"account"`` \| ``"character"``, `player`: `Player`, `perms`: ([`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`)[]) => `boolean` |
| `remove` | <CustomPerms\>(`type`: ``"account"`` \| ``"character"``, `player`: `Player`, `perm`: [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`) => `Promise`<`boolean`\> |
| `removeAll` | <CustomPerms\>(`type`: ``"account"`` \| ``"character"``, `perm`: [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`, `ids`: `string`[]) => `Promise`<`void`\> |

#### Defined in

[server/systems/permission.ts:451](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/permission.ts#L451)

## Functions

### add

▸ **add**<`CustomPerms`\>(`type`, `player`, `perm`): `Promise`<`boolean`\>

Add a permission to an account or character.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomPerms` | ``""`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | ``"account"`` \| ``"character"`` |  |
| `player` | `Player` | An alt:V Player Entity |
| `perm` | `CustomPerms` \| [`DefaultPerms`](server_systems_permission.md#DefaultPerms) |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/systems/permission.ts:241](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/permission.ts#L241)

___

### clear

▸ **clear**(`type`, `player`): `Promise`<`void`\>

Clear all permissions for an account or character.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | ``"account"`` \| ``"character"`` |  |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/systems/permission.ts:275](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/permission.ts#L275)

___

### getAll

▸ **getAll**<`CustomPerms`\>(`type`, `perm`): `Promise`<[`player`](server_config.md#player)[] \| [`player`](server_config.md#player)[]\>

Get all documents that have a specified permission in their permissions array.
Will return an empty array if no permissions are found.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomPerms` | ``""`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"account"`` \| ``"character"`` |
| `perm` | [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms` |

#### Returns

`Promise`<[`player`](server_config.md#player)[] \| [`player`](server_config.md#player)[]\>

#### Defined in

[server/systems/permission.ts:342](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/permission.ts#L342)

___

### getPermissions

▸ **getPermissions**(`entity`, `type`): `any`

Get permissions for a given entity and type

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `Player` |
| `type` | ``"account"`` \| ``"character"`` |

#### Returns

`any`

#### Defined in

[server/systems/permission.ts:424](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/permission.ts#L424)

▸ **getPermissions**(`entity`, `type`): `any`

Get permissions for a given entity and type

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `Vehicle` |
| `type` | ``"vehicle"`` |

#### Returns

`any`

#### Defined in

[server/systems/permission.ts:425](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/permission.ts#L425)

___

### has

▸ **has**<`CustomPerms`\>(`type`, `player`, `perm`): `boolean`

Check if a character or account has a single permission.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomPerms` | ``""`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | ``"account"`` \| ``"character"`` |  |
| `player` | `Player` | An alt:V Player Entity |
| `perm` | [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms` |  |

#### Returns

`boolean`

#### Defined in

[server/systems/permission.ts:289](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/permission.ts#L289)

___

### hasAll

▸ **hasAll**<`CustomPerms`\>(`type`, `player`, `perms`): `boolean`

Check if a character or account has all the permissions.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomPerms` | ``""`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | ``"account"`` \| ``"character"`` |  |
| `player` | `Player` | An alt:V Player Entity |
| `perms` | ([`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`)[] |  |

#### Returns

`boolean`

#### Defined in

[server/systems/permission.ts:325](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/permission.ts#L325)

___

### hasOne

▸ **hasOne**<`CustomPerms`\>(`type`, `player`, `perms`): `boolean`

Check if a character or account has a atleast one permission.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomPerms` | ``""`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | ``"account"`` \| ``"character"`` |  |
| `player` | `Player` | An alt:V Player Entity |
| `perms` | ([`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`)[] |  |

#### Returns

`boolean`

#### Defined in

[server/systems/permission.ts:307](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/permission.ts#L307)

___

### remove

▸ **remove**<`CustomPerms`\>(`type`, `player`, `perm`): `Promise`<`boolean`\>

Remove a permission from an account or character.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomPerms` | ``""`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | ``"account"`` \| ``"character"`` |  |
| `player` | `Player` | An alt:V Player Entity |
| `perm` | [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/systems/permission.ts:259](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/permission.ts#L259)

___

### removeAll

▸ **removeAll**<`CustomPerms`\>(`type`, `perm`, `ids`): `Promise`<`void`\>

Remove specified permission from all instances of an account or character.
Automatically rebinds the document after updating.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomPerms` | ``""`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"account"`` \| ``"character"`` |
| `perm` | [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms` |
| `ids` | `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/systems/permission.ts:374](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/server/systems/permission.ts#L374)
