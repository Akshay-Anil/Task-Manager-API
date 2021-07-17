const express = require('express')
const bcrypt = require('bcryptjs')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT 

// app.use((req,res,next)=>{
//     res.status(503).send('Site is under maintenance')
// })   

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port,()=>{
    console.log('Server is set up at ',port)
})




