const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

require('dotenv').config();

///this is to upload a vide or image

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
console.log(s3)

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_Bucket_Name,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `uploads/${Date.now()}_${file.originalname}`);
        },
    }),
});

module.exports = upload;