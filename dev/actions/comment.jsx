import { Tool, merged } from '../utils/Tool.jsx';
import * as actionConstant from '../constants/actionConstant.jsx';
import axios  from 'axios';
const api = require( './../utils/api.jsx' );

export const setCommentList = (response) => ({
    type: actionConstant.SET_COMMENT_LIST,
    commentList: response
})

export const getCommentList = (resolve,reject) => {
    return dispatch => {
        axios.get(api.getCommentListUrl,{}).then(function (res) {
            dispatch(setCommentList(res.data.data))
            resolve();
        }).catch(function (response) {
            reject("获取评论列表失败")
        });
    }
}

export const delComment = (id,resolve,reject) => {
    return dispatch => {
        axios.post(api.delCommentUrl,{id:id}).then(function (res) {
            resolve("成功");
        }).catch(function (err) {
            reject(err);
        });
    }
}




