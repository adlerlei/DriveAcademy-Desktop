<script lang="ts" generics="T extends Record<string, unknown>">
    import type { Snippet } from "svelte";

    interface Column<T> {
        key: keyof T | string;
        label: string;
        width?: string;
        align?: "left" | "center" | "right";
        render?: Snippet<[{ row: T; value: unknown }]>;
    }

    interface Props {
        columns: Column<T>[];
        data: T[];
        loading?: boolean;
        emptyMessage?: string;
        onRowClick?: (row: T) => void;
        rowKey?: keyof T;
    }

    let {
        columns,
        data,
        loading = false,
        emptyMessage = "暫無資料",
        onRowClick,
        rowKey = "id" as keyof T,
    }: Props = $props();

    function getCellValue(row: T, key: string): unknown {
        const keys = key.split(".");
        let value: unknown = row;
        for (const k of keys) {
            value = (value as Record<string, unknown>)?.[k];
        }
        return value;
    }

    const alignClasses = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };
</script>

<div class="glass rounded-xl overflow-hidden shadow-[var(--shadow-glass)]">
    <div class="overflow-x-auto -mx-px">
        <table class="w-full min-w-[640px]">
            <thead>
                <tr class="bg-charcoal-800/5 border-b border-charcoal-800/10">
                    {#each columns as column}
                        <th
                            class="
								px-4 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-600
								{alignClasses[column.align || 'left']}
							"
                            style={column.width ? `width: ${column.width}` : ""}
                        >
                            {column.label}
                        </th>
                    {/each}
                </tr>
            </thead>
            <tbody class="divide-y divide-charcoal-800/5">
                {#if loading}
                    <tr>
                        <td
                            colspan={columns.length}
                            class="px-4 py-12 text-center"
                        >
                            <div
                                class="flex items-center justify-center gap-2 text-charcoal-600"
                            >
                                <svg
                                    class="animate-spin h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    ></circle>
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <span>載入中...</span>
                            </div>
                        </td>
                    </tr>
                {:else if data.length === 0}
                    <tr>
                        <td
                            colspan={columns.length}
                            class="px-4 py-12 text-center text-charcoal-600"
                        >
                            {emptyMessage}
                        </td>
                    </tr>
                {:else}
                    {#each data as row (row[rowKey])}
                        <tr
                            class="
								transition-colors duration-[var(--duration-fast)]
								{onRowClick
                                ? 'cursor-pointer hover:bg-amber-400/5'
                                : 'hover:bg-charcoal-800/[0.02]'}
							"
                            onclick={() => onRowClick?.(row)}
                        >
                            {#each columns as column}
                                <td
                                    class="
										px-4 py-3 text-sm text-charcoal-800
										{alignClasses[column.align || 'left']}
									"
                                >
                                    {#if column.render}
                                        {@render column.render({
                                            row,
                                            value: getCellValue(
                                                row,
                                                String(column.key),
                                            ),
                                        })}
                                    {:else}
                                        {getCellValue(
                                            row,
                                            String(column.key),
                                        ) ?? "-"}
                                    {/if}
                                </td>
                            {/each}
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>
</div>
