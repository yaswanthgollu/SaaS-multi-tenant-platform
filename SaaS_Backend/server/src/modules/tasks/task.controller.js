const taskService = require('./task.service');

const createTask = async (req, res, next) => {
    try {
        const {title, description, assignedTo } = req.body;

        if(!title){
            return res.status(400).json({message: 'Task title is required'});
        }

        const task =await taskService.createTask({
            title,
            description,
            assignedTo,
            userId: req.userId,
            tenantId: req.tenantId
        });
        res.status(201).json({message: 'Task created successfully. ', task});
    }catch(error){
        next(error);
    }
};

const getTasks = async (req, res, next) => {
    try{
        const tasks = await taskService.getTenantTasks(req.tenantId);
        res.status(200).json(tasks);
    } catch(error){
        next(error);
    }
};

const updateTaskStatus = async (req, res, next)=>{
    try{
        const {id} = req.params;
        const {status} = req.body;

        if(!status){
            return res.status(400).json({message: 'Status field is required.'});
        }

        const updatedTask = await taskService.updateTaskStatus({
            taskId: id,
            status,
            tenantId: req.tenantId
        });

        res.status(200).json({ message: 'Task status updated.', task: updatedTask });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        await taskService.deleteTask({ taskId: id, tenantId: req.tenantId });
        res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTaskStatus,
    deleteTask
};
