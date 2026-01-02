<script lang="ts">
    import {
        GlassCard,
        GlassButton,
        GlassInput,
        GlassTable,
    } from "$lib/components";
    import { t } from "$lib/i18n";

    let students = $state<any[]>([]);
    let loading = $state(true);
    let searchQuery = $state("");

    const columns = [
        { key: "student_number", label: "學員編號", width: "100px" },
        { key: "student_name", label: "學員姓名", width: "100px" },
        { key: "national_id_no", label: "身分證字號", width: "120px" },
        { key: "learner_permit_date", label: "學照日期", width: "100px" },
        { key: "learner_permit_number", label: "學照號碼", width: "120px" },
    ];

    $effect(() => {
        setTimeout(() => {
            students = [];
            loading = false;
        }, 500);
    });
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-charcoal-800">
                {t("nav.licenseRegistration")}
            </h1>
            <p class="mt-1 text-charcoal-600">登錄學習駕照日期及號碼</p>
        </div>
    </div>

    <GlassCard variant="subtle" padding="sm">
        <div class="flex flex-wrap items-center gap-4">
            <div class="flex-1 min-w-[200px] max-w-md">
                <GlassInput
                    type="search"
                    placeholder="搜尋學員編號、姓名..."
                    bind:value={searchQuery}
                />
            </div>
            <GlassButton variant="secondary" size="sm">搜尋</GlassButton>
        </div>
    </GlassCard>

    <GlassTable
        {columns}
        data={students}
        {loading}
        emptyMessage="請搜尋需要登錄學照日期的學員"
    />
</div>
