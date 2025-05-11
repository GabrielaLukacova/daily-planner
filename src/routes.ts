import { Router, Request, Response } from "express";
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
    deleteTaskById
  } from './controllers/taskController';

const router: Router = Router();




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
 *       200:
 *         description: List of matching activities
 */
router.get('/activities/query/:field/:value', getActivitiesByQuery);

router.get('/tasks', verifyToken, getAllTasks);
router.put('/tasks/:id', verifyToken, updateTaskById);
router.delete('/tasks/:id', verifyToken, deleteTaskById);

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
 *         description: MongoDB ObjectId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity data
 */
router.get('/activities/:id', getActivityById);

/**
 * @swagger
 * /activities/{id}:
 *   put:
 *     tags:
 *       - Activity Routes
 *     summary: Update an activity
 *     security:
 *       - ApiKeyAuth: []
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
 *             $ref: "#/components/schemas/Activity"
 *     responses:
 *       200:
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
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity deleted successfully
 */
router.delete('/activities/:id', verifyToken, deleteActivityById);




/** ------------- NOTE ROUTES ------------- */

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
 *       200:
 *         description: Note data
 */
router.get('/notes/:id', getNoteById);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     tags:
 *       - Note Routes
 *     summary: Update a note
 *     security:
 *       - ApiKeyAuth: []
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
 *             $ref: "#/components/schemas/Note"
 *     responses:
 *       200:
 *         description: Note updated successfully
 */
router.put('/notes/:id', verifyToken, updateNoteById);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     tags:
 *       - Note Routes
 *     summary: Delete a note
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted successfully
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
 *             $ref: "#/components/schemas/Task"
 *     responses:
 *       201:
 *         description: Task created
 */
router.post('/tasks', verifyToken, createTask);

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
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task data
 */
router.get('/tasks/:id', verifyToken, getTaskById);

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags:
 *       - Task Routes
 *     summary: Get all tasks
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
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
 *   put:
 *     tags:
 *       - Task Routes
 *     summary: Update a task
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Task"
 *     responses:
 *       200:
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
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
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
 *       201:
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
 *       200:
 *         description: User logged in
 */
router.post('/login', loginUser);
