<script lang='ts'>
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-modern.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
</script>

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-200/5 w-56 p-4">

<svelte:fragment slot="sidebarLeft">
	<!-- Insert the list: -->
	<nav class="list-nav text-blue-400">
		<ul>
			<li><a href="/chat">Home</a></li>
			<li><a href="/about">About</a></li>
			<li><a href="/chat">Chat</a></li>
		</ul>
	</nav>
	<!-- --- -->
</svelte:fragment>

	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<a class="text-xl uppercase" href="../" >DATA CHAT</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />

</AppShell>
