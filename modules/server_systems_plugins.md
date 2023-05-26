---
title: Athena.systems.plugins
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Modules

- [Internal](server_systems_plugins_Internal.md)

## Functions

### addAPI

::: tip Usage
Athena.systems.plugins.**addAPI**(`pluginName`, `functions`): `void`
:::

Injects a 'plugin' API into the runtime.

The runtime injection can be obtained with `Athena.systems.plugins.use`.

See that function for additional information.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `pluginName` | `string` |
| `functions` | [`Object`](server_systems_plugins_Internal.md#Object) |

#### Returns

`void`

#### Defined in

[server/systems/plugins.ts:122](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/server/systems/plugins.ts#L122)

___

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

[server/systems/plugins.ts:85](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/server/systems/plugins.ts#L85)

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

[server/systems/plugins.ts:73](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/server/systems/plugins.ts#L73)

___

### init

::: tip Usage
Athena.systems.plugins.**init**(): `void`
:::

Loads all plugins.

#### Returns

`void`

#### Defined in

[server/systems/plugins.ts:46](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/server/systems/plugins.ts#L46)

___

### isDoneLoading

::: tip Usage
Athena.systems.plugins.**isDoneLoading**(): `Promise`<`void`\>
:::

Verifies if all plugins are done loading.

#### Returns

`Promise`<`void`\>

#### Defined in

[server/systems/plugins.ts:98](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/server/systems/plugins.ts#L98)

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

[server/systems/plugins.ts:62](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/server/systems/plugins.ts#L62)

___

### useAPI

::: tip Usage
Athena.systems.plugins.**useAPI**<`K`\>(`apiName`): `Promise`<[`ServerPluginAPI`](../interfaces/server_systems_plugins_Internal_ServerPluginAPI.md)[`K`]\>
:::

Used to obtain a runtime API and its valid functionality.

This makes it so you can 'import' without knowing the plugin pathways.

As long as you know the 'plugin name' you can import anything.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `ExtractStringKeys`<[`ServerPluginAPI`](../interfaces/server_systems_plugins_Internal_ServerPluginAPI.md)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `apiName` | `K` |

#### Returns

`Promise`<[`ServerPluginAPI`](../interfaces/server_systems_plugins_Internal_ServerPluginAPI.md)[`K`]\>

#### Defined in

[server/systems/plugins.ts:143](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/server/systems/plugins.ts#L143)
