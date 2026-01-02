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

    // ========== 表單欄位 ==========
    let number = $state("");
    let name = $state("");
    let birthDate = $state("");
    let instructorNumber = $state("");

    // ========== 列表欄位 (根據規格文件) ==========
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
    async function searchByNumber() {
        if (!number.trim()) return;

        try {
            const res = await fetch(
                `/api/instructors?search=${encodeURIComponent(number)}`,
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

    // ========== 表格行點擊 ==========
    function handleRowClick(row: any) {
        loadInstructorData(row);
    }

    // ========== 清除表單 ==========
    function clearForm() {
        isEditing = false;
        currentInstructorId = null;
        number = "";
        name = "";
        birthDate = "";
        instructorNumber = "";
    }

    // ========== 新增 ==========
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
        } catch (error) {
            console.error("Add failed:", error);
            alert("新增失敗");
        }
    }

    // ========== 修改 ==========
    async function handleUpdate() {
        if (!isEditing || !currentInstructorId) {
            alert("請先透過「教練編號」查詢到一位教練");
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
        } catch (error) {
            console.error("Update failed:", error);
            alert("修改失敗");
        }
    }

    // ========== 刪除 ==========
    async function handleDelete() {
        if (!isEditing || !currentInstructorId) {
            alert("請先透過「教練編號」查詢到一位教練");
            return;
        }

        if (!confirm("確定要刪除此教練資料嗎？")) {
            return;
        }

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
        } catch (error) {
            console.error("Delete failed:", error);
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

    <!-- 輸入/查詢區塊 -->
    <GlassCard>
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-charcoal-800">教練資料</h2>
            {#if isEditing}
                <span
                    class="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded"
                    >編輯模式</span
                >
            {/if}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassInput
                label="教練編號"
                bind:value={number}
                hint="可用於查詢，按 Enter 搜尋"
                onkeydown={(e) => e.key === "Enter" && searchByNumber()}
            />
            <GlassInput label="教練姓名" bind:value={name} />
            <GlassInput label="出生日期" type="date" bind:value={birthDate} />
            <GlassInput
                label="教練證號"
                bind:value={instructorNumber}
                hint="教練的官方證照號碼"
            />
        </div>

        <!-- 功能按鈕 -->
        <div
            class="flex flex-wrap gap-3 mt-6 pt-4 border-t border-charcoal-800/10"
        >
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
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                    />
                </svg>
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
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                </svg>
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
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                </svg>
                刪除
            </GlassButton>
            <GlassButton variant="ghost" onclick={clearForm}>清除</GlassButton>
        </div>
    </GlassCard>

    <!-- 資料列表 -->
    <GlassCard padding="none">
        <div class="p-4 border-b border-charcoal-800/10">
            <h2 class="text-lg font-semibold text-charcoal-800">教練列表</h2>
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
