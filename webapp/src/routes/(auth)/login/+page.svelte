<script lang="ts">
    import { GlassCard, GlassButton, GlassInput } from "$lib/components";
    import { t } from "$lib/i18n";

    let username = $state("");
    let password = $state("");
    let loading = $state(false);
    let error = $state("");

    async function handleLogin(e: Event) {
        e.preventDefault();
        loading = true;
        error = "";

        try {
            // TODO: Implement actual login API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Redirect to app on success
            window.location.href = "/";
        } catch (err) {
            error = t("auth.invalidCredentials");
        } finally {
            loading = false;
        }
    }
</script>

<div
    class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-charcoal-800 via-charcoal-900 to-charcoal-800"
>
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
        <div
            class="absolute -top-40 -right-40 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl"
        ></div>
        <div
            class="absolute -bottom-40 -left-40 w-80 h-80 bg-coral-400/10 rounded-full blur-3xl"
        ></div>
    </div>

    <div class="relative w-full max-w-md">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
            <div
                class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg"
            >
                <svg
                    class="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                    />
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-white">DriveAcademy</h1>
            <p class="mt-1 text-white/60">駕訓學員管理系統</p>
        </div>

        <!-- Login Card -->
        <GlassCard variant="elevated" padding="lg">
            <form onsubmit={handleLogin} class="space-y-5">
                <GlassInput
                    label={t("auth.username")}
                    bind:value={username}
                    autocomplete="username"
                    required
                />

                <GlassInput
                    label={t("auth.password")}
                    type="password"
                    bind:value={password}
                    autocomplete="current-password"
                    required
                />

                {#if error}
                    <div
                        class="p-3 rounded-lg bg-coral-500/10 border border-coral-500/20 text-coral-600 text-sm"
                    >
                        {error}
                    </div>
                {/if}

                <GlassButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    class="w-full"
                    {loading}
                >
                    {loading ? t("common.loading") : t("auth.loginButton")}
                </GlassButton>
            </form>
        </GlassCard>

        <!-- Footer -->
        <p class="mt-6 text-center text-white/40 text-sm">
            © 2024 DriveAcademy. All rights reserved.
        </p>
    </div>
</div>
