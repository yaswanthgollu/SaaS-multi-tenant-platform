const Task = require('./models/task');

class TaskService{
    // create a task scoped to active tenant
    async createTask({ title, description, assignedTo, userId, tenantId}){
        const task = await Task.create({
            title,
            description,
            assignedTo,
            createdBy: userId,
            tenantId
        });
        return task;
    }

    // Fetch all tasks belongs to active tenant
    async getTenantTasks(tenantId){
        return await Task.find({tenantId})
            .populate('assignedTo', 'fullName email')
            .populate('createdBy', 'fullName email')
            .sort({createdAt: -1})
            .lean();

    }

    // update task status or fields within active tenant
    async updateTaskStatus({taskId, status, tenantId}){
        const task = await Task.findOneAndUpdate(
            {
                _id: taskId, tenantId
            },
            {status},
            {new : true}
        );

        if(!task){
            throw new Error('Task not found or access denied');
        }
        return task;
    }

    // Delete a task within active tenant
    async deleteTask({ taskId, tenantId}){
        const result = await Task.findOneAndDelete({_id: taskId, tenantId});
        if(!result){
            throw new Error('Task not found or access denied');
        }
        return result;
    }
}

module.exports = new TaskService();
