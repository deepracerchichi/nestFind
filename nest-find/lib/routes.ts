// Single source of truth for role-based destinations, so this logic
// doesn't drift out of sync across the files that need it.
export const dashboardHref = (role: string) =>
    role === "admin" ? "/admin" : role === "moderator" ? "/moderator" : "/dashboard";

export const messagesHref = (role: string) =>
    role === "admin" ? "/admin/messages" : "/dashboard/messages";
