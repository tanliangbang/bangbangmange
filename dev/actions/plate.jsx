import { Tool, merged } from '../utils/Tool.jsx';
import * as actionConstant from '../constants/actionConstant.jsx';
import axios  from 'axios';
const api = require( './../utils/api.jsx' );


export const addOrEditorPlate = (param,resolve,reject) => {
    return dispatch => {
        if(param.id===undefined||param.id ===null){
            axios.post(api.getAddPlateUrl,param).then(function (res) {
                resolve("成功");
            }).catch(function (err) {
                reject(err);
            });
        }else{
            axios.post(api.getUpdatePlateUrl,param).then(function (res) {
                dispatch(getPlateList(resolve,reject))
            }).catch(function (response) {
                reject();
            });
        }



    }
}

export const changePlateList = (response) => ({
    type: actionConstant.GET_PLATE_LIST,
    plateList: response
})

export const getPlateList = (resolve,reject) => {
    return dispatch => {
        axios.get(api.getPlateListUrl,{}).then(function (res) {
            dispatch(changePlateList(res.data.data))
            resolve();
        }).catch(function (response) {
            reject("获取资源列表失败")
        });
    }
}



export const delPlate = (id,resolve,reject) => {
    return dispatch => {
        axios.post(api.getDelPlateUrl,{id:id}).then(function (res) {
            dispatch(getPlateList(resolve,reject))
            resolve("成功");
        }).catch(function (err) {
            reject(err);
        });
    }
}


export const getPlateDetailById = (id,resolve,reject) => {
    return dispatch => {
        axios.get(api.getPlateDetailByIdUrl+"?id="+id).then(function (res) {
            let data = res.data.data[0];
            resolve(data);
        }).catch(function (response) {
            console.log("获取模块详情失败")
        });
    }
}

export const changePlateListAndRes = (response) => ({
    type: actionConstant.GET_PLATE_RES_LIST,
    plateAndResList: response
})

export const getPlateAndResList = (resolve,reject) => {
    return dispatch => {
        axios.get(api.getPlateAndResListUrl).then(function (res) {
            dispatch(changePlateListAndRes(res.data.data))
            resolve();
        }).catch(function (response) {
            reject("获取模块列表失败")
        });
    }
}





