<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        open: boolean;
        onClose: () => void;
        title?: string;
        size?: "sm" | "md" | "lg" | "xl";
        children: Snippet;
        footer?: Snippet;
    }

    let {
        open,
        onClose,
        title,
        size = "md",
        children,
        footer,
    }: Props = $props();

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            onClose();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
    <!-- Backdrop -->
    <div
        class="fixed inset-0 z-50 bg-charcoal-900/40 backdrop-blur-sm flex items-center justify-center p-4"
        onclick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
    >
        <!-- Modal -->
        <div
            class="
				w-full {sizes[size]}
				glass shadow-[var(--shadow-glass-lg)] rounded-2xl
				flex flex-col max-h-[90vh]
				animate-in fade-in zoom-in-95 duration-200
			"
        >
            <!-- Header -->
            {#if title}
                <div
                    class="flex items-center justify-between px-6 py-4 border-b border-charcoal-800/10"
                >
                    <h2
                        id="modal-title"
                        class="text-lg font-semibold text-charcoal-800"
                    >
                        {title}
                    </h2>
                    <button
                        onclick={onClose}
                        class="w-8 h-8 rounded-md flex items-center justify-center text-charcoal-600 hover:bg-charcoal-800/5 transition-colors"
                        aria-label="關閉"
                    >
                        <svg
                            class="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            {/if}

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6">
                {@render children()}
            </div>

            <!-- Footer -->
            {#if footer}
                <div
                    class="px-6 py-4 border-t border-charcoal-800/10 bg-ivory-50/50"
                >
                    {@render footer()}
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes zoom-in-95 {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }

    .animate-in {
        animation:
            fade-in 200ms ease-out,
            zoom-in-95 200ms ease-out;
    }
</style>
