# Clothing Images

Credits to Stuyk for literally spending a week generating the images, and batch replacing the green screen.

Please ask Stuyk for permission to use these images in your project and credit him.

This took a really long time to do.

## The Naming Scheme

The naming of the images is a bit confusing; let me explain.

```
componentIdentifier-hashedDlcName-isProp?-isNotShared?-drawableID.png
```

_The above is a psuedo name scheme for clothing images._

### componentIdentifier

Clothes 

* 1 - Masks
* 2 - Hairstyles
* 3 - Torsos
* 4 - Legs
* 5 - Bags & Parachutes
* 6 - Shoes
* 7 - Accessories
* 8 - Undershirts
* 9 - Body Armors (No Images)
* 10 - Decals (No Images)
* 11 - Tops

Props

* 0 - Hats
* 1 - Glasses
* 2 - Ears
* 6 - Watches
* 7 - Bracelets

### hashedDlcName

Uses the `alt.hash` function from alt:V to determine the clothing dlc hash name.

You should do the same for your DLC if you're adding images.

### isProp? - Is this component specifically a prop?

If so; append `prop` to the file name.

### isNotShared? - Is this clothing item shared between male & female?

If is not shared; append `female` or `male` based on player models.

### drawableID

The relative drawable ID according to `player.getDlcClothing` or `player.getDlcProp`.