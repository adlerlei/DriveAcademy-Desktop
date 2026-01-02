<script lang="ts">
    import {
        GlassCard,
        GlassButton,
        GlassInput,
        GlassTable,
        GlassModal,
    } from "$lib/components";
    import { t } from "$lib/i18n";

    // Sample data - will be loaded from API
    let students = $state<any[]>([]);
    let loading = $state(true);
    let searchQuery = $state("");
    let showAddModal = $state(false);

    // Table columns matching original desktop app
    const columns = [
        { key: "student_number", label: "學員編號", width: "100px" },
        { key: "student_name", label: "學員姓名", width: "100px" },
        { key: "national_id_no", label: "身分證字號", width: "120px" },
        { key: "mobile_phone", label: "手機", width: "120px" },
        { key: "batch", label: "梯次", width: "80px" },
        { key: "instructor_name", label: "指導教練", width: "100px" },
        { key: "training_type_name", label: "訓練班別", width: "100px" },
    ];

    // Simulated data load
    $effect(() => {
        setTimeout(() => {
            students = [];
            loading = false;
        }, 500);
    });
</script>

<div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-charcoal-800">
                {t("nav.students")}
            </h1>
            <p class="mt-1 text-charcoal-600">管理所有學員資料</p>
        </div>
        <GlassButton variant="primary" onclick={() => (showAddModal = true)}>
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
                    d="M12 4v16m8-8H4"
                />
            </svg>
            {t("student.addNew")}
        </GlassButton>
    </div>

    <!-- Search and Filters -->
    <GlassCard variant="subtle" padding="sm">
        <div class="flex flex-wrap items-center gap-4">
            <div class="flex-1 min-w-[200px] max-w-md">
                <GlassInput
                    type="search"
                    placeholder="搜尋學員編號、姓名、身分證..."
                    bind:value={searchQuery}
                />
            </div>
            <GlassButton variant="secondary" size="sm">
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
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                </svg>
                篩選
            </GlassButton>
        </div>
    </GlassCard>

    <!-- Data Table -->
    <GlassTable
        {columns}
        data={students}
        {loading}
        emptyMessage="暫無學員資料，請點擊「新增學員」開始建立。"
        onRowClick={(row) => console.log("Selected:", row)}
    />
</div>

<!-- Add Student Modal -->
<GlassModal
    open={showAddModal}
    onClose={() => (showAddModal = false)}
    title="新增學員"
    size="xl"
>
    <form class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassInput label="學員編號" name="student_number" required />
        <GlassInput label="學員姓名" name="student_name" required />
        <GlassInput label="身分證字號" name="national_id_no" required />
        <GlassInput label="出生日期" name="birth_date" type="date" required />
        <GlassInput label="手機號碼" name="mobile_phone" />
        <GlassInput label="市話" name="home_phone" />
        <GlassInput label="電子郵件" name="email" type="email" />
        <GlassInput label="梯次" name="batch" />
        <div class="md:col-span-2">
            <GlassInput label="戶籍地址" name="r_address" />
        </div>
    </form>

    {#snippet footer()}
        <div class="flex justify-end gap-3">
            <GlassButton variant="ghost" onclick={() => (showAddModal = false)}>
                {t("common.cancel")}
            </GlassButton>
            <GlassButton variant="primary">
                {t("common.save")}
            </GlassButton>
        </div>
    {/snippet}
</GlassModal>
