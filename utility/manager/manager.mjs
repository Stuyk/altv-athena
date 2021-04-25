import axios from 'axios';

axios.get(`http://127.0.0.1:8899/restart/core`).catch(err => {
    console.log(`Please run your server first. 'npm run windows' or 'npm run linux'`);
});

