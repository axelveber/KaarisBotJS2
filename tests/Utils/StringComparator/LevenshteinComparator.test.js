const LevenshteinComparator = require("../../../src/Utils/StringComparator/LevenshteinComparator")

test('Test basic compare', () => {
    let comparator = new LevenshteinComparator()
    expect(comparator.compare('toto', 'tata')).toBe(2)
})

test('Test complex compare', () => {
    let comparator = new LevenshteinComparator()
    expect(comparator.compare('dire straits sultans of swing', 'sultans of swing dire straits')).toBe(25)
})

test('Test different words', () => {
    let comparator = new LevenshteinComparator()
    expect(comparator.compare('abcd', 'efgh')).toBe(4)
})