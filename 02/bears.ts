import * as express from 'express'

let router = express.Router();

router.use((req, res, next) => {
    console.log('something is happending.');
    next();
});

router.route('/')
    .post((req, res, next) => {
        res.status(201).json({ msg: 'Bear created!' })
        next()
    })
    .get((req, res, next) => {
        res.status(200).json({ msg: 'Welcome use my API!' });
        next()
    })
   
router.route('/:id')
    .get((req, res) => {
        res.status(200).sendFile(`${__dirname}/mock/user1.json`)
    })
    .post((req, res) => {
        res.status(201).json({ _id: req.params.id })
    })
export default router
