const express = require('express');
const helmet = require('helmet');
// const otherRoutes = require('./otherRoutes.js');

const db = require('./knexConfig');
// const Roles = require('./roles/roles-model.js');

const server = express();
const port = process.env.PORT || 5000;
const errors = { // Dynamic error messaging based on sqlite codes
    '1': 'We ran into an error.',
    '4': 'Operation aborted',
    '9': 'Operation aborted',
    '19': 'Another record with that value exists, yo!'
};

server.use(helmet());
server.use(express.json());
// server.use('/otherRoutes', otherRoutes);




// GET list all projects
server.get('/projects', async (req, res) => {
    try {
        const projects = await db('projects');
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json(error);
    }
});


// GET project by id
server.get('/projects/:id', async (req, res) => {
    try {
        const student = await db('projects')
            .where({ id: req.params.id })
            .first();
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json(error);
    }
});


// POST create new project. Name is required.
server.post('/projects', async (req, res) => {
    if (!req.body.name || !req.body.description) { 
        return res.status(400).json({ message:"Please include a name and description to create a new project" 
    })}
    try {
        const [id] = await db('projects').insert(req.body);
        const project = await db('projects')
            .where({ id })
            .first();
        res.status(201).json(project);
    } catch (error) {
        const message = errors[error.errno] || "We ran into an error";
        res.status(500).json({ message });
    }
});



// PUT update student. name and cohort_id required. Must be unique req.body.name. Must be cohort that exists
server.put('/projects/:id', async (req, res) => {
    if (!req.body.name || !req.body.description) { 
        return res.status(400).json({ message:"Please include a name and description to update a project" })
    }
    try {
        const count = await db('projects')
            .where({ id: req.params.id })
            .update(req.body);
        if (count > 0) {
            const project = await db('projects')
                .where({ id: req.params.id })
                .first();
            res.status(200).json(project);
        } else {
            res.status(404).json({ message:"Records not found" });
        }
    } catch (error) {
        const message = errors[error.errno] || "We ran into an error";
        res.status(500).json({ message });
    }
});
















server.listen(port, () =>
  console.log(`\n\n--- API running on http://localhost:${port} ---`)
);


