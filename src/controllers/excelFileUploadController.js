const {getExcelDataService} = require('../services/excelFileUploadServices')
const {unlink} = require("fs");
const path = require("path");
exports.getExcelData = async (req, res, next) => {
    try {
        const result = await getExcelDataService(req);
        if (req.files?.length > 0) {
            const { filename } = req.files[0];
            unlink(path.join(__dirname, `/../../uploads/excel_files/${filename}`), (err) => {
                if (err) console.log(err);
            });
        }
        return res.status(200).json(result);
    } catch (error) {
        if (req.files?.length > 0) {
            const { filename } = req.files[0];
            unlink(path.join(__dirname, `/../../uploads/excel_files/${filename}`), (err) => {
                if (err) console.log(err);
            });
        }
        next(error);
    }
};