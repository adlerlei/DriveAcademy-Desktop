<script lang="ts">
    import {
        GlassCard,
        GlassButton,
        GlassInput,
        GlassTable,
    } from "$lib/components";
    import { t } from "$lib/i18n";

    let searchQuery = $state("");
    let currentStudent = $state<any>(null);
    let birthDate = $state("");
    let email = $state("");
    let rAddressZipCode = $state("");
    let rAddressCity = $state("");
    let rAddress = $state("");
    let submissionDate = $state("");
    let submissionList = $state<any[]>([]);

    const columns = [
        { key: "national_id_no", label: "身分證號", width: "120px" },
        { key: "student_name", label: "學員姓名", width: "100px" },
        { key: "birth_date", label: "出生日期", width: "100px" },
        { key: "mobile_phone", label: "手機", width: "120px" },
        { key: "submission_date", label: "送件日期", width: "100px" },
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
        birthDate = student.birth_date || "";
        email = student.email || "";
        rAddressZipCode = student.r_address_zip_code || "";
        rAddressCity = student.r_address_city || "";
        rAddress = student.r_address || "";
    }

    function clearSearch() {
        currentStudent = null;
        searchQuery = "";
        birthDate = "";
        email = "";
        rAddressZipCode = "";
        rAddressCity = "";
        rAddress = "";
    }

    async function handleSubmission() {
        if (!currentStudent) {
            alert("請先查詢並選擇一位學員");
            return;
        }
        if (!submissionDate) {
            alert("請填寫送件日期");
            return;
        }
        try {
            const res = await fetch(`/api/students/${currentStudent.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ submission_date: submissionDate }),
            });
            if (res.ok) {
                submissionList = [
                    ...submissionList,
                    { ...currentStudent, submission_date: submissionDate },
                ];
                alert("已加入送件清單！");
                clearSearch();
            } else {
                alert("更新失敗");
            }
        } catch (error) {
            console.error("Submission failed:", error);
            alert("送件失敗");
        }
    }

    function handleExport() {
        if (submissionList.length === 0) {
            alert("送件清單為空，無法匯出");
            return;
        }
        alert("匯出功能開發中");
    }
</script>

<div class="space-y-6">
    <div>
        <h1 class="text-2xl font-bold text-charcoal-800">
            {t("nav.licenseSubmission")}
        </h1>
    </div>

    <GlassCard>
        <div class="flex items-center gap-4">
            <div class="flex-1">
                <GlassInput
                    placeholder="輸入學員編號、姓名、身分證字號或手機搜尋..."
                    bind:value={searchQuery}
                    onkeydown={(e) => e.key === "Enter" && searchStudent()}
                >
                    {#snippet icon()}
                        <svg
                            class="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    {/snippet}
                </GlassInput>
            </div>
            <GlassButton variant="primary" onclick={searchStudent}>
                搜尋
            </GlassButton>
        </div>
    </GlassCard>

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
            {#if currentStudent}<span
                    class="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium"
                    >已選擇：{currentStudent.student_name}</span
                >{/if}
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">出生日期</span><span
                    class="text-charcoal-800 font-medium"
                    >{birthDate || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">學員信箱</span><span
                    class="text-charcoal-800 font-medium">{email || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1 col-span-2">
                <span class="text-sm text-charcoal-500">戶籍地址</span><span
                    class="text-charcoal-800 font-medium"
                    >{rAddressZipCode
                        ? `${rAddressZipCode} ${rAddressCity} ${rAddress}`
                        : "-"}</span
                >
            </div>
        </div>
    </GlassCard>

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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                /></svg
            >
            送件作業
        </h2>
        <div class="flex flex-wrap items-end gap-4">
            <GlassInput
                label="送件日期"
                type="date"
                bind:value={submissionDate}
                required
                class="w-48"
            />
        </div>
    </GlassCard>

    <GlassCard padding="sm">
        <div class="flex flex-wrap items-center gap-3">
            <GlassButton variant="ghost" onclick={clearSearch}
                ><svg
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
                >清除</GlassButton
            >
            <div class="w-px h-6 bg-charcoal-200"></div>
            <GlassButton variant="primary" onclick={handleSubmission}
                ><svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    /></svg
                >學照統一送件</GlassButton
            >
            <GlassButton variant="secondary" onclick={handleExport}
                ><svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    /></svg
                >匯出</GlassButton
            >
        </div>
    </GlassCard>

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
                送件清單
            </h2>
            <p class="text-sm text-charcoal-600 mt-1">
                本次操作已加入 {submissionList.length} 位學員
            </p>
        </div>
        <GlassTable
            {columns}
            data={submissionList}
            loading={false}
            emptyMessage="尚未加入任何學員至送件清單"
        />
    </GlassCard>
</div>
