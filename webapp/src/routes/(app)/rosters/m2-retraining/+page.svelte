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

    const columns = [
        { key: "student_number", label: "學員編號", width: "100px" },
        { key: "student_name", label: "學員姓名", width: "100px" },
        { key: "national_id_no", label: "身分證字號", width: "120px" },
        { key: "mobile_phone", label: "聯絡電話", width: "120px" },
        { key: "training_type_name", label: "原班別", width: "100px" },
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
                {t("nav.m2Retraining")}
            </h1>
            <p class="mt-1 text-charcoal-600">管理 M2 補訓學員名冊</p>
        </div>
        <div class="flex gap-3">
            <GlassButton variant="secondary">匯出 Excel</GlassButton>
            <GlassButton variant="primary">列印名冊</GlassButton>
        </div>
    </div>

    <GlassTable
        {columns}
        data={students}
        {loading}
        emptyMessage="暫無 M2 補訓學員資料"
    />
</div>
