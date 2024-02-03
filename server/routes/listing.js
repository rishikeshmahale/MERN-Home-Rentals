const express = require("express")
const router = express.Router();
const multer = require("multer");

const Listing = require("../models/Listing.js");

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

// create listing
router.post("/create", upload.array("listingPhotos"), async (req, res) => {
  try {

    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    const listingPhotos = req.files

    if (!listingPhotos) {
      return res.status(400).send("No file uploaded.")
    }

    const listingPhotoPaths = listingPhotos.map(file => file.path);

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    })

    await newListing.save();

    return res.status(200).json(newListing);
  } catch (err) {
    return res.status(409).json({ message: "Fail to create Listing", error: err.message })
  }
});


// get listing by categories
router.get("/", async (req, res) => {
  const qCategory = req.query.category

  try {
    let listings
    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate("creator")
    } else {
      listings = await Listing.find().populate("creator")
    }

    return res.status(200).json(listings)
  } catch (err) {
    return res.status(404).json({ message: "Fail to fetch listings", error: err.message })
  }
})

// get listing by search
router.get("/search/:search", async (req, res) => {
  const { search } = req.params;

  try {
    let listings = []

    if (search === "all") {

      listings = await Listing.find().populate("creator");

    } else {

      listings = await Listing.find({
        $or: [
          { category: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
        ]
      }).populate("creator");

    }

    return res.status(200).json(listings);
    
  } catch (err) {
    return res.status(404).json({ message: "Fail to fetch listings", error: err.message })
  }
})

/* LISTING DETAILS */
router.get("/:listingId", async (req, res) => {

  try {

    const { listingId } = req.params;

    const listing = await Listing.findById(listingId).populate("creator");

    return res.status(200).json(listing)
  } catch (err) {
    return res.status(404).json({ message: "Listing can not found!", error: err.message })
  }
})

module.exports = router;
