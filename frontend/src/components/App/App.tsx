import { RouterProvider } from "react-router-dom";
import "./App.scss";
import { router } from "../../router";
import AuthProvider from "../../providers/AuthProvider";

export default function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}
