import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { BankAccountNumber } from './src/bankAccountNumber';
import { AtmFunctions } from './src/view';

const PLUGIN_NAME = 'Athena ATM';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    AtmFunctions.init();
    BankAccountNumber.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} was Loaded`);
});
