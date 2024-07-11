import express from 'express'
import authRouter from './routes/auth.js'
import { authMiddleware } from './middlewares/authMiddleware.js';
import bookingRouter from './routes/booking.js'
import expenseRouter from './routes/expense.js'
import userRouter from './routes/users.js'
import notFoundMiddleware from './middlewares/notFound.js';
import cors from "cors"


const app = express();

app.use(express.json()); // if we not provide this then we will not be able to access the request body
app.use(cors());

app.use('/auth', authRouter);
app.use('/booking', authMiddleware ,bookingRouter)
app.use('/expense', authMiddleware, expenseRouter )
app.use('/users', userRouter )


app.get('/',(req,res)=>{
    res.status(200).json({message:"hi there"})
})

app.use(notFoundMiddleware)
app.listen(3000, ()=>{
    console.log("running on 3000");
})

