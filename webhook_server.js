const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// xAI API configuration (loaded from environment variables)
const XAI_API_URL = process.env.XAI_API_URL;
const XAI_API_KEY = process.env.XAI_API_KEY;

// Webhook route
app.post('/webhook', async (req, res) => {
    console.log('Received webhook:', req.body);
    
    try {
        const xaiResponse = await axios.post(XAI_API_URL, req.body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${XAI_API_KEY}`
            }
        });
        
        const responseContent = xaiResponse.data.choices[0].message.content;
        console.log('xAI response:', responseContent);
        
        // Send the xAI response back to Roblox
        res.status(200).json({ content: responseContent });
    } catch (error) {
        console.error('Error calling xAI API:', error.message);
        if (error.response) {
            console.error('xAI response:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to get xAI response' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Webhook server listening on port ${port}`);
});
