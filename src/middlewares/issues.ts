import * as moment from 'moment';

import { Issue } from '../models/issue'
import { db } from '../db';

export function issues(req, res, next) {
  if (req.headers['x-github-event'] == 'issues') {
    let issue: Issue = new Issue();
    issue.repository = req.body.repository.name;
    issue.action = req.body.action;

    db.collection('scores').add(
      {
        "player": "rH9puJCsOYcJtAue9VhD8K8SxY83",
        "category": "GITHUB",
        "description": "ISSUE",
        "game": "c4lUBr3vo4onHKBQIOJh",
        "score": 1,
        "time": moment().toISOString()              
      }
    ).then( () => console.log('Succesfully written new document'))
    .catch( () => console.log('Error writing new document'))
  
    res.send('Received issue ' + issue.action + ' event for repo: ' + issue.repository);
    next();
  } else {
    next();
  }
  
}