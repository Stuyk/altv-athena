import * as alt from 'alt-server';
import { ServerAPI } from '../../../server';
import { BankAccountNumber } from './src/bankAccountNumber';
import { AtmFunctions } from './src/view';

const PLUGIN_NAME = 'Athena ATM';

ServerAPI.systems.PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    AtmFunctions.init();
    BankAccountNumber.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
