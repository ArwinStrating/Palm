import * as moment from 'moment';

import { Issue } from '../models/issue'
import { db } from '../db';

export function pushes(req, res, next) {
  if (req.headers['x-github-event'] == 'push') {
    let issue: Issue = new Issue();
    issue.repository = req.body.repository.name;

    db.collection('scores').add(
      {
        "player": "rH9puJCsOYcJtAue9VhD8K8SxY83",
        "category": "GITHUB",
        "description": "COMMIT",
        "game": "c4lUBr3vo4onHKBQIOJh",
        "score": 1,
        "time": new Date()
      }
    ).then( () => console.log('Succesfully written new document'))
    .catch( () => console.log('Error writing new document'))
  
    res.send('Received push event for repo: ' + issue.repository);
    next();
  } else {
    next();
  }
  
}