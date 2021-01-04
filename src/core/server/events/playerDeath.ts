import * as alt from 'alt-server';

alt.on('playerDeath', handleDeath);

/**
 * Respawn and Death Logic.
 * Automatically places the player into a dead state if they are not in one.
 * @param {alt.Player} player
 * @param {alt.Player} killer
 * @param {*} weaponHash
 */
function handleDeath(player: alt.Player, killer: alt.Player, weaponHash: any): void {
    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);

    if (!player.data.isDead) {
        player.data.isDead = true;
        player.emitMeta('isDead', true);
        player.saveField('isDead', true);
        player.send(`You have died. Pending respawn.`);

        alt.log(`(${player.id}) ${player.data.name} has died.`);
    }

    if (!player.nextDeathSpawn) {
        player.nextDeathSpawn = Date.now() + 30000;
    }
}
