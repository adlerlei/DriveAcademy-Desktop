<script lang="ts">
    import { page } from "$app/stores";
    import { GlassSidebar } from "$lib/components";
    import { t } from "$lib/i18n";

    let { children } = $props();

    // 側邊欄狀態
    let isSidebarOpen = $state(false);

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }

    function closeSidebar() {
        isSidebarOpen = false;
    }

    // Navigation items matching original desktop app menu
    const navItems = [
        { id: "home", label: t("nav.home"), href: "/" },
        { id: "students", label: t("nav.students"), href: "/students" },
        {
            id: "instructors",
            label: t("nav.instructors"),
            href: "/instructors",
        },
        { id: "annual-plan", label: t("nav.annualPlan"), href: "/annual-plan" },
        {
            id: "license-submission",
            label: t("nav.licenseSubmission"),
            href: "/licenses/submission",
        },
        {
            id: "license-registration",
            label: t("nav.licenseRegistration"),
            href: "/licenses/registration",
        },
        {
            id: "opening-roster",
            label: t("nav.openingRoster"),
            href: "/rosters/opening",
        },
        {
            id: "m2-retraining",
            label: t("nav.m2Retraining"),
            href: "/rosters/m2-retraining",
        },
        {
            id: "closing-roster",
            label: t("nav.closingRoster"),
            href: "/rosters/closing",
        },
        {
            id: "driving-exam",
            label: t("nav.drivingExam"),
            href: "/exams/driving",
        },
        { id: "road-exam", label: t("nav.roadExam"), href: "/exams/road" },
        {
            id: "written-exam",
            label: t("nav.writtenExam"),
            href: "/exams/written",
        },
    ];

    let currentPath = $derived($page.url.pathname);
</script>

<div class="min-h-screen flex">
    <!-- 漢堡選單按鈕 (手機版) -->
    <button
        class="fixed top-4 left-4 z-50 p-2 rounded-lg glass-dark text-white md:hidden"
        onclick={toggleSidebar}
        aria-label="開關選單"
    >
        <svg
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            {#if isSidebarOpen}
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                />
            {:else}
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                />
            {/if}
        </svg>
    </button>

    <!-- Sidebar -->
    <GlassSidebar
        items={navItems}
        {currentPath}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
    />

    <!-- Main Content -->
    <main class="flex-1 md:ml-64 ml-0 min-h-screen transition-all duration-300">
        <div class="p-4 md:p-8 pt-16 md:pt-8">
            {@render children()}
        </div>
    </main>
</div>
