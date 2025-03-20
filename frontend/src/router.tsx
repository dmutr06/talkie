import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";

export const router = createBrowserRouter([
    {
        path: "/chats",
        element: <Dashboard />,
        children: [
            {
                path: ":id",
                element: <Chat />,
            }
        ],
    },
    {
        path: "/auth",
        element: <Auth />,
    },
    {
        path: "/auth/callback",
        element: <AuthCallback />,
    },
]);
