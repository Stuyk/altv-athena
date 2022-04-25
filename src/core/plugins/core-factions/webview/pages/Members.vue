<template>
    <div class="wrapper members-wrapper">
        <div class="split space-between members-fill">
            <div class="selection pa-4">
                <template v-if="!selected">
                    <span class="overline">Select a member to modify permissions</span>
                    <br />
                    <span class="overline">Permissions may vary by your rank</span>
                </template>
                <template v-else>
                    <div class="permissions">
                        <div
                            class="permission mb-4"
                            v-for="(perm, index) in getRankPermissions(selected.rank)"
                            :key="index"
                        >
                            <div v-if="perm && perm.key && perm.value">
                                <Button color="green">{{ perm.name }}</Button>
                            </div>
                            <div v-else>
                                <Button :disable="true">{{ perm.name }}</Button>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="members">
                <!-- Search -->
                <div class="members-top pl-4 pr-6">
                    <input type="text" class="search" placeholder="Search members" v-model="search" />
                </div>
                <!-- Member List by Rank -->
                <div class="members-bottom">
                    <div class="rank" v-for="(rank, index) in getRanks()" :key="index" style="">
                        <div class="split space-between pl-4 pr-4 pt-4 pb-4 rank-name">
                            <span>{{ rank.name }}</span>
                            <sup>[ {{ rank.weight }} ]</sup>
                        </div>
                        <div class="rank-content pa-4">
                            <div
                                v-for="(member, index) in getMembersByRank(rank.uid)"
                                :key="index"
                                :name="member.name"
                                class="member mb-2"
                            >
                                <div class="split space-between">
                                    <Button
                                        @click="() => selectMember(member)"
                                        :color="getMemberSelectClass(member)"
                                        :flatten="true"
                                        class="member-button"
                                        style="width: 100%"
                                        >{{ member.name }}</Button
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';
import Module from '@components/Module.vue';
import { Faction, FactionCharacter, FactionRank, RankPermissionNames } from '../../shared/interfaces';
import { FactionLocale } from '../../shared/locale';
import { FactionParser } from '../utility/factionParser';

const ComponentName = 'Members';
export default defineComponent({
    name: ComponentName,
    props: {
        faction: Object as () => Faction,
        character: String,
    },
    data() {
        return {
            selected: null,
            search: '',
        };
    },
    components: {
        Button,
        Icon,
        Module,
    },
    computed: {},
    methods: {
        getMemberSelectClass(member: FactionCharacter) {
            if (!this.selected) {
                return 'blue';
            }

            if (this.selected.name !== member.name) {
                return 'blue';
            }

            return 'orange';
        },
        selectMember(member: FactionCharacter) {
            this.selected = member;
        },
        getMembersByRank(rank: string): Array<FactionCharacter & { id?: string }> {
            const members = FactionParser.getFactionMembersByRank(this.faction, rank);

            if (!this.search || this.search === '') {
                return members;
            }

            return members.filter((member) => {
                return member.name.toLowerCase().includes(this.search.toLowerCase());
            });
        },
        getRanks(): Array<FactionRank> {
            return FactionParser.getFactionRanks(this.faction);
        },
        getRankName(uid: string): string {
            return FactionParser.getRankName(this.faction, uid);
        },
        getRankPermissions(
            rank: string,
            permissions = [RankPermissionNames.kickMembers, RankPermissionNames.manageMembers],
        ): Array<{ key: string; value: boolean; name: string; desc: string }> {
            const character = FactionParser.getMember(this.faction, this.character);
            if (!this.selected) {
                return [];
            }

            const actingRank = FactionParser.getRank(this.faction, character);
            const againstRank = FactionParser.getRank(this.faction, rank);
            const validPermissions = FactionParser.getValidPermissions(actingRank, againstRank, character.hasOwnership);
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

                if (key === RankPermissionNames.kickMembers) {
                    if (validPermissions.hasOwnProperty(key) && character.name !== this.selected) {
                        permissionList.push({ key, value: validPermissions[key], name, desc });
                    } else {
                        permissionList.push({ key, value: false, name, desc });
                    }
                }

                if (key === RankPermissionNames.manageMembers) {
                    if (validPermissions.hasOwnProperty(key) && character.name !== this.selected) {
                        permissionList.push({ key, value: validPermissions[key], name: 'Promote', desc });
                        permissionList.push({ key, value: validPermissions[key], name: 'Demote', desc });
                    } else {
                        permissionList.push({ key, value: false, name: 'Promote', desc });
                        permissionList.push({ key, value: false, name: 'Demote', desc });
                    }
                }
            }

            return permissionList;
        },
    },
});
</script>

<style scoped>
.members-wrapper {
    height: 100%;
    width: 100%;
}

.members {
    min-width: 225px;
    max-width: 225px;
    min-height: 75vh;
    max-height: 75vh;
    background: rgba(22, 22, 22, 1);
    border-left: 2px solid rgba(28, 28, 28, 1);
}

.members-top {
    display: flex;
    flex-direction: column;
    min-height: 50px;
    max-height: 50px;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background: rgba(28, 28, 28, 1);
    border-bottom: 2px solid rgba(22, 22, 22, 1);
}

.members-bottom {
    display: flex;
    flex-direction: column;
    min-height: calc(75vh - 50px);
    max-height: calc(75vh - 50px);
    overflow-y: scroll;
}

.rank {
    height: 100%;
}

.rank-name {
    display: flex;
    flex-direction: row;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
    background: rgba(28, 28, 28, 1);
}

.rank-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
}

.permissions {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 12px;
}

.selection {
    width: 100%;
    height: 100%;
    background-color: rgba(36, 36, 36, 1);
}

.members-fill {
    height: 100%;
    align-items: flex-start;
}

.member .button {
    font-size: 10px !important;
    font-weight: 900;
    overflow: hidden;
}

.member-button {
    border-radius: 6px;
}

.search {
    align-self: center;
    font-family: 'Roboto', sans-serif;
    background: rgba(12, 12, 12, 1);
    border: 2px solid rgba(36, 36, 36, 1);
    padding: 6px;
    width: 100%;
    box-sizing: border-box;
    color: white;
}

.search:focus {
    border-color: rgba(52, 52, 52, 1);
}
</style>
