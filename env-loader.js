// Simple environment variable loader for browser environments
// This is a basic implementation - in production, you'd want to use a proper build tool

const loadEnvConfig = async () => {
    try {
        const response = await fetch('./config.env');
        const envText = await response.text();
        
        const envVars = {};
        envText.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, value] = trimmed.split('=');
                if (key && value) {
                    envVars[key.trim()] = value.trim();
                }
            }
        });
        
        // Make environment variables available globally
        window.process = window.process || {};
        window.process.env = window.process.env || {};
        Object.assign(window.process.env, envVars);
        
        console.log('Environment variables loaded successfully');
    } catch (error) {
        console.warn('Could not load config.env file, using fallback values');
    }
};

// Load environment variables when the script is loaded
loadEnvConfig(); 