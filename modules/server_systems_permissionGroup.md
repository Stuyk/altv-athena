---
title: Athena.systems.permissionGroup
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [PermissionGroup](../interfaces/server_systems_permissionGroup_PermissionGroup.md)

## Functions

### addGroupPerm

::: tip Usage
Athena.systems.permissionGroup.**addGroupPerm**<`T`\>(`document`, `groupName`, `value`): `T` & [`PermissionGroup`](../interfaces/server_systems_permissionGroup_PermissionGroup.md)
:::

Add a group key to a document, and return the document.

Document can be anything.

#### Example
```ts
const data = Athena.document.character.get(somePlayer);
if (!data) {
    return;
}

const modifiedDocument = Athena.systems.permissionGroup.addGroupKey<typeof data>(data, 'police', 'police-chief');
await Athena.document.character.set(somePlayer, 'groups', modifiedDocument.groups);
```

**`Export`**

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `document` | `T` & [`PermissionGroup`](../interfaces/server_systems_permissionGroup_PermissionGroup.md) |
| `groupName` | `string` |
| `value` | `string` \| `string`[] |

#### Returns

`T` & [`PermissionGroup`](../interfaces/server_systems_permissionGroup_PermissionGroup.md)

#### Defined in

[server/systems/permissionGroup.ts:28](https://github.com/Stuyk/altv-athena/blob/ed495cc/src/core/server/systems/permissionGroup.ts#L28)

___

### hasAtLeastOneGroupPerm

::: tip Usage
Athena.systems.permissionGroup.**hasAtLeastOneGroupPerm**(`document`, `groupName`, `permissions`): `boolean`
:::

Check if a specific document has any of the listed permissions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `document` | [`PermissionGroup`](../interfaces/server_systems_permissionGroup_PermissionGroup.md) |
| `groupName` | `string` |
| `permissions` | `string`[] |

#### Returns

`boolean`

#### Defined in

[server/systems/permissionGroup.ts:168](https://github.com/Stuyk/altv-athena/blob/ed495cc/src/core/server/systems/permissionGroup.ts#L168)

___

### hasCommonPermission

::: tip Usage
Athena.systems.permissionGroup.**hasCommonPermission**(`documents`, `groupName`, `permission`): `boolean`
:::

Checks if the given documents have a common permission.

**`Name`**

hasCommonPermission

**`Exports`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `documents` | [`PermissionGroup`](../interfaces/server_systems_permissionGroup_PermissionGroup.md)[] |
| `groupName` | `string` |
| `permission` | `string` |

#### Returns

`boolean`

#### Defined in

[server/systems/permissionGroup.ts:203](https://github.com/Stuyk/altv-athena/blob/ed495cc/src/core/server/systems/permissionGroup.ts#L203)

___

### hasGroup

::: tip Usage
Athena.systems.permissionGroup.**hasGroup**(`document`, `groupName`): `boolean`
:::

Checks if the documet is part of a group.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `document` | [`PermissionGroup`](../interfaces/server_systems_permissionGroup_PermissionGroup.md) |
| `groupName` | `string` |

#### Returns

`boolean`

#### Defined in

[server/systems/permissionGroup.ts:127](https://github.com/Stuyk/altv-athena/blob/ed495cc/src/core/server/systems/permissionGroup.ts#L127)

___

### hasGroupPerm

::: tip Usage
Athena.systems.permissionGroup.**hasGroupPerm**(`document`, `groupName`, `permission`): `boolean`
:::

Check if a document has a specific group permission.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `document` | [`PermissionGroup`](../interfaces/server_systems_permissionGroup_PermissionGroup.md) |
| `groupName` | `string` |
| `permission` | `string` |

#### Returns

`boolean`

#### Defined in

[server/systems/permissionGroup.ts:148](https://github.com/Stuyk/altv-athena/blob/ed495cc/src/core/server/systems/permissionGroup.ts#L148)

___

### removeGroup

::: tip Usage
Athena.systems.permissionGroup.**removeGroup**<`T`\>(`document`, `groupName`): `T` & [`PermissionGroup`](../interfaces/server_systems_permissionGroup_PermissionGroup.md)
:::

Removes a group entirely from a document.

**`Export`**

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `document` | `T` & [`PermissionGroup`](../interfaces/server_systems_permissionGroup_PermissionGroup.md) |
| `groupName` | `string` |

#### Returns

`T` & [`PermissionGroup`](../interfaces/server_systems_permissionGroup_PermissionGroup.md)

#### Defined in

[server/systems/permissionGroup.ts:110](https://github.com/Stuyk/altv-athena/blob/ed495cc/src/core/server/systems/permissionGroup.ts#L110)

___

### removeGroupPerm

::: tip Usage
Athena.systems.permissionGroup.**removeGroupPerm**<`T`\>(`document`, `groupName`, `value`): `T` & [`PermissionGroup`](../interfaces/server_systems_permissionGroup_PermissionGroup.md)
:::

Remove a permission from a group key.

**`Export`**

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `document` | `T` & [`PermissionGroup`](../interfaces/server_systems_permissionGroup_PermissionGroup.md) |
| `groupName` | `string` |
| `value` | `string` \| `string`[] |

#### Returns

`T` & [`PermissionGroup`](../interfaces/server_systems_permissionGroup_PermissionGroup.md)

#### Defined in

[server/systems/permissionGroup.ts:67](https://github.com/Stuyk/altv-athena/blob/ed495cc/src/core/server/systems/permissionGroup.ts#L67)
