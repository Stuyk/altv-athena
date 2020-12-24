import * as alt from 'alt-server';
import express from 'express';
import cors from 'cors';
import { decryptData } from '../utility/encryption';
import bodyParser from 'body-parser';
import { handleLoginRouting } from '../views/login';


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/authenticate', handleAuthenticate);
// app.use('/js', express.static(jsPath));

async function handleAuthenticate(req, res) {
    if (!req.body || !req.body.data) {
        res.json({ status: false });
        return;
    }

    const queryData = JSON.parse(req.body.data);
    const discordDataJSON = decryptData(queryData);
    const discordData = JSON.parse(discordDataJSON);

    // id, username, avatar, discriminator, public_flags, flags, locale, mfa_enabled
    const player = alt.Player.all.find((player) => {
        const playerExt: alt.Player = player as alt.Player;
        return playerExt.discordToken === discordData.player_identifier;
    });

    if (!player || !player.valid) {
        // res.sendFile(path.join(htmlPath, '/error.html'), (err) => {});
        res.json({ status: false, message: 'Failed to find matching player.'});
        return;
    }

    handleLoginRouting(player as alt.Player, discordData);
    res.json({ status: true });
    // res.sendFile(path.join(htmlPath, '/done.html'), (err) => {});
}

app.listen(7790);
