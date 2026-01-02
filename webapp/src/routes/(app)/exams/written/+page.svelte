<script lang="ts">
    import {
        GlassCard,
        GlassButton,
        GlassInput,
        GlassTable,
    } from "$lib/components";
    import { t } from "$lib/i18n";

    // 查詢區
    let searchStudentNumber = $state("");
    let searchStudentName = $state("");
    let searchNationalId = $state("");

    // 學員資料顯示區
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
        { key: "batch", label: "梯次", width: "60px" },
        { key: "student_number", label: "學員編號", width: "100px" },
        { key: "student_name", label: "學員姓名", width: "100px" },
        { key: "national_id_no", label: "身分證號碼", width: "120px" },
        { key: "birth_date", label: "出生日期", width: "100px" },
        { key: "exam_session", label: "場次", width: "60px" },
        { key: "written_test_date", label: "筆試日期", width: "100px" },
        { key: "exam_code", label: "代碼", width: "80px" },
    ];

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
        registerNumber = student.register_number || "";
        birthDate = student.birth_date || "";
        trainingTypeName = student.training_type_name || "";
        term = student.register_term || "";
        batch = student.batch || "";
    }

    function clearForm() {
        currentStudent = null;
        searchStudentNumber = "";
        searchStudentName = "";
        searchNationalId = "";
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

    function handlePrintSchool() {
        if (examList.length === 0) {
            alert("清冊為空");
            return;
        }
        alert("列印筆試清冊（駕訓班用）功能開發中");
    }

    function handlePrintOfficial() {
        if (examList.length === 0) {
            alert("清冊為空");
            return;
        }
        alert("列印筆試清冊（監理站用）功能開發中");
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
                label="身分證號碼"
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
                B. 學員資料顯示區（唯讀）
            </h2>
            {#if currentStudent}
                <span
                    class="text-sm text-green-600 bg-green-50 px-2 py-1 rounded"
                    >已選擇：{currentStudent.student_name}</span
                >
            {/if}
        </div>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">名冊號碼</span><span
                    class="font-medium">{registerNumber || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">出生日期</span><span
                    class="font-medium">{birthDate || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">訓練班別</span><span
                    class="font-medium">{trainingTypeName || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">期別</span><span
                    class="font-medium">{term || "-"}</span
                >
            </div>
            <div class="flex flex-col gap-1">
                <span class="text-sm text-charcoal-600">梯次</span><span
                    class="font-medium">{batch || "-"}</span
                >
            </div>
        </div>
    </GlassCard>

    <!-- C. 筆試登錄區 -->
    <GlassCard>
        <h2 class="text-lg font-semibold text-charcoal-800 mb-4">
            C. 筆試登錄區
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <GlassInput
                label="筆試日期"
                type="date"
                bind:value={writtenTestDate}
            />
            <GlassInput label="場次" bind:value={examSession} />
            <GlassInput
                label="號碼"
                value={autoExamNumber}
                disabled
                hint="自動生成"
            />
            <GlassInput label="代碼" bind:value={examCode} />
        </div>
        <div class="flex flex-wrap gap-3 pt-4 border-t border-charcoal-800/10">
            <GlassButton variant="primary" onclick={handleAddToExam}
                >新增筆試清冊</GlassButton
            >
            <GlassButton variant="secondary" onclick={handlePrintOfficial}
                >列印筆試清冊（監理站用）</GlassButton
            >
            <GlassButton variant="secondary" onclick={handlePrintSchool}
                >列印筆試清冊（駕訓班用）</GlassButton
            >
            <GlassButton variant="secondary" onclick={handleExport}
                >匯出筆試清冊文件</GlassButton
            >
            <GlassButton variant="ghost" onclick={clearForm}>清除</GlassButton>
        </div>
    </GlassCard>

    <!-- 筆試清冊 -->
    <GlassCard padding="none">
        <div class="p-4 border-b border-charcoal-800/10">
            <h2 class="text-lg font-semibold text-charcoal-800">筆試清冊</h2>
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
