<template>
    <div class="shopContainer" id="Mainbody" style="width: 50%; height: 75%">
        <div class="shopBackground">
            <div class="shopWrapper">
                <div class="shopItem" v-for="(shopItem, index) in filteredItems" :key="index">
                    <div class="item" v-if="ShopSystem.ShopItems">
                        <div class="image">
                            <img :src="ResolvePath(`../../assets/icons/${shopItem.image}.png`)" id="Images" />
                        </div>
                        <div class="descriptions">
                            <span>{{ shopItem.name }}</span
                            ><br /><br /><br />
                        </div>
                        <div class="inputButtons">
                            <span>{{ addCommas(shopItem.price) }}$</span><br /><br />
                            <input
                                type="number"
                                placeholder="1"
                                v-model="selectedAmount[index]"
                                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength); if(this.value < 0) this.value = 1;"
                                maxlength="3"
                            />
                            <Button
                                class="btn-grad"
                                :color="buttonColor"
                                :flatten="false"
                                :padding="2"
                                @click="buyShopItem(index)"
                                >{{ buttonText }}</Button
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="decoration" style="position: relative">
            <div class="logo"></div>
            <div class="search-bar">
                <input type="text" v-model="search" placeholder="" required />
                <div class="search-icon"></div>
            </div>
            <Button color="red" class="btn-close" @click="closePage()">Close</Button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '../../components/Button.vue';
import Frame from '../../components/Frame.vue';
import Icon from '../../components/Icon.vue';
import Input from '../../components/Input.vue';
import Modal from '../../components/Modal.vue';
import Module from '../../components/Module.vue';
import RangeInput from '../../components/RangeInput.vue';
import Toolbar from '../../components/Toolbar.vue';
import ResolvePath from '../../utility/pathResolver';
// DEBUGGING
/*
const SHOP = [
    { name: 'Northern Haze Seeds', dbName: 'Northern Haze Seeds', price: 250, image: 'burger' },
    { name: 'Bread', dbName: 'Bread', price: 350, image: 'bread' },
    { name: 'Burger', dbName: 'burger', price: 450, image: 'burger' },
    { name: 'Bread', price: 550, image: 'bread' },
    { name: 'Burger', price: 650, image: 'burger' },
    { name: 'Bread', price: 750, image: 'bread' },
    { name: 'Bread', price: 750, image: 'bread' },
    { name: 'Bread', price: 750, image: 'bread' },
    { name: 'Bread', price: 750, image: 'bread' },
    { name: 'Bread', price: 750, image: 'bread' },
    { name: 'Bread', price: 750, image: 'bread' },
    { name: 'Bread', price: 750, image: 'bread' },
];
*/
// Very Important! The name of the component must match the file name.
// Don't forget to do this. This is a note so you don't forget.
const ComponentName = 'ShopUI';
export default defineComponent({
    name: ComponentName,
    // Used to add Custom Components
    components: {
        Button,
        Frame,
        Icon,
        Input,
        Modal,
        Module,
        RangeInput,
        Toolbar,
    },
    // Used to define state
    data() {
        return {
            shopType: 'buy',
            buttonText: 'Buy me!',
            buttonColor: 'green',
            search: '',
            selectedAmount: [],
            keyword: '',
            shopLogo: './osslogo.png',
            ShopSystem: {
                ShopItems: [],
            },
        };
    },
    // Called when the page is loaded.
    mounted() {
        // Bind Events to Methods
        // this.fillShopItems(SHOP); // Debugging Purpose
        if ('alt' in window) {
            alt.emit(`${ComponentName}:Ready`);
            alt.on(`${ComponentName}:Vue:SetItems`, this.fillShopItems);
        }
        // Add Keybinds for In-Menu
        document.addEventListener('keyup', this.handleKeyPress);
    },
    // Called when the page is unloaded.
    unmounted() {
        // Make sure to turn off any document events as well.
        // Only if they are present of course.
        // Example:
        // document.removeEventListener('mousemove', this.someFunction)
        if ('alt' in window) {
            alt.off(`${ComponentName}:Close`, this.close);
            alt.off(`${ComponentName}:Vue:SetItems`, this.fillShopItems);
        }
        // Remove Keybinds for In-Menu
        document.removeEventListener('keyup', this.handleKeyPress);
    },
    computed: {
        filteredItems() {
            return this.ShopSystem.ShopItems.filter((ShopItem) =>
                ShopItem.name.toLowerCase().includes(this.search.toLowerCase()),
            );
        },
        cssVars() {
            return {
                /* variables you want to pass to css */
                '--img': this.shopLogo,
            };
        },
    },
    // Used to define functions you can call with 'this.x'
    methods: {
        addCommas(nStr: string) {
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + '.' + '$2');
            }
            return x1 + x2;
        },
        handleKeyPress(e) {
            // Escape Key
            if (e.keyCode === 27 && 'alt' in window) {
                alt.emit(`${ComponentName}:Close`);
            }
        },
        fillShopItems(shopItems: Array<String | number>[], type: string) {
            const shopSystem = { ...this.ShopSystem };
            this.ShopSystem = shopSystem;
            //shopSystem.ShopItems = SHOP; // Debugging Purpose
            shopSystem.ShopItems = shopItems;
            if (type === 'sell') {
                this.buttonText = 'Sell';
                this.buttonColor = 'red';
                this.shopType = 'sell';
            } else if (type === 'buy') {
                this.buttonText = 'Buy me!';
                this.buttonColor = 'green';
                this.shopType = 'buy';
            }
            return;
        },
        // ShopItem
        buyShopItem(index: number) {
            const shopSystem = { ...this.ShopSystem };
            this.ShopSystem = shopSystem;
            if (
                this.selectedAmount[index] === null ||
                this.selectedAmount[index] === undefined ||
                this.selectedAmount[index] < 1
            )
                this.selectedAmount[index] = 1;
            console.log(JSON.stringify(shopSystem.ShopItems[0]));
            console.log(index, this.selectedAmount[index]);
            alt.emit(
                `${ComponentName}:Client:HandleShop`,
                shopSystem.ShopItems[index],
                this.selectedAmount[index],
                this.shopType,
            );
            return;
        },
        closePage() {
            if ('alt' in window) {
                alt.emit(`${ComponentName}:Vue:CloseShop`);
            }
        },
        ResolvePath,
    },
});
</script>

<style scoped>
/* SHOPWRAPPER - DO NOT MODIFY */
.shopWrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.shopContainer {
    width: 60vw;
    padding: 0px;
    height: auto;
}

.shopItem {
    position: relative;
    color: white;
    user-select: none;
    height: auto;
    margin-bottom: 10px;
}

.shopItem .item {
    color: white;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif,
        'Helvetica Neue', sans-serif;
    font-weight: 700;
    font-weight: none;
    font-size: 1em;
    background: rgb(0, 0, 0);
    border: 2px outset rgb(65, 154, 196);
    border-top-left-radius: 10%;
    border-bottom-right-radius: 10%;
    padding-bottom: 10%;
    margin-top: 10%;
    margin-left: 10%;
    margin-right: 10%;
}

.shopItem .image {
    max-height: 150px;
}

.shopItem .descriptions {
    position: relative;
    margin-top: 1.5vh;
    text-overflow: ellipsis;
    word-wrap: break-word;
    overflow: hidden;
    max-height: 4.4em;
    line-height: 1.4em;
    text-align: center;
    padding-left: 5%;
    padding-right: 5%;
}

.shopBackground {
    position: absolute;
    background: rgba(0, 0, 0, 0.95);
    left: 10vw;
    top: 10vh;
    height: 80vh;
    width: 50vw;
    text-align: center;
    user-select: none;
    margin: 0 auto;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    overflow-y: scroll;
    overflow-x: hidden;
}

#Images {
    width: 64px;
    height: 64px;
    max-height: 128px;
    padding-top: 20px;
}

.decoration {
    width: 15vw;
    height: 75vh;
    background: linear-gradient(180deg, rgba(35, 39, 42, 1) 0%, rgba(44, 47, 51, 0.7511379551820728) 100%),
        url('shopUI.jpg');
    float: right;
    background-size: cover;
    background-position: center;
    padding-top: 0;
}

.decoration input {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    color: white;
    font-size: 1.5em;
    font-weight: bold;
    text-align: center;
    outline: none;
}

.logo {
    margin-left: 10%;
    width: 80%;
    height: auto;
    min-height: 222px;
    background: url('./osslogo.png') no-repeat;
    background-size: contain;
    margin-top: 10%;
}

.shopItem input {
    background-color: rgba(0, 108, 180, 0.788);
    width: 80%;
    max-width: 80%;
    color: white;
    widows: 100%;
    text-align: center;
    user-select: none;
    height: 2.2vh;
    border: 0px;
    border-radius: 5px;
    border-color: white;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif,
        'Helvetica Neue', sans-serif;
    font-size: 1.1em;
    font-weight: bolder;
    margin-bottom: 1vh;
}
.inputButtons {
    position: relative;
    top: -0.5vh;
    align-items: center;
}
.buyButton {
    border-radius: 5px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif,
        'Helvetica Neue', sans-serif;
}

.btn-grad {
    width: 75%;
    left: 12.5%;
}
.btn-grad {
    margin-top: 5%;
    padding: 25px 45px;
    text-align: center;
    text-transform: uppercase;
    transition: 0.5s;
    background-size: 100% auto;
    background: rgb(0, 0, 0);
    border: 1px solid rgb(20, 171, 218);
    border-left: 0px;
    border-right: 0px;
    border-radius:50px;
}

.btn-grad:hover {
    background-position: right center; /* change the direction of the change here */
    color: #fff;
    text-decoration: none;
}

.btn-close {
    max-width: 15vw;
    float: right;
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.75);
    border: 0px;
    width: 100%;
}

/* width */
::-webkit-scrollbar {
    width: 10px;
    border-radius: 25px;
}

/* Track */
::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.35);
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: rgba(255, 0, 0, 0.35);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 0, 0, 0.35);
}
::placeholder {
    color: rgba(255, 255, 255, 0.363);
    opacity: 1;
}
.search-bar {
    height: auto;
    width: auto;
    position: absolute;
    display: inline-block;
    margin-top: 50px;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
}
.search-bar input {
    height: 44px;
    width: 44px;
    padding: 10px 20px;
    box-sizing: border-box;
    font-size: 18px;
    border: 2px solid transparent;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 100;
    background-color: transparent;
    transition: all 0.5s ease-out;
    color: transparent;
}
.search-bar input::-moz-placeholder {
    color: transparent;
}
.search-bar input:-ms-input-placeholder {
    color: transparent;
}
.search-bar input::placeholder {
    color: transparent;
}
.search-bar input:invalid {
    box-shadow: none;
}
.search-bar input:hover {
    border: 2px solid #fff;
}
.search-bar input:focus,
.search-bar input:valid {
    width: 12vw;
    border: 2px solid rgb(0, 0, 0);
    outline: none;
    cursor: auto;
    background-color: rgba(0, 0, 0, 0.548);
    color: white;
}
.search-bar input:focus::-moz-placeholder,
.search-bar input:valid::-moz-placeholder {
    color: #999;
}
.search-bar input:focus:-ms-input-placeholder,
.search-bar input:valid:-ms-input-placeholder {
    color: #999;
}
.search-bar input:focus::placeholder,
.search-bar input:valid::placeholder {
    color: #999;
}
.search-bar input:focus + .search-icon,
.search-bar input:valid + .search-icon {
    z-index: 0;
    border-color: #ccc;
    right: 20px;
}
.search-bar input:focus + .search-icon:after,
.search-bar input:valid + .search-icon:after {
    background-color: #ccc;
}

.search-icon {
    display: inline-block;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    border: 2px solid #fff;
    position: absolute;
    right: 12px;
    top: 8px;
    z-index: -1;
}
.search-icon:after {
    content: '';
    position: absolute;
    top: 19.07px;
    left: 17.07px;
    transform: rotate(45deg);
    height: 2px;
    width: 10px;
    background-color: #fff;
    border-radius: 10px;
}
</style>
