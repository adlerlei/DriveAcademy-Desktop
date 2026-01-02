<script lang="ts">
    import { GlassCard, GlassButton } from "$lib/components";
    import { t } from "$lib/i18n";
</script>

<div class="space-y-8">
    <!-- Page Header -->
    <div>
        <h1 class="text-3xl font-bold text-charcoal-800">
            {t("app.title")}
        </h1>
        <p class="mt-2 text-charcoal-600">
            歡迎使用 DriveAcademy 駕訓學員管理系統
        </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard variant="elevated">
            <div class="flex items-center gap-4">
                <div
                    class="w-12 h-12 rounded-xl bg-amber-400/20 flex items-center justify-center"
                >
                    <svg
                        class="w-6 h-6 text-amber-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-charcoal-600">學員總數</p>
                    <p class="text-2xl font-bold text-charcoal-800">--</p>
                </div>
            </div>
        </GlassCard>

        <GlassCard variant="elevated">
            <div class="flex items-center gap-4">
                <div
                    class="w-12 h-12 rounded-xl bg-emerald-400/20 flex items-center justify-center"
                >
                    <svg
                        class="w-6 h-6 text-emerald-600"
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
                </div>
                <div>
                    <p class="text-sm text-charcoal-600">本期結訓</p>
                    <p class="text-2xl font-bold text-charcoal-800">--</p>
                </div>
            </div>
        </GlassCard>

        <GlassCard variant="elevated">
            <div class="flex items-center gap-4">
                <div
                    class="w-12 h-12 rounded-xl bg-blue-400/20 flex items-center justify-center"
                >
                    <svg
                        class="w-6 h-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-charcoal-600">本月考試</p>
                    <p class="text-2xl font-bold text-charcoal-800">--</p>
                </div>
            </div>
        </GlassCard>

        <GlassCard variant="elevated">
            <div class="flex items-center gap-4">
                <div
                    class="w-12 h-12 rounded-xl bg-purple-400/20 flex items-center justify-center"
                >
                    <svg
                        class="w-6 h-6 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-charcoal-600">教練人數</p>
                    <p class="text-2xl font-bold text-charcoal-800">--</p>
                </div>
            </div>
        </GlassCard>
    </div>

    <!-- Quick Actions -->
    <GlassCard>
        <h2 class="text-lg font-semibold text-charcoal-800 mb-4">快速操作</h2>
        <div class="flex flex-wrap gap-3">
            <GlassButton
                variant="primary"
                onclick={() => (window.location.href = "/students")}
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
                新增學員
            </GlassButton>
            <GlassButton
                variant="secondary"
                onclick={() => (window.location.href = "/rosters/opening")}
            >
                開訓名冊
            </GlassButton>
            <GlassButton
                variant="secondary"
                onclick={() => (window.location.href = "/exams/written")}
            >
                筆試清冊
            </GlassButton>
        </div>
    </GlassCard>
</div>
