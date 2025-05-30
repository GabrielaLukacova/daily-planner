"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const authController_1 = require("./controllers/authController");
const activityController_1 = require("./controllers/activityController");
const noteController_1 = require("./controllers/noteController");
const taskController_1 = require("./controllers/taskController");
const router = (0, express_1.Router)();
exports.router = router;
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
router.get('/activities/query/:field/:value', authController_1.verifyToken, activityController_1.getActivitiesByQuery);
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
router.post('/activities', authController_1.verifyToken, activityController_1.createActivity);
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
router.get('/activities', authController_1.verifyToken, activityController_1.getAllActivities);
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
router.get('/activities/:id', authController_1.verifyToken, activityController_1.getActivityById);
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
router.put('/activities/:id', authController_1.verifyToken, activityController_1.updateActivityById);
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
router.delete('/activities/:id', authController_1.verifyToken, activityController_1.deleteActivityById);
router.get('/tasks', authController_1.verifyToken, taskController_1.getAllTasks);
router.put('/tasks/:id', authController_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, taskController_1.updateTaskById)(req, res);
}));
router.delete('/tasks/:id', authController_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, taskController_1.deleteTaskById)(req, res);
}));
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
router.get('/notes', authController_1.verifyToken, noteController_1.getAllNotes);
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
router.get('/notes/:id', authController_1.verifyToken, noteController_1.getNoteById);
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
router.post('/notes', authController_1.verifyToken, noteController_1.createNote);
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
router.put('/notes/:id', authController_1.verifyToken, noteController_1.updateNoteById);
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
router.delete('/notes/:id', authController_1.verifyToken, noteController_1.deleteNoteById);
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
router.post('/tasks', authController_1.verifyToken, taskController_1.createTask);
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
router.get('/tasks', authController_1.verifyToken, taskController_1.getAllTasks);
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
router.get('/tasks/:id', authController_1.verifyToken, taskController_1.getTaskById);
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
router.put('/tasks/:id', authController_1.verifyToken, taskController_1.updateTaskById);
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
router.delete('/tasks/:id', authController_1.verifyToken, taskController_1.deleteTaskById);
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
router.post('/register', authController_1.registerUser);
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
router.post('/login', authController_1.loginUser);
exports.default = router;
//# sourceMappingURL=routes.js.map