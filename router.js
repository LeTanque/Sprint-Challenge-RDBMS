const router = require('express').Router();

const db = require('./knexConfig.js');

const errors = { // Dynamic error messaging based on sqlite codes
    '1': 'We ran into an error.',
    '4': 'Operation aborted',
    '9': 'Operation aborted',
    '19': 'Another record with that value exists, yo!'
};




// Endpoints
// GET all actions
router.get('/', async (req, res) => {
    try {
        const actions = await db('actions');
        res.status(200).json(actions);
    } catch (error) {
        res.status(500).json(error);
    }
});


// GET a action by id
router.get('/:id', async (req, res) => {
    try {
        const action = await db('actions')
            .where({ id: req.params.id })
            .first();
        res.status(200).json(action);
    } catch (error) {
        res.status(500).json(error);
    }
});


// POST create new action. Name is required. project_id is required. project_id must exist, no actions without existing projects.
router.post('/', async (req, res) => {
    if (!req.body.name || !req.body.project_id) { 
        return res.status(400).json({ message:"Please include a name and project ID to create a new action" 
    })}
    const projectExists = await db('projects')
        .where({ id: req.body.project_id })
        .first();
    if (!projectExists) {
        return res.status(404).json({ message:"Project doesn't exist. Please update project ID and try again." });
    }
    try {
        const [id] = await db('actions').insert(req.body);
        const action = await db('actions')
            .where({ id })
            .first();
        res.status(201).json(action);
    } catch (error) {
        const message = errors[error.errno] || "We ran into an error";
        res.status(500).json({ message });
    }
});


// PUT update action. name and project_id required. Must be project that exists
router.put('/:id', async (req, res) => {
    if (!req.body.name || !req.body.project_id) { 
        return res.status(400).json({ message:"Please include a name and project ID to update a action" })
    }
    const projectExists = await db('projects')
        .where({ id: req.body.project_id })
        .first();
    if (!projectExists) {
        return res.status(404).json({ message:"Project doesn't exist. Please update project ID and try again." });
    }
    try {
        const count = await db('actions')
            .where({ id: req.params.id })
            .update(req.body);
        if (count > 0) {
            const action = await db('actions')
                .where({ id: req.params.id })
                .first();
            res.status(200).json(action);
        } else {
            res.status(404).json({ message:"Records not found" });
        }
    } catch (error) {
        const message = errors[error.errno] || "We ran into an error";
        res.status(500).json({ message });
    }
});


// DELETE remove action
router.delete('/:id', async (req, res) => {
    try {
        const count = await db('actions')
            .where({ id: req.params.id })
            .del();
        if (count > 0) {
            res.status(204).end();
        } else {
            res.status(404).json({ message:"Action not found" });
        }
    } catch (error) {
        const message = errors[error.errno] || "We ran into an error";
        res.status(500).json({ message });
    }
});








module.exports = router;
