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
    let selectedBatch = $state("");

    const columns = [
        { key: "student_number", label: "學員編號", width: "100px" },
        { key: "student_name", label: "學員姓名", width: "100px" },
        { key: "national_id_no", label: "身分證字號", width: "120px" },
        { key: "birth_date", label: "出生日期", width: "100px" },
        { key: "instructor_name", label: "指導教練", width: "100px" },
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
                {t("nav.closingRoster")}
            </h1>
            <p class="mt-1 text-charcoal-600">產生結訓名冊報表</p>
        </div>
        <div class="flex gap-3">
            <GlassButton variant="secondary">
                <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                </svg>
                匯出 Excel
            </GlassButton>
            <GlassButton variant="primary">
                <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                </svg>
                列印名冊
            </GlassButton>
        </div>
    </div>

    <GlassCard variant="subtle" padding="sm">
        <div class="flex flex-wrap items-center gap-4">
            <GlassInput
                label="選擇梯次"
                type="text"
                placeholder="請輸入梯次"
                bind:value={selectedBatch}
                class="w-48"
            />
            <GlassButton variant="secondary" size="sm">載入學員</GlassButton>
        </div>
    </GlassCard>

    <GlassTable
        {columns}
        data={students}
        {loading}
        emptyMessage="請先選擇梯次並載入學員名單"
    />
</div>
