
// Supabase Client Initialization
// Requires: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> in HTML

const SUPABASE_URL = 'https://debbjoigkighwgbvgewh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlYmJqb2lna2lnaHdnYnZnZXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwOTE1NjIsImV4cCI6MjA4MjY2NzU2Mn0.KKC0QEuI2mUC_2BVTEpeR5rQFWSrIT2xXAaWkX-N9-8';

// NOTE: We only use the ANON key here. Never expose the service_role key in the frontend.

let supabaseClient = null;

try {
    if (window.supabase) {
        const { createClient } = window.supabase;
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized');
        checkConnection();
    } else {
        console.error('Supabase script not loaded. Make sure to include the CDN link.');
        updateStatus('Script Missing', 'red');
    }
} catch (error) {
    console.error('Error initializing Supabase:', error);
    updateStatus('Init Error', 'red');
}

async function checkConnection() {
    if (!supabaseClient) return;
    updateStatus('Connecting...', 'orange');
    
    // Simple query to test connection
    const { data, error } = await supabaseClient.from('projects').select('count', { count: 'exact', head: true });
    
    if (error) {
        console.error('Connection Test Failed:', error);
        updateStatus('Disconnected', 'red');
        alert('Supabase Connection Failed: ' + error.message);
    } else {
        console.log('Connection Test Passed');
        updateStatus('Connected', 'green');
    }
}

function updateStatus(text, color) {
    const el = document.getElementById('connectionStatus');
    if (el) {
        el.textContent = text;
        el.style.background = color;
    }
}

export { supabaseClient, checkConnection };
