"use strict";

const CommandService = require('../Utils/CommandService');
const JaccardComparator = require('../Utils/StringComparator/JaccardComparator');
const LevenshteinComparator = require('../Utils/StringComparator/LevenshteinComparator');

class BlindTest {
    constructor(videoName, videoId) {
        this.commandService = new CommandService();
        this.comparator = new JaccardComparator();
        this.videoName = videoName;
        this.responses = [];
        this.videoId = videoId;
    }

    addResponse(authorId, authorName, guess) {
        var date = new Date();
        this.responses.push({
            authorId:   authorId,
            authorName: authorName,
            guess:      guess,
            date:       date.getTime()
        });
    }

    computeWinner() {
        // If there is no response, we throw an exception
        if(this.responses.length === 0) {
            throw "no_response";
        }

        // We compute all distances
        var scores = [];
        console.log("### Blind test summary : ###")
        this.responses.forEach(response => {
            let distance = this.comparator.compare(response.guess, this.videoName) 
            scores.push({
                authorId: response.authorId,
                authorName: response.authorName,
                guess: response.guess,
                distance: distance,
                date:     response.date
            })
            console.log(response.authorName + '("' + response.guess + '") : ' + distance)
        });

        // Then we get the response with the minimal distance (the date will break ties)
        var winner = scores[0];
        scores.slice(1).forEach(score => {
            if(score.distance < winner.distance ||
               (score.distance == winner.distance && score.date < winner.date)) {
                winner = score;
            }
        });
        console.log(winner.authorName + ' wins.')

        // We can now return the winner id
        return {
            authorId: winner.authorId,
            guess: winner.guess
        };
    }
}

module.exports = BlindTest;