import React from "react";
import {useLangHandler, Language} from "./Stores/LangStore"
import {Upload, message, Button} from 'antd';
import {UploadOutlined} from '@ant-design/icons';



function ImageLoader({onUpload}){
  const curLang = useLangHandler(state => state.state);

    //if image is uploaded, trigger event with source of image
    //that can be read by parent component
    function handleImage(file){
        var reader = new FileReader();
        reader.onload = function(event){
            var img = new Image();
            
            img.src = event.target.result;
            onUpload(img);
        }
        reader.readAsDataURL(file);     
    }
    //simple upload button for image upload
    return (<Upload name="plan" beforeUpload={beforeUpload} action={handleImage} showUploadList={false}>
        <Button>
          <UploadOutlined /> {Language[curLang]["selectImage"]}
        </Button>
      </Upload>
      );
}
export default ImageLoader;

//check if file is jpg or png
function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }

    return isJpgOrPng;
  }

