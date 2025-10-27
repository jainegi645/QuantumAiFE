import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";

// Clerk publishable key must be provided via Vite env (VITE_CLERK_PUBLISHABLE_KEY)
const clerkPublishableKey = (import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")!).render(
	<ClerkProvider publishableKey={clerkPublishableKey}>
		<App />
	</ClerkProvider>
);