require('dotenv').config();
const fs = require('fs');
const sharp = require('sharp');
const axios = require('axios');
const cheerio = require('cheerio');

const convertSvgIntoPng = async () => {
await sharp('./mySvgFile.svg')
    .png()
    .resize(8000) // Resizing the image, you can adjust the size
    .toFile('./output.png')
}

const convertSvgIntoFile = async (svgString) => {
    const $ = cheerio.load(svgString);
    let svgElement = $('svg');

    const filePath = './mySvgFile.svg';
    fs.writeFileSync(filePath, $.html(svgElement));
}

// Function to read image and send to Mathpix API
const recognizeMathFromImage = async () => {
    try {
        // Read the image file
        const imageBase64 = fs.readFileSync('./output.png', { encoding: 'base64' });

        // Set up the request headers
        const headers = {
            'app_id': process.env.MATHPIX_APP_ID,
            'app_key': process.env.MATHPIX_APP_KEY,
            'Content-type': 'application/json'
        };

        // Set up the request body
        const body = {
            'src': `data:image/png;base64,${imageBase64}`,
            "formats": ["text"],
            data_options: {
                include_asciimath: true,
                include_latex: true,
            },
        };

        // Send a POST request to Mathpix
        const response = await axios.post('https://api.mathpix.com/v3/latex', body, { headers: headers });

        return response?.data?.text.replace(/^[^\d]+/, '')
    } catch (error) {
        console.error('Error1:', error.message);
    }
}

const fetchMathResult = async (svgString)  => {
    await convertSvgIntoFile(svgString)
    await convertSvgIntoPng();
    let expression = await recognizeMathFromImage();

    const apiKey = process.env.GPT_API_KEY;

    const OpenAI = require('openai');
    const openai = new OpenAI({
        apiKey: apiKey
    });

    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: `Give a math result from this expression: ${expression} << Just return only number, nothing else!` }],
        max_tokens: 1000,
    });

    return chatCompletion.choices[0].message.content;
}

module.exports = {
    fetchMathResult
};
