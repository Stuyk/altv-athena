import express from 'express';
import * as path from 'path';
import cors from 'cors';

const app = express();
const currentPath = path.join(process.cwd(), '/resources/webserver/files');

console.log(currentPath);

app.use(cors());

app.use('/', express.static(currentPath));

app.listen(9111, () => {
    console.log(`Started express server on: http://localhost:9111`);
    console.log(`Serving Files from: ${currentPath}`);
});
