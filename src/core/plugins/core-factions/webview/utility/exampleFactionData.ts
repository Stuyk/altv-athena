export const ExampleFactionData = {
    name: 'Los Santos Police Department',
    motd: '',
    members: {
        // Rank -> 'Member'
        '51a8efe590851930ac59f5cc': {
            name: 'Member_Three',
            rank: 'e65b8b289fb64f31e8b135cd9e41db8ebbc97b5df8d4ccec91db4c135e4b4966',
            hasOwnership: false,
        },
        '51a8efe590851930ac59f599': {
            name: 'Member_Six',
            rank: 'e65b8b289fb64f31e8b135cd9e41db8ebbc97b5df8d4ccec91db4c135e4b4966',
            hasOwnership: false,
        },
        '51a8efe590851930ac59f569': {
            name: 'Member_Seven',
            rank: 'e65b8b289fb64f31e8b135cd9e41db8ebbc97b5df8d4ccec91db4c135e4b4966',
            hasOwnership: false,
        },
        '51a8efe590851930ac59f555': {
            name: 'Member_Eight',
            rank: 'e65b8b289fb64f31e8b135cd9e41db8ebbc97b5df8d4ccec91db4c135e4b4966',
            hasOwnership: false,
        },
        '51a8efe590851930ac59faaa': {
            name: 'Member_Nine',
            rank: 'e65b8b289fb64f31e8b135cd9e41db8ebbc97b5df8d4ccec91db4c135e4b4966',
            hasOwnership: false,
        },
        '51a8efe590851930ac59fbbb': {
            name: 'Member_Ten',
            rank: 'e65b8b289fb64f31e8b135cd9e41db8ebbc97b5df8d4ccec91db4c135e4b4966',
            hasOwnership: false,
        },
        '51a8efe590851930ac59fccc': {
            name: 'Member_Eleven',
            rank: 'e65b8b289fb64f31e8b135cd9e41db8ebbc97b5df8d4ccec91db4c135e4b4966',
            hasOwnership: false,
        },
        '51a8efe590851930ac59fddd': {
            name: 'Member_Twelve',
            rank: 'e65b8b289fb64f31e8b135cd9e41db8ebbc97b5df8d4ccec91db4c135e4b4966',
            hasOwnership: false,
        },
        '51a8efe590851930ac59feee': {
            name: 'Member_Thirteen_Is_Really_Long',
            rank: 'e65b8b289fb64f31e8b135cd9e41db8ebbc97b5df8d4ccec91db4c135e4b4966',
            hasOwnership: false,
        },
        // Rank -> 'Officer'
        '51a8efe590851930ac59f5eg': {
            name: 'Member_Two',
            rank: 'e65b8b289fb64f31e8b135cd9e41db8ebbc97b5df8d4ccec91db4c135e4b49677',
            hasOwnership: false,
        },
        '51a8efe590851930ac59fxyz': {
            name: 'Member_Five',
            rank: 'e65b8b289fb64f31e8b135cd9e41db8ebbc97b5df8d4ccec91db4c135e4b49677',
            hasOwnership: false,
        },
        // Rank -> 'Owner'
        '61a8efe590851930ac59f5ef': {
            name: 'Member_One',
            rank: '541b72671c4af46361a8b52b9949fb357d8f96eb1133aae8a6569bc4f8253005',
            hasOwnership: true,
        },
    },
    ranks: [
        {
            name: 'Owner',
            actionPermissions: [],
            rankPermissions: {
                addMembers: true,
                bankAdd: true,
                bankRemove: true,
                kickMembers: true,
                manageMembers: true,
                manageRanks: true,
                manageRankPermissions: true,
            },
            vehicles: [],
            weight: 99,
            uid: '541b72671c4af46361a8b52b9949fb357d8f96eb1133aae8a6569bc4f8253005',
        },
        {
            name: 'Officer',
            actionPermissions: [],
            rankPermissions: {
                addMembers: true,
                bankAdd: true,
                bankRemove: false,
                kickMembers: true,
                manageMembers: true,
                manageRanks: false,
                manageRankPermissions: false,
            },
            vehicles: [],
            weight: 5,
            uid: 'e65b8b289fb64f31e8b135cd9e41db8ebbc97b5df8d4ccec91db4c135e4b49677',
        },
        {
            name: 'Member',
            actionPermissions: [],
            rankPermissions: {
                addMembers: false,
                bankAdd: true,
                bankRemove: false,
                kickMembers: false,
                manageMembers: false,
                manageRanks: false,
                manageRankPermissions: false,
            },
            vehicles: [],
            weight: 1,
            uid: 'e65b8b289fb64f31e8b135cd9e41db8ebbc97b5df8d4ccec91db4c135e4b4966',
        },
    ],
};
