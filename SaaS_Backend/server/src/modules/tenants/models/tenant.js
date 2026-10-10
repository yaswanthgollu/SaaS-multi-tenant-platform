const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscriptionTier: {
        type: String,
        enum: ['FREE', 'PRO', 'ENTERPRISE'],
        default: 'FREE'
    }
}, { timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);