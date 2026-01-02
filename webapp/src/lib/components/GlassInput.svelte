<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    interface Props extends HTMLInputAttributes {
        label?: string;
        error?: string;
        hint?: string;
        value?: string;
    }

    let {
        label,
        error,
        hint,
        id,
        value = $bindable(""),
        class: className = "",
        ...restProps
    }: Props = $props();

    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
</script>

<div class="flex flex-col gap-1.5 {className}">
    {#if label}
        <label for={inputId} class="text-sm font-medium text-charcoal-700">
            {label}
            {#if restProps.required}
                <span class="text-coral-500">*</span>
            {/if}
        </label>
    {/if}

    <input
        id={inputId}
        bind:value
        class="
			h-10 w-full px-4
			glass rounded-lg
			text-charcoal-800 placeholder:text-charcoal-600/50
			transition-all duration-[var(--duration-normal)] ease-[var(--ease-smooth)]
			focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-ivory-50
			disabled:opacity-50 disabled:cursor-not-allowed
			{error ? 'ring-2 ring-coral-400/50' : 'border border-charcoal-800/10'}
		"
        {...restProps}
    />

    {#if error}
        <p class="text-sm text-coral-500">{error}</p>
    {:else if hint}
        <p class="text-sm text-charcoal-600/70">{hint}</p>
    {/if}
</div>
