import * as express from 'express';
import * as bodyParser from 'body-parser';

import { issues } from './middlewares/issues';
import { pushes } from './middlewares/pushes';

const app = express();

app.use(bodyParser.json());

app.use(issues, pushes,
  function (req, res, next) {
    res.status(200).end();
  }
);

app.post('/webhook', function(req, res) {

  if (req.headers['x-github-event'] != 'issues') return res.status(200).end();

  // const payload = req.body
  //   , repo    = payload.repository.name

  // res.send('Received issue ' + payload.action + ' event for repo: ' + repo);
});

app.listen(8080, () => {
  console.log('server listening on port 8080');
});

// handler.on('error', function (err) {
//   console.error('Error:', err.message)
// })

// handler.on('push', function (event) {
//   console.log('Received a push event for %s to %s',
//     event.payload.repository.name,
//     event.payload.ref)
// })

// handler.on('issues', function (event) {
//   console.log('Received an issue event for %s action=%s: #%d %s',
//     event.payload.repository.name,
//     event.payload.action,
//     event.payload.issue.number,
//     event.payload.issue.title)
// })