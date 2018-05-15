export class PullRequest {
    id: number;
    repository: string;
    title: string;
    event: string = 'pull_request';
    action: string;
    author: string;
    createdAt: string;
}
