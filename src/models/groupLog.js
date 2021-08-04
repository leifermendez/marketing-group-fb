const mongoose = require('mongoose')

const GroupLogSchma = new mongoose.Schema(
    {
        idGroup: {
            type: String
        },
        message: {
            type: String
        },
        account: {
            type: String
        },
        lastInteractionAt: {
            type: Date
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('grouplog', GroupLogSchma)