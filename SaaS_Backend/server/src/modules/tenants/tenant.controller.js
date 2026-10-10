const tenantService = require('./tenant.service');

const createTenant = async (req, res, next) => {
    try {
        const {name, slug} = req.body;
        if(!name || !slug){
            return res.status(400).json({message: 'Name and slug are required'});
        }

        const newTenant = await tenantService.createTenant({
        name,
        slug,
        userId: req.userId
    });

    res.status(201).json({
        message: 'Tenant created successfully',
        tenant: newTenant
    });

    } catch (error) {
        res.status(400).json({message: error.message});
    }    
};

const getMyTenants = async ( req, res, next) => {
    try {
        const tenants = await tenantService.getUserTenants(req.userId);
        res.status(200).json({tenants});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTenant,
    getMyTenants
}