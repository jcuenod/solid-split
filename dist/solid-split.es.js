import { template, addEventListener, effect, style, insert, createComponent, For, delegateEvents } from 'solid-js/web';
import { createState } from 'solid-js';

const _tmpl$ = template(`<div></div>`, 2);
// const SNAP_POINTS = Array.from(new Array(11)).map((v, i) => (100 / 12) * (i + 1))

const DEFAULT_GUTTER_SIZE = 4;
let moveHandler;

const startDrag = (vertical, parent, onResize) => event => {
  event.preventDefault();
  document.body.style.userSelect = "none";
  document.body.style.pointerEvents = "none";
  moveHandler = moveDrag(vertical, parent, onResize);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
  document.addEventListener('touchcancel', stopDrag);
  document.addEventListener('mousemove', moveHandler);
  document.addEventListener('touchmove', moveHandler);
};

const moveDrag = (vertical, parent, onResize) => event => {
  const parentRect = parent.getBoundingClientRect();
  const parentSize = vertical ? parentRect.height : parentRect.width;
  const windowOffset = vertical ? parentRect.top : parentRect.left;
  const clientAxis = vertical ? 'clientY' : 'clientX';
  const mousePosition = 'touches' in event ? event.touches[0][clientAxis] : event[clientAxis];
  const newPosition = 100 * (mousePosition - windowOffset) / parentSize; // const unsnappedNewPosition = 100 * (mousePosition - windowOffset) / parentSize
  // const closestSnapPoint = SNAP_POINTS.reduce((a, v) => {
  //     return Math.abs(unsnappedNewPosition - v) < Math.abs(unsnappedNewPosition - a) ? v : a
  // }, SNAP_POINTS[0])
  // const shouldSnap = Math.abs(closestSnapPoint - unsnappedNewPosition) < SNAP_DISTANCE
  // const newPosition = shouldSnap
  //     ? closestSnapPoint
  //     : unsnappedNewPosition

  onResize(newPosition);
};

const stopDrag = event => {
  document.body.style.userSelect = "";
  document.body.style.pointerEvents = "";
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
  document.removeEventListener('touchcancel', stopDrag);
  document.removeEventListener('mousemove', moveHandler);
  document.removeEventListener('touchmove', moveHandler);
};

const styleFromDirection = (vertical, gutterSize) => vertical ? {
  height: gutterSize + "px",
  left: 0,
  right: 0,
  cursor: 'row-resize'
} : {
  width: gutterSize + "px",
  top: 0,
  bottom: 0,
  cursor: 'col-resize'
};

const Gutter = props => (() => {
  const _el$ = _tmpl$.cloneNode(true);

  addEventListener(_el$, "touchstart", startDrag(props.vertical, props.parent, props.onResize), true);

  addEventListener(_el$, "mousedown", startDrag(props.vertical, props.parent, props.onResize), true);

  effect(_$p => style(_el$, { ...styleFromDirection(props.vertical, props.gutterSize),
    "background-color": "#aaa"
  }, _$p));

  return _el$;
})();

const childStyle = (vertical, size, gutterSize) => vertical ? {
  height: "calc(" + size + "% - " + gutterSize / 2 + "px)"
} : {
  width: "calc(" + size + "% - " + gutterSize / 2 + "px)"
};

const Child = props => (() => {
  const _el$2 = _tmpl$.cloneNode(true);

  insert(_el$2, () => props.children);

  effect(_$p => style(_el$2, {
    display: "flex",
    overflow: "auto",
    ...childStyle(props.vertical, props.size, props.gutterSize)
  }, _$p));

  return _el$2;
})();

const Split = props => {
  let parentRef;
  const {
    children,
    vertical,
    gutterSize = DEFAULT_GUTTER_SIZE
  } = props;
  const defaultSize = 100 / children.length;
  const [state, setState] = createState({
    sizes: children.map(() => defaultSize)
  });
  return (() => {
    const _el$3 = _tmpl$.cloneNode(true);

    const _ref$ = parentRef;
    typeof _ref$ === "function" ? _ref$(_el$3) : parentRef = _el$3;

    _el$3.style.setProperty("display", "flex");

    _el$3.style.setProperty("flex-direction", vertical ? "column" : "row");

    _el$3.style.setProperty("flex", 1);

    _el$3.style.setProperty("width", "100%");

    _el$3.style.setProperty("height", "100%");

    insert(_el$3, createComponent(Child, {
      gutterSize: gutterSize,
      vertical: vertical,

      get size() {
        return state.sizes[0];
      },

      get children() {
        return children[0];
      }

    }), null);

    insert(_el$3, createComponent(For, {
      get each() {
        return children.slice(1);
      },

      children: (nextChild, index) => [createComponent(Gutter, {
        gutterSize: gutterSize,
        vertical: vertical,
        parent: parentRef,
        onResize: newLeftTotal => {
          const i = index();
          const leftChildrenSizes = state.sizes.slice(0, i + 1);
          const leftSizeTally = leftChildrenSizes.reduce((a, v) => a + v, 0);
          const leftDivisor = newLeftTotal / (leftSizeTally || 0.001);
          const newLeftSizes = leftChildrenSizes.map(s => (s || 0.001) * leftDivisor);
          const newRightTotal = 100 - newLeftTotal;
          const rightChildrenSizes = state.sizes.slice(i + 1);
          const rightSizeTally = rightChildrenSizes.reduce((a, v) => a + v, 0);
          const rightDivisor = newRightTotal / (rightSizeTally || 0.001);
          const newRightSizes = rightChildrenSizes.map(s => (s || 0.001) * rightDivisor);
          setState({
            sizes: [...newLeftSizes, ...newRightSizes]
          });
        }
      }), createComponent(Child, {
        gutterSize: gutterSize,
        vertical: vertical,

        get size() {
          return state.sizes[index() + 1];
        },

        children: nextChild
      })]
    }), null);

    return _el$3;
  })();
};

delegateEvents(["mousedown", "touchstart"]);

export default Split;
