const router = require('express').Router();

const commentsModel = require('./models/comments');

// path: /api/comment
// GET method route
router.get('/api/comment', async (req, res) => {
    try {
        const allComments = await commentsModel.find({});
        res.status(200).json(allComments);
    } catch (error) {
        res.json(error);
    }
})

// POST method route
router.post('/api/comment', async (req, res) => {
    try {
        const newComment = new commentsModel({
            author: req.body.author,
            body: req.body.body,
            date: req.body.date,
            user: req.body.user
        });

        const saveComment = await newComment.save();
        // send new comment in response
        res.status(200).json(saveComment);
    } catch (error) {
        res.json(error);
    }
})

// PUT method route
router.put('/api/comment/:id', async (req, res) => {
    try {
        const updateComment = await commentsModel.findByIdAndUpdate(req.params.id, {$set: req.body});
        res.status(200).json("Comment updated");
    } catch (error) {
        res.json(error);
    }
})

// DELETE method route
router.delete('/api/comment/:id', async (req, res) => {
    try {
        const updateComment = await commentsModel.findByIdAndDelete(req.params.id);
        res.status(200).json("Comment deleted");
    } catch (error) {
        res.json(error);
    }
})

module.exports = router;