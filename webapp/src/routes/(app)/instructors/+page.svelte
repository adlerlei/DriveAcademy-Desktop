<script lang="ts">
    import {
        GlassCard,
        GlassButton,
        GlassInput,
        GlassTable,
        GlassModal,
    } from "$lib/components";
    import { t } from "$lib/i18n";

    let instructors = $state<any[]>([]);
    let loading = $state(true);
    let searchQuery = $state("");
    let showAddModal = $state(false);

    const columns = [
        { key: "number", label: "教練編號", width: "120px" },
        { key: "name", label: "教練姓名", width: "120px" },
        { key: "birth_date", label: "出生日期", width: "120px" },
        { key: "instructor_number", label: "教練證號", width: "150px" },
    ];

    $effect(() => {
        fetchInstructors();
    });

    async function fetchInstructors() {
        loading = true;
        try {
            const res = await fetch(`/api/instructors?search=${searchQuery}`);
            if (res.ok) {
                const data = await res.json();
                instructors = data.data || [];
            }
        } catch (error) {
            console.error("Failed to fetch instructors:", error);
        } finally {
            loading = false;
        }
    }

    async function handleAddInstructor(e: Event) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("/api/instructors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                showAddModal = false;
                fetchInstructors();
            }
        } catch (error) {
            console.error("Failed to add instructor:", error);
        }
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-charcoal-800">
                {t("nav.instructors")}
            </h1>
            <p class="mt-1 text-charcoal-600">管理所有教練資料</p>
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
            新增教練
        </GlassButton>
    </div>

    <GlassCard variant="subtle" padding="sm">
        <div class="flex flex-wrap items-center gap-4">
            <div class="flex-1 min-w-[200px] max-w-md">
                <GlassInput
                    type="search"
                    placeholder="搜尋教練編號、姓名..."
                    bind:value={searchQuery}
                    oninput={() => fetchInstructors()}
                />
            </div>
        </div>
    </GlassCard>

    <GlassTable
        {columns}
        data={instructors}
        {loading}
        emptyMessage="暫無教練資料，請點擊「新增教練」開始建立。"
    />
</div>

<GlassModal
    open={showAddModal}
    onClose={() => (showAddModal = false)}
    title="新增教練"
    size="md"
>
    <form onsubmit={handleAddInstructor} class="space-y-4">
        <GlassInput label="教練編號" name="number" required />
        <GlassInput label="教練姓名" name="name" required />
        <GlassInput label="出生日期" name="birth_date" type="date" />
        <GlassInput label="教練證號" name="instructor_number" />

        <div class="flex justify-end gap-3 pt-4">
            <GlassButton
                type="button"
                variant="ghost"
                onclick={() => (showAddModal = false)}
            >
                {t("common.cancel")}
            </GlassButton>
            <GlassButton type="submit" variant="primary">
                {t("common.save")}
            </GlassButton>
        </div>
    </form>
</GlassModal>
