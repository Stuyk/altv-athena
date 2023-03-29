---
title: Athena.systems.defaults.weaponItems
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### disable

::: tip Usage
Athena.systems.defaults.weaponItems.**disable**(): `void`
:::

Disable all weapon items from being created / used.
Does not remove them if they already exist in the database.

#### Example
```ts
Athena.systems.default.weaponItems.disable();
```

#### Returns

`void`

#### Defined in

[server/systems/defaults/weaponItems.ts:58](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/server/systems/defaults/weaponItems.ts#L58)
