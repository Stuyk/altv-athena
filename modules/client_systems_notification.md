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

[client/systems/notification.ts:5](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/client/systems/notification.ts#L5)

## Functions

### addCallback

::: tip Usage
AthenaClient.systems.notification.**addCallback**(`callback`): `void`
:::

Call a function back when a notification is received.

Good for overwriting the default notification system and handling it on your own.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`NotificationCallback`](client_systems_notification.md#NotificationCallback) |

#### Returns

`void`

#### Defined in

[client/systems/notification.ts:42](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/client/systems/notification.ts#L42)

___

### disableDefault

::: tip Usage
AthenaClient.systems.notification.**disableDefault**(): `void`
:::

Disable the default notification handler

#### Returns

`void`

#### Defined in

[client/systems/notification.ts:30](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/client/systems/notification.ts#L30)
