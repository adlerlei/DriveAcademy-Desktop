// Students API - GET all, POST create
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StudentService } from '$lib/server/student.service';

export const GET: RequestHandler = async ({ url, platform }) => {
    if (!platform?.env?.DB) {
        return json({ error: 'Database not available' }, { status: 503 });
    }

    const studentService = new StudentService(platform.env.DB);

    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';

    try {
        const result = await studentService.getAll({ page, limit, search });
        return json(result);
    } catch (error) {
        console.error('Error fetching students:', error);
        return json({ error: 'Failed to fetch students' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request, platform }) => {
    if (!platform?.env?.DB) {
        return json({ error: 'Database not available' }, { status: 503 });
    }

    const studentService = new StudentService(platform.env.DB);

    try {
        const data = await request.json();
        const student = await studentService.create(data);
        return json(student, { status: 201 });
    } catch (error) {
        console.error('Error creating student:', error);
        return json({ error: 'Failed to create student' }, { status: 500 });
    }
};
