---
title: AthenaClient.systems.rpc
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### on

::: tip Usage
AthenaClient.systems.rpc.**on**<`T`\>(`eventName`, `callback`): `void`
:::

Handle an RPC event from server-side, and return a result back to the server.

The RPC event must be invoked from server-side through the `Athena.systems.rpc.invoke` function.

#### Example
```ts
AthenaClient.systems.rpc.on('returnPlayerLocalPosition', () => {
     return alt.Player.local.pos;
})
```

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `callback` | (...`args`: `any`[]) => `T` |

#### Returns

`void`

#### Defined in

[client/systems/rpc.ts:20](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/systems/rpc.ts#L20)
