import { Request, Response } from "express";
import { taskModel } from "../models/taskModel";
import { connect, disconnect } from "../repository/database";

/**
 * Create a new task
 */
export async function createTask(req: Request, res: Response): Promise<void> {
  try {
    await connect();

    const { title, isCompleted = false, highPriority = false, _createdBy } = req.body;

    if (!title || !_createdBy) {
      res.status(400).json({ message: "Missing required fields: title or _createdBy" });
      return;
    }

    const newTask = new taskModel({
      title,
      isCompleted,
      highPriority,
      _createdBy,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error: any) {
    console.error("Failed to create task:", error.message);
    res.status(500).json({
      message: "Failed to create task",
      error: error.message || error,
    });
  } finally {
    await disconnect();
  }
}

/**
 * Get all tasks for a specific user
 */
export async function getAllTasks(req: Request, res: Response): Promise<void> {
  try {
    await connect();

    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).json({ message: "Missing userId" });
      return;
    }

    const tasks = await taskModel.find({ _createdBy: userId });
    res.status(200).json(tasks);
  } catch (error: any) {
    console.error("Failed to fetch tasks:", error.message);
    res.status(500).json({
      message: "Failed to fetch tasks",
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
    await connect();

    const task = await taskModel.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json(task);
  } catch (error: any) {
    console.error("Error retrieving task:", error.message);
    res.status(500).json({
      message: "Error retrieving task",
      error: error.message || error,
    });
  } finally {
    await disconnect();
  }
}

/**
 * Update a task by ID
 */
export async function updateTaskById(req: Request, res: Response): Promise<void> {
  try {
    await connect();

    // Build update object dynamically to avoid overwriting with undefined
    const updateData: Partial<{ title: string; isCompleted: boolean; highPriority: boolean }> = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.isCompleted !== undefined) updateData.isCompleted = req.body.isCompleted;
    if (req.body.highPriority !== undefined) updateData.highPriority = req.body.highPriority;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: "No valid fields provided for update" });
      return;
    }

    const updatedTask = await taskModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json(updatedTask);
  } catch (error: any) {
    console.error("Error updating task:", error.message);
    res.status(500).json({
      message: "Error updating task",
      error: error.message || error,
    });
  } finally {
    await disconnect();
  }
}

/**
 * Delete a task by ID
 */
export async function deleteTaskById(req: Request, res: Response): Promise<void> {
  try {
    await connect();

    const deletedTask = await taskModel.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({
      message: "Error deleting task",
      error: error.message || error,
    });
  } finally {
    await disconnect();
  }
}
