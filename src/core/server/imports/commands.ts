import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

alt.emit(SYSTEM_EVENTS.COMMANDS_LOADED);