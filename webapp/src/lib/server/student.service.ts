// Student service - CRUD operations
import type { D1Database } from '@cloudflare/workers-types';
import type { Student, StudentInput, PaginationParams, PaginatedResult } from './db';

export class StudentService {
    constructor(private db: D1Database) { }

    // Get all students with pagination and search
    async getAll(params: PaginationParams = {}): Promise<PaginatedResult<Student>> {
        const { page = 1, limit = 20, search = '' } = params;
        const offset = (page - 1) * limit;

        let whereClause = '';
        const searchParams: string[] = [];

        if (search) {
            whereClause = `WHERE student_number LIKE ? OR student_name LIKE ? OR national_id_no LIKE ? OR mobile_phone LIKE ?`;
            const searchPattern = `%${search}%`;
            searchParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }

        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM student ${whereClause}`;
        const countResult = await this.db.prepare(countQuery).bind(...searchParams).first<{ total: number }>();
        const total = countResult?.total || 0;

        // Get paginated data
        const dataQuery = `SELECT * FROM student ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`;
        const dataResult = await this.db.prepare(dataQuery).bind(...searchParams, limit, offset).all<Student>();

        return {
            data: dataResult.results || [],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    // Get student by ID
    async getById(id: number): Promise<Student | null> {
        const result = await this.db.prepare('SELECT * FROM student WHERE id = ?').bind(id).first<Student>();
        return result || null;
    }

    // Get student by student number
    async getByStudentNumber(studentNumber: string): Promise<Student | null> {
        const result = await this.db.prepare('SELECT * FROM student WHERE student_number = ?').bind(studentNumber).first<Student>();
        return result || null;
    }

    // Create new student
    async create(data: StudentInput): Promise<Student> {
        const columns = Object.keys(data).filter(k => data[k as keyof StudentInput] !== undefined);
        const values = columns.map(k => data[k as keyof StudentInput]);
        const placeholders = columns.map(() => '?').join(', ');

        const query = `INSERT INTO student (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const result = await this.db.prepare(query).bind(...values).first<Student>();

        if (!result) {
            throw new Error('Failed to create student');
        }

        return result;
    }

    // Update student
    async update(id: number, data: Partial<StudentInput>): Promise<Student> {
        const columns = Object.keys(data).filter(k => data[k as keyof StudentInput] !== undefined);
        const values = columns.map(k => data[k as keyof StudentInput]);
        const setClause = columns.map(k => `${k} = ?`).join(', ');

        const query = `UPDATE student SET ${setClause} WHERE id = ? RETURNING *`;
        const result = await this.db.prepare(query).bind(...values, id).first<Student>();

        if (!result) {
            throw new Error('Student not found');
        }

        return result;
    }

    // Delete student
    async delete(id: number): Promise<boolean> {
        const result = await this.db.prepare('DELETE FROM student WHERE id = ?').bind(id).run();
        return result.success;
    }

    // Get students by batch
    async getByBatch(batch: string): Promise<Student[]> {
        const result = await this.db.prepare('SELECT * FROM student WHERE batch = ? ORDER BY student_number').bind(batch).all<Student>();
        return result.results || [];
    }

    // Get students by instructor
    async getByInstructor(instructorNumber: string): Promise<Student[]> {
        const result = await this.db.prepare('SELECT * FROM student WHERE instructor_number = ? ORDER BY student_number').bind(instructorNumber).all<Student>();
        return result.results || [];
    }
}
