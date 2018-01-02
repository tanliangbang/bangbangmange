import { Tool, merged } from '../Tool';
import * as actionConstant from '../constants/actionConstant';
import axios  from 'axios';


export const initProductList = (response) => ({
    type: actionConstant.GET_PRODUCT_LIST,
     productList: response,
})

export const initProductDetail = (response) => ({
    type: actionConstant.GET_PRODUCT_DETAIL,
    productDetail: response,
})

export const addProject = (basicField,fileFieldType,id,callback) => {
    var fileFieldType = JSON.stringify(fileFieldType);
    var basicField = JSON.stringify(basicField);
    if(id!=null){
        return dispatch => {
            axios.put(`/api/v1/bond/projects/`+id,{summary:basicField,details:fileFieldType}).then(function (res) {
                callback(true,"修改成功")
            }).catch(function (response) {
                callback(false,"修改失败")
            });
        }
    }else{
        return dispatch => {
            axios.post(`/api/v1/bond/projects`,{summary:basicField,details:fileFieldType}).then(function (res) {
                callback(true,"添加成功")
            }).catch(function (response) {
                callback(true,"添加失败")
            });
        }
    }

}


export const getProductList = () => {
    return dispatch => {
        axios.get(`/api/v1/bond/projects`).then(function (res) {
            var currdata = parseData(res.data);
            dispatch(initProductList(currdata))
        }).catch(function (response) {
            console.log(response);
        });

    }
}

export const delProduct = (id) => {
    return dispatch => {
        axios.delete(`/api/v1/bond/projects/`+id).then(function (res) {
            console.log(res)
        }).catch(function (response) {
            console.log(response);
        });
    }
}





export const getProductDetail = (id) => {
    return dispatch => {
        axios.get(`/api/v1/bond/projects/`+id).then(function (res) {
            var currData = initProductDetail((res.data)[0])
            currData.productDetail.summary = JSON.parse(currData.productDetail.summary);
            currData.productDetail.details = JSON.parse(currData.productDetail.details);
            dispatch(currData)
        }).catch(function (response) {
            console.log(response);
        });

    }
}





function parseData(res){
     for(var i=0;i<res.length;i++){
         res[i].summary = JSON.parse(res[i].summary)
     }
    return res;
}
















