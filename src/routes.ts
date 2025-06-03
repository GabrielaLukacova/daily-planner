import { Router, Request, Response } from 'express';
import { verifyToken, registerUser, loginUser } from './controllers/authController';

import {
  createActivity,
  getAllActivities,
  getActivityById,
  getActivitiesByQuery,
  updateActivityById,
  deleteActivityById,
} from './controllers/activityController';

import {
  createNote,
  getAllNotes,
  getNoteById,
  getNotesByQuery,
  updateNoteById,
  deleteNoteById,
} from './controllers/noteController';

import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
} from './controllers/taskController';

const router: Router = Router();
export { router };

/** ------------- ACTIVITY ROUTES ------------- */

/**
 * @swagger
 * /activities/query/{field}/{value}:
 *   get:
 *     tags:
 *       - Activity Routes
 *     summary: Retrieves all activities based on a specified query
 *     parameters:
 *       - in: path
 *         name: field
 *         required: true
 *         description: The field to query
 *         schema:
 *           type: string
 *       - in: path
 *         name: value
 *         required: true
 *         description: The value to search for
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of matching activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   startTime:
 *                     type: string
 *                   endTime:
 *                     type: string
 *                   place:
 *                     type: string
 *                   isRepeating:
 *                     type: boolean
 *                   repeating:
 *                     type: string
 *                     enum: [None, Daily, Weekly, Monthly]
 *                   _createdBy:
 *                     type: string
 *       '400':
 *         description: Invalid input
 */
router.get('/activities/query/:field/:value', verifyToken, getActivitiesByQuery);

/**
 * @swagger
 * /activities:
 *   post:
 *     tags:
 *       - Activity Routes
 *     summary: Creates a new activity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - startTime
 *               - endTime
 *               - _createdBy
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *                 description: A brief description of the activity
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date when the activity is scheduled
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               place:
 *                 type: string
 *               isRepeating:
 *                 type: boolean
 *               repeating:
 *                 type: string
 *                 enum: [None, Daily, Weekly, Monthly]
 *                 default: None
 *                 description: The repeating frequency of the activity
 *               _createdBy:
 *                 type: string
 *                 description: The ID of the user who created the activity
 *     responses:
 *       '201':
 *         description: Activity successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Activity'
 *       '400':
 *         description: Invalid input
 */
router.post('/activities', verifyToken, createActivity);

/**
 * @swagger
 * /activities:
 *   get:
 *     tags:
 *       - Activity Routes
 *     summary: Retrieves all activities
 *     responses:
 *       '200':
 *         description: List of all activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   startTime:
 *                     type: string
 *                   endTime:
 *                     type: string
 *                   place:
 *                     type: string
 *                   isRepeating:
 *                     type: boolean
 *                   repeating:
 *                     type: string
 *                     enum: [None, Daily, Weekly, Monthly]
 *                   _createdBy:
 *                     type: string
 *       '500':
 *         description: Server error
 */
router.get('/activities', verifyToken, getAllActivities);

/**
 * @swagger
 * /activities/{id}:
 *   get:
 *     tags:
 *       - Activity Routes
 *     summary: Get a specific activity by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Activity ID (String)
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Activity data
 */
router.get('/activities/:id', verifyToken, getActivityById);

/**
 * @swagger
 * /activities/{id}:
 *   put:
 *     tags:
 *       - Activity Routes
 *     summary: Update an activity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Activity ID (String)
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - startTime
 *               - endTime
 *               - place
 *               - isRepeating
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               place:
 *                 type: string
 *               isRepeating:
 *                 type: boolean
 *               repeating:
 *                 type: string
 *                 enum: [None, Daily, Weekly, Monthly]
 *     responses:
 *       '200':
 *         description: Activity updated successfully
 */
router.put('/activities/:id', verifyToken, updateActivityById);

/**
 * @swagger
 * /activities/{id}:
 *   delete:
 *     tags:
 *       - Activity Routes
 *     summary: Delete an activity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Activity ID (String)
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Activity deleted successfully
 */
router.delete('/activities/:id', verifyToken, deleteActivityById);


/** ------------- NOTE ROUTES ------------- */

/**
 * @swagger
 * /notes:
 *   get:
 *     tags:
 *       - Note Routes
 *     summary: Get all notes
 *     responses:
 *       200:
 *         description: List of all notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */
router.get('/notes', verifyToken, getAllNotes);

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     tags:
 *       - Note Routes
 *     summary: Get a specific note by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Note data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       '404':
 *         description: Note not found
 */
router.get('/notes/:id', verifyToken, getNoteById);

/**
 * @swagger
 * /notes:
 *   post:
 *     tags:
 *       - Note Routes
 *     summary: Create a new note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - date
 *               - _createdBy
 *             properties:
 *               text:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               _createdBy:
 *                 type: string
 *                 description: User ID of the creator
 *     responses:
 *       '201':
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       '400':
 *         description: Invalid input
 */
router.post('/notes', verifyToken, createNote);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     tags:
 *       - Note Routes
 *     summary: Update a note
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - date
 *             properties:
 *               text:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       '200':
 *         description: Note updated successfully
 *       '400':
 *         description: Invalid input
 *       '404':
 *         description: Note not found
 */
router.put('/notes/:id', verifyToken, updateNoteById);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     tags:
 *       - Note Routes
 *     summary: Delete a note
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Note deleted successfully
 *       '404':
 *         description: Note not found
 */
router.delete('/notes/:id', verifyToken, deleteNoteById);

/** ------------- TASK ROUTES ------------- */

/**
 * @swagger
 * /tasks:
 *   post:
 *     tags:
 *       - Task Routes
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - _createdBy
 *             properties:
 *               title:
 *                 type: string
 *               isCompleted:
 *                 type: boolean
 *                 default: false
 *               highPriority:
 *                 type: boolean
 *                 default: false
 *               _createdBy:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Task successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.post('/tasks', verifyToken, createTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags:
 *       - Task Routes
 *     summary: Get all tasks
 *     responses:
 *       '200':
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Task"
 */
router.get('/tasks', verifyToken, getAllTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     tags:
 *       - Task Routes
 *     summary: Get a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Task found
 */
router.get('/tasks/:id', verifyToken, getTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     tags:
 *       - Task Routes
 *     summary: Update a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Task"
 *     responses:
 *       '200':
 *         description: Task updated
 */
router.put('/tasks/:id', verifyToken, updateTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     tags:
 *       - Task Routes
 *     summary: Delete a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Task deleted
 */
router.delete('/tasks/:id', verifyToken, deleteTaskById);

/** ------------- USER ROUTES ------------- */

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Auth Routes
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User registered
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Auth Routes
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in
 */
router.post('/login', loginUser);

router.get('/health', (_req, res) => {
  res.send('OK');
});

// Base API route
router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Daily Planner API is alive!' });
});

export default router;
