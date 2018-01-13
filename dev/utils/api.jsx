/**
 *
 * @author : tanliangbang
 * @date : 2018-1-3
 */

const API_BASE = '';

module.exports = {
    getResListUrl: API_BASE + '/api/res/getResList',  //获取资源列表
    getResContentListUrl:API_BASE + '/api/res/getResContentList',
    getResDetailUrl:API_BASE + '/api/res/getRes',
    getAddResUrl:API_BASE + '/api/res/addRes',
    getDelResUrl:API_BASE + '/api/res/delRes',
    getEditResUrl:API_BASE + '/api/res/updateRes',
    getAddResContentUrl:API_BASE + '/api/res/addResContent',
    getResContentUrl:API_BASE + '/api/res/getResContentById',
    getEditResContentUrl:API_BASE + '/api/res/UpdateResContent',
    getDelResContentUrl:API_BASE + '/api/res/delResContent',
};

