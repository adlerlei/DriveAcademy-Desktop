<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";
    import type { Snippet } from "svelte";

    interface Props extends HTMLInputAttributes {
        label?: string;
        error?: string;
        hint?: string;
        value?: string;
        icon?: Snippet;
    }

    let {
        label,
        error,
        hint,
        id,
        value = $bindable(""),
        icon,
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

    <div class="relative">
        {#if icon}
            <div
                class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style="color: #a2d2ff;"
            >
                {@render icon()}
            </div>
        {/if}
        <input
            id={inputId}
            bind:value
            class="
				h-10 w-full rounded-md
				glass-input
				text-charcoal-800
				focus:outline-none
				{icon ? 'pl-10 pr-4' : 'px-4'}
				{error ? 'ring-2 ring-coral-400/50 !border-coral-400' : ''}
			"
            {...restProps}
        />
    </div>

    {#if error}
        <p class="text-sm text-coral-500">{error}</p>
    {:else if hint}
        <p class="text-sm text-charcoal-600/70">{hint}</p>
    {/if}
</div>
