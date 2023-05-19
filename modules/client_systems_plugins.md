---
title: AthenaClient.systems.plugins
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Modules

- [Internal](client_systems_plugins_Internal.md)

## Functions

### addAPI

::: tip Usage
AthenaClient.systems.plugins.**addAPI**(`pluginName`, `functions`): `void`
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

[client/systems/plugins.ts:21](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/client/systems/plugins.ts#L21)

___

### useAPI

::: tip Usage
AthenaClient.systems.plugins.**useAPI**<`K`\>(`apiName`): `Promise`<[`ClientPluginAPI`](../interfaces/client_systems_plugins_Internal_ClientPluginAPI.md)[`K`]\>
:::

Used to obtain a runtime API and its valid functionality.

This makes it so you can 'import' without knowing the plugin pathways.

As long as you know the 'plugin name' you can import anything.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `ExtractStringKeys`<[`ClientPluginAPI`](../interfaces/client_systems_plugins_Internal_ClientPluginAPI.md)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `apiName` | `K` |

#### Returns

`Promise`<[`ClientPluginAPI`](../interfaces/client_systems_plugins_Internal_ClientPluginAPI.md)[`K`]\>

#### Defined in

[client/systems/plugins.ts:42](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/client/systems/plugins.ts#L42)
