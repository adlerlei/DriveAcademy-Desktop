<script lang="ts">
    import type { Snippet } from "svelte";

    interface NavItem {
        id: string;
        label: string;
        icon?: Snippet;
        href: string;
    }

    interface Props {
        items: NavItem[];
        currentPath: string;
        collapsed?: boolean;
        logo?: Snippet;
        footer?: Snippet;
    }

    let {
        items,
        currentPath,
        collapsed = false,
        logo,
        footer,
    }: Props = $props();

    function isActive(href: string): boolean {
        if (href === "/") return currentPath === "/";
        return currentPath.startsWith(href);
    }
</script>

<aside
    class="
		fixed left-0 top-0 h-screen
		glass-dark text-white
		flex flex-col
		transition-all duration-[var(--duration-slow)] ease-[var(--ease-smooth)]
		z-40
		{collapsed ? 'w-16' : 'w-64'}
	"
>
    <!-- Logo Area -->
    <div
        class="h-16 flex items-center justify-center border-b border-white/10 shrink-0"
    >
        {#if logo}
            {@render logo()}
        {:else}
            <span class="text-xl font-bold {collapsed ? 'hidden' : 'block'}">
                DriveAcademy
            </span>
            <span class="text-xl font-bold {collapsed ? 'block' : 'hidden'}">
                DA
            </span>
        {/if}
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-2">
        <ul class="space-y-1">
            {#each items as item (item.id)}
                <li>
                    <a
                        href={item.href}
                        class="
							flex items-center gap-3 px-3 py-2.5 rounded-md
							transition-all duration-[var(--duration-normal)] ease-[var(--ease-smooth)]
							{isActive(item.href)
                            ? 'bg-white/15 text-amber-400'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'}
						"
                        title={collapsed ? item.label : undefined}
                    >
                        {#if item.icon}
                            <span class="w-5 h-5 shrink-0">
                                {@render item.icon()}
                            </span>
                        {/if}
                        {#if !collapsed}
                            <span class="truncate">{item.label}</span>
                        {/if}
                    </a>
                </li>
            {/each}
        </ul>
    </nav>

    <!-- Footer -->
    {#if footer && !collapsed}
        <div class="p-4 border-t border-white/10 shrink-0">
            {@render footer()}
        </div>
    {/if}
</aside>
