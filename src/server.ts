import express, { Request, Response } from 'express';
import connectDB from './db/db';
import userRouter from './routes/UserRoute';
import postRouter from './routes/PostRoute';
import commentRouter from './routes/CommentRoute';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import NotificationDTO from './DTO/notificationDTO';
import { sendNotification } from './controllers/notificationController';


connectDB();
const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(express.json());
app.use(userRouter);
app.use(postRouter);
app.use(commentRouter);



app.get('/', async(req: Request, res: Response) => {
    try {
         // Assuming connectDB is asynchronous
        res.send('Welcome to Social Media RESTful API!');
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
});

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('notification', (notification:NotificationDTO) => {
        sendNotification(notification);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
  });

server.listen(3000, () => {
  console.log('Server is running on port 3000');
})