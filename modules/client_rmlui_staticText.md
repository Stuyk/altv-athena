---
title: AthenaClient.rmlui.staticText
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### remove

::: tip Usage
AthenaClient.rmlui.staticText.**remove**(`uid`): `void`
:::

Remove static text based on uid.
Marks for deletion, and then removes it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uid` | `string` | A unique string |

#### Returns

`void`

#### Defined in

[client/rmlui/staticText/index.ts:121](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/client/rmlui/staticText/index.ts#L121)

___

### upsert

::: tip Usage
AthenaClient.rmlui.staticText.**upsert**(`drawable`): `void`
:::

Create in-world static text.
If the same uid is used it will simply replace the object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `drawable` | [`StaticTextInfo`](../interfaces/client_rmlui_staticText_staticTextInterfaces_StaticTextInfo.md) |

#### Returns

`void`

#### Defined in

[client/rmlui/staticText/index.ts:90](https://github.com/Stuyk/altv-athena/blob/068488b/src/core/client/rmlui/staticText/index.ts#L90)
