import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

alt.emit(SYSTEM_EVENTS.COMMANDS_LOADED);
