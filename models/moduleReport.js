const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moduleReportSchema = new Schema(
    {
        completedModuleName: [
            {
                type: String,
                required: true
            }
        ],
        correctMark: {
            type: Number,
            required: true
        },
        totalMark: {
            type: Number,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Module-Report', moduleReportSchema);
