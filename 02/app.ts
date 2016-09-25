import * as express from 'express'
import * as bodyParser from 'body-parser'

import bears from './bears'

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/v1/bears', bears);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
