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
    let licenseTypeName = $state("");
    let birthDate = $state("");
    let remarks = $state("");
    let rAddressZipCode = $state("");
    let rAddressCity = $state("");
    let rAddress = $state("");

    // ========== 學照登錄區（可編輯）==========
    let registrationDate = $state("");
    let learnerPermitDate = $state("");
    let learnerPermitNumber = $state("");

    // ========== 登錄清單 ==========
    let registrationList = $state<any[]>([]);

    // 根據規格文件的列表欄位順序
    const columns = [
        { key: "learner_permit_date", label: "學照日期", width: "100px" },
        { key: "learner_permit_number", label: "學照號碼", width: "120px" },
        { key: "license_type_name", label: "考照類別", width: "100px" },
        { key: "student_number", label: "學員編號", width: "100px" },
        { key: "student_name", label: "學員姓名", width: "100px" },
        { key: "birth_date", label: "出生日期", width: "100px" },
        { key: "national_id_no", label: "身分證號", width: "120px" },
        { key: "mobile_phone", label: "手機", width: "120px" },
        { key: "r_address_zip_code", label: "區號", width: "60px" },
        { key: "r_address_city", label: "縣市區", width: "100px" },
        { key: "r_address", label: "戶籍地址", width: "150px" },
    ];

    // 登錄日期變化時，同步到學照日期
    $effect(() => {
        if (registrationDate && !learnerPermitDate) {
            learnerPermitDate = registrationDate;
        }
    });

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
        licenseTypeName = student.license_type_name || "";
        birthDate = student.birth_date || "";
        remarks = student.remarks || "";
        rAddressZipCode = student.r_address_zip_code || "";
        rAddressCity = student.r_address_city || "";
        rAddress = student.r_address || "";
    }

    // ========== 清除 ==========
    function clearForm() {
        currentStudent = null;
        searchStudentNumber = "";
        searchStudentName = "";
        searchNationalId = "";
        searchMobilePhone = "";
        licenseTypeName = "";
        birthDate = "";
        remarks = "";
        rAddressZipCode = "";
        rAddressCity = "";
        rAddress = "";
        registrationDate = "";
        learnerPermitDate = "";
        learnerPermitNumber = "";
    }

    // ========== 學照日期登錄 ==========
    async function handleRegistration() {
        if (!currentStudent) {
            alert("請先查詢並選擇一位學員");
            return;
        }

        if (!learnerPermitDate || !learnerPermitNumber) {
            alert("請填寫學照日期和學照號碼");
            return;
        }

        // 更新學員資料庫
        try {
            const res = await fetch(`/api/students/${currentStudent.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    learner_permit_date: learnerPermitDate,
                    learner_permit_number: learnerPermitNumber,
                }),
            });

            if (res.ok) {
                // 加入登錄清單
                registrationList = [
                    ...registrationList,
                    {
                        ...currentStudent,
                        learner_permit_date: learnerPermitDate,
                        learner_permit_number: learnerPermitNumber,
                    },
                ];

                alert("學照日期登錄成功！");
                clearForm();
            } else {
                alert("登錄失敗");
            }
        } catch (error) {
            console.error("Registration failed:", error);
            alert("登錄失敗");
        }
    }
</script>

<div class="space-y-6">
    <!-- 頁面標題 -->
    <div>
        <h1 class="text-2xl font-bold text-charcoal-800">
            {t("nav.licenseRegistration")}
        </h1>
        <p class="mt-1 text-charcoal-600">
            登錄學員取得學習駕照後的「學照日期」與「學照號碼」
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
                label="聯絡手機"
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

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">考照類別</span>
                <span class="text-charcoal-800 font-medium"
                    >{licenseTypeName || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">出生日期</span>
                <span class="text-charcoal-800 font-medium"
                    >{birthDate || "-"}</span
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

    <!-- C. 學照登錄區（可編輯）-->
    <GlassCard>
        <h2 class="text-lg font-semibold text-charcoal-800 mb-4">
            C. 學照登錄區
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <GlassInput
                label="登錄日期"
                type="date"
                bind:value={registrationDate}
                hint="會自動同步到學照日期"
            />
            <GlassInput
                label="學照日期"
                type="date"
                bind:value={learnerPermitDate}
                required
            />
            <GlassInput
                label="學照號碼"
                bind:value={learnerPermitNumber}
                required
            />
        </div>

        <div class="flex flex-wrap gap-3 pt-4 border-t border-charcoal-800/10">
            <GlassButton variant="primary" onclick={handleRegistration}>
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
                學照日期登錄
            </GlassButton>
            <GlassButton variant="ghost" onclick={clearForm}>清除</GlassButton>
        </div>
    </GlassCard>

    <!-- 登錄清單 -->
    <GlassCard padding="none">
        <div class="p-4 border-b border-charcoal-800/10">
            <h2 class="text-lg font-semibold text-charcoal-800">登錄清單</h2>
            <p class="text-sm text-charcoal-600 mt-1">
                本次操作已登錄 {registrationList.length} 位學員
            </p>
        </div>
        <GlassTable
            {columns}
            data={registrationList}
            loading={false}
            emptyMessage="尚未登錄任何學員的學照日期"
        />
    </GlassCard>
</div>
