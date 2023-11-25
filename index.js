const puppeteer = require('puppeteer');
const { fetchMathResult } = require('./ocr');

async function runBot() {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-maximized'], timeout: 0 }); // Set a higher timeout (e.g., 0 for no timeout)
    const page = await browser.newPage();

    try {
        // Navigate to the website
        await page.goto('https://vote.junioreurovision.tv');

        // Click the "See Video" button
        await page.waitForSelector('button.c-hCWQRl');
        // Click the "See Video" button
        await page.click('button.c-hCWQRl');

        await page.waitForTimeout(1200); // Assuming the video lasts for 60 seconds

        // Play the video
        await page.click('button[aria-label="Play video"]');

        // Wait for the video to finish
        const maxWaitTime = 290000 ; // Maximum wait time for video completion
        const interval = 5000; // Check every 5 seconds

        // Wait for the video to finish
        let waitedTime = 0;
        while (waitedTime < maxWaitTime) {
            await page.waitForTimeout(interval);
            waitedTime += interval;

            const video = await page.$('video');
            const currentTime = await page.evaluate(video => video.currentTime, video);
            let voteNowButton1 = await page.$('button.c-hCWQRl:not([disabled])');
            if (voteNowButton1) {
                console.log('Just enabled vote button')
                break;
            }
        }

        // Click the "Vote Now" button
        const voteNowButton = await page.$('button.c-hCWQRl:not([disabled])');
        if (voteNowButton) {
            console.log('click vote')
            await voteNowButton.click();
        } else {
            console.log('Vote Now button is not enabled. Video may not have finished yet.');
        }

        await page.waitForTimeout(2000);

        let itemsToSelect = ['Georgia'];
        const allCountries = ['Albania','Armenia','Estonia','France','Germany','Ireland','Italy','Malta','Netherlands','North Macedonia','Poland','Portugal','Spain','Ukraine','United Kingdom'];

        const getRandomInt = function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        let randomIndex1, randomIndex2;

        // Ensure two unique random indices
        do {
            randomIndex1 = getRandomInt(allCountries.length);
            randomIndex2 = getRandomInt(allCountries.length);
        } while (randomIndex1 === randomIndex2);

        // Add the countries at these indices to itemsToSelect
        itemsToSelect.push(allCountries[randomIndex1], allCountries[randomIndex2]);

        // Select 3 items
        for (const itemName of itemsToSelect) {
            console.log(`${itemName} Clicked`)
            // Click on the item
            await page.click(`button[aria-label*="${itemName}"]`);

            // Wait for a brief moment (adjust as needed)
            await page.waitForTimeout(1000);
        }

        console.log(`All Items selected`)

        // Click on the "Vote" button
        await page.click('button.c-hCWQRl:not([disabled])');

        await page.waitForTimeout(10000);

        // Extract the SVG content from the div
        const svgContent = await page.$eval('.c-giyTSW', (svg) => svg.outerHTML);

        console.log(svgContent)

        await page.waitForTimeout(5000);

        // You can send the SVG content to ChatGPT here and get the result
        // Replace the following line with your actual logic to get the result from ChatGPT
        const gptResult = await calculateResultFromGPT(svgContent);

        console.log(gptResult)

        // Fill in the input with the result
        await page.type('label.c-ByUay input', gptResult);

        await page.waitForTimeout(5000);

        // Click on the "Submit" button
        await page.click('button.c-hCWQRl:not([disabled])');

        await page.waitForTimeout(5000);

        console.log(`Clicked Vote`)
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        console.log('done')
        await browser.close();

        // Call runBot again after a delay
        console.log('Restarting the bot after a short delay...');
        setTimeout(runBot, 5000); // 5000 milliseconds delay before restarting
    }
}

// Function to simulate getting a result from ChatGPT
async function calculateResultFromGPT(svgContent) {
    return await fetchMathResult(svgContent)
}


runBot();