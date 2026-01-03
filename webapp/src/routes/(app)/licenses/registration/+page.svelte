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
    let licenseTypeName = $state("");
    let birthDate = $state("");
    let rAddressZipCode = $state("");
    let rAddressCity = $state("");
    let rAddress = $state("");
    let registrationDate = $state("");
    let learnerPermitDate = $state("");
    let learnerPermitNumber = $state("");
    let registrationList = $state<any[]>([]);

    const columns = [
        { key: "learner_permit_date", label: "學照日期", width: "100px" },
        { key: "learner_permit_number", label: "學照號碼", width: "120px" },
        { key: "student_number", label: "學員編號", width: "100px" },
        { key: "student_name", label: "學員姓名", width: "100px" },
        { key: "license_type_name", label: "考照類別", width: "100px" },
    ];

    $effect(() => {
        if (registrationDate && !learnerPermitDate) {
            learnerPermitDate = registrationDate;
        }
    });

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
        licenseTypeName = student.license_type_name || "";
        birthDate = student.birth_date || "";
        rAddressZipCode = student.r_address_zip_code || "";
        rAddressCity = student.r_address_city || "";
        rAddress = student.r_address || "";
    }

    function clearForm() {
        currentStudent = null;
        searchQuery = "";
        licenseTypeName = "";
        birthDate = "";
        rAddressZipCode = "";
        rAddressCity = "";
        rAddress = "";
        registrationDate = "";
        learnerPermitDate = "";
        learnerPermitNumber = "";
    }

    async function handleRegistration() {
        if (!currentStudent) {
            alert("請先查詢並選擇一位學員");
            return;
        }
        if (!learnerPermitDate || !learnerPermitNumber) {
            alert("請填寫學照日期和學照號碼");
            return;
        }
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
    <div>
        <h1 class="text-2xl font-bold text-charcoal-800">
            {t("nav.licenseRegistration")}
        </h1>
        <p class="mt-1 text-charcoal-600">
            登錄學員取得學習駕照後的「學照日期」與「學照號碼」
        </p>
    </div>

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
                    placeholder="輸入學員編號、姓名、身分證字號或手機搜尋..."
                    bind:value={searchQuery}
                    onkeydown={(e) => e.key === "Enter" && searchStudent()}
                />
            </div>
            <GlassButton variant="primary" onclick={searchStudent}
                ><svg
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
                >搜尋</GlassButton
            >
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
                <span class="text-sm text-charcoal-500">考照類別</span><span
                    class="text-charcoal-800 font-medium"
                    >{licenseTypeName || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-500">出生日期</span><span
                    class="text-charcoal-800 font-medium"
                    >{birthDate || "-"}</span
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
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                /></svg
            >
            學照登錄
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-4">
            <GlassInput
                label="登錄日期"
                type="date"
                bind:value={registrationDate}
                hint="會自動同步到學照日期"
                class="col-span-1 sm:col-span-3 md:col-span-4"
            />
            <GlassInput
                label="學照日期"
                type="date"
                bind:value={learnerPermitDate}
                required
                class="col-span-1 sm:col-span-3 md:col-span-4"
            />
            <GlassInput
                label="學照號碼"
                bind:value={learnerPermitNumber}
                required
                class="col-span-1 sm:col-span-3 md:col-span-4"
            />
        </div>
    </GlassCard>

    <GlassCard padding="sm">
        <div class="flex flex-wrap items-center gap-3">
            <GlassButton variant="ghost" onclick={clearForm}
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
            <GlassButton variant="primary" onclick={handleRegistration}
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
                >學照日期登錄</GlassButton
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
                登錄清單
            </h2>
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
