// Database utilities for Cloudflare D1
import type { D1Database } from '@cloudflare/workers-types';

export interface DatabaseContext {
    DB: D1Database;
}

// Student type matching the database schema
export interface Student {
    id: number;
    license_type_code: string | null;
    license_type_name: string | null;
    training_type_code: string | null;
    training_type_name: string | null;
    student_number: string | null;
    student_name: string | null;
    batch: string | null;
    register_batch: string | null;
    birth_date: string | null;
    national_id_no: string | null;
    mobile_phone: string | null;
    home_phone: string | null;
    education: string | null;
    instructor_number: string | null;
    instructor_name: string | null;
    gender: string | null;
    email: string | null;
    remarks: string | null;
    r_address_zip_code: string | null;
    r_address_city: string | null;
    r_address: string | null;
    m_address_zip_code: string | null;
    m_address_city: string | null;
    m_address: string | null;
    learner_permit_login_data: string | null;
    learner_permit_date: string | null;
    learner_permit_number: string | null;
    submission_date: string | null;
    exam_code: string | null;
    exam_name: string | null;
    transmission_type_code: string | null;
    transmission_type_name: string | null;
    dropout: string | null;
    register_number: string | null;
    register_term: string | null;
    written_exam_date: string | null;
    road_test_date: string | null;
    driving_test_group: string | null;
    road_test_items_type: string | null;
    exam_type_name: string | null;
    driving_test_number: string | null;
    driving_test_session: string | null;
    driving_test_code: string | null;
    student_term_class_code: string | null;
    created_at: string;
}

// Instructor type
export interface Instructor {
    id: number;
    number: string | null;
    name: string | null;
    birth_date: string | null;
    instructor_number: string | null;
    created_at: string;
}

// Admin type
export interface Admin {
    id: number;
    name: string;
    password_hash: string;
    created_at: string;
}

// Annual Plan type
export interface AnnualPlan {
    id: number;
    year: string | null;
    term: string | null;
    term_class_code: string | null;
    batch: string | null;
    training_type_code: string | null;
    training_type_name: string | null;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
}

// Address Data type
export interface AddressData {
    id: number;
    zip_code: string | null;
    city: string | null;
    created_at: string;
}

// Input types for creating/updating records
export type StudentInput = Omit<Student, 'id' | 'created_at'>;
export type InstructorInput = Omit<Instructor, 'id' | 'created_at'>;
export type AnnualPlanInput = Omit<AnnualPlan, 'id' | 'created_at'>;

// Pagination types
export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
