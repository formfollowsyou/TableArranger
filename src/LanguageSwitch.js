import React from 'react'
import {useLangHandler, Language} from "./Stores/LangStore"

import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';



function LanguageSwitch() {
    const curLang = useLangHandler(state => state.state);
    const setLang = useLangHandler(state => state.switch);

    function handleClick(e) {
        setLang(e.key);
      };

    const menu = (
        <Menu onClick={handleClick}>
            <Menu.Item key={"en"}>
                {Language["en"]["language"]}
            </Menu.Item>
            <Menu.Item key={"de"}>
                {Language["de"]["language"]}
            </Menu.Item>
        </Menu>
      );
      
    return (
    <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
        {Language[curLang]["language"]} <DownOutlined />
        </a>
    </Dropdown>
    )
}

export default LanguageSwitch
