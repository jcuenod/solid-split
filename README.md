# Solid Split

Draggable split element for [Solid](https://github.com/solidui/solid).

Inspired by [React Split](https://github.com/nathancahill/split/tree/master/packages/react-split) and [Split.js](https://github.com/nathancahill/split). Unlike React Split, Solid Split is not a wrapper around a vanilla js library. This has been built from the ground up complete with its own original set of brand new bugs and issues. Use at your own risk.

## Usage

```jsx
import Split from "solid-split"

const SplitComponent = () =>
    <Split>
        <div>Element 1</div>
        <div>Element 2</div>
        <div>Element 3</div>
    </Split>
```

## API

| Option | Type | Default | Value |
|---|---|---|---|
| gutterSize | int | 4 (px) | The size of the gutter between elements.  |
| vertical | bool | false | Option to display elements vertically (as a column). |

## Support

Should support all modern browsers and handle both click and touch events. Note that, with touch events, you will probably have a better experience with wider gutters.