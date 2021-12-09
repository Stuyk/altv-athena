export default {
    Vehicle: {
        'Driver Seat': {
            eventName: 'seat:Enter',
            args: [],
            isServer: true,
        },
        Doors: {
            'Driver Door': {
                eventName: 'door:Open',
                args: [-1],
            },
            'MORE DOORS': {
                'Driver Door': {
                    eventName: 'door:Open',
                    args: [-1],
                },
                'MORE MORE DOORS': {
                    'Driver Door': {
                        eventName: 'door:Open',
                        args: [-1],
                    },
                    'MORE MORE MORE DOORS': {
                        'Driver Door': {
                            eventName: 'door:Open',
                            args: [-1],
                        },
                        'MORE MORE MORE MORE DOORS': {
                            'Driver Door': {
                                eventName: 'door:Open',
                                args: [-1],
                            },
                        },
                    },
                },
            },
        },
    },
    'Fuel Pump': {
        'Fill Closest Vehicle': {
            eventName: 'fuel:Fill',
            args: [],
        },
    },
    House: {
        'Enter House': {
            eventName: 'enter:House',
            args: [],
        },
    },
};
