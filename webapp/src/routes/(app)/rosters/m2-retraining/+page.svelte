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

    const examRetakeTypes = ["補筆試", "補路試"];

    const instructors = [
        { number: "001", name: "王大明" },
        { number: "002", name: "李小華" },
        { number: "003", name: "張建國" },
    ];

    // ========== 查詢區欄位 ==========
    let searchStudentNumber = $state("");
    let searchStudentName = $state("");
    let searchNationalId = $state("");

    // ========== 學員資料顯示區 ==========
    let currentStudent = $state<any>(null);
    let birthDate = $state("");
    let gender = $state("");
    let batch = $state("");
    let trainingTypeName = $state("");
    let rAddressZipCode = $state("");
    let rAddressCity = $state("");
    let rAddress = $state("");

    // 可編輯欄位（自動帶入舊資料）
    let learnerPermitDate = $state("");
    let registerNumber = $state("");
    let term = $state("");

    // ========== M2補訓登錄區 ==========
    let sourceCode = $state("");
    let sourceName = $state("");
    let transmissionCode = $state("");
    let transmissionName = $state("");
    let instructorNumber = $state("");
    let instructorName = $state("");
    let examRetakeType = $state(""); // 筆路

    // ========== M2補訓清單 ==========
    let rosterList = $state<any[]>([]);

    const columns = [
        { key: "register_number", label: "名冊號碼", width: "100px" },
        { key: "student_number", label: "學員編號", width: "100px" },
        { key: "batch", label: "梯次", width: "60px" },
        { key: "student_name", label: "學員姓名", width: "100px" },
        { key: "source_name", label: "來源", width: "80px" },
        { key: "transmission_name", label: "手自排", width: "80px" },
        { key: "instructor_name", label: "教練", width: "80px" },
        { key: "national_id_no", label: "身分證號", width: "120px" },
        { key: "learner_permit_date", label: "學照日期", width: "100px" },
        { key: "gender", label: "性別", width: "60px" },
        { key: "birth_date", label: "出生日期", width: "100px" },
        { key: "r_address_zip_code", label: "區號", width: "60px" },
        { key: "r_address", label: "戶籍地址", width: "150px" },
    ];

    // 連動下拉處理函數（與開訓名冊類似）
    function handleSourceCodeChange(e: Event) {
        const code = (e.target as HTMLSelectElement).value;
        sourceCode = code;
        const found = sourceTypes.find((t) => t.code === code);
        sourceName = found?.name || "";
    }

    function handleSourceNameChange(e: Event) {
        const name = (e.target as HTMLSelectElement).value;
        sourceName = name;
        const found = sourceTypes.find((t) => t.name === name);
        sourceCode = found?.code || "";
    }

    function handleTransmissionCodeChange(e: Event) {
        const code = (e.target as HTMLSelectElement).value;
        transmissionCode = code;
        const found = transmissionTypes.find((t) => t.code === code);
        transmissionName = found?.name || "";
    }

    function handleTransmissionNameChange(e: Event) {
        const name = (e.target as HTMLSelectElement).value;
        transmissionName = name;
        const found = transmissionTypes.find((t) => t.name === name);
        transmissionCode = found?.code || "";
    }

    function handleInstructorNumberChange(e: Event) {
        const num = (e.target as HTMLSelectElement).value;
        instructorNumber = num;
        const found = instructors.find((i) => i.number === num);
        instructorName = found?.name || "";
    }

    function handleInstructorNameChange(e: Event) {
        const name = (e.target as HTMLSelectElement).value;
        instructorName = name;
        const found = instructors.find((i) => i.name === name);
        instructorNumber = found?.number || "";
    }

    // 查詢功能
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
        gender = student.gender || "";
        batch = student.batch || "";
        trainingTypeName = student.training_type_name || "";
        rAddressZipCode = student.r_address_zip_code || "";
        rAddressCity = student.r_address_city || "";
        rAddress = student.r_address || "";
        // 可編輯欄位
        learnerPermitDate = student.learner_permit_date || "";
        registerNumber = student.register_number || "";
        term = student.register_term || "";
    }

    function clearForm() {
        currentStudent = null;
        searchStudentNumber = "";
        searchStudentName = "";
        searchNationalId = "";
        birthDate = "";
        gender = "";
        batch = "";
        trainingTypeName = "";
        rAddressZipCode = "";
        rAddressCity = "";
        rAddress = "";
        learnerPermitDate = "";
        registerNumber = "";
        term = "";
        sourceCode = "";
        sourceName = "";
        transmissionCode = "";
        transmissionName = "";
        instructorNumber = "";
        instructorName = "";
        examRetakeType = "";
    }

    async function handleAddToRoster() {
        if (!currentStudent) {
            alert("請先查詢並選擇一位學員");
            return;
        }

        if (!examRetakeType) {
            alert("請選擇筆路（補筆試/補路試）");
            return;
        }

        rosterList = [
            ...rosterList,
            {
                ...currentStudent,
                learner_permit_date: learnerPermitDate,
                register_number: registerNumber,
                source_code: sourceCode,
                source_name: sourceName,
                transmission_code: transmissionCode,
                transmission_name: transmissionName,
                instructor_number: instructorNumber,
                instructor_name: instructorName,
                exam_retake_type: examRetakeType,
            },
        ];

        alert("已加入M2補訓名冊！");
        clearForm();
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
            {t("nav.m2Retraining")}
        </h1>
        <p class="mt-1 text-charcoal-600">
            處理學員因故需參加補訓（如補筆試、補路試）的名冊作業
        </p>
    </div>

    <!-- A. 學員查詢區 -->
    <GlassCard>
        <h2 class="text-lg font-semibold text-charcoal-800 mb-4">
            A. 學員查詢區
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
    </GlassCard>

    <!-- B. 學員資料顯示區 -->
    <GlassCard variant="subtle">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-charcoal-800">
                B. 學員資料顯示區
            </h2>
            {#if currentStudent}
                <span
                    class="text-sm text-green-600 bg-green-50 px-2 py-1 rounded"
                    >已選擇：{currentStudent.student_name}</span
                >
            {/if}
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">出生日期</span><span
                    class="font-medium">{birthDate || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">性別</span><span
                    class="font-medium">{gender || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">梯次</span><span
                    class="font-medium">{batch || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">訓練班別</span><span
                    class="font-medium">{trainingTypeName || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">戶籍地址</span><span
                    class="font-medium text-sm"
                    >{rAddressZipCode
                        ? `${rAddressZipCode} ${rAddressCity}`
                        : "-"}</span
                >
            </div>
        </div>

        <h3 class="text-sm font-semibold text-charcoal-700 mb-2">
            可編輯欄位（自動帶入舊資料）
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassInput
                label="學照日期"
                type="date"
                bind:value={learnerPermitDate}
            />
            <GlassInput label="名冊號碼" bind:value={registerNumber} />
            <GlassInput label="期別" bind:value={term} />
        </div>
    </GlassCard>

    <!-- C. M2補訓登錄區 -->
    <GlassCard>
        <h2 class="text-lg font-semibold text-charcoal-800 mb-4">
            C. M2補訓登錄區
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <!-- 來源 -->
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >來源代碼</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-md text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={sourceCode}
                    onchange={handleSourceCodeChange}
                >
                    <option value="">請選擇</option>
                    {#each sourceTypes as type}<option value={type.code}
                            >{type.code}</option
                        >{/each}
                </select>
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >來源名稱</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-md text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={sourceName}
                    onchange={handleSourceNameChange}
                >
                    <option value="">請選擇</option>
                    {#each sourceTypes as type}<option value={type.name}
                            >{type.name}</option
                        >{/each}
                </select>
            </div>

            <!-- 手自排 -->
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >手自排代碼</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-md text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={transmissionCode}
                    onchange={handleTransmissionCodeChange}
                >
                    <option value="">請選擇</option>
                    {#each transmissionTypes as type}<option value={type.code}
                            >{type.code}</option
                        >{/each}
                </select>
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >手自排名稱</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-md text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={transmissionName}
                    onchange={handleTransmissionNameChange}
                >
                    <option value="">請選擇</option>
                    {#each transmissionTypes as type}<option value={type.name}
                            >{type.name}</option
                        >{/each}
                </select>
            </div>

            <!-- 指導教練 -->
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >教練編號</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-md text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={instructorNumber}
                    onchange={handleInstructorNumberChange}
                >
                    <option value="">請選擇</option>
                    {#each instructors as inst}<option value={inst.number}
                            >{inst.number}</option
                        >{/each}
                </select>
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >教練姓名</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-md text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={instructorName}
                    onchange={handleInstructorNameChange}
                >
                    <option value="">請選擇</option>
                    {#each instructors as inst}<option value={inst.name}
                            >{inst.name}</option
                        >{/each}
                </select>
            </div>

            <!-- 筆路 -->
            <div class="flex flex-col gap-1.5 lg:col-span-2">
                <label class="text-sm font-medium text-charcoal-700"
                    >筆路 <span class="text-coral-500">*</span></label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-md text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    bind:value={examRetakeType}
                >
                    <option value="">請選擇</option>
                    {#each examRetakeTypes as type}<option value={type}
                            >{type}</option
                        >{/each}
                </select>
            </div>
        </div>

        <div class="flex flex-wrap gap-3 pt-4 border-t border-charcoal-800/10">
            <GlassButton variant="primary" onclick={handleAddToRoster}
                >加入M2補訓</GlassButton
            >
            <GlassButton variant="secondary" onclick={handlePrintSchool}
                >列印M2補訓（駕訓班用）</GlassButton
            >
            <GlassButton variant="secondary" onclick={handlePrintOfficial}
                >列印M2補訓（監理站用）</GlassButton
            >
            <GlassButton variant="ghost" onclick={clearForm}>清除</GlassButton>
        </div>
    </GlassCard>

    <!-- M2補訓名冊清單 -->
    <GlassCard padding="none">
        <div class="p-4 border-b border-charcoal-800/10">
            <h2 class="text-lg font-semibold text-charcoal-800">
                M2補訓名冊清單
            </h2>
            <p class="text-sm text-charcoal-600 mt-1">
                本次操作已加入 {rosterList.length} 位學員
            </p>
        </div>
        <GlassTable
            {columns}
            data={rosterList}
            loading={false}
            emptyMessage="尚未加入任何學員至M2補訓名冊"
        />
    </GlassCard>
</div>
