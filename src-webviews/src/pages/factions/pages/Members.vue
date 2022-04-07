<template>
    <div class="wrapper pl-2">
        <div class="row">
            <span class="header overline">id</span>
            <span class="header overline">name</span>
            <span class="header overline">rank</span>
            <span class="header overline">actions</span>
        </div>
        <div class="row" v-for="(member, index) in getMembers()" :key="index">
            <span class="id">{{ member.id }}</span>
            <span class="name">{{ member.name }}</span>
            <span class="rank">{{ getRankName(member.rank) }}</span>
            <div class="permissions">
                <div class="permission" v-for="(perm, index) in getRankPermissions(member.rank)" :key="index">
                    <div v-if="perm && perm.key && perm.value">
                        <Button color="green">{{ perm.name }}</Button>
                    </div>
                    <div v-else>
                        <Button :disable="true">{{ perm.name }}</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '../../../components/Button.vue';
import Icon from '../../../components/Icon.vue';
import {
    Faction,
    FactionCharacter,
    FactionRank,
    RankPermissionNames,
} from '../../../../../src/core/shared-plugins/core-factions/interfaces';
import { FactionLocale } from '../../../../../src/core/shared-plugins/core-factions/locale';
import { FactionParser } from '../utility/factionParser';

const ComponentName = 'Members';
export default defineComponent({
    name: ComponentName,
    props: {
        faction: Object as () => Faction,
        character: String,
    },
    components: {
        Button,
        Icon,
    },
    computed: {
        //
    },
    methods: {
        getMembers(): Array<FactionCharacter & { id?: string }> {
            return FactionParser.getFactionMembers(this.faction, true);
        },
        getRankName(uid: string): string {
            return FactionParser.getRankName(this.faction, uid);
        },
        getRankPermissions(
            rank: string,
            permissions = [RankPermissionNames.kickMembers, RankPermissionNames.manageMembers],
        ): Array<{ key: string; value: boolean; name: string; desc: string }> {
            const character = FactionParser.getMember(this.faction, this.character);
            const actingRank = FactionParser.getRank(this.faction, character);

            const againstRank = FactionParser.getRank(this.faction, rank);
            const validPermissions = FactionParser.getValidPermissions(actingRank, againstRank);
            const permissionList: Array<{ key: string; value: boolean; desc: string; name: string }> = [];

            for (let i = 0; i < permissions.length; i++) {
                const key = permissions[i];

                let name = FactionLocale[key];
                if (!name) {
                    name = `No Locale for ${key}`;
                }

                let desc = FactionLocale[key + 'Desc'];
                if (!desc) {
                    desc = `No Locale for ${key + 'Desc'}`;
                }

                if (!validPermissions.hasOwnProperty(key)) {
                    permissionList.push({ key, value: false, name, desc });
                } else {
                    permissionList.push({ key, value: validPermissions[key], name, desc });
                }
            }

            return permissionList;
        },
    },
});
</script>

<style scoped>
.row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
}

.row .id {
    max-width: 50px;
    overflow: hidden;
}

.row .id:hover {
    max-width: unset;
    overflow: unset;
}
</style>
