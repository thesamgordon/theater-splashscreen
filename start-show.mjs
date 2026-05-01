import { execSync, spawn } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';
import OBSWebSocket from 'obs-websocket-js';
import env from 'dotenv';

env.config();

const hostname = os.hostname().split('.')[0].toLowerCase();
let dnsUrl = `http://${hostname}.local`;

try {
    execSync(`ping -c 1 ${hostname}.local`).toString();
} catch (error) {
    dnsUrl = `http://${hostname}.lan`;

    try {
        execSync(`ping -c 1 ${hostname}.lan`).toString();
    } catch (error) {
        console.error("Failed to resolve both .local and .lan domains: ", error.message);
        process.exit(1);
    }
}

const lobbyUrl = `${dnsUrl}/display`;
const dashboardUrl = `${dnsUrl}/dashboard`;

const buildPath = path.join(process.cwd(), '.next');

const shouldRebuild = () => {
    if (!fs.existsSync(buildPath)) return true;

    const buildTime = fs.statSync(buildPath).mtimeMs;
    const foldersToWatch = ['app', 'components', 'public', 'lib'];

    for (const folder of foldersToWatch) {
        const fullPath = path.join(process.cwd(), folder);
        if (fs.existsSync(fullPath)) {
            const stats = fs.statSync(fullPath);
            if (stats.mtimeMs > buildTime) return true;

            const files = execSync(`find ${fullPath} -type f -newer ${buildPath} 2>/dev/null`).toString();
            if (files.trim().length > 0) return true;
        }
    }
    return false;
};

if (shouldRebuild()) {
    console.log("Changes detected or no build found. Rebuilding...");
    execSync('npm run build', { stdio: 'inherit' });
}


const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const BLUE = "\x1b[34m";
const WHITE = "\x1b[37m";
const GRAY = "\x1b[90m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";

const labelWidth = 14;
const totalInnerWidth = 54;

const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*m/g, '');

const formatLine = (content) => {
    const visibleLength = stripAnsi(content).length;
    const paddingNeeded = Math.max(0, totalInnerWidth - visibleLength);
    return `${BLUE}║${RESET} ${content}${' '.repeat(paddingNeeded)} ${BLUE}║${RESET}`;
};

console.clear();
console.log(`${BLUE}╔════════════════════════════════════════════════════════╗${RESET}`);
console.log(formatLine(`              ${BOLD}${WHITE}MHS LOBBY CONTROL SYSTEM${RESET}   `));
console.log(`${BLUE}╠════════════════════════════════════════════════════════╣${RESET}`);
console.log(formatLine(""));
console.log(formatLine(` ${BOLD}${"Display URL:".padEnd(labelWidth)}${RESET} ${RED}${lobbyUrl}${RESET}`));
console.log(formatLine(` ${BOLD}${"Remote URL:".padEnd(labelWidth)}${RESET} ${RED}${dashboardUrl}${RESET}`));
console.log(formatLine(""));
console.log(`${BLUE}╠════════════════════════════════════════════════════════╣${RESET}`);
console.log(formatLine(` ${GREEN}● SYSTEM ONLINE${RESET}`));
console.log(formatLine(` ${GRAY}Press Ctrl+C to terminate session${RESET}`));
console.log(`${BLUE}╚════════════════════════════════════════════════════════╝${RESET}\n`);

try {
    const obsCheckScript = `
        if application "OBS" is not running then
            activate application "OBS"
            delay 2
        end if
    `;

    execSync(`osascript -e '${obsCheckScript}'`);
    console.log(`${GREEN}✔${RESET} Successfully opened OBS.`);
} catch (e) {
    console.log(`${BOLD}\x1b[31m[!]${RESET} ${GRAY}Could not auto-launch OBS. Please open it manually.${RESET}`);
}

const server = spawn('npx next start -H 0.0.0.0 -p 80', {
    shell: true
});

const obs = new OBSWebSocket();

export const refreshSource = async () => {
    try {
        await obs.connect('ws://127.0.0.1:4455', process.env.OBS_PASSWORD || undefined);

        await obs.call('PressInputPropertiesButton', {
            inputName: "Browser",
            propertyName: 'refreshnocache'
        });

        console.log(`${GREEN}✔${RESET} Successfully refreshed browser source.`);

        await obs.disconnect();
        return true;
    } catch (error) {
        console.error(`${RED}✘${RESET} OBS WebSocket Error: ${error.message}. Retrying...`);
        return false;
    }
}

server.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('error')) {
        console.log(output);
    }
});

server.stderr.on('data', (data) => {
    console.error(`${RED}✘${RESET} [Server Error]: ${data}`);
});

const interval = setInterval(async () => {
    const success = await refreshSource();
    if (success) clearInterval(interval);
}, 2000);