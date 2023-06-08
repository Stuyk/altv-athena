---
title: Athena.systems.inventory.config.Internal
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Variables

### DEFAULT\_CONFIG

• **DEFAULT\_CONFIG**: `Object`

Do not modify this directly.
These are used as internal values.
Use the config setter / getter in ItemManager system to modify.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `custom` | { `size`: `number` = 256 } |
| `custom.size` | `number` |
| `inventory` | { `size`: `number` = 30 } |
| `inventory.size` | `number` |
| `toolbar` | { `size`: `number` = 4 } |
| `toolbar.size` | `number` |
| `weight` | { `enabled`: `boolean` = true; `player`: `number` = 64 } |
| `weight.enabled` | `boolean` |
| `weight.player` | `number` |

#### Defined in

[server/systems/inventory/config.ts:10](https://github.com/Stuyk/altv-athena/blob/2435881/src/core/server/systems/inventory/config.ts#L10)
