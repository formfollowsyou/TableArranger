import React, {useState, useEffect, useRef } from "react";
import Matter from "matter-js";
import MatterWrap from "matter-wrap";
import decomp from 'poly-decomp';
window.decomp = decomp; //seems necessary for matter.js polygons

//add matter-wrap plugin to matter
//this allows matter objects to leave the canvas on one side and appear on the other.
Matter.use(MatterWrap); 
//matterjs categories to filter collision events
//table offsets dont need to collide with walls, but need to collide with each other
export const MatterCategories = {
    tableCategory: 0x0001,
    tableOffsetCategory: 0x0002
}
//create a react context for matter, to be read by child components
export const MatterContext = React.createContext({})

function MatterScene(props){
    //engine and render state hooks, that can be later read through context provider
    const [engine, setEngine] = useState(Matter.Engine.create({}));
    const [render, setRender] = useState(null);
    //scene is our reference to html canvas
    const scene = useRef(null);
    useEffect(() => {
        //start when background image is set
        if(props.backgroundImage !== null){
            //assign background image via css to the div which contains our html canvas
            scene.current.style.backgroundImage = "url("+props.backgroundImage.src+")";
            scene.current.style.backgroundSize = "contain";
            scene.current.style.backgroundRepeat = "no-repeat";

            //create necessary matter objects
            var Engine = Matter.Engine,
            Render = Matter.Render,
            World = Matter.World,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint
            //get dimensions of scene div and use it to
            //set dimensions of matter js engine
            var sceneBounds = scene.current.getBoundingClientRect();
            World.create({bounds:{min:{x:0, y:0}, max:{x:sceneBounds.width, y:sceneBounds.height}}});
            //initiate renderer
            const renderInit = Render.create({
                element: scene.current,
                engine: engine,
                options:{
                    width: sceneBounds.width,
                    height: sceneBounds.height,
                    hasBounds: true,
                    wireframes: false,
                    background: 'rgba(255,255,255,0.0)', //transparent to show background image of div
                    showPositions: false,
                },
                bounds:{
                    min:{
                        x:0,
                        y:0
                    },
                    max:{
                        x:sceneBounds.width,
                        y:sceneBounds.height
                    }
                }
            });
            //not sure if this is necessary
            //matter bounds work fine, but could be better.
            //so far settings seem to work out..
            engine.world.bounds.min.x = 20
            engine.world.bounds.min.y = 20
            engine.world.bounds.max.x =  sceneBounds.width-20
            engine.world.bounds.max.y = sceneBounds.height-20
                
            //add mouse interaction
            var mouse = Mouse.create(renderInit.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 1.0,
                    angularStiffness:1.0,
                    render:{
                        visible: false
                    }
                }
        });
        //set gravity to zero
        engine.world.gravity = {x:0.0, y:0.0};
        World.add(engine.world, mouseConstraint);


        Engine.run(engine);
        Render.run(renderInit);
        setRender(renderInit);
    }
        return function cleanup(){
            //add code
        }
    }, [props.backgroundImage]);

    //on click on canvas, send event with x and y position to parent
    function handleClick(e){
        if(render !== null){
            const rect = render.canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            return props.onCanvasClick(x, y);
        }
        return null;
    }
    
    return (
    <MatterContext.Provider value={engine}>
        <div ref={scene} style={{minWidth: "100%",  minHeight: "100%"}} onClick={handleClick}>
            {props.children}
        </div>
    </MatterContext.Provider>
    );

  
}


export default MatterScene;
