"use strict";

const StringComparator = require("../StringComparator");
const stringComparison =  require('string-comparison');

class JaccardComparator extends StringComparator
{
    compare(a, b)
    {
        let jaccard = stringComparison.jaccardIndex;

        return jaccard.distance(a, b)
    }
}

module.exports = JaccardComparator