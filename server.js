const express = require('express');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = 3000;

const NETLIFY_TOKEN = 'nfp_Hs6AfkjHWhu73ysyAb1gwLLLogkvpwfp43a3';

app.get('/deploy', async (req, res) => {
    try {
        // Step 1: Create a new site on Netlify
        const siteCreationResponse = await axios.post(
            'https://api.netlify.com/api/v1/sites',
            {},
            {
                headers: {
                    Authorization: `Bearer ${NETLIFY_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const siteId = siteCreationResponse.data.id;
        console.log('Site created with ID:', siteId);

        // Step 2: Read and encode "index.html" to base64
        const htmlContent = fs.readFileSync('index.html').toString('base64'); // Ensure hello.html is in the same directory

        // Step 3: Deploy "Hello World" HTML
        const deployResponse = await axios.post(
            `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
            {
                files: {
                    '/index.html': htmlContent, // Ensure the file is named index.html
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${NETLIFY_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const deployUrl = deployResponse.data.deploy_ssl_url;
        console.log('Deployed to:', deployUrl);

        // Respond with the deployment link
        res.send(`Site deployed successfully! View it at: ${deployUrl}`);
    } catch (error) {
        // Enhanced error logging
        console.error('Error deploying to Netlify:', error);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        res.status(500).send('Failed to deploy site to Netlify.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
