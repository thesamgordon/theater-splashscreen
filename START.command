#!/bin/bash
cd "$(dirname "$0")"

echo -ne "\033]0;MHS LOBBY CONTROL SYSTEM\007"

node start-show.mjs