import Router, { Request, Response, NextFunction } from 'express';
import { Task, TaskPriority } from '../../entity/tasks.entity';
import dataSource from '../../db/dataSource';
import { Users } from '../../entity/users.entity';

const router = Router();
const taskRepository = dataSource.getRepository(Task);
const userRepository = dataSource.getRepository(Users);

// Middleware to authenticate user from JWT token in cookies
async function authenticateUser(req: Request & { user?: Users }, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const jwt = require('jsonwebtoken');
        const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';
        const decoded = jwt.verify(token, jwtSecret);
        const user = await userRepository.findOne({ where: { user_id: (decoded as any).id } }); 
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

router.use(authenticateUser);

router.post('/', async (req: Request & { user?: Users }, res: Response) => {
    const data = req.body;
    if (!data || !data.title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    const newTask = taskRepository.create({
        title: data.title,
        description: data.description || null,
        priority: data.priority || TaskPriority.MEDIUM,
        deadline: data.deadline ? new Date(data.deadline) : null,
        completed: data.completed || false,
        user: req.user,
    });
    const savedTask = await taskRepository.save(newTask);
    res.status(201).json(savedTask);
});

router.get('/', async (req: Request & { user?: Users }, res: Response) => {
    const tasks = await taskRepository.find({ where: { user: req.user } });
    res.status(200).json(tasks);
});

router.get('/:id', async (req: Request & { user?: Users }, res: Response) => {
    const task = await taskRepository.findOne({ where: { id: req.params.id, user: req.user } });
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
});

router.put('/:id', async (req: Request & { user?: Users }, res: Response) => {
    const data = req.body;
    const task = await taskRepository.findOne({ where: { id: req.params.id, user: req.user } });
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    task.title = data.title || task.title;
    task.description = data.description !== undefined ? data.description : task.description;
    task.priority = data.priority || task.priority;
    task.deadline = data.deadline ? new Date(data.deadline) : task.deadline;
    task.completed = data.completed !== undefined ? data.completed : task.completed;
    const updatedTask = await taskRepository.save(task);
    res.status(200).json(updatedTask);
});

router.delete('/:id', async (req: Request & { user?: Users }, res: Response) => {
    const task = await taskRepository.findOne({ where: { id: req.params.id, user: req.user } });
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    await taskRepository.remove(task);
    res.status(204).send();
});

export default router;