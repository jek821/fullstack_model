const { TextractClient, DetectDocumentTextCommand } = require('@aws-sdk/client-textract');
require('dotenv').config(); // Load environment variables

// Initialize Textract client with region and credentials from .env
const client = new TextractClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function analyzeImageWithTextract(imageBuffer) {
    console.log("Sending image to Textract...");

    const params = {
        Document: { Bytes: imageBuffer }, // Send raw image buffer
    };

    try {
        const command = new DetectDocumentTextCommand(params);
        const response = await client.send(command);

        // Extract detected text from the response
        const lines = response.Blocks
            .filter((block) => block.BlockType === 'LINE')
            .map((block) => block.Text);

        console.log("Detected Text Lines:", lines);
        return lines; // Return an array of detected lines
    } catch (error) {
        console.error("Error invoking Textract:", error.message);
        throw error;
    }
}

module.exports = { analyzeImageWithTextract };
