---
title: AthenaClient.utility.raycast
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Variables

### default

• `Const` **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `isFacingWater` | () => `any` |
| `performRaycast` | (`start`: `IVector3`, `end`: `IVector3`, `flags`: `number`, `radius`: `number`, `useShapeTest?`: `boolean`) => [`number`, `boolean`, `IVector3`, `IVector3`, `number`] |
| `positionFromCamera` | (`flags?`: `number`, `useShapeTest?`: `boolean`, `radius?`: `number`) => `any` |
| `positionFromPlayer` | (`flags`: `number`, `useShapeTest?`: `boolean`, `radius?`: `number`) => `any` |
| `simpleRaycast` | (`flags?`: `number`, `maxDistance`: `number`, `useShapeTest?`: `boolean`, `radius?`: `number`) => { `didComplete`: `boolean` ; `didHit?`: `boolean` ; `entityHit?`: `number` ; `position?`: `IVector3`  } |
| `simpleRaycastPlayersView` | (`flags`: `number`, `maxDistance`: `number`, `useShapeTest?`: `boolean`, `radius?`: `number`) => { `didComplete`: `boolean` ; `didHit?`: `boolean` ; `entityHit?`: `number` ; `position?`: `IVector3`  } |

#### Defined in

[client/utility/raycast.ts:6](https://github.com/Stuyk/altv-athena/blob/92069ee/src/core/client/utility/raycast.ts#L6)
