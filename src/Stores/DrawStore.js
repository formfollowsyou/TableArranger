import create from 'zustand'
import produce from 'immer'

//store to save wall positions
export const [useWallStore] = create(set => ({
    walls: [],
    lastPoint: null,
    addPoint: (xPos, yPos) => set(state => 
        //if lastPoint is already set
        (state.lastPoint !== null ? 
        //use the new point together with last point to create a wall (line) between both points
        //and set last point to null again
        {walls: [...state.walls, [state.lastPoint, {x: xPos, y: yPos }]], lastPoint: null} : 
        //otherwise set last point
        {lastPoint : {x: xPos, y: yPos }})),
    removeWall: (xPos, yPos, threshold) => set(state => 
        //filter/remove walls that are within threshold to a point (xPos, yPos)
        ({walls: state.walls.filter(line => 
            pointOnLine(line[0].x, line[0].y, line[1].x, line[1].y, xPos, yPos, threshold))}))
}))

//function to check, if point is on a line with a width of threshold
//x0, y0, x1, y1: define line
//px, py: define point such as mouse click on canvas
//threshold: accepted distance towards line to return true for point on line
//return: false (not on line), true (on line)
function pointOnLine(x0, y0, x1, y1, px,py, threshold){
    const dx = x1 - x0;
    const dy = y1 - y0;
    const sqLength = dx*dx+dy*dy;
    const t = ((px - x0) * dx + (py - y0) * dy) / sqLength;
    if(t<0 || t > 1)
        return true;
    else{
        const distX = px - (x0 + t*dx);
        const distY = py - (y0 + t*dy);
        const length = distX*distX+distY*distY;
        if(length < threshold)
            return false;
        return true;
    }
}

//just a simple hook to know the state of drawing
export const [useDrawHandler] = create(set => ({
    state: null,
    draw: () => set( s => ({state: s.state === "draw" ? null : "draw"})),
    erase: () => set( s => ({state: s.state === "erase" ? null : "erase"})),
    default: () => set( s => ({state: s.state = null}))
    
}))
