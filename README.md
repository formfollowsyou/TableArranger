# Table Arranger

Because of the Coronavirus, restaurants and bars are urged to arrange their tables within safe distance from each other. We used this challenge to experiment with a little tool that could assist arranging tables on a floor plan while keeping them in distance. Be aware that it is unfinished, but it can be fun to use!

[Try it out!](https://formfollowsyou.github.io/TableArranger/)

### Select image
Just select an image, it will be used as a background. (No upload is happening)
![select image](img/1-image.jpg)

### Draw first wall
After drawing the first wall, you are asked to name its length. It is necessary to scale walls and tables accordingly.
![set first wall and length](img/2-length.gif)

### Draw more walls!
![draw walls](img/3-wall.gif)

### Erase walls
![erase walls](img/4-erase.gif)

### Configure and add tables
Set length and width of a table (red area). Furthermore set the depth of chairs, that would be arranged around the table (light red). Additionally, we need to know how far chairs should stay away from chairs of other tables, this is defined by the distance (black outline).
![configure tables](img/5-tables.gif)
![table properties](img/6-properties.jpg)

### Table arrangement
Do not take this part too serious, then it won't be frustrating, but quite fun!
![table arrangmemnt](img/7-arrange.gif)

## Used software packages
We had fun experimenting with these software packages:
- Physics Engine [MatterJS](https://github.com/liabru/matter-js)
- State Managment [Zustand](https://github.com/react-spring/zustand)
- UI Framework [React](https://github.com/facebook/react)
- UI Components [Ant Design](https://github.com/ant-design/ant-design)

## Possible improvements
A lot!
- The physics engine Matter.js allows tunneling of objects through other objects
- Rotating tables is not possible
- Placement of tables always happens at same spot
- Deleting tables by clicking them would be useful
- So many more things...
- Wear face masks, stay reasonable and in distance to others