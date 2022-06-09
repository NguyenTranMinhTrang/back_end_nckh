//Models
const History = require('../models/history');

class HistoryControllers {
    async postHistory(req, res) {
        try {
            let { id, animalID, time } = req.body;
            await History.save(id, animalID, time)

            res.json({
                status: "SUCCESS",
                message: "Lịch sử đã được lưu thành công"
            });
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            });
        }

    }

    async getHistory(req, res) {
        try {
            let { id } = req.body;
            const history = await History.find(id)
            res.json({
                status: "SUCCESS",
                data: history.reverse()
            });
        } catch (error) {
            res.json({
                status: "FAILED",
                message: error.message
            });
        }

    }

    async deleteHistory(req, res) {
        try {
            let { id, animalID, time } = req.body;
            await History.delete(id, animalID, time)
            res.json({
                status: "SUCCESS",
                message: "Xóa lịch sử thành công!"
            });
        } catch (error) {
            res.json({
                status: "SUCCESS",
                message: error.message
            });
        }

    }
}

module.exports = new HistoryControllers