import { createState, createEffect, children } from "solid-js"

// const SNAP_DISTANCE = 2.5
// const SNAP_POINTS = Array.from(new Array(11)).map((v, i) => (100 / 12) * (i + 1))
const DEFAULT_GUTTER_SIZE = 4

let moveHandler

const startDrag = (vertical, parent, onResize) => event => {
    event.preventDefault()
    document.body.style.userSelect = "none"
    document.body.style.pointerEvents = "none"
    moveHandler = moveDrag(vertical, parent, onResize)
    document.addEventListener('mouseup', stopDrag)
    document.addEventListener('touchend', stopDrag)
    document.addEventListener('touchcancel', stopDrag)
    document.addEventListener('mousemove', moveHandler)
    document.addEventListener('touchmove', moveHandler)
}
const moveDrag = (vertical, parent, onResize) => event => {
    const parentRect = parent.getBoundingClientRect()
    const parentSize = vertical
        ? parentRect.height
        : parentRect.width
    const windowOffset = vertical
        ? parentRect.top
        : parentRect.left
    const clientAxis = vertical
        ? 'clientY'
        : 'clientX'
    const mousePosition = ('touches' in event)
        ? event.touches[0][clientAxis]
        : event[clientAxis]

    const newPosition = 100 * (mousePosition - windowOffset) / parentSize
    // const unsnappedNewPosition = 100 * (mousePosition - windowOffset) / parentSize
    // const closestSnapPoint = SNAP_POINTS.reduce((a, v) => {
    //     return Math.abs(unsnappedNewPosition - v) < Math.abs(unsnappedNewPosition - a) ? v : a
    // }, SNAP_POINTS[0])
    // const shouldSnap = Math.abs(closestSnapPoint - unsnappedNewPosition) < SNAP_DISTANCE
    // const newPosition = shouldSnap
    //     ? closestSnapPoint
    //     : unsnappedNewPosition
    onResize(newPosition)
}
const stopDrag = event => {
    document.body.style.userSelect = ""
    document.body.style.pointerEvents = ""
    document.removeEventListener('mouseup', stopDrag)
    document.removeEventListener('touchend', stopDrag)
    document.removeEventListener('touchcancel', stopDrag)
    document.removeEventListener('mousemove', moveHandler)
    document.removeEventListener('touchmove', moveHandler)
}

const styleFromDirection = (vertical, gutterSize) =>
    vertical
        ? { height: gutterSize + "px", left: 0, right: 0, cursor: 'row-resize' }
        : { width: gutterSize + "px", top: 0, bottom: 0, cursor: 'col-resize' }
const Gutter = (props) =>
    <div
        style={{ ...styleFromDirection(props.vertical, props.gutterSize), "background-color": "#aaa" }}
        onMouseDown={startDrag(props.vertical, props.parent, props.onResize)}
        onTouchStart={startDrag(props.vertical, props.parent, props.onResize)}
    />

const childStyle = (vertical, size, gutterSize) =>
    vertical
        ? { height: "calc(" + size + "% - " + (gutterSize / 2) + "px)" }
        : { width: "calc(" + size + "% - " + (gutterSize / 2) + "px)" }
const Child = props =>
    <div style={{
        display: "flex",
        overflow: "auto",
        ...childStyle(props.vertical, props.size, props.gutterSize)
    }}>
        {props.children}
    </div >


const Split = props => {
    let parentRef
    const gutterSize = props.gutterSize || DEFAULT_GUTTER_SIZE

    const childrenList = children(() => props.children)

    const defaultSize = childrenList().length > 0
        ? 100 / childrenList().length
        : 100


    const [state, setState] = createState({ sizes: childrenList().map(() => defaultSize) })
    createEffect(() => {
        const defaultSize = childrenList().length > 0
            ? 100 / childrenList().length
            : 100
        setState({ sizes: childrenList().map(() => defaultSize) })
    })

    return (
        <div ref={parentRef} style={{ display: "flex", "flex-direction": props.vertical ? "column" : "row", flex: 1, width: "100%", height: "100%" }}>
            <Child gutterSize={gutterSize} vertical={props.vertical} size={state.sizes[0]}>{childrenList()[0]}</Child>
            <For each={childrenList().slice(1)}>
                {(nextChild, index) =>
                    <>
                        <Gutter gutterSize={gutterSize} vertical={props.vertical} parent={parentRef} onResize={newLeftTotal => {
                            const i = index()

                            const leftChildrenSizes = state.sizes.slice(0, i + 1)
                            const leftSizeTally = leftChildrenSizes.reduce((a, v) => a + v, 0)
                            const leftDivisor = newLeftTotal / (leftSizeTally || 0.001)
                            const newLeftSizes = leftChildrenSizes.map(s => (s || 0.001) * leftDivisor)

                            const newRightTotal = 100 - newLeftTotal
                            const rightChildrenSizes = state.sizes.slice(i + 1)
                            const rightSizeTally = rightChildrenSizes.reduce((a, v) => a + v, 0)
                            const rightDivisor = newRightTotal / (rightSizeTally || 0.001)
                            const newRightSizes = rightChildrenSizes.map(s => (s || 0.001) * rightDivisor)

                            setState({ sizes: [...newLeftSizes, ...newRightSizes] })
                        }} />
                        <Child gutterSize={gutterSize} vertical={props.vertical} size={state.sizes[index() + 1]}>{nextChild}</Child>
                    </>
                }
            </For>
        </div>
    )
}
export default Split