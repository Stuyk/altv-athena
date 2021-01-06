---
description: >-
    This will tell you how to setup a private mirror of Athena.
---

# Setting Up a Private Mirror Repository

## Why?

Let's talk about why someone would want a setup like this.

-   You are adding your own code base.
-   You want to stay up to date with the main Athena repository.
-   You want to build on top of Athena.
-   You want to be able to merge in new code.
-   You want to be able to handle merge conflicts from the new code.

## Setup

Create a bare clone of the Athena Repository

```sh
git clone https://github.com/Stuyk/altv-athena --bare altv-athena-bare
```

Create a new private repistory on github.
Let's call it altv-athena-private

![](https://i.imgur.com/y1Lxqwn.png)

Copy your URL from github.

![](https://i.imgur.com/Dd7Zrke.png)

Move into the bare directory from your command line tool of choice

```sh
cd altv-athena-bare
```

Mirror the bare repository to your private mirror.

```sh
git push --mirror <your_github_url_here>
```

Delete the bare repository.

```sh
cd ..
rmdir altv-athena-bare
```

Clone the repository down from github.

```sh
git clone <your_github_url_here>
```

Add the upstream of the original athena repository.

```sh
git remote add upstream git@github.com:Stuyk/altv-athena.git
git remote set-url --push upstream DISABLE
```

## Fetching and Updating from Athena

Instead of being an absolute scrub and merging files in one at at ime, you're going to be using git to pull down changes. Which does things mostly automatically.

Here are some notes before you perform these actions **(SUPER IMPORTANT)**:

-   Close All Open Files
-   Push All Current Change to Private Repository
-   Run the two commands below.

```sh
git fetch upstream
git pull upstream master
```

### Merge Conflicts?!

Don't worry I made a simple video to help explain merge conflicts. Check out this video:

[![Resolving Merge Conflicts](https://img.youtube.com/vi/sc_vo30hu_M/0.jpg)](https://www.youtube.com/watch?v=sc_vo30hu_M)

## Pushing Changes to Private Repository

If you make changes in your private clone. You can now simply push to the private repository and pull it down anywhere. Which is really great.

Here's how you can push changes.

```sh
git add .
git commit -m "What did I commit to the repo"
git push origin master
```
