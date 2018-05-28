import { Commit } from '../models/commit'

export class Push {
    repository: string;
    event: string = 'push';
    userRef: string;
    authorName: string;
    commits: Commit[]; 
}
