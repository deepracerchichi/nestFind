export type Report = {
    _id: string;
    listing: {
        _id: string;
        title: string;
    };
    reportedBy: {
        username: string;
        email: string;
    };
    reason: string;
    status: "open" | "resolved" | "dismissed";
    createdAt: string;
};
