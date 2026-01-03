<script lang="ts">
    import {
        GlassCard,
        GlassButton,
        GlassInput,
        GlassTable,
    } from "$lib/components";
    import { t } from "$lib/i18n";

    // 查詢區
    let searchQuery = $state("");

    // 學員資料
    let currentStudent = $state<any>(null);
    let registerNumber = $state("");
    let birthDate = $state("");
    let trainingTypeName = $state("");
    let term = $state("");
    let batch = $state("");

    // 筆試登錄區
    let writtenTestDate = $state("");
    let examSession = $state("");
    let examCode = $state("");

    // 筆試清冊
    let examList = $state<any[]>([]);
    let autoExamNumber = $derived(String(examList.length + 1).padStart(3, "0"));

    const columns = [
        { key: "exam_number", label: "號碼", width: "80px" },
        { key: "register_number", label: "名冊號碼", width: "100px" },
        { key: "student_number", label: "學員編號", width: "100px" },
        { key: "student_name", label: "學員姓名", width: "100px" },
        { key: "written_test_date", label: "筆試日期", width: "100px" },
        { key: "exam_session", label: "場次", width: "80px" },
    ];

    async function searchStudent() {
        if (!searchQuery.trim()) return;
        try {
            const res = await fetch(
                `/api/students?search=${encodeURIComponent(searchQuery)}`,
            );
            if (res.ok) {
                const data = await res.json();
                if (data.data && data.data.length > 0) {
                    loadStudentData(data.data[0]);
                } else {
                    alert("查無此學員");
                }
            }
        } catch (error) {
            console.error("Search failed:", error);
        }
    }

    function loadStudentData(student: any) {
        currentStudent = student;
        registerNumber = student.register_number || "";
        birthDate = student.birth_date || "";
        trainingTypeName = student.training_type_name || "";
        term = student.register_term || "";
        batch = student.batch || "";
    }

    function clearForm() {
        currentStudent = null;
        searchQuery = "";
        registerNumber = "";
        birthDate = "";
        trainingTypeName = "";
        term = "";
        batch = "";
        writtenTestDate = "";
        examSession = "";
        examCode = "";
    }

    async function handleAddToExam() {
        if (!currentStudent) {
            alert("請先查詢並選擇一位學員");
            return;
        }
        examList = [
            ...examList,
            {
                ...currentStudent,
                exam_number: autoExamNumber,
                written_test_date: writtenTestDate,
                exam_session: examSession,
                exam_code: examCode,
            },
        ];
        alert("已加入筆試清冊！");
        clearForm();
    }

    function handlePrint() {
        if (examList.length === 0) {
            alert("清冊為空");
            return;
        }
        alert("列印功能開發中");
    }
    function handleExport() {
        if (examList.length === 0) {
            alert("清冊為空");
            return;
        }
        alert("匯出功能開發中");
    }
</script>

<div class="space-y-6">
    <div>
        <h1 class="text-2xl font-bold text-charcoal-800">
            {t("nav.writtenExam")}
        </h1>
        <p class="mt-1 text-charcoal-600">安排學員的駕照筆試，製作對應的清冊</p>
    </div>

    <!-- 學員查詢 -->
    <GlassCard>
        <h2
            class="text-lg font-semibold text-charcoal-800 mb-4 flex items-center gap-2"
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                /></svg
            >
            學員查詢
        </h2>
        <div class="flex items-center gap-4">
            <div class="flex-1">
                <GlassInput
                    placeholder="輸入學員編號、姓名或身分證字號搜尋..."
                    bind:value={searchQuery}
                    onkeydown={(e) => e.key === "Enter" && searchStudent()}
                />
            </div>
            <GlassButton variant="primary" onclick={searchStudent}>
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

    <!-- 學員資料（唯讀）-->
    <GlassCard variant="subtle">
        <div class="flex items-center justify-between mb-4">
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
                學員資料（唯讀）
            </h2>
            {#if currentStudent}
                <span
                    class="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium"
                    >已選擇：{currentStudent.student_name}</span
                >
            {/if}
        </div>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">名冊號碼</span><span
                    class="text-charcoal-800 font-medium"
                    >{registerNumber || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">出生日期</span><span
                    class="text-charcoal-800 font-medium"
                    >{birthDate || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">訓練班別</span><span
                    class="text-charcoal-800 font-medium"
                    >{trainingTypeName || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">期別</span><span
                    class="text-charcoal-800 font-medium">{term || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">梯次</span><span
                    class="text-charcoal-800 font-medium">{batch || "-"}</span
                >
            </div>
        </div>
    </GlassCard>

    <!-- 筆試登錄區 -->
    <GlassCard>
        <h2
            class="text-lg font-semibold text-charcoal-800 mb-6 flex items-center gap-2"
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                /></svg
            >
            筆試登錄
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-4">
            <GlassInput
                label="筆試日期"
                type="date"
                bind:value={writtenTestDate}
                class="col-span-full sm:col-span-3 md:col-span-3"
            />
            <GlassInput
                label="場次"
                bind:value={examSession}
                class="col-span-full sm:col-span-3 md:col-span-2"
            />
            <div class="col-span-full sm:col-span-3 md:col-span-1 sm:col-span-2 md:col-span-2 flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >號碼（自動）</label
                >
                <input
                    type="text"
                    class="h-10 w-full px-3 glass-input rounded-md text-charcoal-800 bg-charcoal-50"
                    value={autoExamNumber}
                    disabled
                />
            </div>
            <GlassInput label="代碼" bind:value={examCode} class="col-span-full sm:col-span-3 md:col-span-2" />
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
            <GlassButton variant="primary" onclick={handleAddToExam}
                >加入筆試清冊</GlassButton
            >
            <GlassButton variant="secondary" onclick={handlePrint}
                >列印清冊</GlassButton
            >
            <GlassButton variant="secondary" onclick={handleExport}
                >匯出</GlassButton
            >
        </div>
    </GlassCard>

    <!-- 筆試清冊 -->
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
                筆試清冊
            </h2>
            <p class="text-sm text-charcoal-600 mt-1">
                本次操作已加入 {examList.length} 位學員
            </p>
        </div>
        <GlassTable
            {columns}
            data={examList}
            loading={false}
            emptyMessage="尚未加入任何學員至筆試清冊"
        />
    </GlassCard>
</div>
