const Tenant = require('./models/tenant');

const TenantMember = require('./models/tenantMember');

class TenantService {
    // creates new tenant and assigns the user as the owner
    async createTenant({ name, slug, userId}) {
        const existingslug = await Tenant.findOne({slug});
        if(existingslug) {
            throw new Error('Tenant slug already exists');
        }

        // create Tenant document
        const tenant = await Tenant.create({
            name,
            slug,
            ownerId: userId
        });

        await TenantMember.create({
            tenantId: tenant._id,
            userId,
            role: 'OWNER'
        });

        return tenant;

    }

    // Fetch all tenants for a user
    async getUserTenants(userId) {
        const memberships = await TenantMember.find({
            userId
        }).populate('tenantId')
        .lean();

        return memberships.map(m => ({...m.tenantId, role: m.role}));
    }
};

module.exports = new TenantService();