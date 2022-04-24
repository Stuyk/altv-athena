# Contributing

## Prerequisites

Before contributing to the Athena Framework there are a few requirements which are **REQUIRED** before making pull requests.

### Use VSCode

This repository currently uses VSCode as the main IDE. If you are using WebStorm you are reponsible for making `Prettier` work with it.

### Install Prettier

Prettier is a code formatter and the entire repository uses it.

[![](https://i.imgur.com/kSv5ure.png)](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

After installation make sure to turn on `Format on Save`.

`File > Preferences > Settings`

![](https://i.imgur.com/gspTN2k.png)

Now when you are contributing code it will format it like **EVERYONE ELSES** code.

## What to Contribute?

Athena is working towards being a 'core' framework. This means that anything that is contributed that does not bring value to other developers will not be accepted. Do not waste your time writing anything that cannot be re-used by other developers.

Here are some examples of what you shouldn't write and what you should write instead.

- Instead of LSPD you write an entire Faction System to handle ALL factions.
- Instead of making one dumpster diveable you write a way for all objects to be interacted with.
- Instead of making one vending machine function, make them all function. 
  - Make them removeable. 
  - Make them have different inventories.

Contributing to Athena is about bringing value to developers that cannot otherwise write complex systems.

Obviously, we take fixes for bugs or slight changes to existing features as long as they are backwards compatible.

## How to Create a Pull Request

All pull requests should be built off of the latest developer version. There is usually an open `Tracking PR` to determine what version to use.

When your code is ready you can create a PR to merge into the `Tracking PR`.

We **WILL NOT** take pull requests based off the `master` branch.
