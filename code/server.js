'use strict';

const PORT = 3000;
const maps = require('./public/maps').maps;
const express = require("express");
const app = express();
const fs = require("fs"); // the module for writing operation
Math.random();

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));

/**
 * Route handler for GET request to the URL /state_info
 */
app.get("/state_info", (req, res) => {
    let state = req.query.state;

    // The function generates a random intiger between 0 and 49 (both inclusive)
    function randomNumber() {
        const number = Math.floor(Math.random() * 49 + 1)
        return number
    };

    // The function receives the state Id and returns its name
    function getStateName(stateId) {
        return maps[stateId].state
    };

    // if random state is chosen:
    if (state === undefined) {
        const stateId = randomNumber()
        state = getStateName(stateId)
        console.log('random choice:', state);
    } else {
        console.log(state);
    };

    const GoogleMap = getMapAddress(state);
    const stateFlag = getFlagAddress(state);

    // The function receives a state name and returns its url map address
    function getMapAddress(state) {
        for (const i in maps) {
            if (maps[i]['state'] === state) {
                return maps[i]['map']
            }
        }
    };

     // The function receives a state name and returns its url flag address
     function getFlagAddress(state) {
        for (const i in maps) {
            if (maps[i]['state'] === state) {
                return maps[i]['flag']
            }
        }
    };

    // Writes the requested state name to a text file used by the microservice (ms3) 
    fs.writeFile('stateName.txt', state, (err) => {
        if (err) throw err;
    });

    // Writes the requested state name to a text file used by the microservice (microservce_QuickFacts)
    fs.writeFile('stateName1.txt', state, (err) => {
        if (err) throw err;
    });

    // Delays opening the requested page, the time needed for microservice to extract the requested data
    setTimeout (() => {

        const length = state.length;
        
        fs.readFile('./public/stateData.txt', 'utf8', function(err, data){
            const textName = data.substring(0, length);

            fs.readFile('./public/stateFacts.txt', 'utf8', function(err, data){
                const factsName = data.substring(0, length);
                
                // the variable to hold a content for a script file used to modify the state_info html page
                let content = `const welcome = \'Welcome to ${state}!\';\nconst flagName = \'<b>The flag of ${state} & quick facts about the state (source Wikipedia):</b>\';\nconst data = ${GoogleMap};\nconst data2 = ${stateFlag};\n\nwindow.onload = function () {\n   document.getElementById('stateName').innerHTML = welcome;\n   document.getElementById('map').src=data;\n   document.getElementById('flag').src=data2;\n   document.getElementById('flag&facts').innerHTML = flagName;\n`;
                
                const stateInfoError = `document.getElementById('stateInfo').src ="alert.txt";\n`;
                const stateFactsError = `document.getElementById('stateFacts').src ="alert.txt";\n`;
                
                // checks if the microservices are working, if not, displays the info:
                if (state === textName && state === factsName) {
                    console.log('Microservices are working!\n')
                    content = `${content}};`
                } 
                else if (state != textName && state === factsName) {
                    console.log('Microservice (ms3) is not ready!\n')
                    content = `${content}   ${stateInfoError}};`
                } 
                else if (state === textName && state != factsName) {
                    console.log('Microservice (microservce_QuickFacts) is not ready!\n')
                    content = `${content}   ${stateFactsError}};`
                } 
                else {
                    console.log('Microservices are not ready!\n')
                    content = `${content}   ${stateFactsError}   ${stateInfoError}};`
                };

                // Updates the script file used by state_info.html
                fs.writeFile('./public/script.txt', content, (err) => {
                    if (err) throw err;
                });
            });
        });
        res.sendFile(__dirname + '/public/state_info.html')
    }, 4000);  
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});