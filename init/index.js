// const mongoose = require('mongoose');
// const initData = require("./data");
// const Listing = require("../models/listing.js");
// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'
// main()
//   .then(() => console.log("Connected to MongoDB"))
//   .catch(err => console.error("Failed to connect to MongoDB", err));

// async function main() {
//   await mongoose.connect(MONGO_URL)
// }
// const initDB = async () => {
//   try {
    

//     await Listing.deleteMany({});
//     initData.data = initData.data.map(listing => ({ ...listing, owner: "6973c1c62149f3328045d800" }));
//     await Listing.insertMany(initData.data);
//     console.log("Sample listings inserted successfully");
//   } catch (err) {
//     console.error("Error inserting sample data:", err);
//   }
// };
// initDB();
require("dotenv").config();
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const initData = require("./data");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("Failed to connect to MongoDB", err));


async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});

    // 🔥 Fetch existing Atlas user
    const user = await User.findOne({ username: "wandersoul" });

    if (!user) {
      console.log("User not found in Atlas DB");
      return;
    }

    const updatedData = [];

    for (let listing of initData.data) {

      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${listing.location}`
      );
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0) continue;

      const lat = geoData[0].lat;
      const lng = geoData[0].lon;

      updatedData.push({
        ...listing,
        owner: user._id,   // 👈 use real user ID
        geometry: {
          type: "Point",
          coordinates: [lng, lat]
        }
      });
    }

    await Listing.insertMany(updatedData);
    console.log("Seeded successfully with real user");

  } catch (err) {
    console.error("Error inserting sample data:", err);
  } finally {
    mongoose.connection.close();
  }
};


initDB();