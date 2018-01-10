import { Tool, merged } from '../utils/Tool';
import * as actionConstant from '../constants/actionConstant';
import axios  from 'axios';

const api = require( './../utils/api' );



export const changeResList = (response) => ({
    type: actionConstant.GET_RES_LIST,
     resList: response
})

export const getResList = () => {
    return dispatch => {
            axios.get(api.getResListUrl,{}).then(function (res) {
                dispatch(changeResList(res.data.data))
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
            dispatch(changeResDetail(res.data.data[0]))
            resolve();
        }).catch(function (response) {
            console.log("获取资源详情失败")
        });
    }
}















