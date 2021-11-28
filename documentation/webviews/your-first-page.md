# Your First Page

Writing your first page can be a bit confusing but this tutorial should cover the very basics of your page. 

- [Your First Page](#your-first-page)
  - [Copy the Template](#copy-the-template)
  - [Rename the Template](#rename-the-template)
  - [Open Template.vue](#open-templatevue)
  - [Rename Template.vue](#rename-templatevue)
  - [Adding the Page](#adding-the-page)
  - [Writing the HTML](#writing-the-html)
  - [Creating Clickable Things](#creating-clickable-things)
  - [How to Send Events](#how-to-send-events)
  - [How to Receive Events](#how-to-receive-events)
  - [How to Setup the Page for Client](#how-to-setup-the-page-for-client)
  - [Setting up the Copied View Template](#setting-up-the-copied-view-template)

## Copy the Template

Let's start off by navigating to the following directory:

```
src-webviews/src/pages/template
```

Copy this folder and paste it in `pages`.

This can be done by right-clicking the `template` folder and selecting copy. Then right-click on `pages` and select paste.

_You may need to shut down `npm run vue-dev` to get this to work as well as the server._

## Rename the Template

After copying the template you should see something like... `template copy` as a folder. You should rename this to whatever you want your folder to be named. In this example our folder name will be `test`.

![](https://i.imgur.com/oVSwOA8.png)

## Open Template.vue

Inside of `Template.vue` we are going to change the contents of one variable **immediately**. We're going to change the ComponentName.

**Before**
```ts
const ComponentName = 'Template';
```

**After**
```ts
const ComponentName = 'Test';
```

## Rename Template.vue

Now we are going to rename `Template.vue` to the same name as our folder but we are going to ensure that the **First Letter is Capitalized**.

**Before**

![](https://i.imgur.com/c4qrEYy.png)

**After**

![](https://i.imgur.com/MPmUd7F.png)

## Adding the Page

Vite has no idea your page exists at this point. We're going to ensure that Vite sees it now.

This step is probably the most confusing but it only requires modifying one file. I've tried to simplify this as much as possible but hopefully it's enough to understand. This is the equivalent of importing a file in TypeScript.

Open the following file:

```
src-webviews/src/pages/components.ts
```

Inside you should see something like this...

![](https://i.imgur.com/KfokYwr.png)

This is where we are going to import our new page and append it to the `componentList` object.

Let's import your `test` folder and `Test.vue` page.

```ts
import Test from './test/Test.vue';
```

Then we append it to your componentList.

```ts
const componentList = {
    Atm: shallowRef(Atm),
    CharacterCreator: shallowRef(CharacterCreator),
    CharacterSelect: shallowRef(CharacterSelect),
    Clothing: shallowRef(Clothing),
    Designs: shallowRef(Designs),
    Garage: shallowRef(Garage),
    InputBox: shallowRef(InputBox),
    Inventory: shallowRef(Inventory),
    Login: shallowRef(Login),
    Storage: shallowRef(Storage),
    Test: shallowRef(Test)
};
```

That's all we need to do to add the custom page. We can now run `npm run vue-dev` to see our page in the browser.

![](https://i.imgur.com/rO48CEH.png)

_If `vue-dev` was already running just `refresh` the browser._

## Writing the HTML

The page automatically comes with a handful of comments built-in. A Vue page is split into three sections though. The top section with `<template></template>` is for writing your HTML.

However, the caveat with this is that you must always have **only 1 `<div>` element** immediately inside of `<template>`. Check the examples below for more information.

**Invalid**

```html
<template>
    <div class="header"></div>
    <div class="footer"></div>
</template>
```

_This is **not correct.** Do not do this._

**Valid**

```html
<template>
    <div class="wrapper">
        <div class="header"></div>
        <div class="footer"></div>
    </div>
</template>
```

_This is correct. Do this._

## Creating Clickable Things

By default Athena comes with its very own custom css and built-in components. The template should have automatically imported Components that you can use anywhere inside of your page.

It's best to look at the other Pages to see how Components are used.

Here's how to create a button.

```html
<template>
    <div class="wrapper">
        <Button color="blue">
            Hello World
        </Button>
    </div>
</template>
```

After saving the page you should see something like this...

![](https://i.imgur.com/LYTmsKH.png)

Now we can make the button clickable by adding the attribute `@click="someMethodName"`.

```html
<template>
    <div class="wrapper" @click="someMethodName">
        <Button color="blue">
            Hello World
        </Button>
    </div>
</template>
```

Now we just need to add the `method` called `someMethodName` so in your Vue template scroll down until you find `methods: {` inside the Vue Component.

![](https://i.imgur.com/kdGaE1i.png)

We are going to create a custom function inside of it.

```ts
data() {
    return {
        increment = 0;
    }
},
methods: {
    someMethodName() {
        this.increment += 1;
    }
},
```

Now we can refresh the page to get the method to be recongized. When you click the button `nothing will happen or display` so let's display our increment in the HTML.

```html
<template>
    <div class="wrapper" @click="someMethodName">
        <span class="green--text">{{ increment }}</span>
        <Button color="blue" class="mt-4">
            Add
        </Button>
    </div>
</template>
```

As we continue to press the button the value of `increment` will increase.

![](https://thumbs.gfycat.com/WholeUnlinedHoneyeater-size_restricted.gif)

## How to Send Events

To send an event to the `client` we use the following template inside of a method.

```ts
if ('alt' in window) {
    alt.emit('helloFromWebView');
}
```

We can send additional arguments along with the event.

```ts
if ('alt' in window) {
    alt.emit('helloFromWebView', arg1, arg2, arg3);
}
```

## How to Receive Events

Receiving events should be done inside of the `mounted()` function in the Vue Template. What we need to do is bind an event name to a method.

```ts
data() {
    return {
        first: '',
        last: ''
    }
},
mounted() {
    if ('alt' in window) {
        // 1. This event is called from client-side
        alt.on('setName', this.doSomething);
    }
},
unmounted() {
    if ('alt' in window) {
        alt.off('setName', this.doSomething);
    }
}
methods: {
    // 2. Which triggers this method.
    doSomething(firstName: string, lastName: string) {
        // 3. Which sets these values in our state.
        this.first = firstName;
        this.last = lastName;

        // 4. We can then access {{ first }} and {{ last }}
        // inside of our HTML and inside of our methods.
        this.saySomething();
    },
    saySomething() {
        console.log(`You updated First Name to: ${this.first}`)
    }
}
```

## How to Setup the Page for Client

The final step in our test page is to get it working in-game. Which can be done by copying the template from the following path:

```
src/core/client/views/template.ts
```

You should copy this file and `rename it` to anything you want. You can move it to `client-plugins` or just keep it in the same folder. However, moving it out of the directory will mean you will need to update the `imports at the top of the file` according to your folder structure.

That being said make sure you **IMPORT THIS FILE** somewhere so that client-side recognizes it. This is something you do by doing basic TypeScript or JavaScript.

Look at `src/core/client/startup.ts` for more information.

## Setting up the Copied View Template

Change the following variable inside your copied `template.ts`.

```ts
const PAGE_NAME = 'Template';
```

Make this match what your Vue `ComponentName` was set to. In the example above it was `Test`.

Read through the comments in the template to get a better understanding of what is going on inside.

As always you can look at the other pages to get general information about how things are done.

**The template does not include a way to open it. If you want a way to quickly test it. Create a command on `server-side` that emits a `client-side` event that calls the `TemplateView.open` function.

**Good Luck!**
