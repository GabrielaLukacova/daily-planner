import { Request, Response } from 'express'
import { taskModel } from '../models/taskModel'
import { connect, disconnect } from '../repository/database'
import mongoose from 'mongoose'

/**
 * Create a new task
 */
export async function createTask(req: Request, res: Response): Promise<void> {
  try {
    await connect()

    const newTask = new taskModel({
      title: req.body.title,
      isCompleted: req.body.isCompleted ?? false,
      highPriority: req.body.highPriority ?? false,
      _createdBy: req.body._createdBy,
    })

    const savedTask = await newTask.save()
    res.status(201).json(savedTask)
  } catch (error: any) {
    console.error('❌ Failed to create task:', error.message)
    res.status(500).json({
      message: 'Failed to create task',
      error: error.message || error,
    })
  } finally {
    await disconnect()
  }
}

/**
 * Get all tasks filtered by userId
 */
export async function getAllTasks(req: Request, res: Response): Promise<void> {
  try {
    await connect();

    const userId = req.query.userId as string;

    if (!userId) {
      console.log('⚠️ Missing userId, returning empty list');
      res.status(200).json([]);
      return;
    }

    const tasks = await taskModel.find({ _createdBy: userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error: any) {
    console.error('❌ Failed to fetch tasks:', error.message);
    res.status(500).json({
      message: 'Failed to fetch tasks',
      error: error.message || error,
    });
  } finally {
    await disconnect();
  }
}


/**
 * Get a task by ID
 */
export async function getTaskById(req: Request, res: Response): Promise<void> {
  try {
    await connect()

    const task = await taskModel.findById(req.params.id)

    if (!task) {
      res.status(404).json({ message: 'Task not found' })
      return
    }

    res.status(200).json(task)
  } catch (error: any) {
    console.error('❌ Failed to get task:', error.message)
    res.status(500).json({
      message: 'Error retrieving task',
      error: error.message || error,
    })
  } finally {
    await disconnect()
  }
}

/**
 * Update a task by ID
 */
export async function updateTaskById(req: Request, res: Response): Promise<void> {
  try {
    await connect()

    const updatedTask = await taskModel.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        isCompleted: req.body.isCompleted,
        highPriority: req.body.highPriority,
      },
      { new: true }
    )

    if (!updatedTask) {
      res.status(404).json({ message: 'Task not found' })
      return
    }

    res.status(200).json(updatedTask)
  } catch (error: any) {
    console.error('❌ Failed to update task:', error.message)
    res.status(500).json({
      message: 'Error updating task',
      error: error.message || error,
    })
  } finally {
    await disconnect()
  }
}

/**
 * Delete a task by ID
 */
export async function deleteTaskById(req: Request, res: Response): Promise<void> {
  try {
    await connect()

    const deletedTask = await taskModel.findByIdAndDelete(req.params.id)

    if (!deletedTask) {
      res.status(404).json({ message: 'Task not found' })
      return
    }

    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (error: any) {
    console.error('❌ Failed to delete task:', error.message)
    res.status(500).json({
      message: 'Error deleting task',
      error: error.message || error,
    })
  } finally {
    await disconnect()
  }
}

