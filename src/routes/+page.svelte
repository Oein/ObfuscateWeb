<script lang="ts">
	import { Container, Input, Textarea } from '@team.poi/svelteui';
	import { obfuscate } from 'javascript-obfuscator';
	import { getCode, mg } from './x';

	let v: string;
	let res: string = '';
	let v2 = '';
	let resa = '';
	let v3 = '';
	let resb = '';
</script>

<h1>Obfuscate code</h1>
<Textarea
	placeholder="Put your code here"
	bind:value={v}
	on:keyup={() => {
		const opt = {
			compact: true,
			numbersToExpressions: true,
			simplify: true,
			identifierNamesGenerator: 'mangled-shuffled',
			stringArray: true,
			stringArrayRotate: true,
			stringArrayShuffle: true,
			stringArrayIndexShift: true,
			stringArrayIndexesType: ['hexadecimal-number', 'hexadecimal-numeric-string'],
			stringArrayWrappersCount: 3,
			stringArrayWrappersType: 'function',
			stringArrayWrappersParametersMaxCount: 5,
			stringArrayWrappersChainedCalls: true,
			splitStrings: true,
			splitStringsChunkLength: 10
		};
		// @ts-ignore
		let a = obfuscate(v, opt).getObfuscatedCode();
		// @ts-ignore
		a = obfuscate(a, opt).getObfuscatedCode();
		res = a;
	}}
/>
<div style="height: 1rem;" />
<Textarea readonly placeholder="Result" bind:value={res} textareaStyle="height: 5rem;" />
<h1>Obfuscate string array</h1>
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
<h1>Obfuscate string</h1>
<Textarea
	placeholder="Put your string here"
	bind:value={v3}
	on:keyup={() => {
		// @ts-ignore
		resb = getCode(v3);
	}}
/>
<div style="height: 1rem;" />
<Textarea readonly placeholder="Result" bind:value={resb} textareaStyle="height: 5rem;" />
<div style="height: 1rem;" />
