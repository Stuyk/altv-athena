---
title: Athena.systems.rpc.ServerRpcEvent
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/systems/rpc](../modules/server_systems_rpc.md).ServerRpcEvent

## Properties

### args

• `Optional` **args**: `any`[]

Arguments to pass down to the client.

**`Memberof`**

ServerRpcEvent

#### Defined in

[server/systems/rpc.ts:21](https://github.com/Stuyk/altv-athena/blob/4bfd806/src/core/server/systems/rpc.ts#L21)

___

### eventName

• **eventName**: `string`

A general purpose name for the event.

**`Memberof`**

ServerRpcEvent

#### Defined in

[server/systems/rpc.ts:13](https://github.com/Stuyk/altv-athena/blob/4bfd806/src/core/server/systems/rpc.ts#L13)

___

### kickOnNoResponse

• `Optional` **kickOnNoResponse**: `string`

Kick, and log the user for not responding to an event.

The value should be a message to send to the user.

**`Memberof`**

ServerRpcEvent

#### Defined in

[server/systems/rpc.ts:31](https://github.com/Stuyk/altv-athena/blob/4bfd806/src/core/server/systems/rpc.ts#L31)

___

### msTimeout

• **msTimeout**: `number`

Timeout before the event is unregistered and removed.

**`Memberof`**

ServerRpcEvent

#### Defined in

[server/systems/rpc.ts:39](https://github.com/Stuyk/altv-athena/blob/4bfd806/src/core/server/systems/rpc.ts#L39)
