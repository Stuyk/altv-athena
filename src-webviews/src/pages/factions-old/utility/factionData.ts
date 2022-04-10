export default {
    _id: '610b2583173e6d562c301a9d',
    clientID: '608729d7b1f7d6140ca718ac',
    canAddRanks: true,
    logs: [`[${new Date(Date.now()).toISOString()}] John_Dane - false - whatever...`],
    name: 'Whatever',
    pos: {
        x: -802.1275024414062,
        y: -60.06593322753906,
        z: 37.75537109375,
        length: 805.2589115022635,
    },
    players: [],
    ranks: [
        {
            name: 'Admin',
            permissions: 1,
        },
        {
            name: 'Moderator',
            permissions: 7972,
            canRenameRank: true,
            canMoveRankDown: true,
            canChangeRankPerms: true,
        },
        {
            name: 'Goon',
            permissions: 2816,
            canRenameRank: true,
            canMoveRankUp: true,
            canRemoveRank: true,
            canChangeRankPerms: true,
        },
    ],
    canAddToBank: true,
    canRemoveFromBank: true,
    canChangeName: true,
    bank: 0,
};
