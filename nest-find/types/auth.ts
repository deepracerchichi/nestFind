export type Role = "admin" | "user"

export interface User {
    id: string
    username: string
    email: string
    role: Role
}

