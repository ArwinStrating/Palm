export class Activity {
    id: number;
    timestamp: number;
    message: string;
    user?: string;
    repo?: string;
    eventType: string = 'github-events';
    eventData: any;
}