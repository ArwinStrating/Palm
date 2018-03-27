import { Issue } from '../models/issue'

export function issues(req, res, next) {
  if (req.body.issue) {
    let issue: Issue = new Issue();
    issue.repository = req.body.repository.name;
    issue.action = req.body.repository.name;
  
    res.send('Received issue ' + issue.action + ' event for repo: ' + issue.repository);
    next();
  } else {
    next();
  }
  
}