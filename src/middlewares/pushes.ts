import * as moment from 'moment';

import { Push } from '../models/push';
import { Commit } from '../models/commit';
import { Activity } from '../models/activity';

import { db } from '../db';
import { retrieveUser } from '../helpers/name-retriever'

import * as PubSub from '@google-cloud/pubsub';

// Creates a client
const pubsub = new PubSub({
  projectId: 'm4m-code-heroes-dev'
});
const topicName = 'github-events';

export async function pushes(req, res, next) {
  if (req.headers['x-github-event'] == 'push') {
    let push: Push = new Push();
    let commits: Commit[] = [];
    if (req.body.commits) {
      for (let commit of req.body.commits) {
          commit.committer.username  = commit.committer.username 
            ? commit.committer.username 
            : req.body.pusher.name

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
    }
    push.repository = req.body.repository.name;
    push.authorName = req.body.pusher.name;
    push.commits = commits;

    const userRef = await retrieveUser(push.authorName, 'github')

    push.userRef = userRef;

    console.log(JSON.stringify(push));    

    for(const commit of push.commits) {
      if (commit.distinct) {
        db.collection('data').doc('github').collection('commits').doc(commit.id).set(
          {
            "_meta": {
              "project": push.repository,
              "user": commit.committer.username
            },
            "user": userRef,
            "commitId": commit.id,
            "commitMessage": commit.message,
            "time": commit.timestamp,
            "modified" : commit.modified,
            "removed": commit.removed,
            "added": commit.added
          }
        ).then( () => console.log('Succesfully written new document'))
        .catch( (error) => console.log('Error writing new document: ' + error))
      }
    }

    const activity: Activity = new Activity();
    activity.id = req.body.after;
    activity.timestamp = new Date().toISOString();
    activity.message = req.body.head_commit.message;
    activity.eventData = push;
    activity.user = userRef;
    activity.repo = push.repository;

    console.log(JSON.stringify(activity))

    const dataBuffer = Buffer.from(JSON.stringify(activity));

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