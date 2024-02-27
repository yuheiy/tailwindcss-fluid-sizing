TODO: コード例を全て `640px_32px,1536px_64px`にする
TODO: postcss-pxtoremを紹介する https://github.com/cuth/postcss-pxtorem
TODO: 段階的にfluidになるパターンを紹介する `fluid-mt-[sm_24px,lg_32px] lg:fluid-mt-[lg_64px,xl_128px]`

# tailwindcss-fluid-sizing

A plugin for Tailwind CSS **v3.3.3+** that provides utilities for fluid sizings, a technique such as that known as _[fluid typography](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/)_.

## Installation

Install the plugin from npm:

```bash
npm install tailwindcss-fluid-sizing --save-dev
```

Then add the plugin to your `tailwind.config.js` file:

```javascript
const screens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

module.exports = {
  theme: {
    screens,
    // ...
  },
  plugins: [
    require('tailwindcss-fluid-sizing')({
      screens: {
        ...screens,
        DEFAULT_FROM: screens.sm,
        DEFAULT_TO: screens['2xl'],
      },
    }),
    // ...
  ],
};
```

## Usage

To apply fluid sizing, use arbitrary values alongside utility classes prefixed with `fluid-`, specifying the necessary arguments:

```html
<h1 class="fluid-text-[768px_32px,1280px_64px]">tailwindcss-fluid-sizing</h1>
```

Those arguments indicate a `font-size` transition from `32px` at a viewport width of `768px` to `64px` at `1280px`, generating CSS that employs the `clamp` function for smooth scaling:

```css
.fluid-text-\\[768px_32px\\2c 1280px_64px\\] {
  font-size: clamp(32px, 6.25vw - 16px, 64px);
}
```

To check the supported utility classes, please refer to [`src/sizingUtilities.ts`](src/sizingUtilities.ts).

### Using rem unit

You can also specify sizes using the `rem` unit:

```html
<h1 class="fluid-text-[768px_2rem,1280px_4rem]">tailwindcss-fluid-sizing</h1>
```

This generates CSS as follows:

```css
.fluid-text-\\[768px_2rem\\2c 1280px_4rem\\] {
  font-size: clamp(2rem, 6.25vw - 1rem, 4rem);
}
```

### Using screen keywords

By setting `screens` in the plugin options, you can use keyword values instead of actual values as arguments:

```html
<h1 class="fluid-text-[768px_32px,1280px_64px]">tailwindcss-fluid-sizing</h1>
<!-- ↑ is equivalent to ↓ -->
<h1 class="fluid-text-[md_32px,lg_64px]">tailwindcss-fluid-sizing</h1>
```

In your `tailwind.config.js` file:

```javascript
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('tailwindcss-fluid-sizing')({
      screens: {
        md: '768px',
        lg: '1280px',
      },
    }),
    // ...
  ],
};
```

### Fallback to default screens

By setting `screens.DEFAULT_FROM` / `screens.DEFAULT_TO` in the plugin options allow you to specify default values for omitted screen specifications:

```html
<h1 class="fluid-text-[768px_32px,1280px_64px]">tailwindcss-fluid-sizing</h1>
<!-- ↑ is equivalent to ↓ -->
<h1 class="fluid-text-[32px,64px]">tailwindcss-fluid-sizing</h1>
```

In your `tailwind.config.js` file:

```javascript
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('tailwindcss-fluid-sizing')({
      screens: {
        DEFAULT_FROM: '768px',
        DEFAULT_TO: '1280px',
      },
    }),
    // ...
  ],
};
```

### Using the `theme` function

It’s possible to use the [`theme` function](https://tailwindcss.com/docs/functions-and-directives#theme) to reference the design tokens in your `tailwind.config.js` file:

<!-- prettier-ignore -->
```html
<h1 class="fluid-text-[768px_2rem,1280px_4rem]">tailwindcss-fluid-sizing</h1>
<!-- ↑ is equivalent to ↓ -->
<h1 class="fluid-text-[theme(screens.md)_theme(spacing.8),theme(screens.xl)_theme(spacing.16)]">tailwindcss-fluid-sizing</h1>
```

### Referencing the configured theme

You can configure your own custom set of sizing utilities using the `theme.fluidSizing` section of your `tailwind.config.js` file:

```javascript
module.exports = {
  theme: {
    fluidSizing: {
      fontSize: {
        array: ['768px 32px', '1280px 64px'],
        string: '768px 32px, 1280px 64px',
      },
    },
    // ...
  },
  plugins: [
    require('tailwindcss-fluid-sizing')({
      // ...
    }),
    // ...
  ],
};
```

This makes it possible to use it as follows:

```html
<h1 class="fluid-text-[768px_32px,1280px_64px]">tailwindcss-fluid-sizing</h1>
<!-- ↑ is equivalent to ↓ -->
<h1 class="fluid-text-array">tailwindcss-fluid-sizing</h1>
<!-- ↑ is equivalent to ↓ -->
<h1 class="fluid-text-string">tailwindcss-fluid-sizing</h1>
```

To check which the theme keys corresponds to the utility classes, please refer to [`src/sizingUtilities.ts`](src/sizingUtilities.ts).

### Adjusting the root `font-size`

If the root `font-size` is modified (e.g., to `62.5%`), adjust the plugin settings accordingly to ensure accurate sizing calculations:

```css
html {
  font-size: 62.5%;
}
```

Update your `tailwind.config.js` file as follows to align the plugin with the modified root `font-size`.

```javascript
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('tailwindcss-fluid-sizing')({
      rootFontSizePixel: 0.625 * 16,
    }),
    // ...
  ],
};
```
