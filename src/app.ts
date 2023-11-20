import express, { Application, Request, Response } from 'express'
import { userRoutes } from './routes/user.route'
import cors from 'cors'
const app: Application = express()
app.use(express.json())
app.use(cors())

app.use('/api/v1/users', userRoutes)

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to murir tin tour and travel',
  })
})

export default app
