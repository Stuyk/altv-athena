# What is this?

These are just various scripts that are used to help generate different data for Athena.

They're mostly ran manually and not meant to be used in production.

## gridSorter.mjs

```sh
node ./scripts/gridSorter.mjs
```

Generates a file that will be distributed to the root directory.

Creates a list of atms, fuel pumps, vendors, etc.

Pre-processes and ensures that only one blip exists between positions that are too close to one another.

Additional processing done on client login.
