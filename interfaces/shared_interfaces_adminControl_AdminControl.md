---
title: AthenaShared.interfaces.adminControl.AdminControl
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/adminControl](../modules/shared_interfaces_adminControl.md).AdminControl

## Properties

### component

• **component**: `string`

The name of the component to correspond with this.

Usually a vue component, or some other way to identify this control.

**`Memberof`**

BaseAdminControl

#### Defined in

[shared/interfaces/adminControl.ts:31](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/shared/interfaces/adminControl.ts#L31)

___

### keywords

• **keywords**: `string`[]

Keywords need to be single words, and simply suggestions that match what it does.

ie: `['player', 'vehicle', 'delete', 'id']`

**`Memberof`**

BaseAdminControl

#### Defined in

[shared/interfaces/adminControl.ts:49](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/shared/interfaces/adminControl.ts#L49)

___

### name

• **name**: `string`

Exactly what this control should do as a name.

Keep it short and simple.

Example: `Delete Current Vehicle`, `Delete Vehicle by ID`, `Teleport to Player`

**`Memberof`**

BaseAdminControl

#### Defined in

[shared/interfaces/adminControl.ts:21](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/shared/interfaces/adminControl.ts#L21)

___

### permissions

• **permissions**: `string`[]

Account permissions that have access to these controls.

**`Memberof`**

BaseAdminControl

#### Defined in

[shared/interfaces/adminControl.ts:57](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/shared/interfaces/adminControl.ts#L57)

___

### uid

• **uid**: `string`

A unique identifier to identify this control.

**`Memberof`**

BaseAdminControl

#### Defined in

[shared/interfaces/adminControl.ts:39](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/shared/interfaces/adminControl.ts#L39)
