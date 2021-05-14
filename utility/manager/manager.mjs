import axios from 'axios';

axios.get(`http://127.0.0.1:8899/restart/core`).catch(err => {
    if (!err) {
        return;
    }

    console.log(`Please run your server first. 'npm run windows' or 'npm run linux'`); 
    console.log(`Ignore this message if your server is already running / working.`);
}).then(() => {
    console.log(`Triggered core server refresh.`);
});