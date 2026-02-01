
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

console.log("Cloudinary config check:", cloudinary.config().cloud_name);

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wanderlust_DEV",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

module.exports = { cloudinary, storage };


// cloudinary.api.ping()
//   .then((res) => console.log("✅ cloudinary ping ok:", res))
//   .catch((e) => {
//     console.log("❌ cloudinary ping full error:", e);
//     console.log("❌ as JSON:", JSON.stringify(e, null, 2));
//   });

