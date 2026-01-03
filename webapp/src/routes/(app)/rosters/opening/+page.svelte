<script lang="ts">
    import {
        GlassCard,
        GlassButton,
        GlassInput,
        GlassTable,
    } from "$lib/components";
    import { t } from "$lib/i18n";

    // 固定資料
    const sourceTypes = [
        { code: "A", name: "新考" },
        { code: "B", name: "晉考" },
        { code: "C", name: "換考" },
        { code: "G", name: "吊扣註銷重考" },
        { code: "Z", name: "臨時駕駛執照" },
    ];

    const transmissionTypes = [
        { code: "M", name: "手排" },
        { code: "A", name: "自排" },
        { code: "S", name: "特製車" },
    ];

    const instructors = [
        { number: "001", name: "王大明" },
        { number: "002", name: "李小華" },
        { number: "003", name: "張建國" },
    ];

    const terms = ["01", "02", "03"];

    // ========== 查詢區 ==========
    let searchQuery = $state("");

    // ========== 學員資料（唯讀）==========
    let currentStudent = $state<any>(null);
    let birthDate = $state("");
    let learnerPermitDate = $state("");
    let gender = $state("");
    let batch = $state("");
    let trainingTypeName = $state("");
    let rAddressZipCode = $state("");
    let rAddressCity = $state("");
    let rAddress = $state("");

    // ========== 名冊登錄區 ==========
    let term = $state("");
    let registerBatch = $state("");
    let sourceCode = $state("");
    let sourceName = $state("");
    let transmissionCode = $state("");
    let transmissionName = $state("");
    let instructorNumber = $state("");
    let instructorName = $state("");

    // ========== 開訓名冊清單 ==========
    let rosterList = $state<any[]>([]);

    let autoRegisterNumber = $derived(
        term && registerBatch
            ? `0${term}${registerBatch}${String(rosterList.length + 1).padStart(3, "0")}`
            : "",
    );

    const columns = [
        { key: "register_number", label: "名冊號碼", width: "100px" },
        { key: "batch", label: "梯次", width: "60px" },
        { key: "student_number", label: "學員編號", width: "100px" },
        { key: "student_name", label: "學員姓名", width: "100px" },
        { key: "source_name", label: "來源", width: "80px" },
        { key: "transmission_name", label: "手自排", width: "80px" },
        { key: "instructor_name", label: "教練", width: "80px" },
    ];

    // ========== 整合下拉選單處理 ==========
    function handleSourceChange(e: Event) {
        const code = (e.target as HTMLSelectElement).value;
        sourceCode = code;
        const found = sourceTypes.find((t) => t.code === code);
        sourceName = found?.name || "";
    }

    function handleTransmissionChange(e: Event) {
        const code = (e.target as HTMLSelectElement).value;
        transmissionCode = code;
        const found = transmissionTypes.find((t) => t.code === code);
        transmissionName = found?.name || "";
    }

    function handleInstructorChange(e: Event) {
        const num = (e.target as HTMLSelectElement).value;
        instructorNumber = num;
        const found = instructors.find((i) => i.number === num);
        instructorName = found?.name || "";
    }

    // ========== 查詢功能 ==========
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
        learnerPermitDate = student.learner_permit_date || "";
        gender = student.gender || "";
        batch = student.batch || "";
        registerBatch = student.batch || "";
        trainingTypeName = student.training_type_name || "";
        rAddressZipCode = student.r_address_zip_code || "";
        rAddressCity = student.r_address_city || "";
        rAddress = student.r_address || "";
    }

    function clearForm() {
        currentStudent = null;
        searchQuery = "";
        birthDate = "";
        learnerPermitDate = "";
        gender = "";
        batch = "";
        trainingTypeName = "";
        rAddressZipCode = "";
        rAddressCity = "";
        rAddress = "";
        term = "";
        registerBatch = "";
        sourceCode = "";
        sourceName = "";
        transmissionCode = "";
        transmissionName = "";
        instructorNumber = "";
        instructorName = "";
    }

    async function handleAddToRoster() {
        if (!currentStudent) {
            alert("請先查詢並選擇一位學員");
            return;
        }
        if (!term || !sourceCode || !transmissionCode || !instructorNumber) {
            alert("請填寫期別、來源、手自排和指導教練");
            return;
        }
        rosterList = [
            ...rosterList,
            {
                ...currentStudent,
                register_number: autoRegisterNumber,
                source_code: sourceCode,
                source_name: sourceName,
                transmission_code: transmissionCode,
                transmission_name: transmissionName,
                instructor_number: instructorNumber,
                instructor_name: instructorName,
            },
        ];
        alert("已加入開訓名冊！");
        clearForm();
    }

    function handleExport() {
        if (rosterList.length === 0) {
            alert("名冊為空");
            return;
        }
        alert("匯出功能開發中");
    }
    function handlePrintSchool() {
        if (rosterList.length === 0) {
            alert("名冊為空");
            return;
        }
        alert("列印（駕訓班用）功能開發中");
    }
    function handlePrintOfficial() {
        if (rosterList.length === 0) {
            alert("名冊為空");
            return;
        }
        alert("列印（監理站用）功能開發中");
    }
</script>

<div class="space-y-6">
    <!-- 頁面標題 -->
    <div>
        <h1 class="text-2xl font-bold text-charcoal-800">
            {t("nav.openingRoster")}
        </h1>
        <p class="mt-1 text-charcoal-600">
            將已完成學照登錄的學員，正式編入特定期別的開訓名冊中
        </p>
    </div>

    <!-- 學員查詢區 -->
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

    <!-- 學員資料顯示區（唯讀）-->
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
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">出生日期</span><span
                    class="text-charcoal-800 font-medium"
                    >{birthDate || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">學照日期</span><span
                    class="text-charcoal-800 font-medium"
                    >{learnerPermitDate || "-"}</span
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
                <span class="text-sm text-charcoal-500">戶籍地址</span><span
                    class="text-charcoal-800 font-medium text-sm"
                    >{rAddressZipCode
                        ? `${rAddressZipCode} ${rAddressCity}`
                        : "-"}</span
                >
            </div>
        </div>
    </GlassCard>

    <!-- 名冊登錄區 -->
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                /></svg
            >
            名冊登錄
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-4">
            <div class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-2 md:col-span-1 sm:col-span-3 md:col-span-2 flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >期別 <span class="text-coral-500">*</span></label
                >
                <select
                    class="h-10 w-full px-2 glass-input rounded-md text-charcoal-800 text-center focus:outline-none"
                    bind:value={term}
                >
                    <option value="">-</option>
                    {#each terms as t}<option value={t}>{t}</option>{/each}
                </select>
            </div>
            <div class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-2 md:col-span-1 sm:col-span-3 md:col-span-2 flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >名冊號碼</label
                >
                <input
                    type="text"
                    class="h-10 w-full px-3 glass-input rounded-md text-charcoal-800 bg-charcoal-50"
                    value={autoRegisterNumber}
                    disabled
                />
            </div>
            <div class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-2 md:col-span-1 sm:col-span-3 md:col-span-2 flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700">梯次</label
                >
                <input
                    type="text"
                    class="h-10 w-full px-3 glass-input rounded-md text-charcoal-800 bg-charcoal-50 text-center"
                    value={registerBatch}
                    disabled
                />
            </div>
            <div class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-3 md:col-span-1 sm:col-span-3 md:col-span-3 flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >來源 <span class="text-coral-500">*</span></label
                >
                <select
                    class="h-10 w-full px-3 glass-input rounded-md text-charcoal-800 focus:outline-none"
                    value={sourceCode}
                    onchange={handleSourceChange}
                >
                    <option value="">請選擇來源</option>
                    {#each sourceTypes as t}<option value={t.code}
                            >{t.code} - {t.name}</option
                        >{/each}
                </select>
            </div>
            <div class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-3 md:col-span-1 sm:col-span-3 md:col-span-3 flex flex-col gap-1.5">
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
            <div class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-3 md:col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-3 md:col-span-4 flex flex-col gap-1.5">
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
            <GlassButton variant="primary" onclick={handleAddToRoster}>
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
                加入開訓名冊
            </GlassButton>
            <GlassButton variant="secondary" onclick={handleExport}>
                <svg
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
                >
                匯出
            </GlassButton>
            <GlassButton variant="secondary" onclick={handlePrintSchool}
                >列印（駕訓班用）</GlassButton
            >
            <GlassButton variant="secondary" onclick={handlePrintOfficial}
                >列印（監理站用）</GlassButton
            >
        </div>
    </GlassCard>

    <!-- 開訓名冊清單 -->
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
                開訓名冊清單
            </h2>
            <p class="text-sm text-charcoal-600 mt-1">
                本次操作已加入 {rosterList.length} 位學員
            </p>
        </div>
        <GlassTable
            {columns}
            data={rosterList}
            loading={false}
            emptyMessage="尚未加入任何學員至開訓名冊"
        />
    </GlassCard>
</div>
