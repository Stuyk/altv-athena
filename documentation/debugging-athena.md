---
description: How to debug the game mode
---

# Debugging Athena

If you have implemented code but are not sure how to find an error then there's a few ways to approach it.

## npx tsc

This command you run your terminal will use the generic typescript compiler to help you find a `bug` in your code. If there's an issue it will tell you the exact file, and line number.

If it's at the end of a `bracket` then it's inside of the bracket that is causing the error.

To utilize this simply run in your terminal:

```
npx tsc
```

## Check Discord

If you are getting an error message check the Athena discord through the search box. If it's not there check the official alt:V Discord as well.

## Can't find the Error?

Try removing the files you have created and move them outside of the gamemode.
