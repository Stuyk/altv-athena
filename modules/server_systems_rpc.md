---
title: Athena.systems.rpc
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [ServerRpcEvent](../interfaces/server_systems_rpc_ServerRpcEvent.md)

## Type Aliases

### Callback

Ƭ **Callback**: (`player`: `alt.Player`, ...`args`: `any`[]) => `void`

#### Type declaration

::: tip Usage
Athena.systems.rpc.(`player`, `...args`): `void`
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `alt.Player` |
| `...args` | `any`[] |

##### Returns

`void`

#### Defined in

[server/systems/rpc.ts:4](https://github.com/Stuyk/altv-athena/blob/fc54439/src/core/server/systems/rpc.ts#L4)

## Functions

### invoke

::: tip Usage
Athena.systems.rpc.**invoke**(`player`, `event`, `callback`): `void`
:::

Invoke an RPC event, and get a result.

If the timeout expires; the callback will pass undefined.

#### Example
```ts
Athena.systems.rpc.invoke(somePlayer, 'getLocalPos', (player: alt.Player, pos: alt.IVector3) => {
     alt.log('RPC Position was' + JSON.stringify(pos));
})
```

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `event` | [`ServerRpcEvent`](../interfaces/server_systems_rpc_ServerRpcEvent.md) |
| `callback` | [`Callback`](server_systems_rpc.md#Callback) |

#### Returns

`void`

#### Defined in

[server/systems/rpc.ts:61](https://github.com/Stuyk/altv-athena/blob/fc54439/src/core/server/systems/rpc.ts#L61)
