import fkill from 'fkill';
const ports = [7788, 'altv-server', 'altv-server.exe', 3399];

for (const port of ports) {
    try {
        fkill(port, { force: true, ignoreCase: true, silent: true });
    } catch (err) {
        console.log(err);
    }
}
