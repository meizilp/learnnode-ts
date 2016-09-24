import * as express from 'express'
import * as bodyParser from 'body-parser'

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let router = express.Router();

router.use((req, res, next) => {
    console.log('something is happending.');
    next();
});

router.get('/', (req, res) => {
    res.status(200).json({ msg: 'Welcome use my API!' });
})

router.route('/bears')
    .post((req, res) => {
        res.status(201).json({ msg: 'Bear created!' })
    })
    .get((req, res) => {
        console.log(`${__dirname}/mock/user1.json`)
        res.status(200).sendFile(`${__dirname}/mock/user1.json`)
    })

router.route('/bears/:id')
    .get((req, res) => {
        res.status(200).json({ _id: req.params.id })
    })

app.use('/api', router);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
