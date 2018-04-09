import * as moment from 'moment';

import { Push } from '../models/push';
import { Commit } from '../models/commit';

import { db } from '../db';

export function pushes(req, res, next) {
  if (req.headers['x-github-event'] == 'push') {
    let push: Push = new Push();
    let commits: Commit[] = [];
    for (let commit of req.body.commits) {
        let c = new Commit.Builder(commit.id)
          .withMessage(commit.message)
          .withModified(commit.modified)
          .withRemoved(commit.removed)
          .withAdded(commit.added)
          .build();

        commits.push(c);
    }
    push.repository = req.body.repository.name;
    push.commits = commits;

    db.collection('scores').add(
      {
        "player": "rH9puJCsOYcJtAue9VhD8K8SxY83",
        "category": "GITHUB",
        "description": "COMMIT",
        "game": "c4lUBr3vo4onHKBQIOJh",
        "score": push.commits.length,
        "time": moment().toISOString()
      }
    ).then( () => console.log('Succesfully written new document'))
    .catch( () => console.log('Error writing new document'))
  
    res.send(push);
    next();
  } else {
    next();
  }
  
}