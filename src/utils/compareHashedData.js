const bcrypt = require('bcrypt')

const compareHashedData = async (data, hashedData) => {
    try {
        const compareResult = await bcrypt.compare(data, hashedData)
        return compareResult

    } catch (error) {
        throw error
    }
}

module.exports = compareHashedData;