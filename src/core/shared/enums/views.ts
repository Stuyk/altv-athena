export enum View_Events_Discord {
    Close = 'Discord:Close'
}

export enum View_Events_Creator {
    Done = 'creator:Done',
    Close = 'creator:Close',
    Show = 'creator:Show',
    Sync = 'creator:Sync',
    AwaitModel = 'creator:AwaitModel',
    AwaitName = 'creator:AwaitName'
}

export enum View_Events_Inventory {
    Process = 'inventory:Process',
    Use = 'inventory:Use',
    Split = 'inventory:Split',
    Pickup = 'inventory:Pickup'
}

export enum View_Events_Clothing {
    Open = 'clothing:Open',
    Sync = 'clothing:Sync',
    Purchase = 'clothing:Purchase',
    Exit = 'clothing:Exit'
}

export enum View_Events_Characters {
    Select = 'characters:Select',
    New = 'characters:New',
    Show = 'characters:Show',
    Done = 'characters:Done',
    Delete = 'characters:Delete'
}

export enum View_Events_Chat {
    Send = 'chat:Send',
    Append = 'chat:Append'
}

export enum View_Events_Garage {
    Open = 'garage:Open',
    Spawn = 'garage:Spawn',
    Despawn = 'garage:Despawn',
    Close = 'garage:Close'
}

export enum View_Events_Dealership {
    Open = 'dealership:Open',
    Purchase = 'dealership:Purchase'
}
