import * as moment from 'moment';

import { Delete } from '../models/delete';
import { Activity } from '../models/activity';

import { retrieveUser } from '../helpers/name-retriever'

import * as PubSub from '@google-cloud/pubsub';

// Creates a client
const pubsub = new PubSub({
  projectId: 'm4m-code-heroes-dev'
});
const topicName = 'github-events';

export async function deletes(req, res, next) {
  if (req.headers['x-github-event'] == 'delete') {
    let deleteAction: Delete = new Delete();
    deleteAction.repository = req.body.repository.full_name;
    deleteAction.authorName = req.body.sender.login;
    deleteAction.ref = req.body.ref;
    deleteAction.ref_type = req.body.ref_type;

    const userRef = await retrieveUser(deleteAction.authorName, 'github')

    deleteAction.userRef = userRef;

    console.log(JSON.stringify(deleteAction));

    const activity: Activity = new Activity();
    activity.id = null;
    activity.timestamp = new Date().toISOString();
    activity.message = `Deleted ${deleteAction.ref_type} ${deleteAction.ref}`;
    activity.eventData = deleteAction;
    activity.user = userRef;
    activity.repo = deleteAction.repository;

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