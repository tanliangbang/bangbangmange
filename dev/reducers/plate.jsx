import * as actionConstant from '../constants/actionConstant.jsx';

/**
 * Created by Administrator on 2017/2/14.
 */
// 初始化状态
let initplate = {
    plateList:[],
    plateAndResList:[]
}

export default function plate(state = initplate, action) {
    switch (action.type) {
        case actionConstant.GET_PLATE_LIST:
            return Object.assign({}, state, {
                plateList:action.plateList
            });
        case actionConstant.GET_PLATE_RES_LIST:
            return Object.assign({}, state, {
                plateAndResList:action.plateAndResList
            });

        default : return state;
    }
}