# HEY LISTEN

Sometimes introducing certain fonts will actually crash your game.

It's unknown what actually causes this but if you are trying to load a new font...

Ensure there are no quotes around it inside of `rmlui` css and test once before changing everything.

The easiest place to test a font is probably the input box. 

Introducing a corrupted font in the input box, or any rmlui interface will instantly crash your client.

**YOU CANNOT SPECIFY MULTIPLE FONTS IN font-family**

You have been warned.

This cannot be fixed; use a different font.