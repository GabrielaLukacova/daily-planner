import { Request, Response } from 'express';
import { activityModel } from '../models/activityModel';
import { connect, disconnect } from '../repository/database';

/**
 * Create a new activity
 */
export async function createActivity(req: Request, res: Response) {
  try {
    await connect();

    const newActivity = new activityModel({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      place: req.body.place,
      isRepeating: req.body.isRepeating,
      repeating: req.body.repeating,
      _createdBy: req.body._createdBy,
    });

    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error: any) {
    console.error("❌ Failed to create activity:", error);
    res.status(500).json({
      message: 'Failed to create activity',
      error: error.message || error,
    });
  } finally {
    await disconnect();
  }
}

/**
 * Get all activities (optionally filtered by userId)
 */
export async function getAllActivities(req: Request, res: Response) {
  try {
    await connect();

    const userId = req.query.userId as string | undefined;
    const query = userId ? { _createdBy: userId } : {};

    const result = await activityModel.find(query).sort({ date: -1 });
    res.status(200).json(result);
  } catch (error: any) {
    console.error("❌ Failed to retrieve activities:", error);
    res.status(500).json({
      message: "Error retrieving activities",
      error: error.message || error,
    });
  } finally {
    await disconnect();
  }
}

/**
 * Get specific activity by ID
 */
export async function getActivityById(req: Request, res: Response) {
  try {
    await connect();
    const result = await activityModel.findById(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("❌ Failed to retrieve activity by ID:", error);
    res.status(500).json({
      message: "Error retrieving activity",
      error: error.message || error,
    });
  } finally {
    await disconnect();
  }
}

/**
 * Search activities by field and value
 */
export async function getActivitiesByQuery(req: Request, res: Response) {
  const field = req.params.field;
  const value = req.params.value;

  try {
    await connect();
    const result = await activityModel.find({
      [field]: { $regex: value, $options: 'i' },
    });
    res.status(200).json(result);
  } catch (error: any) {
    console.error("❌ Failed to query activities:", error);
    res.status(500).json({
      message: "Error querying activities",
      error: error.message || error,
    });
  } finally {
    await disconnect();
  }
}

/**
 * Update activity by ID
 */
export async function updateActivityById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    await connect();
    const result = await activityModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!result) {
      res.status(404).json({ message: 'Activity not found' });
    } else {
      res.status(200).json({ message: 'Activity updated successfully' });
    }
  } catch (error: any) {
    console.error("❌ Failed to update activity:", error);
    res.status(500).json({
      message: "Error updating activity",
      error: error.message || error,
    });
  } finally {
    await disconnect();
  }
}

/**
 * Delete activity by ID
 */
export async function deleteActivityById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    await connect();
    const result = await activityModel.findByIdAndDelete(id);
    if (!result) {
      res.status(404).json({ message: 'Activity not found' });
    } else {
      res.status(200).json({ message: 'Activity deleted successfully' });
    }
  } catch (error: any) {
    console.error("❌ Failed to delete activity:", error);
    res.status(500).json({
      message: "Error deleting activity",
      error: error.message || error,
    });
  } finally {
    await disconnect();
  }
}
