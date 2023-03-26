---
title: AthenaShared.utility.flags.Internal.Event
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/utility/flags](../modules/shared_utility_flags.md).[Internal](../modules/shared_utility_flags_Internal.md).Event

An event which takes place in the DOM.

## Properties

### AT\_TARGET

• `Readonly` **AT\_TARGET**: `number`

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4954

___

### BUBBLING\_PHASE

• `Readonly` **BUBBLING\_PHASE**: `number`

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4955

___

### CAPTURING\_PHASE

• `Readonly` **CAPTURING\_PHASE**: `number`

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4956

___

### NONE

• `Readonly` **NONE**: `number`

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4957

___

### bubbles

• `Readonly` **bubbles**: `boolean`

Returns true or false depending on how event was initialized. True if event goes through its target's ancestors in reverse tree order, and false otherwise.

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4920

___

### cancelBubble

• **cancelBubble**: `boolean`

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4921

___

### cancelable

• `Readonly` **cancelable**: `boolean`

Returns true or false depending on how event was initialized. Its return value does not always carry meaning, but true can indicate that part of the operation during which event was dispatched, can be canceled by invoking the preventDefault() method.

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4923

___

### composed

• `Readonly` **composed**: `boolean`

Returns true or false depending on how event was initialized. True if event invokes listeners past a ShadowRoot node that is the root of its target, and false otherwise.

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4925

___

### currentTarget

• `Readonly` **currentTarget**: [`EventTarget`](../modules/shared_utility_flags_Internal.md#EventTarget)

Returns the object whose event listener's callback is currently being invoked.

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4927

___

### defaultPrevented

• `Readonly` **defaultPrevented**: `boolean`

Returns true if preventDefault() was invoked successfully to indicate cancelation, and false otherwise.

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4929

___

### eventPhase

• `Readonly` **eventPhase**: `number`

Returns the event's phase, which is one of NONE, CAPTURING_PHASE, AT_TARGET, and BUBBLING_PHASE.

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4931

___

### isTrusted

• `Readonly` **isTrusted**: `boolean`

Returns true if event was dispatched by the user agent, and false otherwise.

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4933

___

### returnValue

• **returnValue**: `boolean`

**`Deprecated`**

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4935

___

### srcElement

• `Readonly` **srcElement**: [`EventTarget`](../modules/shared_utility_flags_Internal.md#EventTarget)

**`Deprecated`**

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4937

___

### target

• `Readonly` **target**: [`EventTarget`](../modules/shared_utility_flags_Internal.md#EventTarget)

Returns the object to which event is dispatched (its target).

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4939

___

### timeStamp

• `Readonly` **timeStamp**: `number`

Returns the event's timestamp as the number of milliseconds measured relative to the time origin.

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4941

___

### type

• `Readonly` **type**: `string`

Returns the type of event, e.g. "click", "hashchange", or "submit".

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4943

## Methods

### composedPath

▸ **composedPath**(): [`EventTarget`](../modules/shared_utility_flags_Internal.md#EventTarget)[]

Returns the invocation target objects of event's path (objects on which listeners will be invoked), except for any nodes in shadow trees of which the shadow root's mode is "closed" that are not reachable from event's currentTarget.

#### Returns

[`EventTarget`](../modules/shared_utility_flags_Internal.md#EventTarget)[]

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4945

___

### initEvent

▸ **initEvent**(`type`, `bubbles?`, `cancelable?`): `void`

**`Deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `bubbles?` | `boolean` |
| `cancelable?` | `boolean` |

#### Returns

`void`

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4947

___

### preventDefault

▸ **preventDefault**(): `void`

If invoked when the cancelable attribute value is true, and while executing a listener for the event with passive set to false, signals to the operation that caused event to be dispatched that it needs to be canceled.

#### Returns

`void`

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4949

___

### stopImmediatePropagation

▸ **stopImmediatePropagation**(): `void`

Invoking this method prevents event from reaching any registered event listeners after the current one finishes running and, when dispatched in a tree, also prevents event from reaching any other objects.

#### Returns

`void`

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4951

___

### stopPropagation

▸ **stopPropagation**(): `void`

When dispatched in a tree, invoking this method prevents event from reaching any objects other than the current object.

#### Returns

`void`

#### Defined in

../../node_modules/typescript/lib/lib.dom.d.ts:4953
