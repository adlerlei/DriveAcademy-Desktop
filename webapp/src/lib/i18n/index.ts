// i18n - 多語言支援系統
import { writable, derived, get } from 'svelte/store';

export type Locale = 'zh-TW' | 'en';

// Available locales
export const locales: Locale[] = ['zh-TW', 'en'];

// Current locale store
export const currentLocale = writable<Locale>('zh-TW');

// Translation dictionaries
const translations: Record<Locale, Record<string, string>> = {
    'zh-TW': {
        // App
        'app.name': 'DriveAcademy',
        'app.title': '駕訓學員管理系統',

        // Navigation
        'nav.home': '首頁',
        'nav.students': '學員資料作業',
        'nav.instructors': '教練資料作業',
        'nav.annualPlan': '年度期別計畫',
        'nav.licenseSubmission': '學照統一送件',
        'nav.licenseRegistration': '學照日期登錄',
        'nav.openingRoster': '開訓名冊作業',
        'nav.closingRoster': '結訓名冊作業',
        'nav.m2Retraining': 'M2 補訓名冊',
        'nav.drivingExam': '場考清冊作業',
        'nav.roadExam': '道考清冊作業',
        'nav.writtenExam': '筆試清冊作業',
        'nav.logout': '登出',

        // Auth
        'auth.login': '登入',
        'auth.username': '使用者名稱',
        'auth.password': '密碼',
        'auth.loginButton': '登入系統',
        'auth.invalidCredentials': '使用者名稱或密碼錯誤',

        // Common
        'common.save': '儲存',
        'common.cancel': '取消',
        'common.delete': '刪除',
        'common.edit': '編輯',
        'common.add': '新增',
        'common.search': '搜尋',
        'common.loading': '載入中...',
        'common.noData': '暫無資料',
        'common.confirm': '確認',
        'common.back': '返回',
        'common.actions': '操作',

        // Student
        'student.title': '學員資料',
        'student.number': '學員編號',
        'student.name': '學員姓名',
        'student.nationalId': '身分證字號',
        'student.phone': '手機號碼',
        'student.birthDate': '出生日期',
        'student.batch': '梯次',
        'student.instructor': '指導教練',
        'student.addNew': '新增學員',

        // Instructor
        'instructor.title': '教練資料',
        'instructor.number': '教練編號',
        'instructor.name': '教練姓名',
        'instructor.birthDate': '出生日期',
        'instructor.licenseNumber': '教練證號',

        // Messages
        'message.saveSuccess': '儲存成功',
        'message.deleteSuccess': '刪除成功',
        'message.deleteConfirm': '確定要刪除嗎？此操作無法復原。',
        'message.error': '發生錯誤，請稍後再試',
    },
    'en': {
        // App
        'app.name': 'DriveAcademy',
        'app.title': 'Driving School Student Management',

        // Navigation
        'nav.home': 'Home',
        'nav.students': 'Student Management',
        'nav.instructors': 'Instructor Management',
        'nav.annualPlan': 'Annual Plan',
        'nav.licenseSubmission': 'License Submission',
        'nav.licenseRegistration': 'License Registration',
        'nav.openingRoster': 'Opening Roster',
        'nav.closingRoster': 'Closing Roster',
        'nav.m2Retraining': 'M2 Retraining',
        'nav.drivingExam': 'Driving Exam Roster',
        'nav.roadExam': 'Road Exam Roster',
        'nav.writtenExam': 'Written Exam Roster',
        'nav.logout': 'Logout',

        // Auth
        'auth.login': 'Login',
        'auth.username': 'Username',
        'auth.password': 'Password',
        'auth.loginButton': 'Sign In',
        'auth.invalidCredentials': 'Invalid username or password',

        // Common
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.add': 'Add',
        'common.search': 'Search',
        'common.loading': 'Loading...',
        'common.noData': 'No data available',
        'common.confirm': 'Confirm',
        'common.back': 'Back',
        'common.actions': 'Actions',

        // Student
        'student.title': 'Student Information',
        'student.number': 'Student ID',
        'student.name': 'Student Name',
        'student.nationalId': 'National ID',
        'student.phone': 'Phone Number',
        'student.birthDate': 'Birth Date',
        'student.batch': 'Batch',
        'student.instructor': 'Instructor',
        'student.addNew': 'Add Student',

        // Instructor
        'instructor.title': 'Instructor Information',
        'instructor.number': 'Instructor ID',
        'instructor.name': 'Instructor Name',
        'instructor.birthDate': 'Birth Date',
        'instructor.licenseNumber': 'License Number',

        // Messages
        'message.saveSuccess': 'Saved successfully',
        'message.deleteSuccess': 'Deleted successfully',
        'message.deleteConfirm': 'Are you sure you want to delete? This action cannot be undone.',
        'message.error': 'An error occurred. Please try again later.',
    }
};

// Translation function
export function t(key: string, params?: Record<string, string | number>): string {
    const locale = get(currentLocale);
    let text = translations[locale]?.[key] ?? translations['zh-TW']?.[key] ?? key;

    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
        });
    }

    return text;
}

// Reactive translation store
export const locale = {
    subscribe: currentLocale.subscribe,
    set: currentLocale.set,
    setLocale: (newLocale: Locale) => {
        currentLocale.set(newLocale);
        if (typeof window !== 'undefined') {
            localStorage.setItem('locale', newLocale);
        }
    },
    init: () => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('locale') as Locale | null;
            if (saved && locales.includes(saved)) {
                currentLocale.set(saved);
            }
        }
    }
};
