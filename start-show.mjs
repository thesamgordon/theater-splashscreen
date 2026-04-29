import { execSync, spawn } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';

const hostname = os.hostname().split('.')[0].toLowerCase();
const dnsUrl = `http://${hostname}.lan`;

const lobbyUrl = `${dnsUrl}/display`;
const dashboardUrl = `${dnsUrl}/dashboard`;

const buildPath = path.join(process.cwd(), '.next');

if (!fs.existsSync(buildPath)) {
    console.log("No production build found. Building the show now...");
    console.log("This may take a minute. Please wait.");
    execSync('npm run build', { stdio: 'inherit' });
}

const labelWidth = 16;

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const BLUE = "\x1b[34m";
const WHITE = "\x1b[37m";
const GRAY = "\x1b[90m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";

console.clear();
console.log(`${BLUE}╔═══════════════════════════════════════════════════╗${RESET}`);
console.log(`${BLUE}║${RESET}               ${BOLD}${WHITE}LOBBY CONTROL SYSTEM${RESET}                ${BLUE}║${RESET}`);
console.log(`${BLUE}╠═══════════════════════════════════════════════════╣${RESET}`);
console.log(`${BLUE}║${RESET}                                                   ${BLUE}║${RESET}`);
console.log(`${BLUE}║${RESET}  ${BOLD}${"Display URL:".padEnd(labelWidth)}${RESET} ${RED}${lobbyUrl.padEnd(31)}${RESET}${BLUE} ║${RESET}`);
console.log(`${BLUE}║${RESET}  ${BOLD}${"Remote URL:".padEnd(labelWidth)}${RESET} ${RED}${dashboardUrl.padEnd(31)}${RESET}${BLUE} ║${RESET}`);
console.log(`${BLUE}║${RESET}                                                   ${BLUE}║${RESET}`);
console.log(`${BLUE}╠═══════════════════════════════════════════════════╣${RESET}`);
console.log(`${BLUE}║${RESET}  ${GREEN}● SYSTEM ONLINE${RESET}                                  ${BLUE}║${RESET}`);
console.log(`${BLUE}║${RESET}  ${GRAY}Press Ctrl+C to terminate session                ${BLUE}║${RESET}`);
console.log(`${BLUE}╚═══════════════════════════════════════════════════╝${RESET}\n`);

const server = spawn('npx next start -H 0.0.0.0 -p 80', {
    shell: true
});

server.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('error')) {
        console.log(output);
    }
});

server.stderr.on('data', (data) => {
    console.error(`[Server Error]: ${data}`);
});