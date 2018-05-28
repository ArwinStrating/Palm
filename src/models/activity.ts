export class Activity {
    id: number;
    timestamp: string;
    message: string;
    user?: string;
    repo?: string;
    eventType: string = 'github-events';
    eventData: any;
}