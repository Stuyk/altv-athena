---
title: Athena.utility.hash
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Variables

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hashPassword` | (`plainTextPassword`: `string`) => `string` |
| `sha256` | (`data`: `string`) => `string` |
| `sha256Random` | (`data`: `string`) => `string` |
| `testPassword` | (`plainTextPassword`: `string`, `pbkdf2Hash`: `string`) => `boolean` |

#### Defined in

[server/utility/hash.ts:66](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/utility/hash.ts#L66)

## Functions

### hashPassword

▸ **hashPassword**(`plainTextPassword`): `string`

Hash a plain text password with pbkdf2 hash and salt.

Returns a pbkdf2 key, and salt. Which can be seperated by the `$` sign.

**`Example`**

```ts
const result = Athena.utility.hash.hashPassword('somePassword');
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `plainTextPassword` | `string` |

#### Returns

`string`

#### Defined in

[server/utility/hash.ts:16](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/utility/hash.ts#L16)

___

### sha256

▸ **sha256**(`data`): `string`

Hash a string of data into a persistent SHA256 hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` |

#### Returns

`string`

#### Defined in

[server/utility/hash.ts:50](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/utility/hash.ts#L50)

___

### sha256Random

▸ **sha256Random**(`data`): `string`

Hash a string of data into a random SHA256 hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` |

#### Returns

`string`

#### Defined in

[server/utility/hash.ts:61](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/utility/hash.ts#L61)

___

### testPassword

▸ **testPassword**(`plainTextPassword`, `pbkdf2Hash`): `boolean`

Test a plain text password against a stored pbkdf2 string.

**`Example`**

```ts
// Actual pbkdf2Hash is just mock string
const doesMatch = Athena.utility.hash.testPassword('test', 'kjfdskljfsdkl$90jj0f10f21f1')
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `plainTextPassword` | `string` |
| `pbkdf2Hash` | `string` |

#### Returns

`boolean`

#### Defined in

[server/utility/hash.ts:36](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/utility/hash.ts#L36)
