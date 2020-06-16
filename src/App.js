import 'fontsource-roboto'
import React, {useState} from 'react'
import {Layout, Button, Row, Collapse, Typography, Modal, InputNumber} from 'antd'
import {PlusOutlined, MinusOutlined} from '@ant-design/icons';
import MatterScene from "./MatterScene"
import MatterTable from "./MatterTable"
import MatterWalls from "./MatterWalls"
import ImageLoader from "./ImageLoader"
import LanguageSwitch from "./LanguageSwitch"
import TableConfigurator from "./TableConfigurator"
import DrawWalls from "./DrawWalls"
import {useTableStore} from "./Stores/TableStore"
import {useLangHandler, Language} from "./Stores/LangStore"
import {useWallStore, useDrawHandler } from "./Stores/DrawStore"
import 'antd/dist/antd.css';
const { Content, Sider } = Layout;
const {Title, Text} = Typography;
const {Panel} = Collapse;

function App(props) {

    const curLang = useLangHandler(state => state.state);
    //table ui uses table store, wall store and draw handler

    //table store
    //handleAdd: adds new table object/class to store
    //handlePlus: increases amount of tables of one object in table store
    //handleMinus: decreases amount of tables of one object in table store
    //more info in TableStore.js
    const tables = useTableStore(state => state.tables);
    const handleAdd = useTableStore(state => state.add);
    const handlePlus = useTableStore(state => state.plus);
    const handleMinus = useTableStore(state => state.minus);

    //wall store
    //addPoint: adds point to wall store, if two are added, it creates a wall
    //removeWall: removes a wall that is within distance threshold of a point such as a canvas mouse click position
    //more info in DrawStore.js
    const walls = useWallStore(state => state.walls);
    const addPoint = useWallStore(state => state.addPoint);
    const removeWall = useWallStore(state => state.removeWall);

    //draw handler
    //drawState: can be "draw", "erase" or "default"
    //defaultDrawState: set draw state to default
    const drawState = useDrawHandler(state => state.state);
    const defaultDrawState = useDrawHandler(state => state.default);

    //background image source path
    const [image, setImage] = useState(null);
    //needed to scale walls and tables according to image size
    const [lengthProportion, setLengthProportion] = useState(1.0);
    //if addTables is set to true, the panel for tables appears
    //is set to true, after proportions are set.
    const [addTables, setAddTables] = useState(false);

    //gets event from tableconfigurator and creates a table within tableStore
    function handleSubmitTable(event){
        defaultDrawState();
        const values = event;
        var avX = 0;
        var avY = 0;
        var count = 0;
        //places table at average position of all wall points
        //could be better...
        for(const line of walls){
            avX += line[0].x;
            avX += line[1].x;
            avY += line[0].y;
            avY += line[1].y;
            count +=2;
        }
        values.x = avX / count;
        values.y = avY / count;
        handleAdd(values)
    }
    //gets length of first wall and sets proportions for all other walls and tables accordingly
    function onSetLength(length){
        const reg = /^-?\d*(\.\d*)?$/;
        if ((!isNaN(length) && reg.test(length)) || length === '' || length === '-') {
            const dx = (walls[0][1].x - walls[0][0].x);
            const dy = (walls[0][1].y - walls[0][0].y);
            const lineLength = Math.sqrt(dx*dx+dy*dy);
            setLengthProportion(length/lineLength);
        }
      };
    //handleClick is called on canvas click
    //depending on draw state, it does nothing or draws and erases walls
    function handleClick(x,y){
        if(drawState === "draw"){
            addPoint(x,y);
        }
        else if(drawState === "erase"){
            removeWall(x,y, 20);
        }
    }
    //gets event with image source from image loader
    //sets image source
    function handleUpload(e){
        setImage(e);
    }
    //closes modal that gets length of first wall
    //sets add tables to true, to show new gui elements
    function handleCloseModal(e){
        setAddTables(true);
    }
    return (     
        <Layout>
        {
        //modal that asks for wall length
        //pops up after first wall was drawn
        //needed to get proportions of walls and tables in relation to image
        }
        <Modal visible={(walls.length===1 && !addTables)} title={Language[curLang]["setLength"]} footer={[<Button key="ok" onClick={handleCloseModal}>Ok</Button>]}>
            <InputNumber autoFocus size="large" onPressEnter={handleCloseModal} min={0.1} max={500} onChange={onSetLength} formatter={value => `${value}m`} parser={value => value.replace('m', '')}/>
        </Modal>
        <Sider theme="light" width="400" style={{ overflow:'auto', padding: '12px' , border: '1px solid lightgray'}}>
            <LanguageSwitch></LanguageSwitch>
            <Title level={1}>{Language[curLang]["title"]}</Title>
            <Text strong>{Language[curLang]["by"]}<a href="https://formfollowsyou.com" alt="Form Follows You Website" target="_blank">Form Follows You</a></Text>
            
            <Collapse defaultActiveKey={['1']} activeKey={(image === null) ? ['1']: (addTables === false ? ['1', '2']:['1', '2', '3'])}>
                {
                //image upload panel
                }
                <Panel header={Language[curLang]["1-image"]} key="1" showArrow={false}>
                    <ImageLoader onUpload={handleUpload}></ImageLoader>
                </Panel>
                {
                //add draw walls panel
                }
                <Panel header={Language[curLang]["2-walls"]} key="2" disabled={(image === null)} showArrow={false}>
                    <DrawWalls></DrawWalls>
                </Panel>
                {
                //add tables panel
                }
                <Panel header={Language[curLang]["3-tables"]} key="3" disabled={(image === null || !addTables)} showArrow={false}>
                    <TableConfigurator onSubmit={handleSubmitTable}></TableConfigurator>
                    <div>
                        {tables.map(tableClass => (
                            //add a row for each table object/class in store that allows to in/decrease the amount its instances
                            <Row justify="space-around" key={tableClass.id} >
                                {Language[curLang]["length"]}: {tableClass.length} {Language[curLang]["width"]}: {tableClass.width} x{tableClass.count}
                                <Button icon={<PlusOutlined />} hoverIndicator 
                                    onClick={() => handlePlus(tableClass.id)}/>
                                <Button icon={<MinusOutlined />} hoverIndicator
                                    onClick={() => handleMinus(tableClass.id)} />                            
                            </Row>
                        ))}
                    </div>
                </Panel>
            </Collapse>
        </Sider>
        <Content>
                <MatterScene onCanvasClick={handleClick} backgroundImage={image}>
                    {//create table fore each table in store
                    tables.map(tableClass => (
                        Array.from(Array(tableClass.count), (e, i) => (
                        <MatterTable key={tableClass.id+"-"+i} {...tableClass} proportion={lengthProportion}></MatterTable>
                        ))
                    ))
                    //create walls
                    }
                    <MatterWalls proportion={lengthProportion}></MatterWalls>
                </MatterScene>
            </Content>
        </Layout>
    );
}

export default App;

