-- DriveAcademy D1 Database Schema
-- Migration from SQLite desktop application

-- 年度期別計畫表
CREATE TABLE IF NOT EXISTS annual_plan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year TEXT,
    term TEXT,
    term_class_code TEXT,
    batch TEXT,
    training_type_code TEXT,
    training_type_name TEXT,
    start_date TEXT,
    end_date TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- 學員資料表
CREATE TABLE IF NOT EXISTS student (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license_type_code TEXT,
    license_type_name TEXT,
    training_type_code TEXT,
    training_type_name TEXT,
    student_number TEXT,
    student_name TEXT,
    batch TEXT,
    register_batch TEXT,
    birth_date TEXT,
    national_id_no TEXT,
    mobile_phone TEXT,
    home_phone TEXT,
    education TEXT,
    instructor_number TEXT,
    instructor_name TEXT,
    gender TEXT,
    email TEXT,
    remarks TEXT,
    r_address_zip_code TEXT,
    r_address_city TEXT,
    r_address TEXT,
    m_address_zip_code TEXT,
    m_address_city TEXT,
    m_address TEXT,
    learner_permit_login_data TEXT,
    learner_permit_date TEXT,
    learner_permit_number TEXT,
    submission_date TEXT,
    exam_code TEXT,
    exam_name TEXT,
    transmission_type_code TEXT,
    transmission_type_name TEXT,
    dropout TEXT,
    register_number TEXT,
    register_term TEXT,
    written_exam_date TEXT,
    road_test_date TEXT,
    driving_test_group TEXT,
    road_test_items_type TEXT,
    exam_type_name TEXT,
    driving_test_number TEXT,
    driving_test_session TEXT,
    driving_test_code TEXT,
    student_term_class_code TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- 教練資料表
CREATE TABLE IF NOT EXISTS instructor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT,
    name TEXT,
    birth_date TEXT,
    instructor_number TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- 管理員資料表
CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

-- 郵遞區號資料表
CREATE TABLE IF NOT EXISTS address_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zip_code TEXT,
    city TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- 建立索引以加速查詢
CREATE INDEX IF NOT EXISTS idx_student_number ON student(student_number);
CREATE INDEX IF NOT EXISTS idx_student_national_id ON student(national_id_no);
CREATE INDEX IF NOT EXISTS idx_student_name ON student(student_name);
CREATE INDEX IF NOT EXISTS idx_instructor_number ON instructor(number);
CREATE INDEX IF NOT EXISTS idx_admin_name ON admin(name);
