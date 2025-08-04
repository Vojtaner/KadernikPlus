export type LogData = {
    id: string;
    userId: string;
    action: string;
    entityType: string;
    entityId?: string;
    message: string;
    metadata?: any;
    teamId: string;
    createdAt: Date;
    user: {
        name: string;
        id: string;
        createdAt: Date;
        email: string;
        bankAccount: string | null;
        authProvider: string | null;
        lastLogin: Date | null;
    };
};
