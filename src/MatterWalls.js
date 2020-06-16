import React, {useState, useContext, useEffect } from "react";
import Matter from "matter-js";
import {useWallStore } from "./Stores/DrawStore.js"
import {MatterContext, MatterCategories} from "./MatterScene"

function MatterWalls(props){
    //just a state to trigger useEffect hook only on load of component
    //actually never updated. feels like a hack...what is a better way of doing this?
    const [restart, setRestart] = useState(false);
    //get walls from store
    const walls = useWallStore(state => state.walls);
    const wallThickness = 0.3/props.proportion
    //get engine from parent matter context
    const engine = useContext(MatterContext)
    //useEffect is called everytime a wall is drawn
    //might be possible to make components out of every wall, but works out so far
    useEffect(() => {
        const bodies = [];
        //for each wall in store
        walls.map((wall) => {
            const distX = (wall[1].x-wall[0].x);
            const distY = (wall[1].y-wall[0].y);
            const length = Math.sqrt(distX*distX+distY*distY);
            //create a static body
            //with filter category of table, but not its offset
            const body = Matter.Bodies.rectangle(distX/2+wall[0].x,distY/2+wall[0].y, 
                length,
                wallThickness,
                { isStatic: true,
                  friction: 1.0, 
                  density: 0.1,
                  restitution:false, 
                  collisionFilter:{category: MatterCategories.tableCategory, mask: MatterCategories.tableCategory},
                render: {
                    fillStyle: '#1890ff',
                    strokeStyle: '#1890ff',
                    lineWidth: 1
               }
            }
            )
            //rotate wall body
            const angle = Matter.Vector.angle(
                Matter.Vector.sub(
                    Matter.Vector.create(wall[0].x, wall[0].y), Matter.Vector.create(wall[1].x, wall[1].y)), 
                Matter.Vector.create(1, 0))
            Matter.Body.rotate(body, angle)
            //add body to world
            Matter.World.add(engine.world, body)
            //store its ref to bodies array
            bodies.push(body);
            
        })
        //on change of walls delete all existing bodies before starting to redraw with useEffect
        return () => bodies.map((body) => {Matter.World.remove(engine.world, body)});
        }, [walls]);
        
     return (null);
}
export default MatterWalls;