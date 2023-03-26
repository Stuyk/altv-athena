---
title: AthenaShared.utility.flags.Internal.PermissionStatus
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/utility/flags](../modules/shared_utility_flags.md).[Internal](../modules/shared_utility_flags_Internal.md).PermissionStatus

## Hierarchy

- [`EventTarget`](../modules/shared_utility_flags_Internal.md#EventTarget)

  ↳ **`PermissionStatus`**

## Properties

### onchange

• **onchange**: (`this`: [`PermissionStatus`](../modules/shared_utility_flags_Internal.md#PermissionStatus), `ev`: [`Event`](../modules/shared_utility_flags_Internal.md#Event)) => `any`

#### Type declaration

::: Tip
AthenaShared.utility.flags.Internal.PermissionStatus.(`this`, `ev`): `any`
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`PermissionStatus`](../modules/shared_utility_flags_Internal.md#PermissionStatus) |
| `ev` | [`Event`](../modules/shared_utility_flags_Internal.md#Event) |

##### Returns

`any`

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:10523

___

### state

• `Readonly` **state**: [`PermissionState`](../modules/shared_utility_flags_Internal.md#PermissionState)

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:10524

## Methods

### addEventListener

::: Tip
AthenaShared.utility.flags.Internal.PermissionStatus.**addEventListener**<`K`\>(`type`, `listener`, `options?`): `void`
:::

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"change"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `K` |
| `listener` | (`this`: [`PermissionStatus`](../modules/shared_utility_flags_Internal.md#PermissionStatus), `ev`: [`PermissionStatusEventMap`](shared_utility_flags_Internal_PermissionStatusEventMap.md)[`K`]) => `any` |
| `options?` | `boolean` \| [`AddEventListenerOptions`](shared_utility_flags_Internal_AddEventListenerOptions.md) |

#### Returns

`void`

#### Overrides

EventTarget.addEventListener

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:10525

::: Tip
AthenaShared.utility.flags.Internal.PermissionStatus.**addEventListener**(`type`, `listener`, `options?`): `void`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `listener` | [`EventListenerOrEventListenerObject`](../modules/shared_utility_flags_Internal.md#EventListenerOrEventListenerObject) |
| `options?` | `boolean` \| [`AddEventListenerOptions`](shared_utility_flags_Internal_AddEventListenerOptions.md) |

#### Returns

`void`

#### Overrides

EventTarget.addEventListener

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:10526

___

### dispatchEvent

::: Tip
AthenaShared.utility.flags.Internal.PermissionStatus.**dispatchEvent**(`event`): `boolean`
:::

Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`Event`](../modules/shared_utility_flags_Internal.md#Event) |

#### Returns

`boolean`

#### Inherited from

EventTarget.dispatchEvent

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:5033

___

### removeEventListener

::: Tip
AthenaShared.utility.flags.Internal.PermissionStatus.**removeEventListener**<`K`\>(`type`, `listener`, `options?`): `void`
:::

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"change"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `K` |
| `listener` | (`this`: [`PermissionStatus`](../modules/shared_utility_flags_Internal.md#PermissionStatus), `ev`: [`PermissionStatusEventMap`](shared_utility_flags_Internal_PermissionStatusEventMap.md)[`K`]) => `any` |
| `options?` | `boolean` \| [`EventListenerOptions`](shared_utility_flags_Internal_EventListenerOptions.md) |

#### Returns

`void`

#### Overrides

EventTarget.removeEventListener

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:10527

::: Tip
AthenaShared.utility.flags.Internal.PermissionStatus.**removeEventListener**(`type`, `listener`, `options?`): `void`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `listener` | [`EventListenerOrEventListenerObject`](../modules/shared_utility_flags_Internal.md#EventListenerOrEventListenerObject) |
| `options?` | `boolean` \| [`EventListenerOptions`](shared_utility_flags_Internal_EventListenerOptions.md) |

#### Returns

`void`

#### Overrides

EventTarget.removeEventListener

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:10528
