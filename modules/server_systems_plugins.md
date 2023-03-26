---
title: Athena.systems.plugins
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### addCallback

::: tip Usage
Athena.systems.plugins.**addCallback**(`callback`): `void`
:::

After plugins are finished loading; call these callbacks.
Useful for using 'Athena API' at the top level of a document.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | `Function` |

#### Returns

`void`

#### Defined in

[server/systems/plugins.ts:77](https://github.com/Stuyk/altv-athena/blob/9c5aa90/src/core/server/systems/plugins.ts#L77)

___

### getPlugins

::: tip Usage
Athena.systems.plugins.**getPlugins**(): `string`[]
:::

Returns a list of all plugin names that are currently being loaded.

**`Static`**

#### Returns

`string`[]

#### Defined in

[server/systems/plugins.ts:65](https://github.com/Stuyk/altv-athena/blob/9c5aa90/src/core/server/systems/plugins.ts#L65)

___

### init

::: tip Usage
Athena.systems.plugins.**init**(): `void`
:::

Loads all plugins.

#### Returns

`void`

#### Defined in

[server/systems/plugins.ts:38](https://github.com/Stuyk/altv-athena/blob/9c5aa90/src/core/server/systems/plugins.ts#L38)

___

### registerPlugin

::: tip Usage
Athena.systems.plugins.**registerPlugin**(`name`, `callback`): `void`
:::

Register a callback for a plugin to begin its initialization period.
This ensures that your plugin is ALWAYS loaded last.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `callback` | `Function` |

#### Returns

`void`

#### Defined in

[server/systems/plugins.ts:54](https://github.com/Stuyk/altv-athena/blob/9c5aa90/src/core/server/systems/plugins.ts#L54)
