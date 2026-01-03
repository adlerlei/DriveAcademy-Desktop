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
        isOpen?: boolean;
        onClose?: () => void;
        logo?: Snippet;
        footer?: Snippet;
    }

    let {
        items,
        currentPath,
        collapsed = false,
        isOpen = true,
        onClose,
        logo,
        footer,
    }: Props = $props();

    function isActive(href: string): boolean {
        if (href === "/") return currentPath === "/";
        return currentPath.startsWith(href);
    }

    function handleNavClick() {
        // 手機版點擊導航項目後關閉側邊欄
        if (onClose && window.innerWidth < 768) {
            onClose();
        }
    }
</script>

<!-- 遮罩層 (手機版) -->
{#if isOpen}
    <button
        class="fixed inset-0 bg-black/50 z-30 md:hidden"
        onclick={onClose}
        aria-label="關閉選單"
    ></button>
{/if}

<aside
    class="
        fixed left-0 top-0 h-screen
        glass-dark text-white
        flex flex-col
        transition-all duration-300 ease-out
        z-40
        {collapsed ? 'w-16' : 'w-64'}
        {isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
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
                        onclick={handleNavClick}
                        class="
                            flex items-center gap-3 px-3 py-2.5 rounded-md
                            transition-all duration-200 ease-out
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
