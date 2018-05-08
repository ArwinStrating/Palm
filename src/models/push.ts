import { Commit } from '../models/commit'

export class Push {
    repository: string;
    event: string = 'push';
    author: string;
    commits: Commit[]; 
}
