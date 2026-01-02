<script lang="ts">
	import type { Snippet } from 'svelte';
	
	interface Props {
		variant?: 'default' | 'subtle' | 'elevated';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		class?: string;
		children: Snippet;
	}
	
	let { 
		variant = 'default', 
		padding = 'md',
		class: className = '',
		children 
	}: Props = $props();
	
	const variants = {
		default: 'glass shadow-[var(--shadow-glass)]',
		subtle: 'glass-subtle',
		elevated: 'glass shadow-[var(--shadow-glass-lg)]'
	};
	
	const paddings = {
		none: '',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8'
	};
</script>

<div 
	class="rounded-xl transition-all duration-[var(--duration-normal)] ease-[var(--ease-smooth)] {variants[variant]} {paddings[padding]} {className}"
>
	{@render children()}
</div>
