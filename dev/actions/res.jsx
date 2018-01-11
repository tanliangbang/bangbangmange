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

















