import express, { Request, Response, NextFunction } from 'express';
import { userRepository } from './dao/user-repository';
import authenticationRouter from './routes/auth-router';
import cors from 'cors';
import userRouter from './routes/users-router';
import jewelleryRouter from './routes/jewellery-router';
import { AppError } from "./model/errors";
import { jewelleryRepository } from './dao/jewellery-repository';

const app = express();

const port = 2704;

app.use(cors());

app.locals.userRepo = userRepository;
app.locals.jewelleryRepo = jewelleryRepository

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Additional middleware which will set headers that we need on each request.
app.use(function (req, res, next) {
  // Set permissive CORS header - this allows this server to be used only as
  // an API server in conjunction with something like webpack-dev-server.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader(`Access-Control-Allow-Methods`, `GET, POST, PUT, DELETE, OPTIONS`);
  res.setHeader('Access-Control-Max-Age', 3600); // 1 hour
  // Disable caching so we'll always get the latest posts.
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.use('/auth', authenticationRouter);
app.use('/users', userRouter);
app.use('/jewelleries', jewelleryRouter);

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message });
  } else {
    const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
    return res.status(500).json({ message: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});