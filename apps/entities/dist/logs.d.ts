export type LogData = {
    userId: string;
    action: string;
    entityType: string;
    entityId?: string;
    message: string;
    metadata?: any;
    teamId: string;
};
