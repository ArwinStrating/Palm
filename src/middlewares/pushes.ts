import * as moment from 'moment';

import { Push } from '../models/push';
import { Commit } from '../models/commit';

import { db } from '../db';

import * as PubSub from '@google-cloud/pubsub';

// Creates a client
const pubsub = new PubSub({
  projectId: 'm4m-code-heroes-dev'
});
const topicName = 'github-events';

export function pushes(req, res, next) {
  if (req.headers['x-github-event'] == 'push') {
    let push: Push = new Push();
    let commits: Commit[] = [];
    for (let commit of req.body.commits) {
        let c = new Commit.Builder(commit.id)
          .withMessage(commit.message)
          .withModified(commit.modified)
          .withCommitter(commit.committer)
          .withDistinct(commit.distinct)
          .withTimestamp(commit.timestamp)
          .withRemoved(commit.removed)
          .withAdded(commit.added)
          .build();

        commits.push(c);
    }
    push.repository = req.body.repository.name;
    push.author = req.body.pusher.name;
    push.commits = commits;

    for(const commit of push.commits) {
      if (commit.distinct) {
        db.collection('data').doc('github').collection('commits').doc(commit.id).set(
          {
            "_meta": {
              "project": push.repository,
              "user": commit.committer.username
            },
            "commitId": commit.id,
            "commitMessage": commit.message,
            "distinct": commit.distinct,
            "time": commit.timestamp,
            "modified" : commit.modified,
            "removed": commit.removed,
            "added": commit.added
          }
        ).then( () => console.log('Succesfully written new document'))
        .catch( (error) => console.log('Error writing new document: ' + error))
      }
    }

    const dataBuffer = Buffer.from(JSON.stringify(push));

    pubsub
      .topic(topicName)
      .publisher()
      .publish(dataBuffer)
      .then(messageId => {
        console.log(`Message ${messageId} published.`);
      })
      .catch(err => {
        console.error('ERROR:', err);
      });

    // res.send(push); 
    next();
  } else {
    next();
  }
  
}