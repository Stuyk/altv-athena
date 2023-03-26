---
title: AthenaClient.systems.notification
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### NotificationCallback

Ƭ **NotificationCallback**: (`message`: `string`, ...`args`: `any`[]) => `void` \| `Function`

#### Defined in

[client/systems/notification.ts:5](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/client/systems/notification.ts#L5)

## Functions

### addCallback

▸ **addCallback**(`callback`): `void`

Call a function back when a notification is received.

Good for overwriting the default notification system and handling it on your own.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`NotificationCallback`](client_systems_notification.md#NotificationCallback) |

#### Returns

`void`

#### Defined in

[client/systems/notification.ts:42](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/client/systems/notification.ts#L42)

___

### disableDefault

▸ **disableDefault**(): `void`

Disable the default notification handler

**`Export`**

#### Returns

`void`

#### Defined in

[client/systems/notification.ts:30](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/client/systems/notification.ts#L30)
