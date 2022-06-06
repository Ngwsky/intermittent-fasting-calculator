<script lang="ts">
	import { isLoading, locale, locales } from 'svelte-i18n';
	import type { TopAppBarComponentDev } from "@smui/top-app-bar";
	import TopAppBar, {
		Row,
		Section,
		Title,
		AutoAdjust,
	} from "@smui/top-app-bar";
	import IconButton from "@smui/icon-button";
	import { Icon } from "@smui/common";
	import { Svg } from "@smui/common/elements";
	import { mdiGithub } from "@mdi/js";
	import Home from "./routes/Home.svelte";
	import Select, { Option } from "@smui/select";
	import language2text from "./lib/lang";

	let topAppBar: TopAppBarComponentDev;
	let darkMode =
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-color-scheme: dark)").matches;

	function toggleTheme(dark: boolean) {
		if (typeof document !== "undefined") {
			let themeLink =
				document.head.querySelector<HTMLLinkElement>("#theme");
			if (!themeLink) {
				themeLink = document.createElement("link");
				themeLink.rel = "stylesheet";
				themeLink.id = "theme";
			}
			themeLink.href = `smui${dark ? "-dark" : ""}.css`;
			document.head
				.querySelector<HTMLLinkElement>('link[href$="smui-dark.css"]')
				?.insertAdjacentElement("afterend", themeLink);
		}
	}

	$: {
		toggleTheme(darkMode);
	}
</script>

{#if $isLoading}
    <p>Loading</p>
{:else}
<TopAppBar bind:this={topAppBar} class="bc-surface">
	<Row>
		<Section>
			<Title>IFC</Title>
		</Section>
		<Section align="end" toolbar>
			<IconButton aria-label="GitHub" href="https://github.com/ngwsky">
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiGithub} />
				</Icon>
			</IconButton>
			<IconButton on:click={() => (darkMode = !darkMode)} toggle>
				<Icon class="material-icons" on>dark_mode</Icon>
				<Icon class="material-icons">light_mode</Icon>
			</IconButton>
			<Select bind:value={$locale} class="w-mc">
				{#each $locales as locale}
					<Option value={locale}>{language2text[locale]}</Option>
				{/each}
			</Select>
		</Section>
	</Row>
</TopAppBar>
<AutoAdjust {topAppBar}>
	<div class="container pt-0">
		<Home />
	</div>
</AutoAdjust>
{/if}

<style global>
	.pt-0 {
		padding-top: 0;
	}
	.w-mc .mdc-select__anchor {
		width: min-content;
	}
</style>
