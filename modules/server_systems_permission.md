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

[server/systems/permission.ts:7](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/permission.ts#L7)

___

### SupportedDocuments

Ƭ **SupportedDocuments**: ``"account"`` \| ``"character"``

#### Defined in

[server/systems/permission.ts:8](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/permission.ts#L8)

## Variables

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `add` | <CustomPerms\>(`type`: ``"character"`` \| ``"account"``, `player`: `Player`, `perm`: `CustomPerms` \| [`DefaultPerms`](server_systems_permission.md#DefaultPerms)) => `Promise`<`boolean`\> |
| `clear` | (`type`: ``"character"`` \| ``"account"``, `player`: `Player`) => `Promise`<`void`\> |
| `getAll` | <CustomPerms\>(`type`: ``"character"`` \| ``"account"``, `perm`: [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`) => `Promise`<[`player`](server_config.md#player)[] \| [`player`](server_config.md#player)[]\> |
| `has` | <CustomPerms\>(`type`: ``"character"`` \| ``"account"``, `player`: `Player`, `perm`: [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`) => `boolean` |
| `hasAll` | <CustomPerms\>(`type`: ``"character"`` \| ``"account"``, `player`: `Player`, `perms`: ([`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`)[]) => `boolean` |
| `hasOne` | <CustomPerms\>(`type`: ``"character"`` \| ``"account"``, `player`: `Player`, `perms`: ([`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`)[]) => `boolean` |
| `remove` | <CustomPerms\>(`type`: ``"character"`` \| ``"account"``, `player`: `Player`, `perm`: [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`) => `Promise`<`boolean`\> |
| `removeAll` | <CustomPerms\>(`type`: ``"character"`` \| ``"account"``, `perm`: [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`, `ids`: `string`[]) => `Promise`<`void`\> |

#### Defined in

[server/systems/permission.ts:439](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/permission.ts#L439)

## Functions

### add

::: tip Usage
Athena.systems.permission.**add**<`CustomPerms`\>(`type`, `player`, `perm`): `Promise`<`boolean`\>
:::

Add a permission to an account or character.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomPerms` | ``""`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | ``"character"`` \| ``"account"`` |  |
| `player` | `Player` | An alt:V Player Entity |
| `perm` | `CustomPerms` \| [`DefaultPerms`](server_systems_permission.md#DefaultPerms) |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/systems/permission.ts:229](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/permission.ts#L229)

___

### clear

::: tip Usage
Athena.systems.permission.**clear**(`type`, `player`): `Promise`<`void`\>
:::

Clear all permissions for an account or character.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | ``"character"`` \| ``"account"`` |  |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/systems/permission.ts:263](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/permission.ts#L263)

___

### getAll

::: tip Usage
Athena.systems.permission.**getAll**<`CustomPerms`\>(`type`, `perm`): `Promise`<[`player`](server_config.md#player)[] \| [`player`](server_config.md#player)[]\>
:::

Get all documents that have a specified permission in their permissions array.
Will return an empty array if no permissions are found.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomPerms` | ``""`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"character"`` \| ``"account"`` |
| `perm` | [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms` |

#### Returns

`Promise`<[`player`](server_config.md#player)[] \| [`player`](server_config.md#player)[]\>

#### Defined in

[server/systems/permission.ts:330](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/permission.ts#L330)

___

### getPermissions

::: tip Usage
Athena.systems.permission.**getPermissions**(`entity`, `type`): `any`
:::

Get permissions for a given entity and type

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `Player` |
| `type` | ``"character"`` \| ``"account"`` |

#### Returns

`any`

#### Defined in

[server/systems/permission.ts:412](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/permission.ts#L412)

::: tip Usage
Athena.systems.permission.**getPermissions**(`entity`, `type`): `any`
:::

Get permissions for a given entity and type

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `Vehicle` |
| `type` | ``"vehicle"`` |

#### Returns

`any`

#### Defined in

[server/systems/permission.ts:413](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/permission.ts#L413)

___

### has

::: tip Usage
Athena.systems.permission.**has**<`CustomPerms`\>(`type`, `player`, `perm`): `boolean`
:::

Check if a character or account has a single permission.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomPerms` | ``""`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | ``"character"`` \| ``"account"`` |  |
| `player` | `Player` | An alt:V Player Entity |
| `perm` | [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms` |  |

#### Returns

`boolean`

#### Defined in

[server/systems/permission.ts:277](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/permission.ts#L277)

___

### hasAll

::: tip Usage
Athena.systems.permission.**hasAll**<`CustomPerms`\>(`type`, `player`, `perms`): `boolean`
:::

Check if a character or account has all the permissions.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomPerms` | ``""`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | ``"character"`` \| ``"account"`` |  |
| `player` | `Player` | An alt:V Player Entity |
| `perms` | ([`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`)[] |  |

#### Returns

`boolean`

#### Defined in

[server/systems/permission.ts:313](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/permission.ts#L313)

___

### hasOne

::: tip Usage
Athena.systems.permission.**hasOne**<`CustomPerms`\>(`type`, `player`, `perms`): `boolean`
:::

Check if a character or account has a atleast one permission.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomPerms` | ``""`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | ``"character"`` \| ``"account"`` |  |
| `player` | `Player` | An alt:V Player Entity |
| `perms` | ([`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms`)[] |  |

#### Returns

`boolean`

#### Defined in

[server/systems/permission.ts:295](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/permission.ts#L295)

___

### remove

::: tip Usage
Athena.systems.permission.**remove**<`CustomPerms`\>(`type`, `player`, `perm`): `Promise`<`boolean`\>
:::

Remove a permission from an account or character.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomPerms` | ``""`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | ``"character"`` \| ``"account"`` |  |
| `player` | `Player` | An alt:V Player Entity |
| `perm` | [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/systems/permission.ts:247](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/permission.ts#L247)

___

### removeAll

::: tip Usage
Athena.systems.permission.**removeAll**<`CustomPerms`\>(`type`, `perm`, `ids`): `Promise`<`void`\>
:::

Remove specified permission from all instances of an account or character.
Automatically rebinds the document after updating.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomPerms` | ``""`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"character"`` \| ``"account"`` |
| `perm` | [`DefaultPerms`](server_systems_permission.md#DefaultPerms) \| `CustomPerms` |
| `ids` | `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/systems/permission.ts:362](https://github.com/Stuyk/altv-athena/blob/2b4a7e1/src/core/server/systems/permission.ts#L362)
