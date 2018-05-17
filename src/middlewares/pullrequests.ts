import * as moment from 'moment';

import { PullRequest } from '../models/pullrequest';
import { Commit } from '../models/commit';

import { db } from '../db';

import * as PubSub from '@google-cloud/pubsub';

// Creates a client
const pubsub = new PubSub({
  projectId: 'm4m-code-heroes-dev'
});
const topicName = 'github-events';

export function pullrequests(req, res, next) {
  if (req.headers['x-github-event'] == 'pull_request') {
    if(req.body.action === 'opened' || req.body.action === 'closed') {
        let pullRequest: PullRequest = new PullRequest();
        pullRequest.id = req.body.pull_request.id;
        pullRequest.repository = req.body.repository.name;
        pullRequest.title = req.body.pull_request.title;    
        pullRequest.author = req.body.pull_request.user.login;
        pullRequest.action = req.body.action;
        pullRequest.createdAt = req.body.pull_request.created_at;

        db.collection('data').doc('github').collection('pull_requests').doc(`${pullRequest.id}`).set(
            {
                "_meta": {
                    "project": pullRequest.repository,
                    "user": pullRequest.author
                },
                "id": pullRequest.id,
                "createdAt": pullRequest.createdAt,
                "action": pullRequest.action,
                "title": pullRequest.title
            }
        ).then( () => console.log('Succesfully written new document'))
        .catch( (error) => console.log('Error writing new document: ' + error));

        const dataBuffer = Buffer.from(JSON.stringify(pullRequest));

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
    }
    // res.send(pullRequest); 
    next();
  } else {
    next();
  }
  
}