import fkill from 'fkill';
const ports = [7788, 'altv-server', 'altv-server.exe'];

for (let i = 0; i < ports.length; i++) {
    try {
        fkill(ports[i], { force: true, ignoreCase: true, silent: true });
    } catch (err) {
    }
}