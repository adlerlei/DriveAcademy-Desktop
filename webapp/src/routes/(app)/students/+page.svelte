<script lang="ts">
    import { GlassCard, GlassButton, GlassInput } from "$lib/components";
    import { t } from "$lib/i18n";
    import {
        taiwanAddress,
        getCities,
        getDistricts,
        getZipCode,
    } from "$lib/data/taiwan-address";

    // ========== 固定資料（整合顯示格式）==========
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

    const batches = ["A", "B"];
    const genders = ["男", "女"];

    const instructors = [
        { number: "001", name: "王大明" },
        { number: "002", name: "李小華" },
        { number: "003", name: "張建國" },
    ];

    // ========== 狀態 ==========
    let isEditing = $state(false);
    let currentStudentId = $state<number | null>(null);

    // ========== 查詢欄位 ==========
    let searchQuery = $state("");

    // ========== 學員基本資料 ==========
    // 存儲時拆分為 code + name，但 UI 使用整合值
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
    let homePhone = $state("");
    let gender = $state("");
    let instructorNumber = $state("");
    let instructorName = $state("");
    let email = $state("");
    // 戶籍地址（三層連動）
    let rCity = $state(""); // 縣市
    let rDistrict = $state(""); // 區域
    let rAddressZipCode = $state(""); // 郵遞區號（自動帶入）
    let rAddressCity = $state(""); // 完整縣市區名稱
    let rAddress = $state(""); // 詳細地址
    // 通訊地址（三層連動）
    let mCity = $state("");
    let mDistrict = $state("");
    let mAddressZipCode = $state("");
    let mAddressCity = $state("");
    let mAddress = $state("");

    // ========== 學員狀態資料（唯讀）==========
    let dropout = $state("");
    let registerNumber = $state("");
    let learnerPermitDate = $state("");
    let learnerPermitNumber = $state("");
    let roadTestDate = $state("");
    let createdAt = $state("");

    // ========== 學員編號自動格式化 (xxx-xxx) ==========
    function formatStudentNumber(value: string): string {
        const digits = value.replace(/[^0-9]/g, ""); // 只保留數字
        if (digits.length > 3) {
            return digits.slice(0, 3) + "-" + digits.slice(3, 6);
        }
        return digits;
    }

    function handleStudentNumberInput(e: Event) {
        const input = e.target as HTMLInputElement;
        const formatted = formatStudentNumber(input.value);
        studentNumber = formatted;
        // 更新輸入框顯示值
        input.value = formatted;
    }

    // ========== 整合下拉選單處理 ==========
    function handleTrainingTypeChange(e: Event) {
        const code = (e.target as HTMLSelectElement).value;
        trainingTypeCode = code;
        const found = trainingTypes.find((t) => t.code === code);
        trainingTypeName = found?.name || "";
    }

    function handleLicenseTypeChange(e: Event) {
        const code = (e.target as HTMLSelectElement).value;
        licenseTypeCode = code;
        const found = licenseTypes.find((t) => t.code === code);
        licenseTypeName = found?.name || "";
    }

    function handleInstructorChange(e: Event) {
        const num = (e.target as HTMLSelectElement).value;
        instructorNumber = num;
        const found = instructors.find((i) => i.number === num);
        instructorName = found?.name || "";
    }

    // ========== 地址連動處理 ==========
    function handleRCityChange(e: Event) {
        const city = (e.target as HTMLSelectElement).value;
        rCity = city;
        rDistrict = ""; // 重置區域
        rAddressZipCode = "";
        rAddressCity = city;
    }

    function handleRDistrictChange(e: Event) {
        const district = (e.target as HTMLSelectElement).value;
        rDistrict = district;
        rAddressZipCode = getZipCode(rCity, district);
        rAddressCity = rCity + district;
    }

    function handleMCityChange(e: Event) {
        const city = (e.target as HTMLSelectElement).value;
        mCity = city;
        mDistrict = "";
        mAddressZipCode = "";
        mAddressCity = city;
    }

    function handleMDistrictChange(e: Event) {
        const district = (e.target as HTMLSelectElement).value;
        mDistrict = district;
        mAddressZipCode = getZipCode(mCity, district);
        mAddressCity = mCity + district;
    }

    // ========== 複製戶籍地址到通訊地址 ==========
    function copyFromPermanentAddress() {
        mCity = rCity;
        mDistrict = rDistrict;
        mAddressZipCode = rAddressZipCode;
        mAddressCity = rAddressCity;
        mAddress = rAddress;
    }

    // ========== 自動同步戶籍地址到通訊地址 ==========
    $effect(() => {
        // 當戶籍地址變更時，自動同步到通訊地址
        if (rCity && rDistrict) {
            mCity = rCity;
            mDistrict = rDistrict;
            mAddressZipCode = rAddressZipCode;
            mAddressCity = rAddressCity;
            mAddress = rAddress;
        }
    });

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
        isEditing = true;
        currentStudentId = student.id;
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
        instructorNumber = student.instructor_number || "";
        instructorName = student.instructor_name || "";
        email = student.email || "";
        mAddressZipCode = student.m_address_zip_code || "";
        mAddressCity = student.m_address_city || "";
        mAddress = student.m_address || "";
        dropout = student.dropout || "";
        registerNumber = student.register_number || "";
        learnerPermitDate = student.learner_permit_date || "";
        learnerPermitNumber = student.learner_permit_number || "";
        roadTestDate = student.road_test_date || "";
        createdAt = student.created_at || "";
    }

    function clearForm() {
        isEditing = false;
        currentStudentId = null;
        searchQuery = "";
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
        instructorNumber = "";
        instructorName = "";
        email = "";
        mAddressZipCode = "";
        mAddressCity = "";
        mAddress = "";
        dropout = "";
        registerNumber = "";
        learnerPermitDate = "";
        learnerPermitNumber = "";
        roadTestDate = "";
        createdAt = "";
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
            instructor_number: instructorNumber,
            instructor_name: instructorName,
            email,
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
        } catch {
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
            instructor_number: instructorNumber,
            instructor_name: instructorName,
            email,
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
        } catch {
            alert("修改失敗");
        }
    }

    async function handleDelete() {
        if (!isEditing || !currentStudentId) {
            alert("請先查詢到學員才能刪除");
            return;
        }
        if (!confirm("確定要刪除此學員資料嗎？")) return;
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
        } catch {
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
        <div class="flex items-center gap-4">
            <div class="flex-1">
                <GlassInput
                    placeholder="輸入學號、姓名或身分證字號搜尋..."
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

    <!-- 學員基本資料 -->
    <GlassCard>
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-charcoal-800">
                📝 學員基本資料
            </h2>
            {#if isEditing}
                <span
                    class="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full font-medium"
                    >編輯模式</span
                >
            {/if}
        </div>

        <!-- 訓練類別（整合下拉選單）-->
        <div class="mb-6">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    /></svg
                >
                訓練分類
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-3">
                <div class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-3 md:col-span-5 flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-charcoal-700"
                        >訓練班別</label
                    >
                    <select
                        class="h-10 w-full px-3 glass-input rounded-md text-charcoal-800 focus:outline-none"
                        value={trainingTypeCode}
                        onchange={handleTrainingTypeChange}
                    >
                        <option value="">請選擇訓練班別</option>
                        {#each trainingTypes as t}
                            <option value={t.code}>{t.code} - {t.name}</option>
                        {/each}
                    </select>
                </div>
                <div class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-3 md:col-span-5 flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-charcoal-700"
                        >考照類別</label
                    >
                    <select
                        class="h-10 w-full px-3 glass-input rounded-md text-charcoal-800 focus:outline-none"
                        value={licenseTypeCode}
                        onchange={handleLicenseTypeChange}
                    >
                        <option value="">請選擇考照類別</option>
                        {#each licenseTypes as t}
                            <option value={t.code}>{t.code} - {t.name}</option>
                        {/each}
                    </select>
                </div>
                <div
                    class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-2 md:col-span-1 sm:col-span-3 md:col-span-2 flex flex-col gap-1.5"
                >
                    <label class="text-sm font-medium text-charcoal-700"
                        >梯次</label
                    >
                    <select
                        class="h-10 w-full px-2 glass-input rounded-md text-charcoal-800 text-center focus:outline-none"
                        bind:value={batch}
                    >
                        <option value="">-</option>
                        {#each batches as b}<option value={b}>{b}</option
                            >{/each}
                    </select>
                </div>
            </div>
        </div>

        <!-- 個人資料 -->
        <div class="mb-6">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    /></svg
                >
                個人資料
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-3">
                <div
                    class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-3 md:col-span-1 sm:col-span-3 md:col-span-3 flex flex-col gap-1.5"
                >
                    <label class="text-sm font-medium text-charcoal-700"
                        >學員編號</label
                    >
                    <input
                        type="text"
                        class="h-10 w-full px-3 glass-input rounded-md text-charcoal-800 focus:outline-none"
                        placeholder="xxx-xxx"
                        maxlength="7"
                        value={studentNumber}
                        oninput={handleStudentNumberInput}
                    />
                </div>
                <GlassInput
                    label="姓名"
                    bind:value={studentName}
                    class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-3 md:col-span-1 sm:col-span-3 md:col-span-3"
                />
                <GlassInput
                    label="身分證號"
                    bind:value={nationalIdNo}
                    class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-3 md:col-span-1 sm:col-span-3 md:col-span-3"
                />
                <div
                    class="col-span-1 sm:col-span-1 md:col-span-1 flex flex-col gap-1.5"
                >
                    <label class="text-sm font-medium text-charcoal-700"
                        >郵遞區號</label
                    >
                    <input
                        type="text"
                        class="h-10 w-full px-2 glass-input rounded-md text-charcoal-800 text-center"
                        bind:value={rAddressZipCode}
                    />
                </div>
                <div
                    class="col-span-1 sm:col-span-1 md:col-span-1 flex flex-col gap-1.5"
                >
                    <label class="text-sm font-medium text-charcoal-700"
                        >性別</label
                    >
                    <select
                        class="h-10 w-full px-2 glass-input rounded-md text-charcoal-800 text-center focus:outline-none"
                        bind:value={gender}
                    >
                        <option value="">-</option>
                        {#each genders as g}<option value={g}>{g}</option
                            >{/each}
                    </select>
                </div>
                <GlassInput
                    label="出生日期"
                    type="date"
                    bind:value={birthDate}
                    class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-3 md:col-span-1 sm:col-span-3 md:col-span-2"
                />
                <div
                    class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-3 md:col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-3 md:col-span-4 flex flex-col gap-1.5"
                >
                    <label class="text-sm font-medium text-charcoal-700"
                        >指導教練</label
                    >
                    <select
                        class="h-10 w-full px-3 glass-input rounded-md text-charcoal-800 focus:outline-none"
                        value={instructorNumber}
                        onchange={handleInstructorChange}
                    >
                        <option value="">請選擇教練</option>
                        {#each instructors as i}
                            <option value={i.number}
                                >{i.number} - {i.name}</option
                            >
                        {/each}
                    </select>
                </div>
            </div>
        </div>

        <!-- 聯絡資訊 -->
        <div class="mb-6">
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    /></svg
                >
                聯絡資訊
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-3">
                <GlassInput
                    label="手機"
                    bind:value={mobilePhone}
                    class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-3 md:col-span-1 sm:col-span-3 md:col-span-3"
                />
                <GlassInput
                    label="室內電話"
                    bind:value={homePhone}
                    class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-3 md:col-span-1 sm:col-span-3 md:col-span-3"
                />
                <GlassInput
                    label="電子郵件"
                    type="email"
                    bind:value={email}
                    class="col-span-1 sm:col-span-1 sm:col-span-6 md:col-span-6 md:col-span-1 sm:col-span-6 md:col-span-6"
                />
            </div>
        </div>

        <!-- 戶籍地址 -->
        <div class="mb-6">
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
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    /></svg
                >
                戶籍地址
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-3">
                <div
                    class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-2 md:col-span-1 sm:col-span-3 md:col-span-2 flex flex-col gap-1.5"
                >
                    <label class="text-sm font-medium text-charcoal-700"
                        >縣市</label
                    >
                    <select
                        class="h-10 w-full px-2 glass-input rounded-md text-charcoal-800 focus:outline-none"
                        value={rCity}
                        onchange={handleRCityChange}
                    >
                        <option value="">選擇縣市</option>
                        {#each getCities() as city}<option value={city}
                                >{city}</option
                            >{/each}
                    </select>
                </div>
                <div
                    class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-2 md:col-span-1 sm:col-span-3 md:col-span-2 flex flex-col gap-1.5"
                >
                    <label class="text-sm font-medium text-charcoal-700"
                        >區域</label
                    >
                    <select
                        class="h-10 w-full px-2 glass-input rounded-md text-charcoal-800 focus:outline-none"
                        value={rDistrict}
                        onchange={handleRDistrictChange}
                        disabled={!rCity}
                    >
                        <option value="">選擇區域</option>
                        {#each getDistricts(rCity) as district}<option
                                value={district}>{district}</option
                            >{/each}
                    </select>
                </div>
                <div
                    class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-2 md:col-span-1 flex flex-col gap-1.5"
                >
                    <label class="text-sm font-medium text-charcoal-700"
                        >郵遞區號</label
                    >
                    <input
                        type="text"
                        class="h-10 w-full px-2 glass-input rounded-md text-charcoal-800 text-center"
                        bind:value={rAddressZipCode}
                    />
                </div>
                <GlassInput
                    label="詳細地址"
                    bind:value={rAddress}
                    class="col-span-1 sm:col-span-1 sm:col-span-6 md:col-span-6 md:col-span-7"
                />
            </div>
        </div>

        <!-- 通訊地址 -->
        <div class="mb-6">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    /><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path></svg
                >
                通訊地址
                <span class="ml-2 text-xs text-charcoal-400"
                    >（自動同步戶籍地址，可修改）</span
                >
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-3">
                <div
                    class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-2 md:col-span-1 sm:col-span-3 md:col-span-2 flex flex-col gap-1.5"
                >
                    <label class="text-sm font-medium text-charcoal-700"
                        >縣市</label
                    >
                    <select
                        class="h-10 w-full px-2 glass-input rounded-md text-charcoal-800 focus:outline-none"
                        value={mCity}
                        onchange={handleMCityChange}
                    >
                        <option value="">選擇縣市</option>
                        {#each getCities() as city}<option value={city}
                                >{city}</option
                            >{/each}
                    </select>
                </div>
                <div
                    class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-2 md:col-span-1 sm:col-span-3 md:col-span-2 flex flex-col gap-1.5"
                >
                    <label class="text-sm font-medium text-charcoal-700"
                        >區域</label
                    >
                    <select
                        class="h-10 w-full px-2 glass-input rounded-md text-charcoal-800 focus:outline-none"
                        value={mDistrict}
                        onchange={handleMDistrictChange}
                        disabled={!mCity}
                    >
                        <option value="">選擇區域</option>
                        {#each getDistricts(mCity) as district}<option
                                value={district}>{district}</option
                            >{/each}
                    </select>
                </div>
                <div
                    class="col-span-1 sm:col-span-1 sm:col-span-3 md:col-span-2 md:col-span-1 flex flex-col gap-1.5"
                >
                    <label class="text-sm font-medium text-charcoal-700"
                        >郵遞區號</label
                    >
                    <input
                        type="text"
                        class="h-10 w-full px-2 glass-input rounded-md text-charcoal-800 text-center"
                        bind:value={mAddressZipCode}
                    />
                </div>
                <GlassInput
                    label="詳細地址"
                    bind:value={mAddress}
                    class="col-span-1 sm:col-span-1 sm:col-span-6 md:col-span-6 md:col-span-7"
                />
            </div>
        </div>
    </GlassCard>

    <!-- 學員狀態資料（唯讀）-->
    <GlassCard variant="subtle">
        <h2 class="text-lg font-semibold text-charcoal-800 mb-4">
            📊 學員狀態資料（唯讀）
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">退訓狀態</span><span
                    class="text-charcoal-800 font-medium">{dropout || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">名冊號碼</span><span
                    class="text-charcoal-800 font-medium"
                    >{registerNumber || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">學照日期</span><span
                    class="text-charcoal-800 font-medium"
                    >{learnerPermitDate || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">學照號碼</span><span
                    class="text-charcoal-800 font-medium"
                    >{learnerPermitNumber || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">路試日期</span><span
                    class="text-charcoal-800 font-medium"
                    >{roadTestDate || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">建檔日期</span><span
                    class="text-charcoal-800 font-medium"
                    >{createdAt || "-"}</span
                >
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
</div>
