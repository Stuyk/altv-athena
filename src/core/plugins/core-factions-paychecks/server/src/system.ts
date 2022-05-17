import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { CurrencyTypes } from '../../../../shared/enums/currency';
import { FactionFuncs } from '../../../core-factions/server/src/funcs';
import { FactionHandler } from '../../../core-factions/server/src/handler';
import { FactionPlayerFuncs } from '../../../core-factions/server/src/playerFuncs';
import { F_PAYCHECK_EVENTS } from '../../shared/events';
import { FactionCharacter, FactionRank } from '../../shared/extensions';

const DEFAULT_HIGH_VALUE = Number.MAX_SAFE_INTEGER;

class InternalFunctions {
    /**
     * Get the time left for a paycheck.
     *
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof InternalFunctions
     */
    static getTimeLeft(player: alt.Player) {
        if (!player || !player.valid || !player.data || !player.data.faction) {
            alt.emitClient(player, F_PAYCHECK_EVENTS.GET_PAYCHECK_TIME_LEFT, DEFAULT_HIGH_VALUE);
            return false;
        }

        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            alt.emitClient(player, F_PAYCHECK_EVENTS.GET_PAYCHECK_TIME_LEFT, DEFAULT_HIGH_VALUE);
            return false;
        }

        const rank = FactionPlayerFuncs.getPlayerFactionRank(player) as FactionRank;
        if (!rank || !rank.paycheck) {
            alt.emitClient(player, F_PAYCHECK_EVENTS.GET_PAYCHECK_TIME_LEFT, DEFAULT_HIGH_VALUE);
            return false;
        }

        const member = faction.members[player.data._id.toString()] as FactionCharacter;
        if (!member) {
            alt.emitClient(player, F_PAYCHECK_EVENTS.GET_PAYCHECK_TIME_LEFT, DEFAULT_HIGH_VALUE);
            return false;
        }

        if (!member.nextPaycheck) {
            alt.emitClient(player, F_PAYCHECK_EVENTS.GET_PAYCHECK_TIME_LEFT, 0);
            return true;
        }

        alt.emitClient(player, F_PAYCHECK_EVENTS.GET_PAYCHECK_TIME_LEFT, member.nextPaycheck - Date.now());
        return true;
    }

    static async setRankPaycheck(player: alt.Player, rank: string, value: number) {
        if (!player || !player.valid || !player.data || !player.data.faction) {
            return false;
        }

        if (value <= -1) {
            return false;
        }

        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            return false;
        }

        const rankIndex = faction.ranks.findIndex((x) => x.uid === rank);
        if (rankIndex <= -1) {
            return false;
        }

        faction.ranks[rankIndex].paycheck = value;
        const didUpdate = await FactionHandler.update(faction._id as string, { ranks: faction.ranks });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    static async setTime(player: alt.Player, value: number) {
        if (!player || !player.valid || !player.data || !player.data.faction) {
            return false;
        }

        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            return false;
        }

        faction.settings.paycheckClaimTime = value;
        const didUpdate = await FactionHandler.update(faction._id as string, { settings: faction.settings });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
            Athena.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        }

        return didUpdate.status;
    }

    static async claimPaycheck(player: alt.Player) {
        if (!player || !player.valid || !player.data || !player.data.faction) {
            return false;
        }

        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            return false;
        }

        const member = faction.members[player.data._id.toString()] as FactionCharacter;
        if (!member) {
            return false;
        }

        if (member.nextPaycheck && Date.now() < member.nextPaycheck) {
            return false;
        }

        const rank = FactionPlayerFuncs.getPlayerFactionRank(player) as FactionRank;
        if (!rank || !rank.paycheck) {
            return false;
        }

        if (faction.bank < rank.paycheck) {
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return false;
        }

        faction.bank -= rank.paycheck;
        faction.members[player.data._id.toString()].nextPaycheck =
            Date.now() + faction.settings.paycheckClaimTime * 60000;

        const didUpdate = await FactionHandler.update(faction._id as string, {
            members: faction.members,
            bank: faction.bank,
        });

        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
            await Athena.player.currency.add(player, CurrencyTypes.CASH, rank.paycheck);
            Athena.player.emit.sound2D(player, 'unlock', 0.5);
        }

        InternalFunctions.getTimeLeft(player);
        return didUpdate.status;
    }
}

export class FactionPaycheckSystem {
    static init() {
        alt.onClient(F_PAYCHECK_EVENTS.GET_PAYCHECK_TIME_LEFT, InternalFunctions.getTimeLeft);
        alt.onClient(F_PAYCHECK_EVENTS.SET_RANK_PAYCHECK, InternalFunctions.setRankPaycheck);
        alt.onClient(F_PAYCHECK_EVENTS.SET_PAYCHECK_TIME, InternalFunctions.setTime);
        alt.onClient(F_PAYCHECK_EVENTS.CLAIM, InternalFunctions.claimPaycheck);
    }
}
