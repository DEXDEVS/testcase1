const createHttpError = require("http-errors");
const {extractDataFromExcel} = require('../utils/extractDataFromExcel')
const getExcelDataService = async (req) => {
    try {
        const {path} = req.files[0];
        const totalCards =extractDataFromExcel(path);
        if(totalCards.length===0){
            throw new createHttpError(400,'Invalid format');
        }
        return totalCards;
    } catch (error) {
        throw new createHttpError(error);
    }
};

module.exports = {getExcelDataService}