// Student API - GET by ID, PUT update, DELETE
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StudentService } from '$lib/server/student.service';

export const GET: RequestHandler = async ({ params, platform }) => {
    if (!platform?.env?.DB) {
        return json({ error: 'Database not available' }, { status: 503 });
    }

    const studentService = new StudentService(platform.env.DB);
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return json({ error: 'Invalid student ID' }, { status: 400 });
    }

    try {
        const student = await studentService.getById(id);
        if (!student) {
            return json({ error: 'Student not found' }, { status: 404 });
        }
        return json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        return json({ error: 'Failed to fetch student' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ params, request, platform }) => {
    if (!platform?.env?.DB) {
        return json({ error: 'Database not available' }, { status: 503 });
    }

    const studentService = new StudentService(platform.env.DB);
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return json({ error: 'Invalid student ID' }, { status: 400 });
    }

    try {
        const data = await request.json();
        const student = await studentService.update(id, data);
        return json(student);
    } catch (error) {
        console.error('Error updating student:', error);
        return json({ error: 'Failed to update student' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ params, platform }) => {
    if (!platform?.env?.DB) {
        return json({ error: 'Database not available' }, { status: 503 });
    }

    const studentService = new StudentService(platform.env.DB);
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return json({ error: 'Invalid student ID' }, { status: 400 });
    }

    try {
        await studentService.delete(id);
        return json({ success: true });
    } catch (error) {
        console.error('Error deleting student:', error);
        return json({ error: 'Failed to delete student' }, { status: 500 });
    }
};
