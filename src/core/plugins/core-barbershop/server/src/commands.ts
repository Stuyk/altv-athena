import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { command } from '../../../../server/decorators/commands';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { BarbershopView } from './view';

export class BarbershopCommands {
    static init() {
        alt.log(`Barbershop Commands Initialized`);
    }

    @command('barber', '/barber', PERMISSIONS.ADMIN)
    private static handleBarbershop(player: alt.Player) {
        BarbershopView.open(player);
    }

    @command('boffer', '/boffer [player_id] - Offer Change of Hairstyle', PERMISSIONS.NONE)
    private static handleBarbershopOffer(hairDresser: alt.Player, id: string) {
        // Some kind of item check...
        if (typeof id === 'undefined') {
            Athena.player.emit.message(hairDresser, Athena.controllers.chat.getDescription('boffer'));
            return;
        }

        const customer = Athena.systems.identifier.getPlayer(id);
        if (!customer || !customer.valid) {
            Athena.player.emit.message(hairDresser, `Could not find that player.`);
            return;
        }

        BarbershopView.offer(hairDresser, customer);
    }

    @command('baccept', '/baccept [player_id] - Accept Change of Hairstyle', PERMISSIONS.NONE)
    private static handleBarbershopAccept(customer: alt.Player, id: string) {
        // Some kind of item check...
        if (typeof id === 'undefined') {
            Athena.player.emit.message(customer, Athena.controllers.chat.getDescription('baccept'));
            return;
        }

        BarbershopView.accept(customer, parseInt(id));
    }
}
