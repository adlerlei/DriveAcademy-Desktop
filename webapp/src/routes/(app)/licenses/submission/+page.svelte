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
    let submissionDate = $state("");

    const columns = [
        { key: "student_number", label: "學員編號", width: "100px" },
        { key: "student_name", label: "學員姓名", width: "100px" },
        { key: "national_id_no", label: "身分證字號", width: "120px" },
        { key: "birth_date", label: "出生日期", width: "100px" },
        { key: "submission_date", label: "送件日期", width: "100px" },
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
                {t("nav.licenseSubmission")}
            </h1>
            <p class="mt-1 text-charcoal-600">學照統一送件作業</p>
        </div>
        <div class="flex gap-3">
            <GlassButton variant="secondary">匯出名單</GlassButton>
            <GlassButton variant="primary">確認送件</GlassButton>
        </div>
    </div>

    <GlassCard variant="subtle" padding="sm">
        <div class="flex flex-wrap items-center gap-4">
            <GlassInput
                label="送件日期"
                type="date"
                bind:value={submissionDate}
                class="w-48"
            />
            <GlassButton variant="secondary" size="sm"
                >載入待送件學員</GlassButton
            >
        </div>
    </GlassCard>

    <GlassTable
        {columns}
        data={students}
        {loading}
        emptyMessage="請選擇送件日期並載入待送件學員"
    />
</div>
