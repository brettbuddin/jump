function score(input, target) {
    if (input.length == 0) {
        return 0;
    }

    if (target == input) {
        return 1.0;
    }

    var score = 0;
    var originalTarget = target;

    if (originalTarget.indexOf(input) > -1) {
        score += 0.4;
    }

    for (var i = 0, len = input.length; i < len; i++) {
        // Look for both the lowercase and uppercase versions of the character in the target string. If we find both,
        // take the index of first. If we find only one, take the index of that one.
        var lowCase      = input[i].toLowerCase();
        var upCase       = input[i].toUpperCase();
        var indexLowCase = target.indexOf(lowCase);
        var indexUpCase  = target.indexOf(upCase);
        var minIndex     = Math.min(indexLowCase, indexUpCase);
        var index        = -1;

        if (minIndex > -1) {
            index = minIndex;
        } else {
            index = Math.max(indexLowCase, indexUpCase);
        }

        // No matches...
        if (index == -1) {
            break;
        }

        score += 0.1;

        // Contiguous character matches
        if (index == 0) {
            score += 0.1;
        }

        // Ensure we're continously searching forward
        target = target.substring(index+1, target.length);
    }

    // Return score based on two criteria:
    // 1. Accumulative character score relative to the input size.
    // 2. Percentage of the string we typed to get this score.
    return score / originalTarget.length;
}

module.exports = score;
