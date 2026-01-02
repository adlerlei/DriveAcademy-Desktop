// Authentication API - Login
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AuthService } from '$lib/server/auth.service';

export const POST: RequestHandler = async ({ request, cookies, platform }) => {
    if (!platform?.env?.DB) {
        return json({ error: 'Database not available' }, { status: 503 });
    }

    const authService = new AuthService(platform.env.DB);

    try {
        const { name, password } = await request.json();

        if (!name || !password) {
            return json({ error: 'Username and password are required' }, { status: 400 });
        }

        const admin = await authService.verifyCredentials(name, password);

        if (!admin) {
            return json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Set session cookie
        cookies.set('session', JSON.stringify({ id: admin.id, name: admin.name }), {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return json({
            success: true,
            user: { id: admin.id, name: admin.name }
        });
    } catch (error) {
        console.error('Login error:', error);
        return json({ error: 'Login failed' }, { status: 500 });
    }
};
