const TenantMember = require('./models/tenantMember');

const verifyTenant = async (req, res, next) => {
    try {
        // Extract the tenantId from the request parameters or body
        const tenantId = req.headers['x-tenant-id'] || req.headers['x-workspace-id'];

        if(!tenantId) {
            return res.status(400).json({ message: 'Tenant ID header (x-tenant-id) is required.'});
        }

        // Ensure req.userId was set by global verifyJWT middleware
        if(!req.userId){
            return res.status(401).json({message: 'Unauthorized: User identity not found.'});
        }

        // verify user belongs to this tenant
        const membership = await TenantMember.findOne({
            tenantId,
            userId: req.userId
        }).lean();

        if(!membership) {
            return res.status(403).json({ message: 'Forbidden: User does not belong to this tenant.'});
        }

        // Inject tenant context into request object for controllers/services
        req.tenantId = tenantId;
        req.userRole = membership.role;

        next();
    } catch (error){
        next(error);
    }
};

module.exports = verifyTenant;