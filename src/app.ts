import express, { Application, Request, Response } from 'express';
import DotenvFlow from 'dotenv-flow';


DotenvFlow.config();

// Create Express server
const app: Application = express();

export function startServer(){
    app.listen(4000, function(){
        console.log('Server is running on port:' + 4000);
    });
}