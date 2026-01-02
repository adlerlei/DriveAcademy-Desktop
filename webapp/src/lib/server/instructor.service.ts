// Instructor service - CRUD operations
import type { D1Database } from '@cloudflare/workers-types';
import type { Instructor, InstructorInput, PaginationParams, PaginatedResult } from './db';

export class InstructorService {
    constructor(private db: D1Database) { }

    // Get all instructors with pagination
    async getAll(params: PaginationParams = {}): Promise<PaginatedResult<Instructor>> {
        const { page = 1, limit = 20, search = '' } = params;
        const offset = (page - 1) * limit;

        let whereClause = '';
        const searchParams: string[] = [];

        if (search) {
            whereClause = `WHERE number LIKE ? OR name LIKE ?`;
            const searchPattern = `%${search}%`;
            searchParams.push(searchPattern, searchPattern);
        }

        const countQuery = `SELECT COUNT(*) as total FROM instructor ${whereClause}`;
        const countResult = await this.db.prepare(countQuery).bind(...searchParams).first<{ total: number }>();
        const total = countResult?.total || 0;

        const dataQuery = `SELECT * FROM instructor ${whereClause} ORDER BY number LIMIT ? OFFSET ?`;
        const dataResult = await this.db.prepare(dataQuery).bind(...searchParams, limit, offset).all<Instructor>();

        return {
            data: dataResult.results || [],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    // Get instructor by ID
    async getById(id: number): Promise<Instructor | null> {
        const result = await this.db.prepare('SELECT * FROM instructor WHERE id = ?').bind(id).first<Instructor>();
        return result || null;
    }

    // Get all instructors for dropdowns
    async getAllForDropdown(): Promise<{ number: string; name: string }[]> {
        const result = await this.db.prepare('SELECT number, name FROM instructor ORDER BY number').all<{ number: string; name: string }>();
        return result.results || [];
    }

    // Create new instructor
    async create(data: InstructorInput): Promise<Instructor> {
        const columns = Object.keys(data).filter(k => data[k as keyof InstructorInput] !== undefined);
        const values = columns.map(k => data[k as keyof InstructorInput]);
        const placeholders = columns.map(() => '?').join(', ');

        const query = `INSERT INTO instructor (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const result = await this.db.prepare(query).bind(...values).first<Instructor>();

        if (!result) {
            throw new Error('Failed to create instructor');
        }

        return result;
    }

    // Update instructor
    async update(id: number, data: Partial<InstructorInput>): Promise<Instructor> {
        const columns = Object.keys(data).filter(k => data[k as keyof InstructorInput] !== undefined);
        const values = columns.map(k => data[k as keyof InstructorInput]);
        const setClause = columns.map(k => `${k} = ?`).join(', ');

        const query = `UPDATE instructor SET ${setClause} WHERE id = ? RETURNING *`;
        const result = await this.db.prepare(query).bind(...values, id).first<Instructor>();

        if (!result) {
            throw new Error('Instructor not found');
        }

        return result;
    }

    // Delete instructor
    async delete(id: number): Promise<boolean> {
        const result = await this.db.prepare('DELETE FROM instructor WHERE id = ?').bind(id).run();
        return result.success;
    }
}
