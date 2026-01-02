<script lang="ts">
    import {
        GlassCard,
        GlassButton,
        GlassInput,
        GlassTable,
    } from "$lib/components";
    import { t } from "$lib/i18n";

    // ========== 固定資料 ==========
    // 訓練班別
    const trainingTypes = [
        { code: "1", name: "普通小型車班" },
        { code: "2", name: "大貨車班" },
        { code: "3", name: "大客車班" },
        { code: "4", name: "聯結車班" },
        { code: "5", name: "職業小型車班" },
        { code: "6", name: "普通重機車班" },
        { code: "7", name: "大型重機車班" },
        { code: "8", name: "小型車逕升大客車班" },
    ];

    // 考照類別
    const licenseTypes = [
        { code: "0", name: "自用小客車" },
        { code: "1", name: "職業小客車" },
        { code: "2", name: "自用大貨車" },
        { code: "3", name: "職業大貨車" },
        { code: "4", name: "自用大客車" },
        { code: "5", name: "職業大客車" },
        { code: "6", name: "自用聯結車" },
        { code: "7", name: "職業聯結車" },
    ];

    // 梯次
    const batches = ["A", "B"];

    // 性別
    const genders = ["男", "女"];

    // 學歷
    const educations = [
        "學前教育",
        "國小",
        "國中",
        "高中",
        "專科",
        "大學",
        "碩士",
        "博士",
    ];

    // 地址資料 (暫時模擬，實際從 address_data 讀取)
    const addressData = [
        { zip_code: "100", city: "台北市中正區" },
        { zip_code: "106", city: "台北市大安區" },
        { zip_code: "110", city: "台北市信義區" },
        { zip_code: "300", city: "新竹市" },
        { zip_code: "320", city: "桃園市中壢區" },
    ];

    // 教練資料 (暫時模擬，實際從 instructor 讀取)
    const instructors = [
        { number: "001", name: "王大明" },
        { number: "002", name: "李小華" },
        { number: "003", name: "張建國" },
    ];

    // ========== 查詢模式 ==========
    let isEditing = $state(false);
    let currentStudentId = $state<number | null>(null);

    // ========== 查詢欄位 ==========
    let searchStudentNumber = $state("");
    let searchStudentName = $state("");
    let searchNationalId = $state("");
    let searchMobilePhone = $state("");

    // ========== A. 學員基本資料（可編輯）==========
    let trainingTypeCode = $state("");
    let trainingTypeName = $state("");
    let licenseTypeCode = $state("");
    let licenseTypeName = $state("");
    let studentNumber = $state("");
    let batch = $state("");
    let studentName = $state("");
    let nationalIdNo = $state("");
    let birthDate = $state("");
    let mobilePhone = $state("");
    let rAddressZipCode = $state("");
    let rAddressCity = $state("");
    let rAddress = $state("");
    let homePhone = $state("");
    let gender = $state("");
    let education = $state("");
    let instructorNumber = $state("");
    let instructorName = $state("");
    let email = $state("");
    let remarks = $state("");
    let mAddressZipCode = $state("");
    let mAddressCity = $state("");
    let mAddress = $state("");

    // ========== B. 學員狀態資料（唯讀）==========
    let dropout = $state("");
    let registerNumber = $state("");
    let learnerPermitDate = $state("");
    let learnerPermitNumber = $state("");
    let roadTestDate = $state("");
    let createdAt = $state("");

    // ========== 連動下拉邏輯 ==========
    function handleTrainingCodeChange(e: Event) {
        const code = (e.target as HTMLSelectElement).value;
        trainingTypeCode = code;
        const found = trainingTypes.find((t) => t.code === code);
        trainingTypeName = found?.name || "";
    }

    function handleTrainingNameChange(e: Event) {
        const name = (e.target as HTMLSelectElement).value;
        trainingTypeName = name;
        const found = trainingTypes.find((t) => t.name === name);
        trainingTypeCode = found?.code || "";
    }

    function handleLicenseCodeChange(e: Event) {
        const code = (e.target as HTMLSelectElement).value;
        licenseTypeCode = code;
        const found = licenseTypes.find((t) => t.code === code);
        licenseTypeName = found?.name || "";
    }

    function handleLicenseNameChange(e: Event) {
        const name = (e.target as HTMLSelectElement).value;
        licenseTypeName = name;
        const found = licenseTypes.find((t) => t.name === name);
        licenseTypeCode = found?.code || "";
    }

    function handleRZipCodeChange(e: Event) {
        const zip = (e.target as HTMLSelectElement).value;
        rAddressZipCode = zip;
        const found = addressData.find((a) => a.zip_code === zip);
        rAddressCity = found?.city || "";
    }

    function handleRCityChange(e: Event) {
        const city = (e.target as HTMLSelectElement).value;
        rAddressCity = city;
        const found = addressData.find((a) => a.city === city);
        rAddressZipCode = found?.zip_code || "";
    }

    function handleMZipCodeChange(e: Event) {
        const zip = (e.target as HTMLSelectElement).value;
        mAddressZipCode = zip;
        const found = addressData.find((a) => a.zip_code === zip);
        mAddressCity = found?.city || "";
    }

    function handleMCityChange(e: Event) {
        const city = (e.target as HTMLSelectElement).value;
        mAddressCity = city;
        const found = addressData.find((a) => a.city === city);
        mAddressZipCode = found?.zip_code || "";
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
        isEditing = true;
        currentStudentId = student.id;

        // 基本資料
        trainingTypeCode = student.training_type_code || "";
        trainingTypeName = student.training_type_name || "";
        licenseTypeCode = student.license_type_code || "";
        licenseTypeName = student.license_type_name || "";
        studentNumber = student.student_number || "";
        batch = student.batch || "";
        studentName = student.student_name || "";
        nationalIdNo = student.national_id_no || "";
        birthDate = student.birth_date || "";
        mobilePhone = student.mobile_phone || "";
        rAddressZipCode = student.r_address_zip_code || "";
        rAddressCity = student.r_address_city || "";
        rAddress = student.r_address || "";
        homePhone = student.home_phone || "";
        gender = student.gender || "";
        education = student.education || "";
        instructorNumber = student.instructor_number || "";
        instructorName = student.instructor_name || "";
        email = student.email || "";
        remarks = student.remarks || "";
        mAddressZipCode = student.m_address_zip_code || "";
        mAddressCity = student.m_address_city || "";
        mAddress = student.m_address || "";

        // 狀態資料
        dropout = student.dropout || "";
        registerNumber = student.register_number || "";
        learnerPermitDate = student.learner_permit_date || "";
        learnerPermitNumber = student.learner_permit_number || "";
        roadTestDate = student.road_test_date || "";
        createdAt = student.created_at || "";
    }

    // ========== 功能按鈕 ==========
    function clearForm() {
        isEditing = false;
        currentStudentId = null;

        // 清空所有欄位
        trainingTypeCode = "";
        trainingTypeName = "";
        licenseTypeCode = "";
        licenseTypeName = "";
        studentNumber = "";
        batch = "";
        studentName = "";
        nationalIdNo = "";
        birthDate = "";
        mobilePhone = "";
        rAddressZipCode = "";
        rAddressCity = "";
        rAddress = "";
        homePhone = "";
        gender = "";
        education = "";
        instructorNumber = "";
        instructorName = "";
        email = "";
        remarks = "";
        mAddressZipCode = "";
        mAddressCity = "";
        mAddress = "";

        // 狀態資料
        dropout = "";
        registerNumber = "";
        learnerPermitDate = "";
        learnerPermitNumber = "";
        roadTestDate = "";
        createdAt = "";

        // 查詢欄位
        searchStudentNumber = "";
        searchStudentName = "";
        searchNationalId = "";
        searchMobilePhone = "";
    }

    async function handleAdd() {
        if (isEditing) {
            alert("目前處於編輯模式，請使用「修改」功能或先「清除」");
            return;
        }

        const data = {
            training_type_code: trainingTypeCode,
            training_type_name: trainingTypeName,
            license_type_code: licenseTypeCode,
            license_type_name: licenseTypeName,
            student_number: studentNumber,
            batch,
            student_name: studentName,
            national_id_no: nationalIdNo,
            birth_date: birthDate,
            mobile_phone: mobilePhone,
            r_address_zip_code: rAddressZipCode,
            r_address_city: rAddressCity,
            r_address: rAddress,
            home_phone: homePhone,
            gender,
            education,
            instructor_number: instructorNumber,
            instructor_name: instructorName,
            email,
            remarks,
            m_address_zip_code: mAddressZipCode,
            m_address_city: mAddressCity,
            m_address: mAddress,
        };

        try {
            const res = await fetch("/api/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                alert("新增成功！");
                clearForm();
            } else {
                alert("新增失敗");
            }
        } catch (error) {
            console.error("Add failed:", error);
            alert("新增失敗");
        }
    }

    async function handleUpdate() {
        if (!isEditing || !currentStudentId) {
            alert("請先查詢到學員才能修改");
            return;
        }

        const data = {
            training_type_code: trainingTypeCode,
            training_type_name: trainingTypeName,
            license_type_code: licenseTypeCode,
            license_type_name: licenseTypeName,
            student_number: studentNumber,
            batch,
            student_name: studentName,
            national_id_no: nationalIdNo,
            birth_date: birthDate,
            mobile_phone: mobilePhone,
            r_address_zip_code: rAddressZipCode,
            r_address_city: rAddressCity,
            r_address: rAddress,
            home_phone: homePhone,
            gender,
            education,
            instructor_number: instructorNumber,
            instructor_name: instructorName,
            email,
            remarks,
            m_address_zip_code: mAddressZipCode,
            m_address_city: mAddressCity,
            m_address: mAddress,
        };

        try {
            const res = await fetch(`/api/students/${currentStudentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                alert("修改成功！");
            } else {
                alert("修改失敗");
            }
        } catch (error) {
            console.error("Update failed:", error);
            alert("修改失敗");
        }
    }

    async function handleDelete() {
        if (!isEditing || !currentStudentId) {
            alert("請先查詢到學員才能刪除");
            return;
        }

        if (!confirm("確定要刪除此學員資料嗎？")) {
            return;
        }

        try {
            const res = await fetch(`/api/students/${currentStudentId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("刪除成功！");
                clearForm();
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
            {t("nav.students")}
        </h1>
        <p class="mt-1 text-charcoal-600">
            建立、查詢、修改與刪除學員的詳細個人資料
        </p>
    </div>

    <!-- 查詢區塊 -->
    <GlassCard>
        <h2 class="text-lg font-semibold text-charcoal-800 mb-4">查詢學員</h2>
        <p class="text-sm text-charcoal-600 mb-4">
            輸入任一欄位後按 Enter 查詢，系統會自動帶入該學員的所有資料
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="flex gap-2">
                <GlassInput
                    label="學員編號"
                    bind:value={searchStudentNumber}
                    onkeydown={(e) =>
                        e.key === "Enter" &&
                        searchStudent("student_number", searchStudentNumber)}
                />
            </div>
            <div class="flex gap-2">
                <GlassInput
                    label="學員姓名"
                    bind:value={searchStudentName}
                    onkeydown={(e) =>
                        e.key === "Enter" &&
                        searchStudent("student_name", searchStudentName)}
                />
            </div>
            <div class="flex gap-2">
                <GlassInput
                    label="身分證號"
                    bind:value={searchNationalId}
                    onkeydown={(e) =>
                        e.key === "Enter" &&
                        searchStudent("national_id_no", searchNationalId)}
                />
            </div>
            <div class="flex gap-2">
                <GlassInput
                    label="手機"
                    bind:value={searchMobilePhone}
                    onkeydown={(e) =>
                        e.key === "Enter" &&
                        searchStudent("mobile_phone", searchMobilePhone)}
                />
            </div>
        </div>
    </GlassCard>

    <!-- A. 學員基本資料（可編輯）-->
    <GlassCard>
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-charcoal-800">
                A. 學員基本資料
            </h2>
            {#if isEditing}
                <span
                    class="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded"
                    >編輯模式</span
                >
            {/if}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- 訓練班別 (連動下拉) -->
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >訓練班別代碼</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-lg text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={trainingTypeCode}
                    onchange={handleTrainingCodeChange}
                >
                    <option value="">請選擇</option>
                    {#each trainingTypes as type}
                        <option value={type.code}>{type.code}</option>
                    {/each}
                </select>
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >訓練班別名稱</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-lg text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={trainingTypeName}
                    onchange={handleTrainingNameChange}
                >
                    <option value="">請選擇</option>
                    {#each trainingTypes as type}
                        <option value={type.name}>{type.name}</option>
                    {/each}
                </select>
            </div>

            <!-- 考照類別 (連動下拉) -->
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >考照類別代碼</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-lg text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={licenseTypeCode}
                    onchange={handleLicenseCodeChange}
                >
                    <option value="">請選擇</option>
                    {#each licenseTypes as type}
                        <option value={type.code}>{type.code}</option>
                    {/each}
                </select>
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >考照類別名稱</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-lg text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={licenseTypeName}
                    onchange={handleLicenseNameChange}
                >
                    <option value="">請選擇</option>
                    {#each licenseTypes as type}
                        <option value={type.name}>{type.name}</option>
                    {/each}
                </select>
            </div>

            <!-- 基本欄位 -->
            <GlassInput label="學員編號" bind:value={studentNumber} />

            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700">梯次</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-lg text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    bind:value={batch}
                >
                    <option value="">請選擇</option>
                    {#each batches as b}
                        <option value={b}>{b}</option>
                    {/each}
                </select>
            </div>

            <GlassInput label="學員姓名" bind:value={studentName} />
            <GlassInput label="身分證號碼" bind:value={nationalIdNo} />
            <GlassInput label="出生日期" type="date" bind:value={birthDate} />
            <GlassInput label="手機" bind:value={mobilePhone} />

            <!-- 戶籍地址 (連動下拉) -->
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >戶籍郵遞區號</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-lg text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={rAddressZipCode}
                    onchange={handleRZipCodeChange}
                >
                    <option value="">請選擇</option>
                    {#each addressData as addr}
                        <option value={addr.zip_code}>{addr.zip_code}</option>
                    {/each}
                </select>
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >戶籍縣市</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-lg text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={rAddressCity}
                    onchange={handleRCityChange}
                >
                    <option value="">請選擇</option>
                    {#each addressData as addr}
                        <option value={addr.city}>{addr.city}</option>
                    {/each}
                </select>
            </div>
            <div class="lg:col-span-1">
                <GlassInput label="戶籍地址" bind:value={rAddress} />
            </div>

            <GlassInput label="室內電話" bind:value={homePhone} />

            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700">性別</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-lg text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    bind:value={gender}
                >
                    <option value="">請選擇</option>
                    {#each genders as g}
                        <option value={g}>{g}</option>
                    {/each}
                </select>
            </div>

            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700">學歷</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-lg text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    bind:value={education}
                >
                    <option value="">請選擇</option>
                    {#each educations as edu}
                        <option value={edu}>{edu}</option>
                    {/each}
                </select>
            </div>

            <!-- 指導教練 (連動下拉) -->
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >教練編號</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-lg text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={instructorNumber}
                    onchange={handleInstructorNumberChange}
                >
                    <option value="">請選擇</option>
                    {#each instructors as inst}
                        <option value={inst.number}>{inst.number}</option>
                    {/each}
                </select>
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >教練姓名</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-lg text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={instructorName}
                    onchange={handleInstructorNameChange}
                >
                    <option value="">請選擇</option>
                    {#each instructors as inst}
                        <option value={inst.name}>{inst.name}</option>
                    {/each}
                </select>
            </div>

            <GlassInput label="電子郵件" type="email" bind:value={email} />
            <GlassInput label="備註" bind:value={remarks} />

            <!-- 通訊地址 (連動下拉) -->
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >通訊郵遞區號</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-lg text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={mAddressZipCode}
                    onchange={handleMZipCodeChange}
                >
                    <option value="">請選擇</option>
                    {#each addressData as addr}
                        <option value={addr.zip_code}>{addr.zip_code}</option>
                    {/each}
                </select>
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >通訊縣市</label
                >
                <select
                    class="h-10 w-full px-4 glass-input rounded-lg text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    value={mAddressCity}
                    onchange={handleMCityChange}
                >
                    <option value="">請選擇</option>
                    {#each addressData as addr}
                        <option value={addr.city}>{addr.city}</option>
                    {/each}
                </select>
            </div>
            <div class="lg:col-span-1">
                <GlassInput label="通訊地址" bind:value={mAddress} />
            </div>
        </div>
    </GlassCard>

    <!-- B. 學員狀態資料（唯讀）-->
    <GlassCard variant="subtle">
        <h2 class="text-lg font-semibold text-charcoal-800 mb-4">
            B. 學員狀態資料（唯讀）
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">退訓狀態</span>
                <span class="text-charcoal-800 font-medium"
                    >{dropout || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">名冊號碼</span>
                <span class="text-charcoal-800 font-medium"
                    >{registerNumber || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">學照日期</span>
                <span class="text-charcoal-800 font-medium"
                    >{learnerPermitDate || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">學照號碼</span>
                <span class="text-charcoal-800 font-medium"
                    >{learnerPermitNumber || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">路試日期</span>
                <span class="text-charcoal-800 font-medium"
                    >{roadTestDate || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">建檔日期</span>
                <span class="text-charcoal-800 font-medium"
                    >{createdAt || "-"}</span
                >
            </div>
        </div>
    </GlassCard>

    <!-- 功能按鈕 -->
    <GlassCard padding="sm">
        <div class="flex flex-wrap gap-3">
            <GlassButton variant="ghost" onclick={clearForm}>
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                </svg>
                清除
            </GlassButton>
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
        </div>
    </GlassCard>
</div>
