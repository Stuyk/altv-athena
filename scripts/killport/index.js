import { kill, killer } from 'cross-port-killer';

const ports = [7788];

async function tryKillingPortProcesses() {
    for (let i = 0; i < ports.length; i++) {
        const pids = await kill(ports[i]);
        if (pids && pids.length >= 1) {
            await killer.killByPids(pids);
        }
    }
}

tryKillingPortProcesses();
