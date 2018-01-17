import './style.scss';
import React,{Component, PropTypes} from 'react'

class UpLoadField extends Component {
    constructor(props) {
        super(props);
        this.state ={
            isShowAddFileType:false
        }
    }

    componentWillMount() {
    }

    showAddFileType(){
       this.setState({
           isShowAddFileType:true,
       })
    }

    uploadBtnFn(fileTypeTitle,contentTitle,e){
        this.props.uploadFn(fileTypeTitle,contentTitle,e.target)
    }

    addFileType(){
        var value =this.refs.fileTile.value
        if(value==""){
            alert("请输入名称");
            return;
        }
      this.props.addFileTypeContentFn(this.props.fileData.name,value);
       this.setState({
           isShowAddFileType:false
       })
        this.refs.fileTile.value = "";

    }




  render() {
       const {files,isShowAddFileType} = this.state
       const {fileData} = this.props;
      return (
        <div className="upLoadField">
            {
                fileData.value.map((item, key) => {
                    return (
                        <div key={key} >
                            <div className="uploadList">
                                <span>{item.name}</span>
                                <button onClick={this.uploadBtnFn.bind(this,fileData.name,item.name)}>上传</button>
                                <div className="uploadProgress"><span style={{width:"0px"}}></span></div>
                                {
                                    item.value.map((item, index) => {
                                        return(
                                            <p key={index}>
                                                <a target="_blank" href={item.url}>{item.name} &nbsp; &nbsp;{item.size} </a>
                                            </p>
                                        )
                                    })
                                }
                            </div>

                        </div>
                    )
                })
            }
            <div className={isShowAddFileType?"":"none"}>
                <input className="fileTitle" ref="fileTile" type="text"/>
                <button onClick={this.addFileType.bind(this)}>确定</button>
            </div>


                <a className="addBasicFieldeBtn" onClick={this.showAddFileType.bind(this)}>新增项目</a>

        </div>
    );
  }
}

export default  UpLoadField;