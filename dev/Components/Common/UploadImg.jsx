import './style.scss'
import React, { Component } from 'react'
import { Upload, Icon, message } from 'antd';



function beforeUpload(file) {
    const isJPG = file.type==="image/png"||file.type==="image/jpg"||file.type==="image/jpeg";
    if (!isJPG) {
        message.error('请选择正确的图片!');
    }
    const isLt4M = file.size / 1024 / 1024 < 4;
    if (!isLt4M) {
        message.error('图片不能超过 4MB!');
    }
    return isJPG && isLt4M;
}


export class UploadImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    setImgUrl(imgUrl){
        this.setState({
            imageUrl:imgUrl,
        });
    }


    handleChange (info) {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.props.uploadCallback(info.file.response);
            this.setState({
                imageUrl:info.file.response,
                loading: false,
            });
        }
    }




    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        return (
            <Upload
                name="resImg"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="/api/upload/uploadImg"
                beforeUpload={beforeUpload}
                onChange={this.handleChange.bind(this)}>
                {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton}
            </Upload>
        );
    }
}




export default  UploadImg;