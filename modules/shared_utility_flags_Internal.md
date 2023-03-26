---
title: AthenaShared.utility.flags.Internal
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [AddEventListenerOptions](../interfaces/shared_utility_flags_Internal_AddEventListenerOptions.md)
- [Event](../interfaces/shared_utility_flags_Internal_Event.md)
- [EventInit](../interfaces/shared_utility_flags_Internal_EventInit.md)
- [EventListener](../interfaces/shared_utility_flags_Internal_EventListener.md)
- [EventListenerObject](../interfaces/shared_utility_flags_Internal_EventListenerObject.md)
- [EventListenerOptions](../interfaces/shared_utility_flags_Internal_EventListenerOptions.md)
- [EventTarget](../interfaces/shared_utility_flags_Internal_EventTarget.md)
- [PermissionDescriptor](../interfaces/shared_utility_flags_Internal_PermissionDescriptor.md)
- [PermissionStatus](../interfaces/shared_utility_flags_Internal_PermissionStatus.md)
- [PermissionStatusEventMap](../interfaces/shared_utility_flags_Internal_PermissionStatusEventMap.md)
- [Permissions](../interfaces/shared_utility_flags_Internal_Permissions.md)

## Type Aliases

### EventListenerOrEventListenerObject

Ƭ **EventListenerOrEventListenerObject**: [`EventListener`](../interfaces/shared_utility_flags_Internal_EventListener.md) \| [`EventListenerObject`](../interfaces/shared_utility_flags_Internal_EventListenerObject.md)

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:17759

___

### PermissionName

Ƭ **PermissionName**: ``"geolocation"`` \| ``"notifications"`` \| ``"persistent-storage"`` \| ``"push"`` \| ``"screen-wake-lock"`` \| ``"xr-spatial-tracking"``

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:17886

___

### PermissionState

Ƭ **PermissionState**: ``"denied"`` \| ``"granted"`` \| ``"prompt"``

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:17887

## Variables

### Event

• **Event**: `Object`

#### Call signature

• **new Event**(`type`, `eventInitDict?`): [`Event`](shared_utility_flags_Internal.md#Event)

##### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `eventInitDict?` | [`EventInit`](../interfaces/shared_utility_flags_Internal_EventInit.md) |

##### Returns

[`Event`](shared_utility_flags_Internal.md#Event)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `AT_TARGET` | `number` |
| `BUBBLING_PHASE` | `number` |
| `CAPTURING_PHASE` | `number` |
| `NONE` | `number` |
| `prototype` | [`Event`](shared_utility_flags_Internal.md#Event) |

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4918

../../node_modules/typescript/lib/lib.dom.d.ts:4960

___

### EventTarget

• **EventTarget**: `Object`

#### Call signature

• **new EventTarget**(): [`EventTarget`](shared_utility_flags_Internal.md#EventTarget)

##### Returns

[`EventTarget`](shared_utility_flags_Internal.md#EventTarget)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `prototype` | [`EventTarget`](shared_utility_flags_Internal.md#EventTarget) |

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:5015

../../node_modules/typescript/lib/lib.dom.d.ts:5038

___

### PermissionStatus

• **PermissionStatus**: `Object`

#### Call signature

• **new PermissionStatus**(): [`PermissionStatus`](shared_utility_flags_Internal.md#PermissionStatus)

##### Returns

[`PermissionStatus`](shared_utility_flags_Internal.md#PermissionStatus)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `prototype` | [`PermissionStatus`](shared_utility_flags_Internal.md#PermissionStatus) |

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:10522

../../node_modules/typescript/lib/lib.dom.d.ts:10531

___

### Permissions

• **Permissions**: `Object`

#### Call signature

• **new Permissions**(): [`Permissions`](shared_utility_flags_Internal.md#Permissions)

##### Returns

[`Permissions`](shared_utility_flags_Internal.md#Permissions)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `prototype` | [`Permissions`](shared_utility_flags_Internal.md#Permissions) |

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:10536

../../node_modules/typescript/lib/lib.dom.d.ts:10540
