<script lang="ts">
	import "./layout.css";
	import { locale } from "$lib/i18n";
	import { onMount } from "svelte";

	let { children } = $props();

	onMount(() => {
		locale.init();
	});
</script>

<svelte:head>
	<title>DriveAcademy - 駕訓學員管理系統</title>
	<meta name="description" content="現代化的駕訓班學員管理系統" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		rel="preconnect"
		href="https://fonts.gstatic.com"
		crossorigin="anonymous"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}
