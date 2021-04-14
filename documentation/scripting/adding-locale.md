---
description: >-
    Learn how to add your own language to the locale system.
---

# Creating Locale for Your Language

Start by creating a copy of `en.ts` from the `src/core/shared/locale/languages` folder and name it any `ISO-639-1` two letter code.
It needs to be a `TypeScript` file.

Example for English is: `en`
Example for Deutsch is: `de`
Example for Español is: `es`
Example for русский is: `ru`

Inside the file you have just created you will have English examples. Translate them.

Variable placeholders are written with: _%_
Variables will be replaced at runtime.

Locales must be written and present at the time of bootup.

`setLanguage` function must be used on `client-side` in order to change the language to your respective `ISO-639-1` two letter code.

## Importing into Locales

Inside of `locale.ts` in the `src/core/shared/locale` folder you'll find a bit of code for `locales`.

```ts
const locales: LocaleFormat = {
    en
    // Additional languages can be added here...
};
```

You need to import your locale. Here is how I would import a Deutsch locale.

```ts
import de from './languages/de'; // Importing the English Locale

const locales: LocaleFormat = {
    en,
    de
    // Additional languages can be added here...
};
```

Hope it's nice and easy to understand!
