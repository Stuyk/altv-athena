---
title: AthenaClient.systems.character
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Variables

### CharacterSystem

• `Const` **CharacterSystem**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `applyAppearance` | (`ped`: `number`, `appearance`: `Appearance`) => `void` |
| `applyEquipment` | (`ped`: `number`, `components`: `Item`[], `isMale`: `boolean`) => `void` |
| `applyHairOverlay` | (`decorations`: { `collection`: `string` ; `overlay`: `string`  }[]) => `void` |

#### Defined in

[client/systems/character.ts:7](https://github.com/Stuyk/altv-athena/blob/71db7b8/src/core/client/systems/character.ts#L7)
