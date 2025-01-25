const express = require('express');
const router = express.Router();
const { analyzeImageWithTextract } = require('../utils/sagemaker');

router.post('/', async (req, res) => {
    console.log("Received request on /classify");
    try {
        const imageBuffer = Buffer.from(req.body.image, 'base64'); // Decode Base64 image
        const detectedLines = await analyzeImageWithTextract(imageBuffer);

        // Send detected lines as an array
        res.json({ lines: detectedLines });
    } catch (error) {
        console.error("Error processing image:", error.message);
        res.status(500).json({ error: "Failed to process image" });
    }
});


module.exports = router;
