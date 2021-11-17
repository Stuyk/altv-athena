<template>
    <div class="split-three-way">
        <div class="equipment">
            <div class="equipment-grid">
                <div
                    v-for="(item, index) in equipment"
                    :id="`e-${index}`"
                    :class="getItemClass(item, index, equipmentSize)"
                    :key="index"
                    v-on="!item ? {} : { mousedown: selectItem, mouseenter: selectItemInfo, mouseleave: clearItemInfo }"
                >
                    <template v-if="item">
                        <div class="icon no-pointer">
                            <img :src="`../../assets/icons/${item.icon}.png`" />
                        </div>
                        <div class="stats no-pointer">
                            <div class="quantity">{{ item.quantity }}x</div>
                            <div class="weight" v-if="item && item.data && item.data.weight">
                                {{ item.data.weight }}{{ unitSuffix }}
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="grey--text text-caption no-pointer descriptor">
                            {{ locales.ITEM_SLOTS[index] }}
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div class="character">
            <div class="toolbar-grid">
                <div
                    v-for="(item, index) in toolbar"
                    :key="index"
                    :id="`t-${index}`"
                    :class="!item ? { 'is-null-item': true } : { item: true }"
                    v-on="!item ? {} : { mousedown: selectItem, mouseenter: selectItemInfo, mouseleave: clearItemInfo }"
                >
                    <template v-if="item">
                        <div class="icon no-pointer">
                            <img :src="`../../assets/icons/${item.icon}.png`" />
                        </div>
                        <div class="stats no-pointer">
                            <div class="quantity">{{ item.quantity }}x</div>
                            <div class="weight" v-if="item && item.data && item.data.weight">
                                {{ item.data.weight }}{{ unitSuffix }}
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="grey--text text--darken-2 no-pointer descriptor">
                            {{ index + 1 }}
                        </div>
                    </template>
                </div>
            </div>
            <h4 class="white--text boldest overline weight-holder" v-if="getCurrentWeight() >= 1">
                Weight | {{ getCurrentWeight() }}u
            </h4>
            <div class="notifications" v-if="notifications && notifications.length >= 1">
                <div v-for="(entry, index) in notifications" :key="index" class="notification">
                    {{ entry }}
                </div>
            </div>
        </div>
        <div class="inventory">
            <div class="inventory-grid">
                <div
                    v-for="(item, index) in inventory"
                    :id="`i-${index}`"
                    :key="index"
                    :class="getItemClass(item, index, inventorySize)"
                    v-on="!item ? {} : { mousedown: selectItem, mouseenter: selectItemInfo, mouseleave: clearItemInfo }"
                >
                    <template v-if="item">
                        <div class="icon">
                            <img :src="`../../assets/icons/${item.icon}.png`" />
                        </div>
                        <div class="consume" v-if="item && item.data && item.data.event">
                            <Icon class="yellow--text" :size="18" icon="icon-arrow-down"></Icon>
                        </div>
                        <div class="quantity">{{ item.quantity }}x</div>
                        <div class="weight" v-if="item && item.data && item.data.weight">
                            {{ item.data.weight }}{{ unitSuffix }}
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DefaultLocales from './utility/defaultLocale';
import Icon from '../../components/Icon.vue';

// Very Important! The name of the component must match the file name.
// Don't forget to do this. This is a note so you don't forget.
const ComponentName = 'Inventory';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon,
    },
    props: {
        emit: Function,
    },
    // Used to define state
    data() {
        return {
            // Item Movement Data / Dragging
            x: 0,
            y: 0,
            itemInfo: null,
            dragAndDrop: {
                shiftX: null,
                shiftY: null,
                clonedElement: null,
                itemIndex: null,
                selectedElement: null,
            },
            // Default Configuration(s) for Previews
            inventorySize: 28,
            equipmentSize: 11,
            toolbarSize: 4,
            // Data to use for display
            inventory: [],
            equipment: [],
            toolbar: [],
            // Default weight unit suffix.
            unitSuffix: 'u',
            // Notification Data
            notifications: [],
            locales: DefaultLocales,
        };
    },
    // Used to define functions you can call with 'this.x'
    methods: {
        addNotification(info: string) {
            const _notifications = [...this.notifications];
            _notifications.unshift(info);
            this.notifications = _notifications;

            setTimeout(() => {
                const currentNotifications = [...this.notifications];
                currentNotifications.pop();
                this.notifications = currentNotifications;
            }, 1500);
        },
        handleClose(keyPress) {
            // Escape && 'i'
            if (keyPress.keyCode !== 27 && keyPress.keyCode !== 73) {
                return;
            }

            document.removeEventListener('keyup', this.handleClose);
            setTimeout(() => {
                if ('alt' in window) {
                    alt.emit(`${ComponentName}:Close`);
                }
            }, 50);
        },
        getCurrentWeight() {
            let weight = 0;

            const arraysToUse = [this.inventory, this.equipment, this.toolbar];

            for (let i = 0; i < arraysToUse.length; i++) {
                const array = arraysToUse[i];
                for (let x = 0; x < array.length; x++) {
                    const item = array[x];
                    if (!item) {
                        continue;
                    }

                    if (!item.data) {
                        continue;
                    }

                    if (item.data.weight) {
                        weight += parseFloat(item.data.weight);
                    }
                }
            }

            return weight;
        },
        getItemClass(item: Object | null, index: number, sizeToCheck: number) {
            if (!item && index >= sizeToCheck) {
                return { 'is-unusable-slot': true };
            }

            if (!item) {
                return { 'is-null-item': true };
            }

            return { item: true };
        },
        updateInventory(items: Array<{ slot: number }>, size = 28) {
            // Establishing the initial inventory size.
            // Based on a server-side setting.
            // However, the size will handle expanded inventory size automatically.
            const sizeToUse = items.length > size ? items.length : size;
            const inventory = new Array(sizeToUse).fill(null);

            for (let i = 0; i < items.length; i++) {
                if (!items[i]) {
                    continue;
                }

                const slot = items[i].slot;
                inventory[slot] = items[i];
            }

            while (inventory.length % 3 !== 0) {
                inventory.push(null);
            }

            this.inventorySize = size;
            this.inventory = inventory;
        },
        updateEquipment(equipmentItems: Array<{ slot: number }>) {
            // Normal equipment is 11. 12 is to make it even.
            const newEquipment = new Array(12).fill(null);
            equipmentItems.forEach((item) => {
                if (!item) {
                    return;
                }

                newEquipment[item.slot] = item;
            });

            this.equipment = newEquipment;
        },
        updateToolbar(items: Array<{ slot: number }>, size = 4) {
            const sizeToUse = items.length > size ? items.length : size;
            const toolbar = new Array(sizeToUse).fill(null);

            items.forEach((item) => {
                if (!item) {
                    return;
                }

                toolbar[item.slot] = item;
            });

            this.toolbar = toolbar;
        },
        // Used to populate the item that has been hovered over.
        selectItemInfo(e) {
            if (this.dragging) {
                return;
            }

            if (!e || !e.target || !e.target.id) {
                return;
            }

            this.itemInfo = e.target.id;
        },
        clearItemInfo() {
            this.itemInfo = null;
        },
        stripCategory(value) {
            return parseInt(value.replace(/.-/gm, ''));
        },
        setPreviewDisabled(isDisabled: boolean) {
            this.disablePreview = isDisabled;
        },
        isFlagEnabled(flags: number, flagToCheck: number) {
            let currentFlags = flags;
            let currentFlagToCheck = flagToCheck;

            if ((currentFlags & currentFlagToCheck) !== 0) {
                return true;
            }

            return false;
        },
        setLocales(locales: any) {
            this.locales = locales;
        },
        // Functionality for Moving / Dragging Items
        selectItem(e, index: number) {
            if (this.dragging) {
                return;
            }

            // Right-Click
            if (e.button === 2) {
                if (!e.target.id || e.target.id === '') {
                    return;
                }

                if (e.shiftKey) {
                    const actualSlot = this.stripCategory(e.target.id);
                    let element;

                    if (e.target.id.includes('i-')) {
                        element = this.inventory.find((i) => i && i.slot === actualSlot);
                    }

                    if (e.target.id.includes('e-')) {
                        element = this.equipment.find((i) => i && i.slot === actualSlot);
                    }

                    if (e.target.id.includes('t-')) {
                        element = this.toolbar.find((i) => i && i.slot === actualSlot);
                    }

                    if (!element) {
                        return;
                    }

                    // Check if there is more than 1 in the stack.
                    if (!element.quantity || element.quantity <= 1) {
                        return;
                    }

                    // 2 is the flag for stackable items
                    if (!this.isFlagEnabled(element.behavior, 2)) {
                        return;
                    }

                    this.split = {
                        slot: e.target.id,
                        item: element,
                    };

                    this.splitAmount = Math.floor(element.quantity / 2);
                    return;
                }

                if (!('alt' in window)) {
                    return;
                }

                alt.emit('play:Sound', 'YES', 'HUD_FRONTEND_DEFAULT_SOUNDSET');

                if (e.target.id.includes('g-')) {
                    alt.emit(`${ComponentName}:Pickup`, e.target.dataset.hash);
                    return;
                }

                alt.emit(`${ComponentName}:Use`, e.target.id);
                return;
            }

            // Start Dragging Process
            this.dragging = true;

            // Calculate Element Size
            const element = document.getElementById(e.target.id);

            if (!element) {
                this.dragging = false;
                return;
            }

            this.dragAndDrop.shiftX = e.clientX - element.getBoundingClientRect().left;
            this.dragAndDrop.shiftY = e.clientY - element.getBoundingClientRect().top;
            this.dragAndDrop.selectedElement = { style: element.style, classList: element.classList.toString() };
            this.dragAndDrop.itemIndex = e.target.id;

            // Append Cloned Element to Page and Modify Style
            const clonedElement = element.cloneNode(true);
            clonedElement['id'] = `cloned-${element.id}`;
            document.body.append(clonedElement);
            this.clonedElement = document.getElementById(`cloned-${element.id}`);
            this.clonedElement.classList.add('item-clone');
            this.clonedElement.classList.add('no-animation');
            this.clonedElement.style.left = `${e.clientX - this.dragAndDrop.shiftX}px`;
            this.clonedElement.style.top = `${e.clientY - this.dragAndDrop.shiftY}px`;

            // Modify Current Element
            element.style.pointerEvents = 'none';
            element.style.setProperty('border', '2px dashed rgba(255, 255, 255, 0.5)', 'important');
            element.style.setProperty('opacity', '0.2', 'important');
            element.classList.add('grey', 'darken-4');
            element.classList.remove('grey', 'darken-3');

            // Toggle Event Listeners
            document.addEventListener('mouseup', this.dropItem);
            document.addEventListener('mouseover', this.mouseOver);
            document.addEventListener('mousemove', this.updatePosition); // This calls UpdatePosition

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'TOGGLE_ON', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        updatePosition(e) {
            this.clonedElement.style.left = `${e.clientX - this.dragAndDrop.shiftX}px`;
            this.clonedElement.style.top = `${e.clientY - this.dragAndDrop.shiftY}px`;
        },
        mouseOver(e) {
            if (this.lastHoverID) {
                const element = document.getElementById(this.lastHoverID);
                element.style.removeProperty('border');
                this.lastHoverID = null;
            }

            if (!e || !e.target || !e.target.id || e.target.id === '') {
                return;
            }

            if (this.lastHoverID !== e.target.id) {
                const element = document.getElementById(e.target.id);
                element.style.setProperty('border', '2px dashed white', 'important');
                this.lastHoverID = e.target.id;
            }
        },
        async dropItem(e) {
            this.dragging = false;

            document.removeEventListener('mouseover', this.mouseOver);
            document.removeEventListener('mouseup', this.dropItem);
            document.removeEventListener('mousemove', this.updatePosition);

            if (this.lastHoverID) {
                const element = document.getElementById(this.lastHoverID);
                element.style.removeProperty('border');
                element.style.removeProperty('box-shadow');
                this.lastHoverID = null;
            }

            this.clonedElement.remove();

            // selectElement.style = this.dragAndDrop.selectedElement.style;
            const selectElement = document.getElementById(this.dragAndDrop.itemIndex);
            Object.keys(this.dragAndDrop.selectedElement.style).forEach((key) => {
                const actualKey = parseInt(key);
                if (isNaN(actualKey)) {
                    selectElement.style[key] = this.dragAndDrop.selectedElement.style[key];
                } else {
                    const nameAsKey = this.dragAndDrop.selectedElement.style[key];
                    selectElement.style[nameAsKey] = '';
                }
            });

            selectElement.style.pointerEvents = 'all';

            const classList = [];
            for (let i = 0; i < selectElement.classList.length; i++) {
                classList.push(selectElement[i]);
            }

            selectElement.classList.remove(...classList);
            selectElement.classList.add(...this.dragAndDrop.selectedElement.classList.split(' '));

            this.x = 0;
            this.y = 0;

            if (!e || !e.target || !e.target.id || e.target.id === '') {
                return;
            }

            const selectedSlot = this.dragAndDrop.itemIndex;
            const endSlot = e.target.id;

            const endElement = document.getElementById(endSlot);
            const isTab = endElement.id.includes('tab');

            const isGroundItem = this.dragAndDrop.itemIndex.includes('g-');
            const isNullEndSlot = endElement.classList.contains('is-null-item');
            const isInventoryEndSlot = !endElement.id.includes('i-');

            // Check to make sure ground items are only being moved into the inventory slots.
            if (!isTab && isGroundItem && !isNullEndSlot && !isInventoryEndSlot) {
                return;
            }

            // Check if the selected slot isn't the same as the end slot.
            if (selectedSlot === endSlot) {
                return;
            }

            const hash = selectElement.dataset.hash ? `${selectElement.dataset.hash}` : null;

            if ('alt' in window) {
                alt.emit(`${ComponentName}:Process`, selectedSlot, endSlot, hash);
            }

            if (!isTab) {
                await this.updateLocalData(selectedSlot, endSlot);
            }
        },
        updateLocalData(selectedSlot, endSlot) {
            const selectIndex = this.stripCategory(selectedSlot);
            const endIndex = this.stripCategory(endSlot);

            const selectName = this.getDataName(selectedSlot);
            const endName = this.getDataName(endSlot);

            const selectItems = [...this[selectName]];
            const endItems = [...this[endName]];

            const selectItem = this.removeLocalItem(selectIndex, selectItems);
            const endItem = this.removeLocalItem(endIndex, endItems);

            if (endItem) {
                endItem.slot = selectIndex;
            }

            selectItem.slot = endIndex;

            this.replaceLocalData(endIndex, selectItem, endItems);
            this.replaceLocalData(selectIndex, endItem, selectItems);

            const selectFunctionUpdater = `update${this.capitalizeFirst(selectName)}`;
            const endFunctionUpdater = `update${this.capitalizeFirst(endName)}`;

            this[selectFunctionUpdater](selectItems);
            this[endFunctionUpdater](endItems);
        },
        removeLocalItem(index: number, localArray: Array<unknown>) {
            const itemClone = localArray[index];
            localArray[index] = null;
            return itemClone;
        },
        replaceLocalData(index: number, replacementItem: unknown, localArray: Array<unknown>) {
            localArray[index] = replacementItem;
        },
        getDataName(prefix: string) {
            if (prefix.includes('tab-')) {
                return 'tab';
            }

            if (prefix.includes('i-')) {
                return 'inventory';
            }

            if (prefix.includes('g-')) {
                return 'ground';
            }

            if (prefix.includes('e-')) {
                return 'equipment';
            }

            return 'toolbar';
        },
        capitalizeFirst(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
    },
    // Called when the page is loaded.
    mounted() {
        document.addEventListener('keyup', this.handleClose);

        if (!('alt' in window)) {
            // Normal equipment is 11. 12 is to make it even.
            this.equipment = new Array(12).fill(null);
            this.inventory = new Array(28).fill(null);
            this.toolbar = new Array(4).fill(null);

            setTimeout(() => {
                this.addNotification('hello world 1');
            }, 200);

            setTimeout(() => {
                this.addNotification('hello world 2');
            }, 400);

            setTimeout(() => {
                this.addNotification('hello world 3');
            }, 800);

            this.updateEquipment([
                {
                    name: `Hat`,
                    uuid: `some_hash_thing_ground`,
                    description: `What a cozy hat! Wow. Much cozy. Many comforts.`,
                    icon: 'hat',
                    slot: 0,
                    quantity: 1,
                    data: {
                        weight: 1,
                        event: 'test',
                    },
                },
                {
                    name: `Hat`,
                    uuid: `some_hash_thing_ground`,
                    description: `What a cozy hat! Wow. Much cozy. Many comforts.`,
                    icon: 'glasses',
                    slot: 5,
                    quantity: 1,
                    data: {
                        event: 'test',
                    },
                },
            ]);

            this.updateToolbar([
                {
                    name: `Pistol`,
                    uuid: `some_hash_thing_ground`,
                    description: `bang`,
                    icon: 'pistol50',
                    slot: 0,
                    quantity: 1,
                    data: {
                        weight: Math.floor(Math.random() * 5) + 1,
                    },
                },
            ]);

            this.updateInventory([
                {
                    name: `Box`,
                    uuid: `some_hash_thing_ground`,
                    description: `It is a box.`,
                    icon: 'crate',
                    slot: Math.floor(Math.random() * 28),
                    quantity: 1,
                    weight: Math.floor(Math.random() * 5),
                    data: {
                        weight: 1,
                    },
                },
                {
                    name: `Box`,
                    uuid: `some_hash_thing_ground`,
                    description: `It is a box.`,
                    icon: 'crate',
                    slot: Math.floor(Math.random() * 28),
                    quantity: 1,
                    weight: Math.floor(Math.random() * 5),
                    data: {
                        weight: 1,
                    },
                },
                {
                    name: `Box`,
                    uuid: `some_hash_thing_ground`,
                    description: `It is a box.`,
                    icon: 'crate',
                    slot: Math.floor(Math.random() * 28),
                    quantity: 1,
                    weight: Math.floor(Math.random() * 5),
                    data: {
                        weight: 1,
                    },
                },
                {
                    name: `Box`,
                    uuid: `some_hash_thing_ground`,
                    description: `It is a box.`,
                    icon: 'crate',
                    slot: Math.floor(Math.random() * 28),
                    quantity: 1,
                    weight: Math.floor(Math.random() * 5),
                    data: {
                        weight: 1,
                        event: 'wahtever',
                    },
                },
            ]);
            return;
        }

        // Bind Events to Methods
        if ('alt' in window) {
            alt.on(`${ComponentName}:Toolbar`, this.updateToolbar);
            alt.on(`${ComponentName}:Inventory`, this.updateInventory);
            alt.on(`${ComponentName}:Equipment`, this.updateEquipment);
            alt.on(`${ComponentName}:DisablePreview`, this.setPreviewDisabled);
            alt.on(`${ComponentName}:SetLocales`, this.setLocales);
            alt.on(`${ComponentName}:AddNotification`, this.addNotification);
            alt.emit(`${ComponentName}:Update`);
            alt.emit('ready');
            alt.emit('url');
        }
    },
    // Called when the page is unloaded.
    unmounted() {
        document.removeEventListener('keyup', this.handleClose);

        // Unbind Events from the Mounted Function
        if ('alt' in window) {
            alt.off(`${ComponentName}:Toolbar`, this.updateToolbar);
            alt.off(`${ComponentName}:Inventory`, this.updateInventory);
            alt.off(`${ComponentName}:Equipment`, this.updateEquipment);
            alt.off(`${ComponentName}:DisablePreview`, this.setPreviewDisabled);
            alt.off(`${ComponentName}:SetLocales`, this.setLocales);
            alt.off(`${ComponentName}:AddNotification`, this.addNotification);
        }
    },
});
</script>

<style scoped>
.split-three-way {
    display: flex;
    min-width: 100vw;
    max-width: 100vw;
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    justify-content: space-between;
}

.equipment,
.inventory {
    width: auto;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    align-self: flex-start;
    align-items: center;
    flex-direction: column;
    margin-top: 12px !important;
    margin-left: 12px;
    margin-right: 12px;
}

.character {
    width: 50vw;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding-top: 12px;
    padding-bottom: 12px;
    align-self: flex-start;
    flex-direction: column;
}

.inventory-grid,
.toolbar-grid,
.equipment-grid {
    display: grid;
    box-sizing: border-box;
    grid-template-columns: repeat(3, 10vh);
    grid-auto-rows: 10vh;
    grid-gap: 0.5vh;
    user-select: none;
    position: relative;
    padding: 5px !important;
    box-sizing: border-box;
    border: 2px solid rgba(0, 0, 0, 0.3);
    background: rgba(0, 0, 0, 0.3);
}

.inventory-grid {
    max-height: calc(100vh - 24px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 5px !important;
    box-sizing: border-box;
    border: 2px solid rgba(0, 0, 0, 0.3);
    background: rgba(0, 0, 0, 0.3);
}

.toolbar-grid {
    grid-template-columns: repeat(4, 10vh);
}

.item {
    display: block;
    position: relative;
    cursor: pointer;
    box-sizing: border-box;
    overflow: hidden;
    height: 100%;
    border: 2px solid rgba(0, 0, 0, 0.5);
    background: rgba(0, 0, 0, 0.75);
}

.item:hover {
    background: rgba(0, 0, 0, 0.85);
}

.icon {
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    align-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
    font-family: 'Roboto';
    overflow: hidden;
    user-select: none !important;
    pointer-events: none !important;
}

.icon img {
    min-width: 6.6666666666667vh;
    max-width: 6.6666666666667vh;
    user-select: none !important;
    pointer-events: none !important;
}

.is-null-item {
    position: relative;
    direction: ltr;
    cursor: pointer;
    border: 2px solid transparent;
    box-sizing: border-box;
    overflow: hidden;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    border: 2px solid rgba(0, 0, 0, 0.5);
    cursor: auto;
}

.is-unusable-slot {
    position: relative;
    direction: ltr;
    cursor: pointer;
    border: 2px solid transparent;
    box-sizing: border-box;
    overflow: hidden;
    height: 100%;
    background: rgba(45, 60, 75, 0.5);
    border: 2px dotted rgba(0, 0, 0, 0.5);
    cursor: auto;
}

.quantity {
    position: absolute;
    text-shadow: 1px 1px black;
    font-size: 11px;
    color: yellow;
    right: 0.5vh;
    bottom: 0;
    font-family: monospace;
    pointer-events: none !important;
}

.weight {
    position: absolute;
    text-shadow: 1px 1px black;
    font-size: 11px;
    color: yellow;
    left: 0.2vh;
    top: 0;
    font-family: monospace;
    pointer-events: none !important;
}

.descriptor {
    display: flex;
    text-align: center;
    justify-content: center;
    justify-items: center;
    align-content: center;
    align-items: center;
    height: 100%;
    pointer-events: none !important;
}

.weight-holder {
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(0, 0, 0, 0.4) 30%,
        rgba(0, 0, 0, 0.4) 60%,
        rgba(255, 255, 255, 0) 100%
    );
    width: 50%;
    text-align: center;
    padding-top: 5px;
    padding-bottom: 5px;
    margin-top: 16px !important;
    margin-bottom: 0px !important;
}

.item-clone {
    position: fixed !important;
    display: flex !important;
    pointer-events: none !important;
    background-color: #424242 !important;
    min-width: 10vh;
    max-width: 10vh;
    min-height: 10vh;
    max-height: 10vh;
    box-shadow: 0px 0px 5px 2px black;
    left: 0;
    right: 0;
    direction: ltr;
    cursor: pointer;
    border: 2px solid transparent;
    box-sizing: border-box !important;
    overflow: visible;
    z-index: 99;
}

.item-clone:hover {
    background: rgba(255, 255, 255, 0.3) !important;
}

.consume {
    position: absolute;
    text-shadow: 1px 1px black;
    font-size: 11px;
    color: white;
    bottom: 1px;
    left: -2px;
    pointer-events: none !important;
    z-index: 99;
    width: 18px;
    height: 18px;
}

.notifications {
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    width: 100%;
}

.notifications .notification {
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(0, 0, 0, 0.4) 30%,
        rgba(0, 0, 0, 0.4) 60%,
        rgba(255, 255, 255, 0) 100%
    );
    width: 50%;
    text-align: center;
    padding-top: 5px;
    padding-bottom: 5px;
    margin-top: 16px;
}
</style>
