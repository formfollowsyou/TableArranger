import React, {useState} from 'react';
import {Form, Button, Slider} from 'antd'
import {useLangHandler, Language} from "./Stores/LangStore"


//on submit of form, configurator sends
//event with value states to parent component
function TableConfigurator({onSubmit}) {
    const curLang = useLangHandler(state => state.state);
    //antd form hook
    const [form] = Form.useForm();
    //form values state
    const [values, setValues] = useState({length: 2.0, width: 0.75, chair: 0.45, offset: 1.5});

    return (
        <Form 
            form={form}
            onValuesChange={(changedValues, allValues) => {
                setValues(allValues);
            }}
            onReset={() => form.resetFields()}
            onFinish={onSubmit}
            initialValues={values}
            colon={false}
          >
            <Form.Item name="length" label={Language[curLang]["length"]+": "+values.length+"m"}>
                <Slider min={0.10} max={10} step={0.01} name="length"/>
            </Form.Item>     
            <Form.Item name="width" label={Language[curLang]["width"]+": "+values.width+"m"}>
                <Slider min={0.10} max={5.0} step={0.01} name="width"/>
            </Form.Item>
            <Form.Item name="chair" label={Language[curLang]["chair"]+": "+values.chair+"m"}>
                <Slider min={0.10} max={1.0} step={0.01} name="chair" />
            </Form.Item>
            <Form.Item name="offset" label={Language[curLang]["offset"]+": "+values.offset+"m"}>
                <Slider min={1.0} max={3.0} step={0.1} name="offset"/>
            </Form.Item>  
            <Button type="primary" htmlType="submit">{Language[curLang]["add"]}</Button>
        </Form>
    )
}

export default TableConfigurator
