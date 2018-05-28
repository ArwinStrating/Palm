export class PullRequest {
    id: number;
    repository: string;
    userRef: string;
    title: string;
    event: string = 'pull_request';
    action: string;
    authorName: string;
    createdAt: string;
}
