<script lang="ts">
    import { page } from "$app/stores";
    import { GlassSidebar } from "$lib/components";
    import { t } from "$lib/i18n";

    let { children } = $props();

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
    <!-- Sidebar -->
    <GlassSidebar items={navItems} {currentPath} />

    <!-- Main Content -->
    <main class="flex-1 ml-64 min-h-screen">
        <div class="p-8">
            {@render children()}
        </div>
    </main>
</div>
