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
    let examDate = $state("");

    const columns = [
        { key: "driving_test_number", label: "號碼", width: "60px" },
        { key: "student_number", label: "學員編號", width: "100px" },
        { key: "student_name", label: "學員姓名", width: "100px" },
        { key: "national_id_no", label: "身分證字號", width: "120px" },
        { key: "driving_test_group", label: "組別", width: "80px" },
        { key: "driving_test_session", label: "場次", width: "80px" },
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
                {t("nav.drivingExam")}
            </h1>
            <p class="mt-1 text-charcoal-600">場地考試清冊管理</p>
        </div>
        <div class="flex gap-3">
            <GlassButton variant="secondary">匯出 Excel</GlassButton>
            <GlassButton variant="primary">列印清冊</GlassButton>
        </div>
    </div>

    <GlassCard variant="subtle" padding="sm">
        <div class="flex flex-wrap items-center gap-4">
            <GlassInput
                label="考試日期"
                type="date"
                bind:value={examDate}
                class="w-48"
            />
            <GlassButton variant="secondary" size="sm">載入名單</GlassButton>
        </div>
    </GlassCard>

    <GlassTable
        {columns}
        data={students}
        {loading}
        emptyMessage="請選擇考試日期並載入名單"
    />
</div>
