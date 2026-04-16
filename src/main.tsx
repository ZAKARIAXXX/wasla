import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global fetch interceptor to inject auth token for backend API calls
const originalFetch = window.fetch;
window.fetch = async (...args) => {
    const [resource, config] = args;
    const url = typeof resource === 'string' ? resource : (resource instanceof Request ? resource.url : resource.toString());

    let finalUrl = url;
    // Proxy API requests to backend during development
    if (url.startsWith('/api/')) {
        // In development, proxy to backend server
        finalUrl = `http://localhost:3000${url}`;
    }

  if (finalUrl.includes('/api/') && !finalUrl.includes('/api/login')) {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Create a safe copy of config; config may be undefined in some fetch calls
            const newConfig: any = config ? { ...config } : {};
            newConfig.headers = {
                ...(newConfig.headers || {}),
                'Authorization': `Bearer ${token}`
            };

            if (resource instanceof Request) {
                // If it's a request object, create a new Request with the merged headers and new URL
                return originalFetch(new Request(finalUrl, { ...newConfig }));
            }
            return originalFetch(finalUrl, newConfig);
        }
    }
    
    if (resource instanceof Request) {
        return originalFetch(new Request(finalUrl, config));
    }
    return originalFetch(finalUrl, config);
};

createRoot(document.getElementById("root")!).render(<App />);
