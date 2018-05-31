import * as express from 'express';
import * as bodyParser from 'body-parser';

import { issues } from './middlewares/issues';
import { pushes } from './middlewares/pushes';
import { pullrequests } from './middlewares/pullrequests';
import { deletes } from './middlewares/deletes';

const app = express();

app.use(bodyParser.json());

app.use(issues, pushes, pullrequests, deletes,
  function (req, res, next) {
    res.status(200).end();
  }
);

app.post('/webhook', function(req, res) {});

app.listen(8080, () => {
  console.log('server listening on port 8080');
});