const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
})

const uploadToS3 = (category, files, prefixFileName) => {
  const result = Promise.all(
      files.map((file) => {
        // var reg = /(?:\.([^.]+))?$/;
        // var ext = reg.exec(file.originalname)[1]; 
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          // Key: `${category}/${prefixFileName}-${file.originalname}`,
          Key: category === 'Policy'? `${category}/${file.originalname}.pdf`:`${category}/${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'private' //'public-read',
        }      
        return new Promise((resolve, reject) => {
          s3.upload(params, (err, res) =>
            {
              err == null ? resolve(res.key) : reject(err)
            })
        })
      })
    ) 
  return result
}

// private bucket
const getFromS3 = (key) => {
  // console.log('fileName',key)
  return new Promise((resolve, reject) => {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,              
        Key: key //fileName       
      };
      
      s3.getObject(params, function (err, res) {
          if (err) {
            // console.log('error  : ', err )
              // reject(err);
              resolve({});
          } else {
              // console.log("Successfully dowloaded data from bucket");
              resolve(res);
          }
      });        
  });
  
}

// public bucket
const getFromS3Bucket = (key) => {
  // console.log('fileName',key)
  return new Promise((resolve, reject) => {
      const params = {
        Bucket: 'stonewell-bucket',              
        Key: key //fileName       
      };
      
      s3.getObject(params, function (err, res) {
          if (err) {
            // console.log('error  : ', err )
              reject(err);
          } else {
              // console.log("Successfully dowloaded data from bucket");
              resolve(res);
          }
      });        
  });
  
}
const deleteFromS3 = () => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: 'stonewell-private', //BUCKET_NAME,  
      Key: 'Refund/RefundRequested/Allianz-Non-student_15075635.pdf.pdf' //fileName       
    };
        s3.deleteObject(params, function (err, res) {
          if (err) {reject(err)}
          else
              console.log("Successfully deleted file from S3");
              // console.log(res);
              resolve({status: 200, message: "Successfully deleted file from S3" })
      });
  });
}

module.exports = {uploadToS3, getFromS3, getFromS3Bucket, deleteFromS3}