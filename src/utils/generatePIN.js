const generatePIN = async () => {
    try {
        return (pin = `${Math.floor(1000 + Math.random() * 9000)}`);
    } catch (error) {
        throw error
    }
}

module.exports = generatePIN