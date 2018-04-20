/**
 *
 * @author : tanliangbang
 * @date : 2018-1-3
 */

const API_BASE = '';

module.exports = {
    getResListUrl: API_BASE + '/api/res/getResList',  //获取资源列表
    getResContentListUrl: API_BASE + '/api/res/getResContentList',
    getResDetailUrl: API_BASE + '/api/res/getRes',
    getAddResUrl: API_BASE + '/api/res/addRes',
    getDelResUrl: API_BASE + '/api/res/delRes',
    getEditResUrl: API_BASE + '/api/res/updateRes',
    getAddResContentUrl: API_BASE + '/api/res/addResContent',
    getResContentUrl: API_BASE + '/api/res/getResContentById',
    getEditResContentUrl: API_BASE + '/api/res/UpdateResContent',
    getDelResContentUrl: API_BASE + '/api/res/delResContent',
    getAddPlateUrl: API_BASE + '/api/plate/addPlate',
    getPlateListUrl: API_BASE + '/api/plate/getPlateList',
    getDelPlateUrl: API_BASE + '/api/plate/delPlate',
    getPlateDetailByIdUrl: API_BASE + '/api/plate/getPlateDetailById',
    getUpdatePlateUrl: API_BASE + '/api/plate/updatePlate',
    getPlateAndResListUrl: API_BASE + '/api/plate/getPlateListAndPlate',
    getaddOrUpdateAticleUrl: API_BASE + '/api/Article/addOrUpdateArticle',
    getArticleListByTypeUrl: API_BASE + '/api/Article/getArticleListByType',
    getDelArticleUrl: API_BASE + '/api/Article/delArticle',
    getArticleByIdUrl: API_BASE + '/api/Article/getArticleById',
    getOperaArticleUrl: API_BASE + '/api/Article/operaArticle',
    getCommentListUrl: API_BASE + '/api/comments/allCommentList',
    delCommentUrl: API_BASE + '/api/comments/delComment'
};

