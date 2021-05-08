# Solid Split

Draggable split element for [Solid](https://github.com/solidui/solid).

Inspired by [React Split](https://github.com/nathancahill/split/tree/master/packages/react-split) and [Split.js](https://github.com/nathancahill/split). Unlike React Split, Solid Split is not a wrapper around a vanilla js library. This has been built from the ground up complete with its own original set of brand new bugs and issues. Use at your own risk.

## Usage

```
import Split from "solid-split"

const CoolComponent = () =>
    <Split>
        <div>Element 1</div>
        <div>Element 2</div>
        <div>Element 3</div>
    </Split>
```

## API

| Option | Type | Value |
|---|---|---|
| gutterSize | int | The size of the gutter between elements. **Default**: 4 (px) |
| vertical | bool | Option to display elements vertically (as a column). **Default**: false |

## Support

Should support all modern browsers and handle both click and touch events. Note that, with touch events, you will probably have a better experience with wider gutters.