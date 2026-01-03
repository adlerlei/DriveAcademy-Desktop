<script lang="ts">
    import {
        GlassCard,
        GlassButton,
        GlassInput,
        GlassTable,
    } from "$lib/components";
    import { t } from "$lib/i18n";

    // 固定資料
    const transmissionTypes = [
        { code: "M", name: "手排" },
        { code: "A", name: "自排" },
        { code: "S", name: "特製車" },
    ];

    const dropoutOptions = ["是", "否"];

    const instructors = [
        { number: "001", name: "王大明" },
        { number: "002", name: "李小華" },
        { number: "003", name: "張建國" },
    ];

    // ========== 查詢區 ==========
    let searchQuery = $state("");

    // ========== 學員資料 ==========
    let currentStudent = $state<any>(null);
    let birthDate = $state("");
    let gender = $state("");
    let batch = $state("");
    let trainingTypeName = $state("");
    let rAddressZipCode = $state("");
    let rAddressCity = $state("");

    // 可編輯欄位
    let learnerPermitDate = $state("");
    let registerNumber = $state("");
    let term = $state("");

    // ========== 結訓登錄區 ==========
    let instructorNumber = $state("");
    let instructorName = $state("");
    let transmissionCode = $state("");
    let transmissionName = $state("");
    let dropout = $state("");

    // ========== 結訓名冊清單 ==========
    let rosterList = $state<any[]>([]);

    const columns = [
        { key: "register_number", label: "名冊號碼", width: "100px" },
        { key: "student_number", label: "學員編號", width: "100px" },
        { key: "student_name", label: "學員姓名", width: "100px" },
        { key: "dropout", label: "退訓", width: "60px" },
        { key: "transmission_name", label: "手自排", width: "80px" },
        { key: "instructor_name", label: "教練", width: "80px" },
    ];

    // 整合下拉選單
    function handleTransmissionChange(e: Event) {
        const code = (e.target as HTMLSelectElement).value;
        transmissionCode = code;
        transmissionName =
            transmissionTypes.find((t) => t.code === code)?.name || "";
    }

    function handleInstructorChange(e: Event) {
        const num = (e.target as HTMLSelectElement).value;
        instructorNumber = num;
        instructorName = instructors.find((i) => i.number === num)?.name || "";
    }

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
        gender = student.gender || "";
        batch = student.batch || "";
        trainingTypeName = student.training_type_name || "";
        rAddressZipCode = student.r_address_zip_code || "";
        rAddressCity = student.r_address_city || "";
        learnerPermitDate = student.learner_permit_date || "";
        registerNumber = student.register_number || "";
        term = student.register_term || "";
    }

    function clearForm() {
        currentStudent = null;
        searchQuery = "";
        birthDate = "";
        gender = "";
        batch = "";
        trainingTypeName = "";
        rAddressZipCode = "";
        rAddressCity = "";
        learnerPermitDate = "";
        registerNumber = "";
        term = "";
        instructorNumber = "";
        instructorName = "";
        transmissionCode = "";
        transmissionName = "";
        dropout = "";
    }

    async function handleAddToRoster() {
        if (!currentStudent) {
            alert("請先查詢並選擇一位學員");
            return;
        }
        if (!dropout || !transmissionCode || !instructorNumber) {
            alert("請填寫退訓、手自排和教練");
            return;
        }
        rosterList = [
            ...rosterList,
            {
                ...currentStudent,
                learner_permit_date: learnerPermitDate,
                register_number: registerNumber,
                transmission_code: transmissionCode,
                transmission_name: transmissionName,
                instructor_number: instructorNumber,
                instructor_name: instructorName,
                dropout,
            },
        ];
        alert("已加入結訓名冊！");
        clearForm();
    }

    function handleExport() {
        if (rosterList.length === 0) {
            alert("名冊為空");
            return;
        }
        alert("匯出功能開發中");
    }
    function handlePrint() {
        if (rosterList.length === 0) {
            alert("名冊為空");
            return;
        }
        alert("列印功能開發中");
    }
</script>

<div class="space-y-6">
    <div>
        <h1 class="text-2xl font-bold text-charcoal-800">
            {t("nav.closingRoster")}
        </h1>
        <p class="mt-1 text-charcoal-600">製作學員的結訓名冊，更新結訓狀態</p>
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
                學員資料
            </h2>
            {#if currentStudent}
                <span
                    class="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium"
                    >已選擇：{currentStudent.student_name}</span
                >
            {/if}
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-4">
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">出生日期</span><span
                    class="text-charcoal-800 font-medium"
                    >{birthDate || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">性別</span><span
                    class="text-charcoal-800 font-medium">{gender || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">梯次</span><span
                    class="text-charcoal-800 font-medium">{batch || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">訓練班別</span><span
                    class="text-charcoal-800 font-medium"
                    >{trainingTypeName || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">戶籍區</span><span
                    class="text-charcoal-800 font-medium"
                    >{rAddressZipCode
                        ? `${rAddressZipCode} ${rAddressCity}`
                        : "-"}</span
                >
            </div>
        </div>
        <h3
            class="text-sm font-semibold text-charcoal-600 mb-3 flex items-center gap-2"
        >
            <svg
                class="w-4 h-4 text-amber-500"
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
            可編輯欄位
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-4">
            <GlassInput
                label="學照日期"
                type="date"
                bind:value={learnerPermitDate}
                class="col-span-full sm:col-span-3 md:col-span-4"
            />
            <GlassInput
                label="名冊號碼"
                bind:value={registerNumber}
                class="col-span-full sm:col-span-3 md:col-span-4"
            />
            <GlassInput
                label="期別"
                bind:value={term}
                class="col-span-full sm:col-span-3 md:col-span-4"
            />
        </div>
    </GlassCard>

    <!-- 結訓登錄區 -->
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                /></svg
            >
            結訓登錄
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-4">
            <div
                class="col-span-full sm:col-span-3 md:col-span-4 flex flex-col gap-1.5"
            >
                <label class="text-sm font-medium text-charcoal-700"
                    >指導教練 <span class="text-coral-500">*</span></label
                >
                <select
                    class="h-10 w-full px-3 glass-input rounded-md text-charcoal-800 focus:outline-none"
                    value={instructorNumber}
                    onchange={handleInstructorChange}
                >
                    <option value="">請選擇教練</option>
                    {#each instructors as i}<option value={i.number}
                            >{i.number} - {i.name}</option
                        >{/each}
                </select>
            </div>
            <div
                class="col-span-full sm:col-span-3 md:col-span-3 flex flex-col gap-1.5"
            >
                <label class="text-sm font-medium text-charcoal-700"
                    >手自排 <span class="text-coral-500">*</span></label
                >
                <select
                    class="h-10 w-full px-3 glass-input rounded-md text-charcoal-800 focus:outline-none"
                    value={transmissionCode}
                    onchange={handleTransmissionChange}
                >
                    <option value="">請選擇</option>
                    {#each transmissionTypes as t}<option value={t.code}
                            >{t.code} - {t.name}</option
                        >{/each}
                </select>
            </div>
            <div
                class="col-span-full sm:col-span-2 md:col-span-2 flex flex-col gap-1.5"
            >
                <label class="text-sm font-medium text-charcoal-700"
                    >退訓 <span class="text-coral-500">*</span></label
                >
                <select
                    class="h-10 w-full px-3 glass-input rounded-md text-charcoal-800 focus:outline-none"
                    bind:value={dropout}
                >
                    <option value="">-</option>
                    {#each dropoutOptions as opt}<option value={opt}
                            >{opt}</option
                        >{/each}
                </select>
            </div>
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
            <GlassButton variant="primary" onclick={handleAddToRoster}
                >加入結訓名冊</GlassButton
            >
            <GlassButton variant="secondary" onclick={handleExport}
                >匯出</GlassButton
            >
            <GlassButton variant="secondary" onclick={handlePrint}
                >列印名冊</GlassButton
            >
        </div>
    </GlassCard>

    <!-- 結訓名冊清單 -->
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
                結訓名冊清單
            </h2>
            <p class="text-sm text-charcoal-600 mt-1">
                本次操作已加入 {rosterList.length} 位學員
            </p>
        </div>
        <GlassTable
            {columns}
            data={rosterList}
            loading={false}
            emptyMessage="尚未加入任何學員至結訓名冊"
        />
    </GlassCard>
</div>
