// writes a mood to mood.txt

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const moodPath = path.join(__dirname, 'mood.txt');
const playlistPath = path.join(__dirname, 'playlist.txt');

const mood = "happy 5";

fs.writeFile(moodPath, `${mood}`, async (err) => {
	if (err) throw err;
	console.log('The mood has been saved!\n');

    let debounceTimeout;

    fs.watch(playlistPath, (eventType) => {
        if (eventType === 'change') {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(async () => {
            // Read the updated playlist.txt file
            const songs = await fs.promises.readFile(playlistPath, 'utf-8');
            console.log(songs);
            process.exit(0);
            }, 1000); // Adjust the debounce delay as needed
        }}
    )});