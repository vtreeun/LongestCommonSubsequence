const { promises: { writeFile } } = require('fs')
/**
 * 
 * @param {Array<Array<{ value: number, from: number }>>} matrix 
 * @param {string} sequenceA 
 * @param {number} i  matrix m length
 * @param {number} j matrix n length
 * @param {string} sequence 
 */
function findSequence(matrix, sequenceA, i, j, sequence = String()) {
    if (i === 0 || j === 0) {
        return sequence
    }

    if (matrix[i][j].from === 0) {
        return findSequence(matrix, sequenceA, i - 1, j - 1, sequenceA.charAt(i - 1) + sequence)
    } else if (matrix[i][j].from === 1) {
        return findSequence(matrix, sequenceA, i - 1, j, sequence)
    } else {
        return findSequence(matrix, sequenceA, i, j - 1, sequence)
    }
}

/**
 * 
 * @param {string} sequenceA 
 * @param {string} sequenceB 
 * @param {string} longestCommonSequence
 */
function findMatchPercentage(sequenceA, sequenceB, longestCommonSequence) {
    const longestSequence = sequenceA.length >= sequenceB.length ? sequenceA : sequenceB
    const matchPercentage = (100 * longestCommonSequence.length) / longestSequence.length
    return `${matchPercentage}%`
}

/**
 * 
 * @param {string} sequenceA 
 * @param {string} sequenceB 
 */
async function longestCommonSequence(sequenceA, sequenceB) {

    const m = sequenceA.length
    const n = sequenceB.length
    const matrix = Array.from({ length: m + 1 }, () => Array(n + 1))

    for (let i = 0; i <= m; i++) {
        matrix[i][0] = { value: 0 }
    }

    for (let j = 0; j <= n; j++) {
        matrix[0][j] = { value: 0 }
    }

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (sequenceA.charAt(i - 1) === sequenceB.charAt(j - 1)) {
                const value = matrix[i - 1][j - 1].value + 1
                const from = 0
                matrix[i][j] = { value, from }
            } else if (matrix[i - 1][j].value >= matrix[i][j - 1].value) {
                const value = matrix[i - 1][j].value
                const from = 1
                matrix[i][j] = { value, from }
            } else {
                const value = matrix[i][j - 1].value
                const from = 2
                matrix[i][j] = { value, from }
            }
        }
    }

    const count = matrix[m][n].value
    const sequence = findSequence(matrix, sequenceA, m, n)
    const matchPercentage = findMatchPercentage(sequenceA, sequenceB, sequence)
    const valuesMatrix = matrix.map(column => column.map(({ value }) => value))
    const data = JSON.stringify({ sequenceA, sequenceB, sequence, count, matchPercentage, matrix: valuesMatrix })

    await writeFile('longest-common-sequence.json', data)
}

exports.findSequence = findSequence
exports.longestCommonSequence = longestCommonSequence
