import { execSync, spawn } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';

const hostname = os.hostname().split('.')[0].toLowerCase();
let dnsUrl = `http://${hostname}.lan`;

try {
    execSync(`ping -c 1 ${hostname}.lan`).toString();
} catch (error) {
    dnsUrl = `http://${hostname}.local`;
}

const lobbyUrl = `${dnsUrl}/display`;
const dashboardUrl = `${dnsUrl}/dashboard`;

const buildPath = path.join(process.cwd(), '.next');

if (!fs.existsSync(buildPath)) {
    console.log("No production build found. Building the show now...");
    console.log("This may take a minute. Please wait.");
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