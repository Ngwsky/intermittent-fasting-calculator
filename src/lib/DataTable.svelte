<script lang="ts">
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import Checkbox from '@smui/checkbox';

	type Header = {
		text: string;
		value: string;
		align?: 'start' | 'center' | 'end';
		sortable?: boolean;
		filterable?: boolean;
		groupable?: boolean;
		divider?: boolean;
		class?: string | string[];
		cellClass?: string | string[];
		width?: string | number;
		filter?: (value: any, search: string, item: any) => boolean;
		sort?: (a: any, b: any) => number;
	};

	export let headers: Header[] = [];
	export let items: any[] = [];
	export let showSelect: boolean = false;
	export let value: any[] = [];
	export let singleSelect: boolean = false;
	export let height: number = 0;
	/*
	export let bench: number = 0;
	export let multiSort: boolean = false;
	export let locale: string = '';
	export let dense: boolean = false;
    */

	let refItems: readonly any[] = [];
	let filteredAndSortedItems: readonly any[] = [];
	let vitems: readonly any[] = [];

	function createRefItems(itemlist: any[]) {
		console.debug('createRefItems', itemlist);
		return Object.freeze(
			itemlist.map((i) => {
				return { item: i, __selected: false };
			})
		);
	}

	function updateSelected(selectedItemList: any[]) {
		refItems.forEach((i) => {
			i.__selected = selectedItemList.some((si) => {
				return headers.findIndex((h) => si[h.value] != i.item[h.value]) === -1;
			});
			return i;
		});
		console.debug('updateSelected', selectedItemList, refItems);
	}

	$: {
		refItems = createRefItems(items.slice());
	}

	$: {
		updateSelected(value);
	}

	$: {
		filteredAndSortedItems = Object.freeze(
			refItems.map((v, i) => {
				return { ...v, __itemIndex: i };
			})
		);
		console.debug('filteredAndSortedItems', filteredAndSortedItems);
	}

	$: vitems = Object.freeze(filteredAndSortedItems.slice());

	function selectRow(event: any, rownum: number) {
		console.debug('selectRow', event);
		const itemindex = vitems[rownum].__itemIndex;
		const filterditemindex = filteredAndSortedItems.findIndex((fi) => fi.__itemIndex === itemindex);

		refItems[itemindex].__selected = !refItems[itemindex].__selected;
		filteredAndSortedItems[filterditemindex].__selected =
			!filteredAndSortedItems[filterditemindex].__selected;
		if (singleSelect) {
			value = [];
			refItems.forEach((ci, i) => {
				if (i !== itemindex) ci.__selected = false;
			});
			filteredAndSortedItems.forEach((fi) => {
				if (fi.__itemIndex !== itemindex) fi.__selected = false;
			});
		}

		value = items.filter((item, index) => refItems[index].__selected);
	}
</script>

<DataTable
	stickyHeader
	style={'width: 100%; overflow: auto;' + (height ? 'height:' + height + 'px;' : '')}
>
	<Head>
		<Row>
			{#if showSelect}
				<Cell checkbox>
					{#if !singleSelect}
						<Checkbox />
					{/if}
				</Cell>
			{/if}
			{#each headers as header}
				<Cell>{header.text}</Cell>
			{/each}
		</Row>
	</Head>
	<Body>
		{#each vitems as vitem, i}
			<Row>
				{#if showSelect}
					<Cell checkbox>
						<Checkbox on:change={(e) => selectRow(e, i)} checked={vitem.__selected} />
					</Cell>
				{/if}
				{#each headers as header}
					<Cell>{vitem.item[header.value]}</Cell>
				{/each}
			</Row>
		{/each}
	</Body>
</DataTable>

<style>
</style>
