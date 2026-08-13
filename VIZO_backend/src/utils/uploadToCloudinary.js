const cloudinary = require("../config/cloudinary.config");


const uploadToCloudinary = (fileBuffer, folder, resourceType="auto")=>{
    return new Promise((resolve, reject)=>{
        const uploadSterm = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type:resourceType,
            },
            (error, result)=>{
                if(error){
                    return reject(error);
                }
                resolve(result);
            }
        );
        uploadSterm.end(fileBuffer);
    });
};
module.exports = uploadToCloudinary;