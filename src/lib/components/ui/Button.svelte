<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		onclick?: (event: MouseEvent) => void;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		type = 'button',
		disabled = false,
		onclick,
		children
	}: Props = $props();

	const variantStyles = {
		primary: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95',
		secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 active:scale-95',
		outline: 'border border-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-800/60 active:scale-95',
		ghost: 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
	};

	const sizeStyles = {
		sm: 'px-3 py-1.5 text-xs rounded-lg',
		md: 'px-5 py-2.5 text-sm rounded-full font-medium',
		lg: 'px-8 py-3.5 text-base rounded-full font-semibold'
	};
</script>

{#if href}
	<a
		{href}
		class="inline-flex items-center justify-center transition duration-200 {variantStyles[variant]} {sizeStyles[size]}"
	>
		{#if children}
			{@render children()}
		{/if}
	</a>
{:else}
	<button
		{type}
		{disabled}
		{onclick}
		class="inline-flex items-center justify-center transition duration-200 {variantStyles[variant]} {sizeStyles[size]} disabled:opacity-50 disabled:pointer-events-none"
	>
		{#if children}
			{@render children()}
		{/if}
	</button>
{/if}
