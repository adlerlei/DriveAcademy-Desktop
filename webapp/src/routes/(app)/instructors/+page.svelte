<script lang="ts">
    import {
        GlassCard,
        GlassButton,
        GlassInput,
        GlassTable,
    } from "$lib/components";
    import { t } from "$lib/i18n";

    // ========== 狀態 ==========
    let instructors = $state<any[]>([]);
    let loading = $state(true);
    let isEditing = $state(false);
    let currentInstructorId = $state<number | null>(null);

    // ========== 查詢欄位 ==========
    let searchQuery = $state("");

    // ========== 表單欄位 ==========
    let number = $state("");
    let name = $state("");
    let birthDate = $state("");
    let instructorNumber = $state("");

    // ========== 列表欄位 ==========
    const columns = [
        { key: "number", label: "教練編號", width: "120px" },
        { key: "name", label: "姓名", width: "120px" },
        { key: "birth_date", label: "出生日期", width: "120px" },
        { key: "instructor_number", label: "教練證號", width: "150px" },
    ];

    // ========== 載入資料 ==========
    $effect(() => {
        fetchInstructors();
    });

    async function fetchInstructors() {
        loading = true;
        try {
            const res = await fetch("/api/instructors");
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

    // ========== 查詢功能 ==========
    async function searchInstructor() {
        if (!searchQuery.trim()) return;
        try {
            const res = await fetch(
                `/api/instructors?search=${encodeURIComponent(searchQuery)}`,
            );
            if (res.ok) {
                const data = await res.json();
                if (data.data && data.data.length > 0) {
                    loadInstructorData(data.data[0]);
                } else {
                    alert("查無此教練");
                }
            }
        } catch (error) {
            console.error("Search failed:", error);
        }
    }

    function loadInstructorData(instructor: any) {
        isEditing = true;
        currentInstructorId = instructor.id;
        number = instructor.number || "";
        name = instructor.name || "";
        birthDate = instructor.birth_date || "";
        instructorNumber = instructor.instructor_number || "";
    }

    function handleRowClick(row: any) {
        loadInstructorData(row);
    }

    function clearForm() {
        isEditing = false;
        currentInstructorId = null;
        searchQuery = "";
        number = "";
        name = "";
        birthDate = "";
        instructorNumber = "";
    }

    async function handleAdd() {
        if (isEditing) {
            alert("目前處於編輯模式，請使用「修改」功能或先「清除」");
            return;
        }
        if (!number.trim() || !name.trim()) {
            alert("請填寫教練編號和姓名");
            return;
        }
        const data = {
            number,
            name,
            birth_date: birthDate,
            instructor_number: instructorNumber,
        };
        try {
            const res = await fetch("/api/instructors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                alert("新增成功！");
                clearForm();
                fetchInstructors();
            } else {
                alert("新增失敗");
            }
        } catch {
            alert("新增失敗");
        }
    }

    async function handleUpdate() {
        if (!isEditing || !currentInstructorId) {
            alert("請先透過搜尋查詢到一位教練");
            return;
        }
        const data = {
            number,
            name,
            birth_date: birthDate,
            instructor_number: instructorNumber,
        };
        try {
            const res = await fetch(`/api/instructors/${currentInstructorId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                alert("修改成功！");
                fetchInstructors();
            } else {
                alert("修改失敗");
            }
        } catch {
            alert("修改失敗");
        }
    }

    async function handleDelete() {
        if (!isEditing || !currentInstructorId) {
            alert("請先透過搜尋查詢到一位教練");
            return;
        }
        if (!confirm("確定要刪除此教練資料嗎？")) return;
        try {
            const res = await fetch(`/api/instructors/${currentInstructorId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                alert("刪除成功！");
                clearForm();
                fetchInstructors();
            } else {
                alert("刪除失敗");
            }
        } catch {
            alert("刪除失敗");
        }
    }
</script>

<div class="space-y-6">
    <!-- 頁面標題 -->
    <div>
        <h1 class="text-2xl font-bold text-charcoal-800">
            {t("nav.instructors")}
        </h1>
        <p class="mt-1 text-charcoal-600">
            建立、查詢、修改與刪除駕訓班的教練基本資料
        </p>
    </div>

    <!-- 查詢區塊 -->
    <GlassCard>
        <div class="flex items-center gap-4">
            <div class="flex-1">
                <GlassInput
                    placeholder="輸入教練編號或姓名搜尋..."
                    bind:value={searchQuery}
                    onkeydown={(e) => e.key === "Enter" && searchInstructor()}
                />
            </div>
            <GlassButton variant="primary" onclick={searchInstructor}>
                <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    /></svg
                >
                搜尋
            </GlassButton>
        </div>
    </GlassCard>

    <!-- 教練資料表單 -->
    <GlassCard>
        <div class="flex items-center justify-between mb-6">
            <h2
                class="text-lg font-semibold text-charcoal-800 flex items-center gap-2"
            >
                <svg
                    class="w-5 h-5 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    /></svg
                >
                教練基本資料
            </h2>
            {#if isEditing}
                <span
                    class="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full font-medium"
                    >編輯模式</span
                >
            {/if}
        </div>

        <div class="grid grid-cols-12 gap-4">
            <GlassInput
                label="教練編號"
                bind:value={number}
                class="col-span-3"
            />
            <GlassInput label="教練姓名" bind:value={name} class="col-span-3" />
            <GlassInput
                label="出生日期"
                type="date"
                bind:value={birthDate}
                class="col-span-3"
            />
            <GlassInput
                label="教練證號"
                bind:value={instructorNumber}
                class="col-span-3"
            />
        </div>
    </GlassCard>

    <!-- 功能按鈕 -->
    <GlassCard padding="sm">
        <div class="flex flex-wrap items-center gap-3">
            <GlassButton variant="ghost" onclick={clearForm}>
                <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    /></svg
                >
                清除
            </GlassButton>
            <div class="w-px h-6 bg-charcoal-200"></div>
            <GlassButton
                variant="primary"
                onclick={handleAdd}
                disabled={isEditing}
            >
                <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                    /></svg
                >
                新增
            </GlassButton>
            <GlassButton
                variant="secondary"
                onclick={handleUpdate}
                disabled={!isEditing}
            >
                <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    /></svg
                >
                修改
            </GlassButton>
            <GlassButton
                variant="danger"
                onclick={handleDelete}
                disabled={!isEditing}
            >
                <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    /></svg
                >
                刪除
            </GlassButton>
        </div>
    </GlassCard>

    <!-- 教練列表 -->
    <GlassCard padding="none">
        <div class="p-4 border-b border-charcoal-800/10">
            <h2
                class="text-lg font-semibold text-charcoal-800 flex items-center gap-2"
            >
                <svg
                    class="w-5 h-5 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    /></svg
                >
                教練列表
            </h2>
            <p class="text-sm text-charcoal-600 mt-1">
                點擊任一行可載入該教練資料進行修改或刪除
            </p>
        </div>
        <GlassTable
            {columns}
            data={instructors}
            {loading}
            emptyMessage="暫無教練資料"
            onRowClick={handleRowClick}
        />
    </GlassCard>
</div>
