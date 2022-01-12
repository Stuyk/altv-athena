// OSS-Discord First Integration. Sadly the Athena Framework doesn't offer discordjs/builders for commands yet.
// I've already requested an integration of that so, we will see where it goes. For now this is the basic integration.
import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { MessageEmbed } from 'discord.js';
import { OSS } from '../index';
import { DiscordController } from '../../../server/systems/discord';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import IShop from './interfaces/IShop';

const OSS_DISCORD = {
    enableDiscordIntegration: false,
    administrativeChannel: '<ChannelID - Copy ID here from your Discord>', // USE YOUR OWN CHANNEL ID (ADMINISTRATIVE)
};

alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, async () => {
    if (OSS_DISCORD.enableDiscordIntegration) {
        const allShops = await Database.fetchAllData<IShop>(OSS.collection);
        let ossEmbed: MessageEmbed;
        let buyShopsFound = 0;
        let sellShopsFound = 0;
        let itemsInShops = 0;
        // inside a command, event listener, etc.
        alt.setTimeout(() => {
            for (let x = 0; x < allShops.length; x++) {
                if (allShops[x].data.items.length > 0) itemsInShops++;
                if (allShops[x].shopType === 'buy') buyShopsFound++;
                if (allShops[x].shopType === 'sell') sellShopsFound++;
                ossEmbed = new MessageEmbed()
                    .setTitle('OSS - Discord Integration')
                    .setURL('https://github.com/Booster1212/')
                    .setDescription('Open source projects are changing the world!')
                    .setImage(
                        'https://user-images.githubusercontent.com/82890183/148142146-ba173e98-4c11-47d9-95da-6d83de2608af.png',
                    )
                    .addFields(
                        { name: 'Loaded Shops:', value: allShops.length },

                        { name: 'Loaded buyers:', value: buyShopsFound, inline: true },
                        { name: 'Loaded sellers:', value: sellShopsFound, inline: true },

                        { name: 'Found items in all Shops:', value: itemsInShops },
                    )
                    .setTimestamp();
            }
            DiscordController.sendEmbed(OSS_DISCORD.administrativeChannel, ossEmbed);
        }, 4000);
    }
});
