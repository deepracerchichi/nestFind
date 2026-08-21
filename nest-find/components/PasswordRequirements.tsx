"use client"
import { TicketCheck, RadioIcon } from "lucide-react";

const REQUIREMENTS = [
    {label: "At least 8 characters", test: (pw: string) => pw.length >= 8},
    { label: "One uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
    { label: "One lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
    { label: "One number", test: (pw: string) => /\d/.test(pw) },
    { label: "One symbol", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

export const isPasswordValid = (password: string) => REQUIREMENTS.every((r) => r.test(password))

export default function PasswordRequirements({password} : {password: string}) {
    if (!password) return null;

    return (
        <ul className="text-xs space-y-1 mt-1">
            {REQUIREMENTS.map((req) => {
                const met = req.test(password);
                return (
                    <li key={req.label} className={met ? "text-green-600" : "text-muted-foreground"}>
                        {met ? <TicketCheck /> : <RadioIcon />}
                    </li>
                )
            })}

        </ul>
    )
}