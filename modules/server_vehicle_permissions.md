---
title: Athena.vehicle.permissions
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### addGroupPerm

::: tip Usage
Athena.vehicle.permissions.**addGroupPerm**(`vehicle`, `groupName`, `permission`): `Promise`<`boolean`\>
:::

Add a group permission to an owned vehicle.

If a player group permission, and a vehicle group permission intercept, then vehicle control is granted.

If a vehicle has any group permissions, all access is denied to non-matching group perms.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `vehicle` | `Vehicle` |
| `groupName` | `string` |
| `permission` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/vehicle/permissions.ts:59](https://github.com/Stuyk/altv-athena/blob/16e0acc/src/core/server/vehicle/permissions.ts#L59)

___

### hasCommonGroupPermission

::: tip Usage
Athena.vehicle.permissions.**hasCommonGroupPermission**(`vehicle`, `document`, `groupName`, `permission`): `any`
:::

Check if a vehicle has any matching permissions against another document.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `vehicle` | `Vehicle` |
| `document` | `PermissionGroup` |
| `groupName` | `string` |
| `permission` | `string` |

#### Returns

`any`

#### Defined in

[server/vehicle/permissions.ts:32](https://github.com/Stuyk/altv-athena/blob/16e0acc/src/core/server/vehicle/permissions.ts#L32)

___

### hasGroupPermission

::: tip Usage
Athena.vehicle.permissions.**hasGroupPermission**(`vehicle`, `groupName`, `permission`): `any`
:::

Check if a vehicle has a group permission.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `vehicle` | `Vehicle` |
| `groupName` | `string` |
| `permission` | `string` |

#### Returns

`any`

#### Defined in

[server/vehicle/permissions.ts:14](https://github.com/Stuyk/altv-athena/blob/16e0acc/src/core/server/vehicle/permissions.ts#L14)
