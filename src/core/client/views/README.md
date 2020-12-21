# Theme Information

General style guides to help recreate the following panel style:

![](https://i.imgur.com/7PQDa4N.png)

## Vue, Vuetify, LESS Setup in HTML

```html
<!DOCTYPE html>
    <head>
        <title><X> by <Y></title>
        <link rel="stylesheet" type="text/css" href="../../css/materialdesignicons.min.css" />
        <link rel="stylesheet" type="text/css" href="../../css/vuetify.min.css" />
        <link rel="stylesheet/less" type="text/css" href="./style.less" />
        <link rel="stylesheet" type="text/css" href="../../fontawesome/css/all.min.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
    </head>
    <body>
        <div id="app">
            <v-app>
                <v-container class="panel fill-height">
                    <v-sheet class="d-flex flex-column elevation-5 pa-3 rounded-lg" rounded block>
                    
                    </v-sheet>
                </v-container>
            </v-app>
        </div>
        <script src="../../js/vue.min.js"></script>
        <script src="../../js/vuetify.js"></script>
        <script src="../../js/less.min.js"></script>
        <script src="../../js/gsap.min.js"></script>
        <script src="./app.js" type="text/javascript"></script>
    </body>
</html>
```

## Vuetify Setup in app.js

```js
const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: {dark: true }}),
    data() {
        return {
            whatever: [],
            index: 0
        };
    }
});
```


## Buttons

### Type: Navigation / Pages

![](https://i.imgur.com/xdh2Gf9.png)

```html
<v-item-group class="navigation d-flex fill-width justify-space-between" block>
    <v-tooltip bottom nudge-bottom="56px">
        <template v-slot:activator="{ on, attrs }">
            <v-btn @click="goBack" class="full flex-grow-1 elevation-0" color="grey lighten-2" outlined text v-bind="attrs" v-on="on" :disabled="!hasCharacters">
                <v-icon small>fa-chevron-left</v-icon>
            </v-btn>
        </template>
        <span>Previous</span>
    </v-tooltip>
    <v-tooltip bottom nudge-bottom="56px">
        <template v-slot:activator="{ on, attrs }">
            <v-btn @click="goNext" class="full flex-grow-1 ml-3 elevation-0" color="grey lighten-2" outlined text v-bind="attrs" v-on="on" :disabled="!hasCharacters">
                <v-icon small>fa-chevron-right</v-icon>
            </v-btn>
        </template>
        <span>Next</span>
    </v-tooltip>
</v-item-group>
```

### Type: Control Group (Add, Delete, Accept, etc.)

![](https://i.imgur.com/Rng2TMD.png)

```html
<v-item-group class="selection d-flex fill-width justify-space-between" block>
    <v-tooltip bottom nudge-bottom="8px" color="blue lighten-2">
        <template v-slot:activator="{ on, attrs }">
            <v-btn @click="newCharacter" class="full flex-grow-1 mt-3 elevation-0" color="blue ligten-2" outlined text v-bind="attrs" v-on="on">
                <v-icon small>fa-plus</v-icon>
            </v-btn>
        </template>
        <span>Add New Character</span>
    </v-tooltip>
    <v-tooltip bottom nudge-bottom="8px" color="red lighten-1">
        <template v-slot:activator="{ on, attrs }">
            <v-btn @click="deleteCharacter" class="full flex-grow-1 mt-3 ml-3 elevation-0" color="red lighten-1" outlined text v-bind="attrs" v-on="on">
                <v-icon small>fa-close</v-icon>
            </v-btn>
        </template>
        <span>Delete Character</span>
    </v-tooltip>
    <v-tooltip bottom nudge-bottom="8px" color="light-green">
        <template v-slot:activator="{ on, attrs }">
            <v-btn @click="selectCharacter" class="full flex-grow-1 mt-3 ml-3 elevation-0" color="light-green" outlined text v-bind="attrs" v-on="on">
                <v-icon small>fa-check</v-icon>
            </v-btn>
        </template>
        <span>Select Character</span>
    </v-tooltip>
</v-item-group>
```

### Lists

![](https://i.imgur.com/iurXjLQ.png)

```html
<v-list class="options" v-if="characters[0]" dense>
    <v-list-item class="option" v-for="(stat, index) in statNames" :key="index">
        <v-list-item-title class="text-left mr-2">
            {{ stat.varName }}
        </v-list-item-title>
        <v-list-item-subtitle v-if="stat.useAppearance">
            {{ stat.prefix }}{{ characters[0].appearance[stat.varRef] }}{{ stat.suffix }}
        </v-list-item-subtitle>
        <v-list-item-subtitle v-else>
            {{ stat.prefix }}{{ characters[0][stat.varRef] }}{{ stat.suffix }}
        </v-list-item-subtitle>
    </v-list-item>
</v-list>
```

### Headers

![](https://i.imgur.com/qx3AYib.png)

```html
<p class="text-sm-left font-weight-bold mb-0 teal--text text--accent-3 subtitle-2">
    <v-icon x-small class="mr-2 teal--text text--accent-3">fa-user</v-icon>
    Select Character
</p>
```