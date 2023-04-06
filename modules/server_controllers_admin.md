---
title: Athena.controllers.admin
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### banPlayer

::: tip Usage
Athena.controllers.admin.**banPlayer**(`player`, `reason`): `Promise`<`boolean`\>
:::

Used to ban a player from the server.

#### Example
```ts
Athena.controllers.admin.banPlayer(player, 'was a bad person :(')
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `reason` | `string` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/controllers/admin.ts:21](https://github.com/Stuyk/altv-athena/blob/e51302d/src/core/server/controllers/admin.ts#L21)

___

### override

::: tip Usage
Athena.controllers.admin.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"banPlayer"`` |
| `callback` | (`player`: `Player`, `reason`: `string`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/controllers/admin.ts:78](https://github.com/Stuyk/altv-athena/blob/e51302d/src/core/server/controllers/admin.ts#L78)

::: tip Usage
Athena.controllers.admin.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"unbanPlayerByDiscord"`` |
| `callback` | (`discord`: `string`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/controllers/admin.ts:79](https://github.com/Stuyk/altv-athena/blob/e51302d/src/core/server/controllers/admin.ts#L79)

___

### unbanPlayerByDiscord

::: tip Usage
Athena.controllers.admin.**unbanPlayerByDiscord**(`discord`): `Promise`<`boolean`\>
:::

Used to unban a player from the server.

#### Example
```ts
Athena.controllers.admin.unbanPlayerByDiscord('202685967935471617');
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `discord` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/controllers/admin.ts:52](https://github.com/Stuyk/altv-athena/blob/e51302d/src/core/server/controllers/admin.ts#L52)
