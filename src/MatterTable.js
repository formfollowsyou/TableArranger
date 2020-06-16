import React, {useState, useContext, useEffect } from "react";
import Matter from "matter-js";
import {MatterContext, MatterCategories} from "./MatterScene"

function MatterTable(props){
    //just a state to trigger useEffect hook only on load of component
    //actually never updated. feels like a hack...what is a better way of doing this?
    const [restart, setRestart] = useState(false);
    //x and y position of table
    const x = props.x
    const y = props.y
    //dimensions of table
    //proportion is needed to scale the tables correctly
    const width = parseFloat(props.width)/props.proportion
    const length = parseFloat(props.length)/props.proportion
    //chair depth, used as an offset to table
    const chair = parseFloat(props.chair)/props.proportion
    //distance to other tables
    const offset = props.offset/props.proportion;
    //get engine from parent matter context
    const engine = useContext(MatterContext)

    //useEffect is called only once.
    //matter js engine and renderer take care of updates
    useEffect(() => {
        //get collider categories
        var tableCategory = MatterCategories.tableCategory;
        var tableOffsetCategory = MatterCategories.tableOffsetCategory;
        //matterjs properties
        //still not fully satisfying, not sure if matterjs fully suits our case
        //i.e. tables easily go through walls (tunneling)
        var properties = {
            isStatic: false,
            density:0.1,
            slop:0.5,
            friction: 1.0,            
            frictionStatic: 1.0,
            frictionAir: 0.1, 
            restitution:false,
        }
        //create our table geometry
        //dimensions: table dimensions + chair offset
        //however, the visual output draws a rectangle in same dimensions
        //and draws a stroke with chair offset around it
        //the stroke should be an inner offset to be correct,
        //but the matterjs renderer does not allow this
        //
        //only collide with objects in same category
        var tableGeometry = Matter.Bodies.rectangle(x,y,width+chair,length+chair, { 
            ...properties,
            collisionFilter:{category: tableCategory, mask: tableCategory}, 
            render: {
            fillStyle: 'red',
            strokeStyle: 'lightpink',
            lineWidth: chair,
            lineJoin: "round"
       } });
       //table offset geometry
       //add round chamfer
       //only collide with geometries in same category
        var tableOffset = Matter.Bodies.rectangle(x,y,width+chair+offset,length+chair+offset,  { 
            ...properties,
            chamfer: {radius:offset/2.0}, 
            collisionFilter:{category: tableOffsetCategory, mask: tableOffsetCategory}, 
            render: {fillStyle:'transparent', 
            lineWidth: 1} });

        //table geometry and offset need to be combined as Matter.Composite
        //get anchor point:
        var anchorX = width/2.0;
        var anchorY = length/2.0;
        var anchorXOffset = width/2.0+offset;
        var anchorYOffset = length/2.0+offset;
        //create composite
        var tableComposite = Matter.Composite.create();
        Matter.Composite.add(tableComposite, tableOffset);
        Matter.Composite.add(tableComposite, tableGeometry);
        //add constraints, from geometry corners to offset corners and centers
        //this avoids rotation of geometry around the center point
        Matter.Composite.add(tableComposite, Matter.Constraint.create({bodyA:tableGeometry, bodyB:tableOffset}));
        Matter.Composite.add(tableComposite, Matter.Constraint.create({bodyA:tableGeometry, pointA:{x: -anchorX, y: -anchorY}, bodyB:tableOffset, pointB: {x: -anchorXOffset, y: -anchorYOffset}, render:{anchors: false, lineWidth:0}}));
        Matter.Composite.add(tableComposite, Matter.Constraint.create({bodyA:tableGeometry, pointA:{x: +anchorX, y: -anchorY}, bodyB:tableOffset, pointB: {x: anchorXOffset, y: -anchorYOffset}, render:{anchors: false, lineWidth:0}}));
        Matter.Composite.add(tableComposite, Matter.Constraint.create({bodyA:tableGeometry, pointA:{x: -anchorX, y: +anchorY}, bodyB:tableOffset, pointB: {x: -anchorXOffset, y: anchorYOffset}, render:{anchors: false, lineWidth:0}}));
        Matter.Composite.add(tableComposite, Matter.Constraint.create({bodyA:tableGeometry, pointA:{x: +anchorX, y: +anchorY}, bodyB:tableOffset, pointB: {x: anchorXOffset, y: anchorYOffset}, render:{anchors: false, lineWidth:0}}));
        //add wrapping (allowed by matter-wrap plugin) to let table go out of canvas on one side and appear on other
        tableComposite.plugin.wrap = engine.world.bounds
        //add to matter world
        Matter.World.add(engine.world, tableComposite);
        //done
        //remove on delete:
        return () => Matter.World.remove(engine.world, tableComposite);
        }, [restart]);
     return (null);
}
export default MatterTable;