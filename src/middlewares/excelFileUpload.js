const uploader = require('../utils/singleUploader');

function excelFileUpload(req, res, next) {
    const upload = uploader(
        'excel_files',
        [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
        ],
        4000000,
        'Only .xlsx or .xls format allowed!'
    );
    // call the middleware function
    upload.any()(req, res, (err) => {
        if (err) {
            res.status(500).json({
                errors: {
                    excel_file: {
                        msg: err.message,
                    },
                },
            });
        } else {
            next();
        }
    });
}

module.exports = excelFileUpload;
