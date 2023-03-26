---
title: Athena.utility.config
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Variables

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `get` | () => `Promise`<[`IConfig`](../interfaces/server_interface_iConfig_IConfig.md) \| `undefined`\> |
| `getAthenaVersion` | () => `string` |
| `getViteServer` | () => `string` |
| `getVueDebugMode` | () => `boolean` |
| `isDevMode` | () => `boolean` |

#### Defined in

[server/utility/config.ts:85](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/utility/config.ts#L85)

## Functions

### get

▸ **get**(): `Promise`<[`IConfig`](../interfaces/server_interface_iConfig_IConfig.md) \| `undefined`\>

#### Returns

`Promise`<[`IConfig`](../interfaces/server_interface_iConfig_IConfig.md) \| `undefined`\>

#### Defined in

[server/utility/config.ts:13](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/utility/config.ts#L13)

___

### getAthenaVersion

▸ **getAthenaVersion**(): `string`

#### Returns

`string`

#### Defined in

[server/utility/config.ts:71](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/utility/config.ts#L71)

___

### getViteServer

▸ **getViteServer**(): `string`

#### Returns

`string`

#### Defined in

[server/utility/config.ts:63](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/utility/config.ts#L63)

___

### getVueDebugMode

▸ **getVueDebugMode**(): `boolean`

#### Returns

`boolean`

#### Defined in

[server/utility/config.ts:67](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/utility/config.ts#L67)

___

### isDevMode

▸ **isDevMode**(): `boolean`

Check if the current server instance is running in dev mode.

#### Returns

`boolean`

#### Defined in

[server/utility/config.ts:56](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/utility/config.ts#L56)
