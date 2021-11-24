---
description: This will tell you how to setup a private mirror of Athena.
---

# Updating Athena

# Table of Contents

- [Updating Athena](#updating-athena)
- [Table of Contents](#table-of-contents)
  - [Migrating from 2.0.3 to Latest](#migrating-from-203-to-latest)
  - [Why Update?](#why-update)
  - [Updating and Storing Changes](#updating-and-storing-changes)
  - [Merge Conflicts?!](#merge-conflicts)
  - [Pushing Changes to Private Repository](#pushing-changes-to-private-repository)

## Migrating from 2.0.3 to Latest

Ensure you have NodeJS 16+ installed. Remove your `node_modules` and your `package-lock.json` and perform `npm install` to update all dependencies.

## Why Update?

Want to know why you should update and keep up with updates for Athena? Solely because as Athena goes through refactors and changes it also gets performance increases and bug fixes.

When you **do not update** you are going to eventually soft-lock your software when major changes have to be done to fix bugs that are not discovered until larger player bases have tested the gamemode. 

It is highly recommended that you **always update** as soon as possible. Staying on older iteration(s) of Athena does not guarentee support for you in the future.

**Some of you are going to literally ignore what I'm saying here and will never update. I'm not going to help you if you're not willing to learn the methods used to update. Learn it or lose it.**

## Updating and Storing Changes

Instead of being super ineffecient and merging files in one at a time, you're going to be using git to pull down changes. Which does things mostly automatically.

Here are some notes before you perform these actions **\(SUPER IMPORTANT\)**:

* Close All Open Files
* Push All Current Change to Private Repository
* Create a backup of your current folder
* Run the two commands below.

```bash
git fetch upstream
git pull upstream master
```

If you run into merge conflicts... see the video below. It will help you understand what needs to be done to resolve merge conflicts.

## Merge Conflicts?!

Don't worry I made a simple video to help explain merge conflicts. Check out this video:

[![Resolving Merge Conflicts](https://img.youtube.com/vi/sc_vo30hu_M/0.jpg)](https://www.youtube.com/watch?v=sc_vo30hu_M)

Merge conflicts only occur when you are pulling in new data from an existing repository. This means that it found similar code but isn't sure if you want to override your current code or mix the two. A merge conflict can easily be seen inside vscode when pulling down from the upstream.

## Pushing Changes to Private Repository

If you make changes in your private clone. You can now simply push to the private repository and pull it down anywhere. Which is really great.

Here's how you can push changes.

```bash
git add .
git commit -m "What did I commit to the repo"
git push origin master
```


