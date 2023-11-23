<script>
	import '@/styles/global.css';
	import { ThemeProvider } from '@team.poi/svelteui';
</script>

<div class="App">
	<ThemeProvider>
		<div class="wrp">
			<slot />
		</div>
	</ThemeProvider>
</div>

<style>
	.wrp {
		width: 100vw;
		height: 100vh;
		height: 100dvh;
		overflow-y: auto;
		overflow-x: hidden;
		box-sizing: border-box;
		padding: 0px 1rem;
	}
</style>
