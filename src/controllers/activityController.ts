import { Request, Response } from 'express';
import { activityModel } from '../models/activityModel';
import { connect, disconnect } from '../repository/database';

/**
 * Create a new activity
 */
export async function createActivity(req: Request, res: Response) {
  const data = req.body;
  try {
    await connect();
    const activity = new activityModel(data);
    const result = await activity.save();
    res.status(201).send(result);
  } catch {
    res.status(500).send("Error creating activity.");
  } finally {
    await disconnect();
  }
}

/**
 * Get all activities
 */
export async function getAllActivities(req: Request, res: Response) {
  try {
    await connect();
    const result = await activityModel.find({});
    res.status(200).send(result);
  } catch {
    res.status(500).send("Error retrieving activities.");
  } finally {
    await disconnect();
  }
}

/**
 * Get specific activity by id
 */
export async function getActivityById(req: Request, res: Response) {
  try {
    await connect();
    const result = await activityModel.findById(req.params.id);
    res.status(200).send(result);
  } catch {
    res.status(500).send("Error retrieving activity with id=" + req.params.id);
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
    const result = await activityModel.find({ [field]: { $regex: value, $options: 'i' } });
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error retrieving activities. Error: " + err);
  } finally {
    await disconnect();
  }
}

/**
 * Update activity by id
 */
export async function updateActivityById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    await connect();
    const result = await activityModel.findByIdAndUpdate(id, req.body);
    if (!result) {
      res.status(404).send('Cannot update activity with id=' + id);
    } else {
      res.status(200).send('Activity was successfully updated.');
    }
  } catch {
    res.status(500).send('Error updating activity with id=' + id);
  } finally {
    await disconnect();
  }
}

/**
 * Delete activity by id
 */
export async function deleteActivityById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    await connect();
    const result = await activityModel.findByIdAndDelete(id);
    if (!result) {
      res.status(404).send('Cannot delete activity with id=' + id);
    } else {
      res.status(200).send('Activity was successfully deleted.');
    }
  } catch {
    res.status(500).send('Error deleting activity with id=' + id);
  } finally {
    await disconnect();
  }
}
