import React from 'react';
import {useLangHandler, Language} from "./Stores/LangStore"
import {useDrawHandler } from "./Stores/DrawStore.js"

import {Row, Button} from 'antd'
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';



function DrawWalls(props) {
    const curLang = useLangHandler(state => state.state);
    //set and get state of draw handler.
    //if set to draw, canvas clicks will be tracked to draw lines
    //if set to erase, canvas clicks will be tracked to delete lines
    //more info on actions within TableUI
    const drawState = useDrawHandler(state => state.state);
    const draw = useDrawHandler(state => state.draw);
    const erase = useDrawHandler(state => state.erase);
    
    return (
        <Row justify="space-around">
            <Button ghost={drawState==="draw"} icon={<EditOutlined />} type="primary" onClick={draw}>{Language[curLang]["draw"]}</Button>
            <Button ghost={drawState==="erase"} icon={<DeleteOutlined />} type="primary" onClick={erase}>{Language[curLang]["erase"]}</Button>
        </Row>
    )
}

export default DrawWalls
