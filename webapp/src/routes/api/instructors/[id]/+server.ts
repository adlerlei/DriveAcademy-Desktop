// Instructor API - GET by ID, PUT update, DELETE
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { InstructorService } from '$lib/server/instructor.service';

export const GET: RequestHandler = async ({ params, platform }) => {
    if (!platform?.env?.DB) {
        return json({ error: 'Database not available' }, { status: 503 });
    }

    const instructorService = new InstructorService(platform.env.DB);
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return json({ error: 'Invalid instructor ID' }, { status: 400 });
    }

    try {
        const instructor = await instructorService.getById(id);
        if (!instructor) {
            return json({ error: 'Instructor not found' }, { status: 404 });
        }
        return json(instructor);
    } catch (error) {
        console.error('Error fetching instructor:', error);
        return json({ error: 'Failed to fetch instructor' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ params, request, platform }) => {
    if (!platform?.env?.DB) {
        return json({ error: 'Database not available' }, { status: 503 });
    }

    const instructorService = new InstructorService(platform.env.DB);
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return json({ error: 'Invalid instructor ID' }, { status: 400 });
    }

    try {
        const data = await request.json();
        const instructor = await instructorService.update(id, data);
        return json(instructor);
    } catch (error) {
        console.error('Error updating instructor:', error);
        return json({ error: 'Failed to update instructor' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ params, platform }) => {
    if (!platform?.env?.DB) {
        return json({ error: 'Database not available' }, { status: 503 });
    }

    const instructorService = new InstructorService(platform.env.DB);
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return json({ error: 'Invalid instructor ID' }, { status: 400 });
    }

    try {
        await instructorService.delete(id);
        return json({ success: true });
    } catch (error) {
        console.error('Error deleting instructor:', error);
        return json({ error: 'Failed to delete instructor' }, { status: 500 });
    }
};
