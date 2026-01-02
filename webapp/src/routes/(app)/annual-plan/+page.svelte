<script lang="ts">
    import {
        GlassCard,
        GlassButton,
        GlassInput,
        GlassTable,
    } from "$lib/components";
    import { t } from "$lib/i18n";

    // 固定資料：訓練班別
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

    // 固定資料：梯次
    const batches = ["A", "B"];

    // 表單狀態
    let trainingTypeCode = $state("");
    let trainingTypeName = $state("");
    let batch = $state("");
    let term = $state("");
    let year = $state("");
    let termClassCode = $state(""); // 自動生成
    let startDate = $state("");
    let endDate = $state("");

    // 列表資料
    let plans = $state<any[]>([]);
    let loading = $state(true);
    let selectedRows = $state<Set<number>>(new Set());

    // 根據規格文件的列表欄位順序
    const columns = [
        { key: "training_type_name", label: "訓練班別名稱", width: "140px" },
        { key: "year", label: "年度", width: "80px" },
        { key: "term", label: "期別編號", width: "80px" },
        { key: "start_date", label: "開訓日期", width: "120px" },
        { key: "end_date", label: "結訓日期", width: "120px" },
        { key: "term_class_code", label: "上課期別代碼", width: "120px" },
    ];

    // 連動：訓練班別代碼 -> 名稱
    function handleTrainingCodeChange(e: Event) {
        const code = (e.target as HTMLSelectElement).value;
        trainingTypeCode = code;
        const found = trainingTypes.find((t) => t.code === code);
        trainingTypeName = found?.name || "";
        updateTermClassCode();
    }

    // 連動：訓練班別名稱 -> 代碼
    function handleTrainingNameChange(e: Event) {
        const name = (e.target as HTMLSelectElement).value;
        trainingTypeName = name;
        const found = trainingTypes.find((t) => t.name === name);
        trainingTypeCode = found?.code || "";
        updateTermClassCode();
    }

    // 自動生成上課期別代碼：訓練班別代碼 + 0 + 期別 + 梯次
    function updateTermClassCode() {
        if (trainingTypeCode && term && batch) {
            termClassCode = `${trainingTypeCode}0${term}${batch}`;
        } else {
            termClassCode = "";
        }
    }

    // 監聽 term 和 batch 變化，自動更新期別代碼
    $effect(() => {
        // 明確讀取響應式變數以追蹤依賴
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
            // const res = await fetch('/api/annual-plans');
            // if (res.ok) plans = await res.json();
            plans = [];
        } catch (error) {
            console.error("Failed to fetch plans:", error);
        } finally {
            loading = false;
        }
    }

    // 清除表單
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

    // 新增
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
            // await fetch('/api/annual-plans', { method: 'POST', body: JSON.stringify(data) });
            console.log("Add plan:", data);
            alert("新增成功！");
            clearForm();
            fetchPlans();
        } catch (error) {
            console.error("Failed to add plan:", error);
            alert("新增失敗");
        }
    }

    // 刪除選中項目
    async function handleDelete() {
        if (selectedRows.size === 0) {
            alert("請先在列表中選擇要刪除的項目");
            return;
        }

        if (!confirm(`確定要刪除選中的 ${selectedRows.size} 筆資料嗎？`)) {
            return;
        }

        try {
            // TODO: 連接實際 API 刪除
            console.log("Delete rows:", Array.from(selectedRows));
            alert("刪除成功！");
            selectedRows = new Set();
            fetchPlans();
        } catch (error) {
            console.error("Failed to delete:", error);
            alert("刪除失敗");
        }
    }

    // 匯出文件
    function handleExport() {
        if (plans.length === 0) {
            alert("沒有資料可匯出");
            return;
        }
        // TODO: 實作匯出功能
        console.log("Export plans");
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
            建立駕訓班的年度開班計畫，包含設定各班別的期別、梯次與開/結訓日期
        </p>
    </div>

    <!-- 輸入區塊 -->
    <GlassCard>
        <h2 class="text-lg font-semibold text-charcoal-800 mb-4">
            新增期別資料
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- 訓練班別代碼 (連動下拉) -->
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >訓練班別代碼 <span class="text-coral-500">*</span></label
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

            <!-- 訓練班別名稱 (連動下拉) -->
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >訓練班別名稱 <span class="text-coral-500">*</span></label
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

            <!-- 梯次 (下拉) -->
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-charcoal-700"
                    >梯次 <span class="text-coral-500">*</span></label
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

            <!-- 期別 -->
            <GlassInput
                label="期別"
                placeholder="例：01"
                bind:value={term}
                oninput={() => updateTermClassCode()}
            />

            <!-- 年度 -->
            <GlassInput label="年度" placeholder="例：113" bind:value={year} />

            <!-- 上課期別代碼 (自動生成) -->
            <GlassInput
                label="上課期別代碼"
                value={termClassCode}
                disabled
                hint="自動生成：訓練班別代碼 + 0 + 期別 + 梯次"
            />

            <!-- 開訓日期 -->
            <GlassInput label="開訓日期" type="date" bind:value={startDate} />

            <!-- 結訓日期 -->
            <GlassInput label="結訓日期" type="date" bind:value={endDate} />
        </div>

        <!-- 功能按鈕 -->
        <div
            class="flex flex-wrap gap-3 mt-6 pt-4 border-t border-charcoal-800/10"
        >
            <GlassButton variant="primary" onclick={handleAdd}>
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
            <GlassButton variant="danger" onclick={handleDelete}>
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
            <GlassButton variant="ghost" onclick={clearForm}>清除</GlassButton>
        </div>
    </GlassCard>

    <!-- 資料列表 -->
    <GlassCard padding="none">
        <div class="p-4 border-b border-charcoal-800/10">
            <h2 class="text-lg font-semibold text-charcoal-800">
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
