---
description: Learn where to add features and custom functionality to your server.
---

# Where to Modify the Server?

If you want to have the least impact from external updates it is recommended to place your custom code inside of `client-plugins` and `plugins`.

## How to add server-side plugins?

Add all plugins `src/core/plugins` and add a respective folder for your code.

-   Open the Plugins Folder
-   Open `imports.ts`
-   Add your main import file to the list at the top.

# How to add client-side plugins?

Add all plugins `src/core/client-plugins` and add a respective folder for your code.
