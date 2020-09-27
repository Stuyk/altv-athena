import * as alt from 'alt-server';
import axios from 'axios';
import express from 'express';
import cors from 'cors';
import { handleLoginRouting } from '../views/login';
import { DISCORD_CONFIG } from '../athena/configDiscord';
import { Player } from 'alt-server';

const app = express();

app.use(cors());
app.get('/authenticate', handleAuthenticate);
// app.use('/js', express.static(jsPath));

async function handleAuthenticate(req, res) {
    const bearerToken = req.query.code;
    const discordToken = req.query.state;

    let request;

    if (!bearerToken || !discordToken) {
        res.send(`No token found.`);
        // res.sendFile(path.join(htmlPath, '/error.html'), (err) => {});
        return;
    }

    const authParams = new URLSearchParams();
    authParams.append(`client_id`, DISCORD_CONFIG.DISCORD_CLIENT_ID);
    authParams.append(`client_secret`, DISCORD_CONFIG.DISCORD_CLIENT_SECRET);
    authParams.append(`grant_type`, `authorization_code`);
    authParams.append(`code`, bearerToken);
    authParams.append(`scope`, `identify`);
    authParams.append(`redirect_uri`, `http://${DISCORD_CONFIG.DISCORD_REDIRECT_IP}:7790/authenticate`);

    request = await axios.post(`https://discordapp.com/api/oauth2/token`, authParams, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (!request.data || !request.data.access_token) {
        // res.sendFile(path.join(htmlPath, '/error.html'), (err) => {});
        res.send(`Failed to find access_token.`);
        return;
    }

    const discordData = { ...request.data };
    request = await axios.get(`https://discordapp.com/api/users/@me`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `${discordData.token_type} ${discordData.access_token}`
        }
    });

    if (!request.data || !request.data.id || !request.data.username) {
        // res.sendFile(path.join(htmlPath, '/error.html'), (err) => {});
        res.send(`Discord data was not found.`);
        return;
    }

    // id, username, avatar, discriminator, public_flags, flags, locale, mfa_enabled
    const player = alt.Player.all.find((player) => {
        const playerExt: Player = player as Player;
        return playerExt.discordToken === discordToken;
    });

    if (!player || !player.valid) {
        // res.sendFile(path.join(htmlPath, '/error.html'), (err) => {});
        res.send(`Failed to find matching player for authentication.`);
        return;
    }

    handleLoginRouting(player as Player, request.data);
    // res.sendFile(path.join(htmlPath, '/done.html'), (err) => {});
    res.send(`All done. Bye.`);
}

app.listen(7790);
