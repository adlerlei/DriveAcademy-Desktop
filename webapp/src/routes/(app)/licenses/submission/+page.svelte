<script lang="ts">
    import {
        GlassCard,
        GlassButton,
        GlassInput,
        GlassTable,
    } from "$lib/components";
    import { t } from "$lib/i18n";

    // ========== 查詢區欄位 ==========
    let searchStudentNumber = $state("");
    let searchStudentName = $state("");
    let searchNationalId = $state("");
    let searchMobilePhone = $state("");

    // ========== 學員資料顯示區（唯讀）==========
    let currentStudent = $state<any>(null);
    let birthDate = $state("");
    let email = $state("");
    let remarks = $state("");
    let rAddressZipCode = $state("");
    let rAddressCity = $state("");
    let rAddress = $state("");

    // ========== 送件作業區 ==========
    let submissionDate = $state("");

    // ========== 送件清單 ==========
    let submissionList = $state<any[]>([]);

    // 根據規格文件的列表欄位順序
    const columns = [
        { key: "national_id_no", label: "身分證號", width: "120px" },
        { key: "birth_date", label: "出生日期", width: "100px" },
        { key: "student_name", label: "學員姓名", width: "100px" },
        { key: "r_address_zip_code", label: "區號", width: "60px" },
        { key: "r_address_city", label: "縣市區", width: "100px" },
        { key: "r_address", label: "戶籍地址", width: "150px" },
        { key: "mobile_phone", label: "手機", width: "120px" },
        { key: "email", label: "E-mail", width: "150px" },
    ];

    // ========== 查詢功能 ==========
    async function searchStudent(field: string, value: string) {
        if (!value.trim()) return;

        try {
            const res = await fetch(
                `/api/students?search=${encodeURIComponent(value)}`,
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
        remarks = student.remarks || "";
        rAddressZipCode = student.r_address_zip_code || "";
        rAddressCity = student.r_address_city || "";
        rAddress = student.r_address || "";
    }

    // ========== 清除查詢 ==========
    function clearSearch() {
        currentStudent = null;
        searchStudentNumber = "";
        searchStudentName = "";
        searchNationalId = "";
        searchMobilePhone = "";
        birthDate = "";
        email = "";
        remarks = "";
        rAddressZipCode = "";
        rAddressCity = "";
        rAddress = "";
    }

    // ========== 學照統一送件 ==========
    async function handleSubmission() {
        if (!currentStudent) {
            alert("請先查詢並選擇一位學員");
            return;
        }

        if (!submissionDate) {
            alert("請填寫送件日期");
            return;
        }

        // 更新學員資料庫中的送件日期
        try {
            const res = await fetch(`/api/students/${currentStudent.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ submission_date: submissionDate }),
            });

            if (res.ok) {
                // 加入送件清單
                submissionList = [
                    ...submissionList,
                    {
                        ...currentStudent,
                        submission_date: submissionDate,
                    },
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

    // ========== 匯出文件 ==========
    function handleExport() {
        if (submissionList.length === 0) {
            alert("送件清單為空，無法匯出");
            return;
        }
        // TODO: 實作匯出功能
        console.log("Export list:", submissionList);
        alert("匯出功能開發中");
    }
</script>

<div class="space-y-6">
    <!-- 頁面標題 -->
    <div>
        <h1 class="text-2xl font-bold text-charcoal-800">
            {t("nav.licenseSubmission")}
        </h1>
        <p class="mt-1 text-charcoal-600">
            批次處理學員的學習駕照（學照）送件作業
        </p>
    </div>

    <!-- A. 學員查詢區 -->
    <GlassCard>
        <h2 class="text-lg font-semibold text-charcoal-800 mb-4">
            A. 學員查詢區
        </h2>
        <p class="text-sm text-charcoal-600 mb-4">
            輸入任一欄位後按 Enter 查詢
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassInput
                label="學員編號"
                bind:value={searchStudentNumber}
                onkeydown={(e) =>
                    e.key === "Enter" &&
                    searchStudent("student_number", searchStudentNumber)}
            />
            <GlassInput
                label="學員姓名"
                bind:value={searchStudentName}
                onkeydown={(e) =>
                    e.key === "Enter" &&
                    searchStudent("student_name", searchStudentName)}
            />
            <GlassInput
                label="身分證號"
                bind:value={searchNationalId}
                onkeydown={(e) =>
                    e.key === "Enter" &&
                    searchStudent("national_id_no", searchNationalId)}
            />
            <GlassInput
                label="聯絡電話"
                bind:value={searchMobilePhone}
                onkeydown={(e) =>
                    e.key === "Enter" &&
                    searchStudent("mobile_phone", searchMobilePhone)}
            />
        </div>
    </GlassCard>

    <!-- B. 學員資料顯示區（唯讀）-->
    <GlassCard variant="subtle">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-charcoal-800">
                B. 學員資料顯示區（唯讀）
            </h2>
            {#if currentStudent}
                <span
                    class="text-sm text-green-600 bg-green-50 px-2 py-1 rounded"
                >
                    已選擇：{currentStudent.student_name}
                </span>
            {/if}
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">出生日期</span>
                <span class="text-charcoal-800 font-medium"
                    >{birthDate || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">學員信箱</span>
                <span class="text-charcoal-800 font-medium">{email || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">備註</span>
                <span class="text-charcoal-800 font-medium"
                    >{remarks || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">戶籍地址</span>
                <span class="text-charcoal-800 font-medium">
                    {rAddressZipCode
                        ? `${rAddressZipCode} ${rAddressCity} ${rAddress}`
                        : "-"}
                </span>
            </div>
        </div>
    </GlassCard>

    <!-- C. 送件作業區 -->
    <GlassCard>
        <h2 class="text-lg font-semibold text-charcoal-800 mb-4">
            C. 送件作業區
        </h2>

        <div class="flex flex-wrap items-end gap-4">
            <div class="w-48">
                <GlassInput
                    label="送件日期"
                    type="date"
                    bind:value={submissionDate}
                    required
                />
            </div>

            <GlassButton variant="primary" onclick={handleSubmission}>
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                學照統一送件
            </GlassButton>
            <GlassButton variant="secondary" onclick={handleExport}>
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
                匯出文件
            </GlassButton>
            <GlassButton variant="ghost" onclick={clearSearch}>
                清除
            </GlassButton>
        </div>
    </GlassCard>

    <!-- 送件清單 -->
    <GlassCard padding="none">
        <div class="p-4 border-b border-charcoal-800/10">
            <h2 class="text-lg font-semibold text-charcoal-800">送件清單</h2>
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
