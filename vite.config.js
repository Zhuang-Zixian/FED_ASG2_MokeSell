// This is the Vite configuration file, 
// this imports the defineConfig function from Vite
import { defineConfig } from 'vite';

// Exporting the Vite configurations 
export default defineConfig({
    server: {
        port: 5173, // Locks the development server to always use port 5173 
    },
});

// Using a fixed development server port allows for easier collaboration between collaborators.
// This is also super duper useful when debugging as Vite sometimes changes the port numbers to like 5174 for example.