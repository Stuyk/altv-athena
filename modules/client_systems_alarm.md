---
title: AthenaClient.systems.alarm
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### loadAlarm

::: tip Usage
AthenaClient.systems.alarm.**loadAlarm**(`name`, `count?`): `Promise`<`boolean`\>
:::

Attempts to load an alarm multiple times before returning false.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `undefined` | The name of the alarm. |
| `count?` | `number` | `0` | Do not modify this. Leave it as zero. |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[client/systems/alarm.ts:17](https://github.com/Stuyk/altv-athena/blob/46a95d3/src/core/client/systems/alarm.ts#L17)

___

### startAlarm

::: tip Usage
AthenaClient.systems.alarm.**startAlarm**(`name`): `Promise`<`void`\>
:::

Play an alarm for the local player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the alarm. |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/systems/alarm.ts:50](https://github.com/Stuyk/altv-athena/blob/46a95d3/src/core/client/systems/alarm.ts#L50)

___

### stopAlarm

::: tip Usage
AthenaClient.systems.alarm.**stopAlarm**(`name`): `Promise`<`void`\>
:::

Stop an alarm for the local player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the alarm. |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/systems/alarm.ts:73](https://github.com/Stuyk/altv-athena/blob/46a95d3/src/core/client/systems/alarm.ts#L73)

___

### stopAllAlarms

::: tip Usage
AthenaClient.systems.alarm.**stopAllAlarms**(): `Promise`<`void`\>
:::

Stop all alarms for the local player.

#### Returns

`Promise`<`void`\>

#### Defined in

[client/systems/alarm.ts:86](https://github.com/Stuyk/altv-athena/blob/46a95d3/src/core/client/systems/alarm.ts#L86)
