import { readFileSync } from 'fs';

export const CONFIG_FILE = 'config.json';
export const CONFIG = () => JSON.parse(readFileSync(CONFIG_FILE,'utf8'));