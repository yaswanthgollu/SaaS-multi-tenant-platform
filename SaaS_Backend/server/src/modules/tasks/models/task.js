const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    status: {
        type: String,
        enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
        default: 'TODO'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

taskSchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);