---
title: AthenaShared.information.weaponList
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [Weapon](../interfaces/shared_information_weaponList_Weapon.md)

## Functions

### getWeaponByName

::: tip Usage
AthenaShared.information.weaponList.**getWeaponByName**(`name`): [`Weapon`](../interfaces/shared_information_weaponList_Weapon.md) \| ``null``
:::

Get a weapon hash by its string name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`Weapon`](../interfaces/shared_information_weaponList_Weapon.md) \| ``null``

#### Defined in

[shared/information/weaponList.ts:1565](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/information/weaponList.ts#L1565)

___

### getWeaponList

::: tip Usage
AthenaShared.information.weaponList.**getWeaponList**(): [`Weapon`](../interfaces/shared_information_weaponList_Weapon.md)[]
:::

Get all the weapons in the game.

#### Returns

[`Weapon`](../interfaces/shared_information_weaponList_Weapon.md)[]

An array of all the weapons in the WeaponList.

#### Defined in

[shared/information/weaponList.ts:1573](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/information/weaponList.ts#L1573)

___

### getWeaponMap

::: tip Usage
AthenaShared.information.weaponList.**getWeaponMap**(): `Object`
:::

#### Returns

`Object`

#### Defined in

[shared/information/weaponList.ts:1577](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/information/weaponList.ts#L1577)
