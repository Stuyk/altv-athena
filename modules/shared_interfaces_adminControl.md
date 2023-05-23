---
title: AthenaShared.interfaces.adminControl
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [AdminControl](../interfaces/shared_interfaces_adminControl_AdminControl.md)

## Variables

### AdminControlEvents

• `Const` **AdminControlEvents**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `toClient` | { `controls`: `string` = 'admin:control:invoke:update' } |
| `toClient.controls` | `string` |
| `toServer` | { `invoke`: `string` = 'admin:control:invoke:event' } |
| `toServer.invoke` | `string` |

#### Defined in

[shared/interfaces/adminControl.ts:1](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/shared/interfaces/adminControl.ts#L1)
