// Instructors API - GET all, POST create
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { InstructorService } from '$lib/server/instructor.service';

export const GET: RequestHandler = async ({ url, platform }) => {
    if (!platform?.env?.DB) {
        return json({ error: 'Database not available' }, { status: 503 });
    }

    const instructorService = new InstructorService(platform.env.DB);

    // Check if this is a dropdown request
    const dropdown = url.searchParams.get('dropdown') === 'true';

    if (dropdown) {
        try {
            const instructors = await instructorService.getAllForDropdown();
            return json(instructors);
        } catch (error) {
            console.error('Error fetching instructors for dropdown:', error);
            return json({ error: 'Failed to fetch instructors' }, { status: 500 });
        }
    }

    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';

    try {
        const result = await instructorService.getAll({ page, limit, search });
        return json(result);
    } catch (error) {
        console.error('Error fetching instructors:', error);
        return json({ error: 'Failed to fetch instructors' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request, platform }) => {
    if (!platform?.env?.DB) {
        return json({ error: 'Database not available' }, { status: 503 });
    }

    const instructorService = new InstructorService(platform.env.DB);

    try {
        const data = await request.json();
        const instructor = await instructorService.create(data);
        return json(instructor, { status: 201 });
    } catch (error) {
        console.error('Error creating instructor:', error);
        return json({ error: 'Failed to create instructor' }, { status: 500 });
    }
};
