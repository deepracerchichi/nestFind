export type Role = "admin" | "user" | "moderator"

export interface User {
    id: string
    username: string
    email: string
    role: Role
}

