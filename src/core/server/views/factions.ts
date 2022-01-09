import * as alt from 'alt-server';
import { View_Events_Factions } from '../../shared/enums/views';
import { FactionSystem } from '../systems/factions';
import { FactionInternalSystem } from '../systems/factionsInternal';

class FactionsFunctions {
    static async open(player: alt.Player) {
        if (!player || !player.valid) {
            return;
        }

        if (!player.data.faction) {
            return;
        }

        if (player.data.isDead) {
            return;
        }

        const clientInterface = FactionInternalSystem.getClientInterface(
            player.data.faction,
            player.data._id.toString(),
        );

        FactionInternalSystem.opened(player);
        alt.emitClient(player, View_Events_Factions.Open, clientInterface);
    }

    static async close(player: alt.Player) {
        if (!player.data.faction) {
            return;
        }

        FactionInternalSystem.closed(player);
    }

    static async eventBus(player: alt.Player, eventName: View_Events_Factions, ...args: any[]): Promise<void> {
        if (!player || !player.valid) {
            return;
        }

        if (!EventBindings[eventName]) {
            throw new Error(`${eventName} is not a Faction Bus Event Binding`);
        }

        const response = await EventBindings[eventName](player, ...args);
        alt.emitClient(player, View_Events_Factions.Response, response);
    }
}

const EventBindings = {
    [View_Events_Factions.AddRank]: FactionSystem.addRank,
    [View_Events_Factions.RemoveRank]: FactionSystem.removeRank,
    [View_Events_Factions.AddMember]: FactionSystem.addMember,
    [View_Events_Factions.RemoveMember]: FactionSystem.removeMember,
    [View_Events_Factions.SetName]: FactionSystem.setName,
    [View_Events_Factions.SetRankName]: FactionSystem.setRankName,
    [View_Events_Factions.SetMemberRank]: FactionSystem.setMemberRank,
    [View_Events_Factions.ChangeRankOrder]: FactionSystem.changeRankOrder,
    [View_Events_Factions.Deposit]: FactionSystem.depositToBank,
    [View_Events_Factions.Withdraw]: FactionSystem.withdrawFromBank,
    [View_Events_Factions.SetPermissions]: FactionSystem.setRankPermissions,
    [View_Events_Factions.Disband]: FactionSystem.disband,
    [View_Events_Factions.ChangeOwner]: FactionSystem.changeOwner,
    [View_Events_Factions.SetStorageLocation]: FactionSystem.setStorageLocation,
    [View_Events_Factions.SetWeaponsLocation]: FactionSystem.setWeaponsLocation,
    [View_Events_Factions.SetPosition]: FactionSystem.setPosition,
};

alt.onClient(View_Events_Factions.Open, FactionsFunctions.open);
alt.onClient(View_Events_Factions.Close, FactionsFunctions.close);
alt.onClient(View_Events_Factions.Bus, FactionsFunctions.eventBus);
