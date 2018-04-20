import { Tool, merged } from '../utils/Tool.jsx';
import * as actionConstant from '../constants/actionConstant.jsx';
import axios  from 'axios';
const api = require( './../utils/api.jsx' );

export const addOrEditorArticle = (param,resolve,reject) => {
    return dispatch => {
            axios.post(api.getaddOrUpdateAticleUrl,param).then(function (res) {
                resolve();
                //dispatch(getArticleListByType({},resolve,reject))
            }).catch(function (response) {
                reject();
            });
    }
}

export const changeArticleList = (response) => ({
    type: actionConstant.GET_ARTICLE_LIST,
    articleList: response
})

export const getArticleListByType = (param,resolve,reject) => {
    return dispatch => {
        axios.get(api.getArticleListByTypeUrl,{params:param}).then(function (res) {
            dispatch(changeArticleList(res.data.data))
            resolve();
        }).catch(function (response) {
            reject("获取资源列表失败")
        });
    }
}



export const delArticle = (id,resolve,reject) => {
    return dispatch => {
        axios.post(api.getDelArticleUrl,{id:id}).then(function (res) {
            dispatch(getArticleList(resolve,reject))
            resolve("成功");
        }).catch(function (err) {
            reject(err);
        });
    }
}


export const getArticleDetailById = (id,resolve,reject) => {
    return dispatch => {
        axios.get(api.getArticleByIdUrl+"?id="+id).then(function (res) {
            let data = res.data.data[0];
            resolve(data);
        }).catch(function (response) {
            console.log("获取模块详情失败")
        });
    }
}

export const operaArticle = (param,resolve,reject) => {
    return dispatch => {
        axios.post(api.getOperaArticleUrl,param).then(function (res) {
            resolve("成功");
        }).catch(function (err) {
            reject(err);
        });
    }
}


export const setPreUrlfn = (response) => ({
    type: actionConstant.SET_PRE_URL,
    preUrl: response
})

export const setPreUrl = (url) => {
    return dispatch => {
        dispatch(setPreUrlfn(url))
    }
}







