import * as alt from 'alt-server';
import axios from 'axios';
import * as express from 'express';
import * as cors from 'cors';
import { IPlayer } from '../interface/IPlayer';
import { IDiscord } from '../interface/IDiscord';

const config: IDiscord = { ...process.env } as IDiscord;
const app = express();

app.use(cors());
app.get('/authenticate', handleAuthenticate);
// app.use('/js', express.static(jsPath));

async function handleAuthenticate(req, res) {
    const token = req.query.code;
    const discordToken = req.query.state;
    let request;

    if (!token || !discordToken) {
        res.send(`No token found.`);
        // res.sendFile(path.join(htmlPath, '/error.html'), (err) => {});
        return;
    }

    const authParams = new URLSearchParams();
    authParams.append(`client_id`, config.CLIENT_ID);
    authParams.append(`client_secret`, config.CLIENT_SECRET);
    authParams.append(`grant_type`, `authorization_code`);
    authParams.append(`code`, token);
    authParams.append(`scope`, `identify`);
    authParams.append(`redirect_uri`, `http://${config.REDIRECT_IP}:7790/authenticate`);

    request = await axios.post(`https://discordapp.com/api/oauth2/token`, authParams, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
            Authorization: `${discordData.token_type} ${discordData.access_token}`,
        },
    });

    if (!request.data || !request.data.id || !request.data.username) {
        // res.sendFile(path.join(htmlPath, '/error.html'), (err) => {});
        res.send(`Discord data was not found.`);
        return;
    }

    // id, username, avatar, discriminator, public_flags, flags, locale, mfa_enabled
    const player = alt.Player.all.find((player) => {
        const playerExt: IPlayer = player as IPlayer;
        playerExt.discordToken === discordToken;
    });

    if (!player || !player.valid) {
        // res.sendFile(path.join(htmlPath, '/error.html'), (err) => {});
        res.send(`Failed to find matching player for authentication.`);
        return;
    }

    alt.emit('login:Start', player, request.data);
    // res.sendFile(path.join(htmlPath, '/done.html'), (err) => {});
    res.send(`All done. Bye.`);
}

app.listen(7790);
