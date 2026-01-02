<script lang="ts">
    import {
        GlassCard,
        GlassButton,
        GlassInput,
        GlassTable,
    } from "$lib/components";
    import { t } from "$lib/i18n";

    // 固定資料
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

    const batches = ["A", "B"];

    // 表單狀態
    let trainingTypeCode = $state("");
    let trainingTypeName = $state("");
    let batch = $state("");
    let term = $state("");
    let year = $state("");
    let termClassCode = $state("");
    let startDate = $state("");
    let endDate = $state("");

    // 列表資料
    let plans = $state<any[]>([]);
    let loading = $state(true);
    let selectedRows = $state<Set<number>>(new Set());

    const columns = [
        { key: "training_type_name", label: "訓練班別", width: "140px" },
        { key: "year", label: "年度", width: "80px" },
        { key: "term", label: "期別", width: "80px" },
        { key: "batch", label: "梯次", width: "60px" },
        { key: "start_date", label: "開訓日期", width: "120px" },
        { key: "end_date", label: "結訓日期", width: "120px" },
        { key: "term_class_code", label: "期別代碼", width: "100px" },
    ];

    // 整合下拉選單處理
    function handleTrainingTypeChange(e: Event) {
        const code = (e.target as HTMLSelectElement).value;
        trainingTypeCode = code;
        const found = trainingTypes.find((t) => t.code === code);
        trainingTypeName = found?.name || "";
    }

    // 自動生成上課期別代碼
    $effect(() => {
        const code = trainingTypeCode;
        const t = term;
        const b = batch;
        if (code && t && b) {
            termClassCode = `${code}0${t}${b}`;
        } else {
            termClassCode = "";
        }
    });

    // 載入資料
    $effect(() => {
        fetchPlans();
    });

    async function fetchPlans() {
        loading = true;
        try {
            // TODO: 連接實際 API
            plans = [];
        } catch (error) {
            console.error("Failed to fetch plans:", error);
        } finally {
            loading = false;
        }
    }

    function clearForm() {
        trainingTypeCode = "";
        trainingTypeName = "";
        batch = "";
        term = "";
        year = "";
        termClassCode = "";
        startDate = "";
        endDate = "";
    }

    async function handleAdd() {
        if (
            !trainingTypeCode ||
            !batch ||
            !term ||
            !year ||
            !startDate ||
            !endDate
        ) {
            alert("請填寫所有必填欄位");
            return;
        }
        const data = {
            training_type_code: trainingTypeCode,
            training_type_name: trainingTypeName,
            batch,
            term,
            year,
            term_class_code: termClassCode,
            start_date: startDate,
            end_date: endDate,
        };
        try {
            // TODO: 連接實際 API
            console.log("Add plan:", data);
            alert("新增成功！");
            clearForm();
            fetchPlans();
        } catch (error) {
            console.error("Failed to add plan:", error);
            alert("新增失敗");
        }
    }

    async function handleDelete() {
        if (selectedRows.size === 0) {
            alert("請先在列表中選擇要刪除的項目");
            return;
        }
        if (!confirm(`確定要刪除選中的 ${selectedRows.size} 筆資料嗎？`))
            return;
        try {
            console.log("Delete rows:", Array.from(selectedRows));
            alert("刪除成功！");
            selectedRows = new Set();
            fetchPlans();
        } catch {
            alert("刪除失敗");
        }
    }

    function handleExport() {
        if (plans.length === 0) {
            alert("沒有資料可匯出");
            return;
        }
        alert("匯出功能開發中");
    }
</script>

<div class="space-y-6">
    <!-- 頁面標題 -->
    <div>
        <h1 class="text-2xl font-bold text-charcoal-800">
            {t("nav.annualPlan")}
        </h1>
        <p class="mt-1 text-charcoal-600">
            建立駕訓班的年度開班計畫，設定各班別的期別、梯次與開結訓日期
        </p>
    </div>

    <!-- 新增期別資料 -->
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                /></svg
            >
            新增期別資料
        </h2>

        <!-- 班別設定 -->
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
                班別設定
            </h3>
            <div class="grid grid-cols-12 gap-3">
                <div class="col-span-5 flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-charcoal-700"
                        >訓練班別 <span class="text-coral-500">*</span></label
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
                <div class="col-span-2 flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-charcoal-700"
                        >梯次 <span class="text-coral-500">*</span></label
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
                <GlassInput
                    label="期別"
                    placeholder="01"
                    bind:value={term}
                    class="col-span-2"
                />
                <GlassInput
                    label="年度"
                    placeholder="113"
                    bind:value={year}
                    class="col-span-3"
                />
            </div>
        </div>

        <!-- 日期設定 -->
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    /></svg
                >
                日期設定
            </h3>
            <div class="grid grid-cols-12 gap-3">
                <GlassInput
                    label="開訓日期"
                    type="date"
                    bind:value={startDate}
                    class="col-span-4"
                />
                <GlassInput
                    label="結訓日期"
                    type="date"
                    bind:value={endDate}
                    class="col-span-4"
                />
                <div class="col-span-4 flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-charcoal-700"
                        >期別代碼（自動生成）</label
                    >
                    <input
                        type="text"
                        class="h-10 w-full px-3 glass-input rounded-md text-charcoal-800 bg-charcoal-50"
                        value={termClassCode}
                        disabled
                    />
                </div>
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
            <GlassButton variant="primary" onclick={handleAdd}>
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
            <GlassButton variant="danger" onclick={handleDelete}>
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
        </div>
    </GlassCard>

    <!-- 資料列表 -->
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
                已儲存的年度期別計畫
            </h2>
        </div>
        <GlassTable
            {columns}
            data={plans}
            {loading}
            emptyMessage="暫無年度期別計畫資料"
        />
    </GlassCard>
</div>
