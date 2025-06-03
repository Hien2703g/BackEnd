const uploadToCloudinary = require("../../Helper/uploadToCloudinary");
module.exports.upload = async (req, res, next) => {
  if (req.file) {
    const link = await uploadToCloudinary.uploadToCloudinary(req.file.buffer);
    req.body[req.file.fieldname] = link;
  }
  next();
};
