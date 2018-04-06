import { Commit } from '../models/commit'

export class Push {
    repository: string;
    commits: Commit[]; 
}
