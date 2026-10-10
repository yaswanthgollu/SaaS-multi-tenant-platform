const mongoose = require('mongoose');

const tenantMemberSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['OWNER', 'ADMIN', 'MEMBER', 'GUEST'],
        default: 'MEMBER'
    }
}, { timestamps: true });

tenantMemberSchema.index({ tenantId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('TenantMember', tenantMemberSchema);