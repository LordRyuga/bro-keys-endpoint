import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;
const CHANNEL_ID = process.env.SLACK_CHANNEL_ID;



const messageOpen = "Bro lab is open";
const messageClose = "Bro lab is closed";
let currentBroStatus = true;
let prevBroStatus = false;

function reverseBroStatus() {
    currentBroStatus = !currentBroStatus
    return currentBroStatus ? messageOpen: messageClose
}


export const printFromBro = async (req, res) => 
{
    let message = reverseBroStatus();
    console.log("Bro status changed to: " + message);
    try
    {
        const result = await postMessageToSlack(message);

        return res.status(200).json({ 
            success: true, 
            message: "Message posted to Slack successfully.",
            slackResponse: result
        });

    }catch (error) 
    {
        console.error('Error posting message to Slack:', error);
        return res.status(500).json({ error: 'Failed to post message to Slack' });
    }
}

const postMessageToSlack = async (message) => {
    let response = null;
    try
    {
        response = await axios.post(process.env.BASE_URL, {
            "channel": CHANNEL_ID,
            "text": message,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SLACK_TOKEN}`,
            },
        });
    }catch (error)
    {
        console.error('Error posting message to Slack:', error);
    }

    return response.data;
}

