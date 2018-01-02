import * as actionConstant from '../constants/actionConstant';

/**
 * Created by Administrator on 2017/2/14.
 */
// 初始化状态
let initProductList = {
    productList:[],
    productDetail:{}
}

export default function product(state = initProductList, action) {
    switch (action.type) {
        case actionConstant.GET_PRODUCT_LIST:
            return Object.assign({}, state, {
                productList:action.productList
            });
        case actionConstant.GET_PRODUCT_DETAIL:
            return Object.assign({}, state, {
                productDetail:action.productDetail
            });
        default : return state;
    }
}