import { Tool, merged } from '../Tool';
import * as actionConstant from '../constants/actionConstant';
import axios  from 'axios';

const api = require( './../utils/api' );

export const changeResList = (response) => ({
    type: actionConstant.GET_RES_LIST,
     resList: response,
})


export const getResList = () => {
        return dispatch => {
            axios.get(api.getResList,{}).then(function (res) {
                dispatch(changeResList(res.data.data))
            }).catch(function (response) {
                 console.log("获取资源列表失败")
            });
        }
}
















