export enum INVENTORY_RULES {
    // Inventory <-> Toolbar
    FROM_TOOLBAR_TO_INVENTORY = 'from-toolbar-to-inventory',
    FROM_INVENTORY_TO_TOOLBAR = 'from-inventory-to-toolbar',
    // Inventory <-> Equipment
    FROM_EQUIPMENT_TO_INVENTORY = 'from-equipment-to-inventory',
    FROM_INVENTORY_TO_EQUIPMENT = 'from-inventory-to-equipment',
    // Inventory <-> Ground
    FROM_GROUND_TO_INVENTORY = 'from-ground-to-inventory',
    FROM_INVENTORY_TO_GROUND = 'from-inventory-to-ground',
    // Equipment <-> Toolbar
    FROM_EQUIPMENT_TO_TOOLBAR = 'from-equipment-to-toolbar',
    FROM_TOOLBAR_TO_EQUIPMENT = 'from-toolbar-to-equipment',
    // Equipment <-> Ground
    FROM_EQUIPMENT_TO_GROUND = 'from-equipment-to-ground',
    FROM_GROUND_TO_EQUIPMENT = 'from-ground-to-equipment',
    // Toolbar <-> Ground
    FROM_TOOLBAR_TO_GROUND = 'from-toolbar-to-ground',
    FROM_GROUND_TO_TOOLBAR = 'from-ground-to-toolbar',
}
