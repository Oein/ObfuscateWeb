<script lang="ts">
	import { Container, Input, Textarea } from '@team.poi/svelteui';
	import { obfuscate } from 'javascript-obfuscator';
	import { mg } from './x';

	let v: string;
	let res: string = '';
	let v2 = '';
	let resa = '';
</script>

<div style="height: 1rem;" />
<Textarea
	placeholder="Put your code here"
	bind:value={v}
	on:keyup={() => {
		let a = obfuscate(v).getObfuscatedCode();
		a = obfuscate(a).getObfuscatedCode();
		res = a;
	}}
/>
<div style="height: 1rem;" />
<Textarea readonly placeholder="Result" bind:value={res} textareaStyle="height: 5rem;" />
<div style="height: 1rem;" />
<Textarea
	placeholder="Put your array here"
	bind:value={v2}
	on:keyup={() => {
		// @ts-ignore
		let a = eval(v2);
		resa = mg(a);
	}}
/>
<div style="height: 1rem;" />
<Textarea readonly placeholder="Result" bind:value={resa} textareaStyle="height: 5rem;" />
