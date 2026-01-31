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

const mongoose = require("mongoose");
const fetch = require("node-fetch");
const initData = require("./data");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});

    const updatedData = [];

    for (let listing of initData.data) {
      // 🔹 Geocode location
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${listing.location}`
      );
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0) {
        console.log("Skipping:", listing.title);
        continue;
      }

      const lat = geoData[0].lat;
      const lng = geoData[0].lon;

      updatedData.push({
        ...listing,
        owner: "6973c1c62149f3328045d800",
        geometry: {
          type: "Point",
          coordinates: [lng, lat]
        }
      });
    }

    await Listing.insertMany(updatedData);
    console.log("Sample listings with geometry inserted successfully");

  } catch (err) {
    console.error("Error inserting sample data:", err);
  } finally {
    mongoose.connection.close();
  }
};

initDB();
