// Authentication service
import type { D1Database } from '@cloudflare/workers-types';
import type { Admin } from './db';

export class AuthService {
    constructor(private db: D1Database) { }

    // Verify admin credentials
    async verifyCredentials(name: string, password: string): Promise<Admin | null> {
        const admin = await this.db.prepare('SELECT * FROM admin WHERE name = ?').bind(name).first<Admin>();

        if (!admin) {
            return null;
        }

        // For now, do simple password comparison
        // TODO: Use bcrypt for password hashing in production
        if (admin.password_hash === password) {
            return admin;
        }

        return null;
    }

    // Create admin user (for initial setup)
    async createAdmin(name: string, password: string): Promise<Admin> {
        // TODO: Hash password with bcrypt in production
        const query = `INSERT INTO admin (name, password_hash) VALUES (?, ?) RETURNING *`;
        const result = await this.db.prepare(query).bind(name, password).first<Admin>();

        if (!result) {
            throw new Error('Failed to create admin');
        }

        return result;
    }

    // Check if any admin exists
    async hasAdmin(): Promise<boolean> {
        const result = await this.db.prepare('SELECT COUNT(*) as count FROM admin').first<{ count: number }>();
        return (result?.count || 0) > 0;
    }

    // Get admin by name
    async getByName(name: string): Promise<Admin | null> {
        const result = await this.db.prepare('SELECT * FROM admin WHERE name = ?').bind(name).first<Admin>();
        return result || null;
    }
}
