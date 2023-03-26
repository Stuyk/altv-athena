---
title: AthenaShared.interfaces.messageCommand
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [DetailedCommand](../interfaces/shared_interfaces_messageCommand_DetailedCommand.md)
- [MessageCommand](../interfaces/shared_interfaces_messageCommand_MessageCommand.md)

## Type Aliases

### CommandCallback

Ƭ **CommandCallback**<`T`\>: (`player`: `T`, ...`args`: `any`[]) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`player`, `...args`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `T` |
| `...args` | `any`[] |

##### Returns

`void`

#### Defined in

[shared/interfaces/messageCommand.ts:1](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/shared/interfaces/messageCommand.ts#L1)
