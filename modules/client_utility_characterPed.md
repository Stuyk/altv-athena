---
title: AthenaClient.utility.characterPed
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Variables

### PedCharacter

• `Const` **PedCharacter**: `Object`

Used to create a single instance of a character pedestrian.
Mostly used for appearance editing and such.
Do not use it for anything else.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apply` | (`_appearance`: `Appearance`, `forceSameShoes`: `boolean`) => `Promise`<`void`\> |
| `create` | (`isMale`: `boolean`, `_pos`: `IVector3`, `_rot`: `any`) => `Promise`<`number`\> |
| `destroy` | () => `Promise`<`unknown`\> |
| `get` | () => `number` |
| `getApperance` | () => `any` |
| `setHidden` | (`value`: `boolean`) => `void` |

#### Defined in

[client/utility/characterPed.ts:21](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/client/utility/characterPed.ts#L21)
