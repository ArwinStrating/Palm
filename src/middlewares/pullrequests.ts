import * as moment from 'moment';

import { PullRequest } from '../models/pullrequest';
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

export async function pullrequests(req, res, next) {
  if (req.headers['x-github-event'] == 'pull_request') {
    if(req.body.action === 'opened' || req.body.action === 'closed') {
        let pullRequest: PullRequest = new PullRequest();
        pullRequest.id = req.body.pull_request.id;
        pullRequest.repository = req.body.repository.full_name;
        pullRequest.title = req.body.pull_request.title;    
        pullRequest.authorName = req.body.pull_request.user.login;
        if (req.body.action === 'closed' && req.body.pull_request.merged) {
            pullRequest.action = 'merged';
        } else {
            pullRequest.action = req.body.action;
        }
        pullRequest.createdAt = req.body.pull_request.created_at;

        const userRef = await retrieveUser(pullRequest.authorName, 'github')

        pullRequest.userRef = userRef;

        console.log(JSON.stringify(pullRequest));

        db.collection('data').doc('github').collection('pull_requests').doc(`${pullRequest.id}`).set(
            {
                "_meta": {
                    "project": pullRequest.repository,
                    "user": pullRequest.authorName
                },
                "id": pullRequest.id,
                "createdAt": pullRequest.createdAt,
                "action": pullRequest.action,
                "title": pullRequest.title,
                "user": userRef
            }
        ).then( () => console.log('Succesfully written new document'))
        .catch( (error) => console.log('Error writing new document: ' + error));

        const activity: Activity = new Activity();
        activity.id = pullRequest.id;
        activity.timestamp = new Date().toISOString();
        activity.message = pullRequest.title;
        activity.eventData = pullRequest;
        activity.user = userRef;
        activity.repo = pullRequest.repository;
    
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
    }
    // res.send(pullRequest); 
    next();
  } else {
    next();
  }
  
}