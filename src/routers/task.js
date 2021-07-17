const express = require('express')
const Task = require('../models/tasks')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/tasks',auth,async (req,res)=>{
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
       await task.save() 
       res.status(201).send(task)
    }catch(e){
        res.status(400).send()
    }
})

// GET/tasks?completed=true
router.get('/tasks',auth ,async (req,res)=>{
   
    try{
        // const tasks=await Task.find({owner :req.user._id })
        const match = {}
        const sort = {}
        if(req.query.completed){
            match.completed = req.query.completed ==='true'
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(":")
            sort[parts[0]]=parts[1]==="desc"? -1 : 1
        }
        await req.user.populate({
            path : 'tasks',
            match,
            options:{
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
                // sort : {
                //     completed : 1
                // }
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(404).send()
    }
})

router.get('/tasks/:id', auth, async (req,res)=>{
    try{
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id:req.params.id,owner: req.user._id})
        if(!task){
           return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
   
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id : req.params.id , owner:req.user._id})
        if(!task)
            return res.status(404).send()
        res.send(task)    
    }catch(e){
        res.status(500).send()
    }
})



router.patch('/tasks/:id', auth ,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedupdates = ['description','completed']
    const isValid = updates.every((update)=>allowedupdates.includes(update))

    if(!isValid)
        return res.status(404).send({error:'Invalid updates'})
    try{
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true , runValidators : true})
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id: req.params.id, owner : req.user._id})
        if(!task)
            return res.status(404).send()

        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()     
        res.send(task)    
    }catch(e){
        res.status(404).send(e)
    }    
})

module.exports = router