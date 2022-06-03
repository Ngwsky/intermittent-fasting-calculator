<script lang="ts">
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import Checkbox from '@smui/checkbox';

	export let headers: string[] = [];
	export let values: boolean[] = [];
</script>

<DataTable style="width: 100%; overflow: auto;">
	<Head>
		<Row>
			{#each headers as header}
				<Cell class="text-center">{header}</Cell>
			{/each}
		</Row>
	</Head>
	<Body>
		<Row>
			{#each values as value}
				<Cell class="text-center" checkbox>
					<Checkbox bind:checked={value} />
				</Cell>
			{/each}
		</Row>
	</Body>
</DataTable>

<style global>
	.text-center {
		text-align: center;
	}
</style>
