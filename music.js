// listens to mood.txt and prints to playlist.txt

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const moodPath = path.join(__dirname, 'mood.txt');
const playlistPath = path.join(__dirname, 'playlist.txt');
dotenv.config();

const API_KEY = process.env.API_KEY;

// Watch prng-service.txt for any changes
console.log("Listening to mood.txt");
fs.watch(moodPath, async (eventType) => {
    if (eventType === 'change') {
        const data =  (await fs.promises.readFile(moodPath, 'utf-8'));
        // split data into two by space, first is mood second is number of songs
        const [mood, numSongs] = data.split(' ');

        let page = Math.floor(Math.random() * 31) + 5;
        // let page = 1;
        let url = `http://ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=${mood}&api_key=${API_KEY}&format=json&page=${page}&limit=${numSongs}`;

        // make a get request from the url and print it out
        try {
            const response = await fetch(url);
            const data = await response.json();
            const tracks = data.tracks.track;
            console.log(tracks);
            // clear mood.txt
            await fs.promises.writeFile(playlistPath, '');
            for(let i = 0; i < numSongs; i++){
                let name = tracks[i].name;
                let artist = tracks[i].artist.name;
                let string = `${name} by ${artist}`;
                await fs.promises.appendFile(playlistPath, string + '\n');
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
            await fs.promises.writeFile(playlistPath, 'Error fetching data: ' + error.message);
        }
    }

})