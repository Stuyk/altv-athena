# CSS Framework

Athena took a similar approach to Vuetify but only built more utility classes than components.

That means that we can do really simple HTML based edits for colors, padding, etc.

- [CSS Framework](#css-framework)
  - [Color Options](#color-options)
  - [Color Text](#color-text)
  - [Darken / Lighten Colors](#darken--lighten-colors)
  - [Font Style](#font-style)
  - [Font Weight](#font-weight)
  - [Margin](#margin)
  - [Padding](#padding)
  - [Rounded Edges](#rounded-edges)
  - [Elevation](#elevation)
- [Split & Stack Methodology](#split--stack-methodology)
  - [Splitting](#splitting)
  - [Stacking](#stacking)
  - [Combining the Two](#combining-the-two)

## Color Options

Color Option(s)

* red
* pink
* purple
* deep-purple
* indigo
* blue
* light-blue
* cyan
* teal
* green
* light-green
* lime
* yellow
* amber
* orange
* deep-orange
* brown
* blue-grey

_https://materialui.co/colors/_

_See src-webviews/src/css/color.css for more option(s)_

## Color Text

The syntax is `color--text`

```html
<span class="green--text">
    This is Green
</span>
```

_See src-webviews/src/css/color.css for more option(s)_

## Darken / Lighten Colors

We can adjust the color of the green by using darken and lighten classes. The values are `1` - `5`.

```html
<span class="green--text text--darken-4">
    Darkest Green
</span>
<span class="green--text text--lighten-4">
    Lightest Green
</span>
```

_See src-webviews/src/css/color.css for more option(s)_

## Font Style

Fonts are mostly just these for classes. However, there is way more customization similar to how Vuetify does typography.

* display-4
* display-3
* display-2
* display-1
* headline
* title
* subtitle-2
* subtitle-1
* body-2
* body-1
* caption
* overline

_See src-webviews/src/css/font.css for more option(s)_

```html
<span class="green--text text--darken-4 overline">
    This is Overline Text
</span>
```

## Font Weight

Font Weight is meant to be as simple as possible. You get only three options.

* bold
* bolder
* boldest

```html
<span class="green--text text--darken-4 overline boldest">
    This is the Boldest Overline Text
</span>
```

## Margin

Margin is something that is done through css entirely and values span from `1` - `16`. They are incredibly useful for quickly spacing elements and ensuring everything is spaced evenly.

Syntax goes as follows.

`a` - All

`l` - Left

`r` - Right

`t` - Top

`b` - Bottom

Then we can combine a number with a value.

```html
<span class="mt-6">
    This has space above it.
</span>
<span class="mb-6">
    This has space below it.
</span>
<span class="ma-6">
    This has space around it.
</span>
```


## Padding

Padding is something that is done through css entirely and values span from `1` - `16`. They are incredibly useful for quickly spacing elements and ensuring everything is spaced evenly.

Syntax goes as follows.

`a` - All

`l` - Left

`r` - Right

`t` - Top

`b` - Bottom

Then we can combine a number with a value.

```html
<span class="pt-6">
    This has space above it.
</span>
<span class="pb-6">
    This has space below it.
</span>
<span class="pa-6">
    This has space around it.
</span>
```

## Rounded Edges

Rounding edges adds simple border-radius to elements with a background.

* rounded-sm
* rounded
* rounded-lg
* rounded-xl

```html
<div class="rounded-lg pa-6" style="background: red">
    This has rounded edges
</div>
```

## Elevation

Elevation adds shadow below the element. Spans from `1` - `24`.

```html
<div class="rounded-lg pa-6 elevation-24" style="background: red">
    This has a shadow.
</div>
```

# Split & Stack Methodology

This is an interesting concept and I don't know if it has a name. It's something that I use when I write all my design(s) for Athena. Hence the name `Split & Stack Method`. An element either needs to be split or the elements need to be stacked.

Here's a preview of a broken down page with each split / stack shown

![](https://i.imgur.com/4w9IuOL.png)

_Red is split, Blue is Stack_

## Splitting

Below is an example on how to split three items equally in a given space.

```html
<div class="split split-full space-between">
    <div>Element 1</div>
    <div>Element 2</div>
    <div>Element 3</div>
</div>
```

## Stacking

These elements will stack together as a 'list' of sorts. They will be vertically stacked.

```html
<div class="stack">
    <div>Element 1</div>
    <div>Element 2</div>
    <div>Element 3</div>
</div>
```

## Combining the Two

Below is a full example of how I would use `split` and `stack`.

```html
<div class="stack" style="min-width: 200px">
    <div class="split split-full space-between">
        <span>Hello</span>
        <span>World</span>
    </div>
    <div class="split split-full space-between">
        <span>Welcome</span>
        <span>To</span>
    </div>
    <div class="split split-full space-between">
        <span>Vue</span>
        <span>3</span>
    </div>
</div>
```