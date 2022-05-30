const JaccardComparator = require("../../../src/Utils/StringComparator/JaccardComparator")

test('Test basic compare', () => {
    let comparator = new JaccardComparator()
    expect(comparator.compare('toto', 'tata')).toBe(0.6666666666666667)
})

test('Test complex compare', () => {
    let comparator = new JaccardComparator()
    expect(comparator.compare('dire straits sultans of swing', 'sultans of swing dire straits')).toBe(0)
})

test('Test different words', () => {
    let comparator = new JaccardComparator()
    expect(comparator.compare('abcd', 'efgh')).toBe(1)
})