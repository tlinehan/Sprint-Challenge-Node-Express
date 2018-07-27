const express = require('express');

const projects = require('./data/helpers/projectModel');
const actions = require('./data/helpers/actionModel');

const port = 3333;

const server = express();

server.use(express.json());
//HOME
server.get('/', (req, res) => {
    res.send('<h1>Welcome to Sprint Challenge Express-Node</h1>');
})

////GET ALL PROJECTS
// server.get('/api/projects', (req, res) => {    
//     projects
//         .get()
//         .then(projects => {
//             res.json(projects);
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({error: 'Server Error.', err});
//             res.end();
//         })
// })

//GET ALL PROJECTS
server.get('/api/projects', async (req, res) => {
    try {
        const proj = await projects.get();
        res.status(200).json(proj);
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({error: 'Server Error', err});
        res.end();
    }
});

//GET ALL ACTIONS
server.get('/api/actions', async (req, res) => {
    try {
        const acts = await actions.get();
        res.status(200).json(acts);
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({error: 'Server Error', err});
        res.end();
    }
});

//GET PROJECTS BY ID
server.get('/api/projects/:id', async (req, res) => {
    const { id } = req.params;

    try {        
        const proj = await projects.get(id);       
        res.status(200).json(proj);            
    } 
    catch (error) {
        console.log(error);
        res.status(404).json({error: 'ID Not Found'});
        res.end();            
    }    
});

//GET PROJECT SPECIFIC ACTIONS
server.get('/api/projects/:id/actions', async(req, res) => {
    const { id } = req.params;

    try{
        const projActions = await projects.getProjectActions(id);            
            if (projActions.length === 0) {
                res.status(404).json({error: 'Not Found'})
                return;
            }                
        res.status(200).json(projActions);
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server Error'});
        res.end();
    }
});

//POST CREATE NEW PROJECT
server.post('/api/projects/create', async (req, res) => {
    const { name, description, completed } = req.body;
    const userInput = { name, description, completed };

    if (!name || !description) {
        res.status(400).json({error: 'Name and Description Required!'})
        return;
    }

    try {
        const response = await projects.insert(userInput);
        res.status(200).json(response);
        console.log(`Success!! New Project Created with an id of ${response.id}.`);
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server Error: Failed to Create new project!'});
        res.end();
    }            
});

//POST NEW ACTION TO A PROJECT
server.post('/api/actions', async(req, res) => {
    const { project_id, description, notes, completed } = req.body;
    const newActionInput = { project_id, description, notes, completed };

    if (!project_id || !description || !notes) {
        res.status(400).json(
            [
                "Error, missing required fields! Data Shape below...",
                {
                    project_id: 'NUM', 
                    description: 'STRING', 
                    notes: 'STRING'
                }
            ]            
        )
        return;
    }

    try {
        const response = await actions.insert(newActionInput);
        res.status(200).json(response);
        console.log(`Success!! New Action Created with an action id of ${response.id}.`);
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server Error: Failed to Create new action!'});
        res.end();
    }
});

//DELETE PROJECT
server.delete('/api/projects', async(req, res) => {
    const { id } = req.body;
    if (!id) {
        res.status(400).json({error: 'Missing ID!'});
        return;
    }

    try {            
        const response = await projects.remove(id);
        //console.log(response);
        if (response === 0) {
            res.status(404).json({Failed_To_Delete: `Could not find the id: ${id}`})
            console.log(`Failed to delete Project with id of ${id}`);
            return;

        } else if (response === 1){
            res.status(200).json(response);
            console.log(`Successfully Deleted ${response} Project(s) with id of ${id}!`);
            return;
        }           
    } 
    catch (err){
        console.log(err);
        res.status(500).json({"Server-Error": `Failed to delete project id: ${id} `})
        res.end();
    }        
})
/////////////////////////////
//DELETE ACTIONS
server.delete('/api/actions', async(req, res) => {
    const { id } = req.body;
    if (!id) {
        res.status(400).json({error: 'Missing ID!'});
        return;
    }

    try {            
        const response = await actions.remove(id);
        //console.log(response);
        if (response === 0) {
            res.status(404).json({Failed_To_Delete: `Could not find the id: ${id}`})
            console.log(`Failed to delete Action with id of ${id}`);
            return;

        } else if (response === 1){
            res.status(200).json(response);
            console.log(`Successfully Deleted ${response} Action(s) with an id of ${id}!`);
            return;
        }           
    } 
    catch (err){
        console.log(err);
        res.status(500).json({"Server-Error": `Failed to delete action with id: ${id} `})
        res.end(err);
    }        
})

//PUT UPDATE PROJECT
server.put('/api/projects', async(req, res) => {
    const { id, name, description, completed } = req.body;
    const changes = { name, description, completed };
    if ( !id ) {
        res.status(400).json({error: 'Provide an ID'});
        return;
    }
    else if (!name && !description && !completed) {
        res.status(400).json({error: "No changes submitted!"})
        return;
    }

    try {
        const response = await projects.update(id, changes);
        
        console.log('Success!')
        res.status(200).json(response);
    }
    catch (err){
        res.status(500).json({Failed_To_Update: 'ID Not found'});
        console.log('Fail!');
        res.end(err);
    }
})

//PUT UPDATE ACTIONS
server.put('/api/actions', async(req, res) => {
    const { id, project_id, description, notes, completed  } = req.body;
    const changes = { id, project_id, description, notes, completed };
    if ( !id ) {
        res.status(400).json({error: 'Provide an ID'});
        return;
    }
    else if (!project_id && !description && !notes && !completed) {
        res.status(400).json({error: "No changes submitted!"})
        return;
    }

    try {
        const response = await actions.update(id, changes);
        
        console.log('Success!')
        res.status(200).json(response);
    }
    catch (err){
        res.status(500).json({Failed_To_Update: 'ID Not found'});
        console.log('Fail!');
        res.end(err);
    }
})



server.listen(port, () => console.log(`API running...on port ${port}`));