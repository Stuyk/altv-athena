---
title: AthenaShared.interfaces.eventCall.EventCall
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/eventCall](../modules/shared_interfaces_eventCall.md).EventCall

Used in the job system to invoke various detached events.

**`Interface`**

EventCall

## Properties

### callAtStart

• `Optional` **callAtStart**: `boolean`

Used to call an event right when an objective is started.
Only useful for the job system.

#### Defined in

[shared/interfaces/eventCall.ts:34](https://github.com/Stuyk/altv-athena/blob/2226a0a/src/core/shared/interfaces/eventCall.ts#L34)

___

### eventName

• **eventName**: `string`

The name of the event to call.
ie. 'openTrunk'

#### Defined in

[shared/interfaces/eventCall.ts:15](https://github.com/Stuyk/altv-athena/blob/2226a0a/src/core/shared/interfaces/eventCall.ts#L15)

___

### isServer

• **isServer**: `boolean`

Does this event get emitted to the server?
Only useful for client-side.

Use alt.on to get this event if set to false.
Must be entirely client-side or entirely server-side if false.

#### Defined in

[shared/interfaces/eventCall.ts:26](https://github.com/Stuyk/altv-athena/blob/2226a0a/src/core/shared/interfaces/eventCall.ts#L26)
