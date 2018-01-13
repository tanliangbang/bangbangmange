import { Tool, merged } from '../utils/Tool';
import * as actionConstant from '../constants/actionConstant';
import axios  from 'axios';

const api = require( './../utils/api' );



export const changeResList = (response) => ({
    type: actionConstant.GET_RES_LIST,
     resList: response
})

export const getResList = (resolve,reject) => {
    return dispatch => {
            axios.get(api.getResListUrl,{}).then(function (res) {
                dispatch(changeResList(res.data.data))
                resolve();
            }).catch(function (response) {
                 console.log("获取资源列表失败")
            });
        }
}




export const changeResContentList = (response) => ({
    type: actionConstant.GET_RES_CONTENT_LIST,
    resContentList: response
})

export const getResContentList = (type,current, pageSize,resolve,reject) => {
    var start = (current-1)*pageSize
    return dispatch => {
        axios.get(api.getResContentListUrl+"?name="+type+"&start="+start+"&size="+pageSize).then(function (res) {
            dispatch(changeResContentList(res.data.data))
            resolve("成功");
        }).catch(function (response) {
            console.log("获取资源内容列表失败")
        });
    }
}



export const changeResDetail = (response) => ({
    type: actionConstant.GET_RES_DETAIL,
    resDetail: response
})

export const getResDetail = (id,resolve,reject) => {
    return dispatch => {
        axios.get(api.getResDetailUrl+"?id="+id).then(function (res) {
            let data = res.data.data[0];
            dispatch(changeResDetail(data))
            resolve(data);
        }).catch(function (response) {
            console.log("获取资源详情失败")
        });
    }
}


export const addOrEditRes = (res,resolve,reject) => {
    return dispatch => {
        if(res.id===undefined||res.id ===null){
            axios.post(api.getAddResUrl,res).then(function (res) {
                dispatch(getResList(resolve,reject))
            }).catch(function (response) {
                reject();
            });
        }else{
            axios.post(api.getEditResUrl,res).then(function (res) {
                dispatch(getResList(resolve,reject))
            }).catch(function (response) {
                reject();
            });
        }

    }
}


export const delRes = (id,resolve,reject) => {
    return dispatch => {
        axios.post(api.getDelResUrl,{id:id}).then(function (res) {
            dispatch(getResList(resolve,reject))
        }).catch(function (response) {
            reject();
        });
    }
}

export const addOrEditorResContent = (fieldList,name,resContentId,resolve,reject) => {
    let startTime = fieldList.startTime;
    let endTime = fieldList.endTime;
    let isOnLine = fieldList.isOnLine?"1":"0";
    delete fieldList.startTime;
    delete fieldList.endTime;
    delete fieldList.isOnLine;
    let content = JSON.stringify(fieldList);
    let param = {
        startTime:startTime,
        endTime:endTime,
        onLine:isOnLine,
        content:content,
        name:name
    }
    return dispatch => {
        if(resContentId){
            param.resContentId = resContentId
            axios.post(api.getEditResContentUrl,param).then(function (res) {
                resolve();
            }).catch(function (response) {
                reject();
            });
        }else{
            axios.post(api.getAddResContentUrl,param).then(function (res) {
                resolve();
                // dispatch(getResContentList(name,1, 5,resolve,reject))
            }).catch(function (response) {
                reject();
            });
        }

    }
}





export const changeResContent = (response) => ({
    type: actionConstant.GET_RES_CONTENT,
    resContent: response
})

export const getResContent = (id,name,resolve,reject) => {
    return dispatch => {
        axios.get(api.getResContentUrl+"?id="+id+"&name="+name).then(function (res) {
            dispatch(changeResContent(res.data.data[0]))
            resolve(res.data.data[0]);
        }).catch(function (response) {
            reject("获取资源内容失败")
        });
    }
}


export const delResContent = (id,type,resolve,reject) => {
    return dispatch => {
        axios.post(api.getDelResContentUrl,{id:id,type:type}).then(function (res) {
            dispatch(getResContentList(type,1, 5,resolve,reject))
            resolve();
        }).catch(function (response) {
            reject();
        });
    }
}














