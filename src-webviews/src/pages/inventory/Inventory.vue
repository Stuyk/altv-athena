<template>
    <div class="split-three-way" oncontextmenu="return false;">
        <!-- Split Interface -->
        <Modal v-if="split">
            <Frame minWidth="45vw" maxWidth="45vw">
                <template v-slot:toolbar>
                    <Toolbar :hideExit="true">
                        <span class="yellow--text"> {{ split.item.name }} ({{ split.item.quantity }}x) </span>
                    </Toolbar>
                </template>
                <template v-slot:content>
                    <div class="split-interface">
                        <div class="subtitle-2 grey--text mb-2 mt-2">
                            {{ locales.LABEL_SPLIT_TEXT }} {{ splitAmount }}x
                        </div>
                        <div class="split split-full center pb-4 pt-4" v-if="split.item.quantity - 1 >= 2">
                            <Button color="blue" @click="setIncrementAmount(null, -1)">
                                <Icon :size="14" icon="icon-chevron-left"></Icon>
                            </Button>
                            <RangeInput
                                :minIndex="1"
                                :maxIndex="split.item.quantity - 1"
                                :indexValue="splitAmount"
                                :increment="1"
                                @input="(e) => setIncrementAmount(e, null)"
                                style="width: 100%"
                                class="pl-3 pr-3"
                            />
                            <Button color="blue" @click="setIncrementAmount(null, 1)">
                                <Icon :size="14" icon="icon-chevron-right"></Icon>
                            </Button>
                        </div>
                        <div class="split split-full">
                            <Button class="mt-2" color="red" style="width: 50%" @click="cancelSplitStack">
                                {{ locales.LABEL_CANCEL }}
                            </Button>
                            <Button class="ml-4 mt-2" color="green" style="width: 50%" @click="splitStack">
                                {{ locales.LABEL_SPLIT }}
                            </Button>
                        </div>
                    </div>
                </template>
            </Frame>
        </Modal>

        <!-- Normal Interfaces -->
        <div class="equipment">
            <div class="equipment-grid">
                <div
                    v-for="(item, index) in equipment"
                    :id="`e-${index}`"
                    :class="getItemClass(item, index, equipmentSize)"
                    :key="index"
                    v-on="
                        !item
                            ? {}
                            : {
                                  mousedown: selectItem,
                                  mouseenter: (e) => selectItemInfo(e, item),
                                  mouseleave: clearItemInfo,
                              }
                    "
                >
                    <template v-if="item">
                        <div class="icon no-pointer">
                            <img :src="ResolvePath(`../../assets/icons/${item.icon}.png`)" />
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
            <div class="stats-wrapper">
                <div class="stats-bg" v-if="itemInfo">
                    <div class="stats">
                        <div class="split split-full">
                            <div class="item-name boldest" :class="getClassRarity">
                                {{ itemInfo.name }}
                            </div>
                            <div class="item-quantity" :class="getClassRarity">{{ itemInfo.quantity }}x</div>
                        </div>
                        <div class="item-desc" v-if="itemInfo.description" :class="getClassRarity">
                            {{ itemInfo.description }}
                        </div>
                        <div class="key-group" v-for="(prop, index) in getHoveredItemStats" :key="index">
                            <div class="split split-full">
                                <span class="overline">{{ prop.key }}:</span>
                                <span class="overline">{{ prop.value }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="spacer">&nbsp;</div>
        <div class="character">
            <!-- Toolbar Display -->
            <div class="toolbar-grid">
                <div
                    v-for="(item, index) in toolbar"
                    :key="index"
                    :id="`t-${index}`"
                    :class="!item ? { 'is-null-item': true } : { item: true }"
                    v-on="
                        !item
                            ? {}
                            : {
                                  mousedown: selectItem,
                                  mouseenter: (e) => selectItemInfo(e, item),
                                  mouseleave: clearItemInfo,
                              }
                    "
                >
                    <template v-if="item">
                        <div class="icon no-pointer">
                            <img :src="ResolvePath(`../../assets/icons/${item.icon}.png`)" />
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
            <!-- Weight Display -->
            <h4 class="white--text boldest overline weight-holder" v-if="getCurrentWeight() >= 1">
                {{ locales.LABEL_WEIGHT }} | {{ getCurrentWeight() }}{{ unitSuffix }}
            </h4>
            <!-- Notification Display -->
            <div class="notifications" v-if="notifications && notifications.length >= 1">
                <div v-for="(entry, index) in notifications" :key="index" class="notification">
                    {{ entry }}
                </div>
            </div>
            <!-- Drop Item Display -->
            <div class="drop-box-container">
                <div class="drop-box grey--text text--lighten-2 overline boldest" id="g-0">
                    {{ locales.LABEL_DROP_ITEM }}
                </div>
            </div>
        </div>
        <div class="spacer">&nbsp;</div>
        <div class="inventory">
            <div class="inventory-grid">
                <div
                    v-for="(item, index) in inventory"
                    :id="`i-${index}`"
                    :key="index"
                    :class="getItemClass(item, index, inventorySize)"
                    v-on="
                        !item
                            ? {}
                            : {
                                  mousedown: selectItem,
                                  mouseenter: (e) => selectItemInfo(e, item),
                                  mouseleave: clearItemInfo,
                              }
                    "
                >
                    <template v-if="item">
                        <div class="icon">
                            <img :src="ResolvePath(`../../assets/icons/${item.icon}.png`)" />
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
import Button from '../../components/Button.vue';
import Icon from '../../components/Icon.vue';
import Modal from '../../components/Modal.vue';
import Toolbar from '../../components/Toolbar.vue';
import Frame from '../../components/Frame.vue';
import RangeInput from '../../components/RangeInput.vue';
import Module from '../../components/Module.vue';
import ResolvePath from '../../utility/pathResolver';

// Very Important! The name of the component must match the file name.
// Don't forget to do this. This is a note so you don't forget.
const ComponentName = 'Inventory';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Frame,
        Icon,
        Modal,
        Module,
        RangeInput,
        Toolbar,
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
            dragAndDrop: {
                shiftX: null,
                shiftY: null,
                clonedElement: null,
                itemIndex: null,
                selectedElement: null,
            },
            // Default Configuration(s) for Previews
            inventorySize: 27,
            equipmentSize: 12,
            toolbarSize: 4,
            // Data to use for display
            inventory: [],
            equipment: [],
            toolbar: [],
            // Default weight unit suffix.
            unitSuffix: 'u',
            // Notification Data
            notifications: [],
            // Rarity Color Information
            rarity: {
                0: 'grey--text text--lighten-2',
                1: 'grey--text text--lighten-4',
                2: 'green--text text--lighten-2',
                3: 'blue--text text--lighten-2',
                4: 'purple--text text--lighten-2',
                5: 'orange--text text--lighten-2',
                6: 'red--text text--lighten-2',
            },
            itemInfo: null,
            locales: DefaultLocales,
            // Split Information
            split: null,
            splitAmount: 0,
        };
    },
    // Used to define functions you can call with 'this.x'
    methods: {
        ResolvePath,
        setIncrementAmount(e, amount) {
            // Clicked a button
            if (!e) {
                if (amount <= -1 && this.splitAmount - 1 >= 1) {
                    this.splitAmount -= 1;
                    return;
                }

                if (amount >= 1 && this.splitAmount + 1 <= this.split.item.quantity - 1) {
                    this.splitAmount += 1;
                    return;
                }
                return;
            }

            const value = parseFloat(e.target['value']);
            this.splitAmount = value;
        },
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
        cancelSplitStack() {
            this.split = null;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        splitStack() {
            let amount = parseFloat(this.splitAmount);

            if (isNaN(amount)) {
                this.split = null;
                return;
            }

            if (this.splitAmount > this.split.item.quantity) {
                return;
            }

            if ('alt' in window) {
                alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
                alt.emit(`${ComponentName}:Split`, this.split.slot, this.splitAmount);
            }

            this.splitAmount = 1;
            this.split = null;
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
        updateInventory(items: Array<{ slot: number }>, size = 27) {
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
        selectItemInfo(e, item: any) {
            if (this.dragging) {
                return;
            }

            if (!e || !e.target || !e.target.id) {
                return;
            }

            this.itemInfo = item;
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

            if (e.target && e.target.id === 'drop-slot') {
                const event = new CustomEvent('drop-slot', { detail: this.dragAndDrop.itemIndex });
                document.dispatchEvent(event);
                return;
            }

            if (!e || !e.target || !e.target.id || e.target.id === '') {
                return;
            }

            let endSlot = e.target.id;
            const selectedSlot = this.dragAndDrop.itemIndex;

            const endElement = document.getElementById(endSlot);
            const isTab = endElement.id.includes('tab');

            // const isGroundItem = this.dragAndDrop.itemIndex.includes('g-');
            const isNullEndSlot = endElement.classList.contains('is-null-item');
            const isDropBox = endElement.classList.contains('drop-box');
            const isInventoryEndSlot = !endElement.id.includes('i-');
            const isSameSlot = selectedSlot === endSlot;

            // Check to make sure ground items are only being moved into the inventory slots.
            if (!isTab && !isDropBox && !isNullEndSlot && !isInventoryEndSlot && isSameSlot) {
                return;
            }

            // Force Drop Box to Ground Slot
            if (isDropBox) {
                endSlot = 'g-0';
            }

            const hash = selectElement.dataset.hash ? `${selectElement.dataset.hash}` : null;

            if ('alt' in window) {
                alt.emit(`${ComponentName}:Process`, selectedSlot, endSlot, hash);
            }

            if (!isTab && !isDropBox) {
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
    computed: {
        getHoveredItemStats() {
            return Object.keys(this.itemInfo.data).map((key) => {
                if (key === 'event') {
                    return { key: 'consumeable', value: true };
                }

                return { key, value: this.itemInfo.data[key] };
            });
        },
        getClassRarity() {
            if (this.itemInfo.rarity === undefined || this.itemInfo.rarity === null) {
                return {};
            }

            if (!this.rarity[this.itemInfo.rarity]) {
                return {};
            }

            return { [this.rarity[this.itemInfo.rarity]]: true };
        },
    },
    // Called when the page is loaded.
    mounted() {
        if (!('alt' in window)) {
            // Normal equipment is 11. 12 is to make it even.
            this.equipment = new Array(12).fill(null);
            this.inventory = new Array(27).fill(null);
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
                    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a luctus nunc, ut dapibus odio. Integer venenatis libero rutrum ante sodales, nec eleifend augue aliquam.`,
                    icon: 'crate',
                    slot: Math.floor(Math.random() * 27),
                    quantity: 1,
                    weight: Math.floor(Math.random() * 5),
                    rarity: Math.floor(Math.random() * 6),
                    data: {
                        weight: 1,
                    },
                },
                {
                    name: `Box`,
                    uuid: `some_hash_thing_ground`,
                    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a luctus nunc, ut dapibus odio. Integer venenatis libero rutrum ante sodales, nec eleifend augue aliquam.`,
                    icon: 'crate',
                    slot: Math.floor(Math.random() * 27),
                    behavior: 151,
                    quantity: 4,
                    weight: Math.floor(Math.random() * 5),
                    rarity: Math.floor(Math.random() * 6),
                    data: {
                        weight: 1,
                        reallyLongText:
                            'kl;fdj;klsajfkl;dasjf;klsjfkl;sajl;kfjs;klfewj;klfwjkal;fjwe;klfajwkl;fwejal;kfweaj',
                    },
                },
                {
                    name: `Box`,
                    uuid: `some_hash_thing_ground`,
                    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a luctus nunc, ut dapibus odio. Integer venenatis libero rutrum ante sodales, nec eleifend augue aliquam.`,
                    icon: 'crate',
                    slot: Math.floor(Math.random() * 27),
                    quantity: 2,
                    behavior: 151,
                    weight: Math.floor(Math.random() * 5),
                    rarity: Math.floor(Math.random() * 6),
                    data: {
                        weight: 1,
                        reallyLongText:
                            'kl;fdj;klsajfkl;dasjf;klsjfkl;sajl;kfjs;klfewj;klfwjkal;fjwe;klfajwkl;fwejal;kfweaj',
                    },
                },
                {
                    name: `Box`,
                    uuid: `some_hash_thing_ground`,
                    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a luctus nunc, ut dapibus odio. Integer venenatis libero rutrum ante sodales, nec eleifend augue aliquam.`,
                    icon: 'crate',
                    slot: Math.floor(Math.random() * 27),
                    quantity: 1,
                    weight: Math.floor(Math.random() * 5),
                    rarity: Math.floor(Math.random() * 6),
                    data: {
                        weight: 1,
                        event: 'wahtever',
                        reallyLongText:
                            'kl;fdj;klsajfkl;dasjf;klsjfkl;sajl;kfjs;klfewj;klfwjkal;fjwe;klfajwkl;fwejal;kfweaj',
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
        document.removeEventListener('mouseover', this.mouseOver);
        document.removeEventListener('mouseup', this.dropItem);
        document.removeEventListener('mousemove', this.updatePosition);

        // Unbind Events from the Mounted Function
        if ('alt' in window) {
            alt.off(`${ComponentName}:Toolbar`, this.updateToolbar);
            alt.off(`${ComponentName}:Inventory`, this.updateInventory);
            alt.off(`${ComponentName}:Equipment`, this.updateEquipment);
            alt.off(`${ComponentName}:DisablePreview`, this.setPreviewDisabled);
            alt.off(`${ComponentName}:SetLocales`, this.setLocales);
            alt.off(`${ComponentName}:AddNotification`, this.addNotification);
        }

        if (this.clonedElement) {
            this.clonedElement.remove();
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
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    align-self: flex-start;
    flex-direction: column;
    padding: 12px;
}

.equipment {
    height: 100vh;
    min-width: 350px;
    max-width: 350px !important;
}

.inside-split {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    max-height: calc(100vh - 24px) !important;
}

.stats-wrapper {
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
    box-sizing: border-box;
    height: 100%;
}

.stats-wrapper .stats-bg {
    border: 2px solid rgba(0, 0, 0, 0.3);
    background: rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    align-self: flex-end;
    width: 100%;
    padding: 5px !important;
}

.stats-wrapper .stats-bg .stats {
    display: flex;
    padding: 5px !important;
    box-sizing: border-box;
    width: 100%;
    flex-direction: column;
    border: 2px solid rgba(0, 0, 0, 0.5);
    background: rgba(0, 0, 0, 0.75);
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    max-width: 350px !important;
    overflow: hidden;
}

.key-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-bottom: 6px;
    margin-top: 3px;
    padding-top: 3px;
    border-top: 2px solid rgba(0, 0, 0, 0.2);
    overflow-wrap: break-word;
    word-wrap: break-word;
    height: auto;
    max-width: 350px !important;
}

.key-group span {
    font-size: 10px !important;
}

.character {
    min-width: 50vw;
    max-width: 50vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    align-self: flex-start;
    flex-direction: column;
    padding: 12px;
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
    max-height: calc(100vh - 24px) !important;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 5px !important;
    box-sizing: border-box;
    border: 2px solid rgba(0, 0, 0, 0.3);
    background: rgba(0, 0, 0, 0.3);
    align-self: flex-end;
}

.equipment-grid {
    align-self: flex-start;
    width: 100%;
    grid-template-columns: repeat(3, auto);
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
    min-width: 10vh;
}

.item:hover {
    background: rgba(0, 0, 0, 0.85);
}

.item .icon {
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

.item .icon img {
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
    min-width: 10vh;
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
    min-width: 10vh;
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

.item-name,
.item-quantity {
    font-size: 14px;
}

.item-desc {
    font-size: 12px !important;
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

.drop-box-container {
    display: flex;
    width: 100%;
    height: 100%;
    flex-grow: 1;
    flex-direction: column;
    justify-content: flex-end;
}

.drop-box-container .drop-box {
    display: flex;
    border: 2px dashed rgba(0, 0, 0, 0.5);
    background: rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    align-self: flex-end;
    width: 100%;
    height: 10vh;
    text-align: center;
    justify-items: center;
    justify-content: center;
    align-content: center;
    align-items: center;
    z-index: 98;
}

.drop-box-container .drop-box:hover {
    border-color: red !important;
    background: rgba(255, 0, 0, 0.5) !important;
}

.spacer {
    flex-grow: 1 !important;
    width: 100%;
}

.split {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    box-sizing: border-box;
}

.button {
    position: relative;
}
</style>
