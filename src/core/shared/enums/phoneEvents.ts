interface PhoneEvent {
    name: string;
    isServer?: boolean;
}

export const PhoneEvents = {
    EVENT: { name: 'phone:Event' },
    ATM_TRANSFER: { name: 'phone:ATM:Transfer', isServer: true },
    ATM_PROCESS: { name: 'phone:ATM:Process' }
};

export const PhoneEventList: Array<PhoneEvent> = [
    //
    PhoneEvents.EVENT,
    PhoneEvents.ATM_TRANSFER,
    PhoneEvents.ATM_PROCESS
];
