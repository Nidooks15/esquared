
/**
 * Supabase Adapter
 * Replaces MockDB (LocalStorage) with real Async Supabase calls.
 */
import { supabaseClient } from './supabase.js';

// Fallback Keys for non-migrated data (Quotes/Bookings still local for now)
const DB_KEYS = {
    QUOTES: 'esquared_quotes',
    BOOKINGS: 'esquared_bookings'
};

class SupabaseDB {
    constructor() {
       // Init logic handled by supabase.js
    }

    // --- Projects (Real Backend) ---

    async getProjects() {
        if (!supabaseClient) return [];
        const { data, error } = await supabaseClient
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
        return data; 
    }

    async getProjectById(id) {
        if (!supabaseClient) return null;
        const { data, error } = await supabaseClient
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) return null;
        return data;
    }

    async addProject(project) {
        console.log('addProject called with:', project);
        if (!supabaseClient) {
            console.error('No Supabase Client!');
            return null;
        }
        
        // Remove ID if present to let DB generate UUID
        const { id, ...projectData } = project;
        
        // Map camelCase to snake_case if needed (or we just use snake_case in object)
        // Our table uses: title, type, location, status, image_url, gallery, short_desc, full_desc
        const payload = {
            title: project.title,
            type: project.type,
            location: project.location,
            status: project.status,
            image_url: project.imageUrl, // Map JS prop to DB Column
            gallery: project.gallery,
            short_desc: project.shortDesc,
            full_desc: project.fullDesc,
            client: project.client,
            timeline: project.timeline,
            area: project.area
        };

        console.log('Payload for Supabase:', payload);

        const { data, error } = await supabaseClient
            .from('projects')
            .insert([payload])
            .select();

        if (error) {
            console.error('Supabase DB Insert Error:', error);
            // Alert here for visibility
            alert('DB Insert Error: ' + error.message + '\nDetails: ' + JSON.stringify(error));
            throw error;
        }
        
        console.log('Insert successful, data returned:', data);
        return data[0];
    }

    async updateProject(id, updates) {
        if (!supabaseClient) return false;

        const payload = {
            title: updates.title,
            type: updates.type,
            location: updates.location,
            status: updates.status,
            image_url: updates.imageUrl,
            gallery: updates.gallery,
            short_desc: updates.shortDesc,
            full_desc: updates.fullDesc,
            client: updates.client,
            timeline: updates.timeline,
            area: updates.area
        };
        // Remove undefined keys
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        const { error } = await supabaseClient
            .from('projects')
            .update(payload)
            .eq('id', id);

        if (error) {
            console.error('Error updating project:', error);
            return false;
        }
        return true;
    }

    async deleteProject(id) {
        if (!supabaseClient) return false;
        const { error } = await supabaseClient
            .from('projects')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('Error deleting:', error);
            return false;
        }
        return true;
    }

    // --- Image Upload (Storage) ---
    // --- Image Upload (Storage) ---
    async uploadImage(file) {
        console.log('Starting uploadImage...', file.name);
        if (!supabaseClient) {
            console.error('No Supabase Client found!');
            throw new Error('No Supabase Client');
        }

        // Create unique name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        console.log('Uploading to path:', filePath);

        const { data, error } = await supabaseClient
            .storage
            .from('project-images')
            .upload(filePath, file);

        if (error) {
            console.error('Supabase Storage Error:', error);
            alert('Supabase Storage Error: ' + error.message + '\nCheck bucket permissions or CORS.');
            throw error;
        }

        console.log('Upload successful, getting URL...');

        // Get Public URL
        const { data: { publicUrl } } = supabaseClient
            .storage
            .from('project-images')
            .getPublicUrl(filePath);

        console.log('Public URL:', publicUrl);
        return publicUrl;
    }

    // --- Quotes & Bookings (Still Local for now) ---
    // Make these async too for consistency, even if fake async
    
    getBookings() {
        return JSON.parse(localStorage.getItem(DB_KEYS.BOOKINGS) || '[]');
    }

    addBooking(booking) {
        const bookings = this.getBookings();
        const newBooking = { id: 'BK-'+Date.now(), status: 'Pending', createdAt: new Date().toISOString(), ...booking };
        bookings.push(newBooking);
        localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify(bookings));
        return newBooking;
    }

    getQuotes() {
        return JSON.parse(localStorage.getItem(DB_KEYS.QUOTES) || '[]');
    }

    addQuote(quote) {
        const quotes = this.getQuotes();
        const newQuote = { id: 'QT-'+Date.now(), createdAt: new Date().toISOString(), ...quote };
        quotes.push(newQuote);
        localStorage.setItem(DB_KEYS.QUOTES, JSON.stringify(quotes));
        return newQuote;
    }
}

export const db = new SupabaseDB();
