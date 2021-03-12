interface PhoneEvent {
    name: string;
    isServer?: boolean;
}

export const PhoneEvents = {
    EVENT: { name: 'phone:Event' },
    ATM_TRANSFER: { name: 'phone:ATM:Transfer', isServer: true },
    ATM_PROCESS: { name: 'phone:ATM:Process' },
    DEALERSHIP_BUY: { name: 'phone:Dealership:Buy', isServer: true }
};

export const PhoneEventList: Array<PhoneEvent> = [
    //
    PhoneEvents.EVENT,
    PhoneEvents.ATM_TRANSFER,
    PhoneEvents.ATM_PROCESS,
    PhoneEvents.DEALERSHIP_BUY
    // Add New Phone App Events to Serverside Here
];
