import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import '../commands/time';
import '../commands/weather';

alt.emit(SYSTEM_EVENTS.COMMANDS_LOADED);