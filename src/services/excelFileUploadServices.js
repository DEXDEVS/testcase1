const createHttpError = require("http-errors");
const {extractDataFromExcel} = require('../utils/extractDataFromExcel')
const getExcelDataService = async (req) => {
    try {
        const {path} = req.files[0];
        const {orderInfo, totalCards} =extractDataFromExcel(path);

        if (!orderInfo || !orderInfo.orderNumber) {
            throw new createHttpError(400,'Order number not found');
        }
        if(!totalCards){
            throw new createHttpError(400,'Invalid format');
        }
        return {orderInfo, totalCards};
    } catch (error) {
        throw new createHttpError(error);
    }
};

module.exports = {getExcelDataService}