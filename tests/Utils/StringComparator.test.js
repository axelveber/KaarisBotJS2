"use strict";

const LevenshteinComparator = require("../../src/Utils/StringComparator/LevenshteinComparator");

let comparator = new LevenshteinComparator()

test('Simple win case', () => {
    let correctName = "dire straits sultans of swing"
    let winnerGuess = "sultans of swing dire straits"
    let loserGuess = "tears for fears everybody wants to rule the world"

    let winnerDistance = comparator.compare(winnerGuess, correctName)
    let loserDistance = comparator.compare(loserGuess, correctName)
    console.log({
        winnerDistance,
        loserDistance
    })

    expect(winnerDistance < loserDistance).toBe(true)
})