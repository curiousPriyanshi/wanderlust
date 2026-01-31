// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// console.log("CLOUDINARY ENV:", {
//   CLOUD_NAME: process.env.CLOUD_NAME,
//   CLOUD_API_KEY: process.env.CLOUD_API_KEY,
//   CLOUD_API_SECRET: process.env.CLOUD_API_SECRET ? "✅ present" : "❌ missing",
// });

// // console.log("SECRET length:", process.env.CLOUD_API_SECRET?.length);
// // cloudinary.api.ping()
// //   .then(() => console.log("✅ cloudinary ping ok"))
// //   .catch((e) => console.log("❌ cloudinary ping fail", e.message));



// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'wanderlust_DEV',
//      allowedFormats: ["jpeg", "png", "jpg"]
//   },
// });

// module.exports = { cloudinary, storage };

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

