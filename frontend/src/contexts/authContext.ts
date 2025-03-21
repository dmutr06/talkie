import { createContext } from "react";
import { User } from "../types/user";

export interface IAuthContext<Checked extends boolean> {
    token: Checked extends true ? string : string | null,
    setToken: (token: string) => void,
    resetToken: () => void,
    user: Checked extends true ? User : User | null,
    status: number | null,
}

export const AuthContext = createContext<IAuthContext<boolean> | null>(null);
