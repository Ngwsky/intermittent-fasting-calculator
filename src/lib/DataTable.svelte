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
	export let radio: boolean = false;
	export let height: number = 0;

	/*
	export let bench: number = 0;
	export let multiSort: boolean = false;
	export let locale: string = '';
	export let dense: boolean = false;
    */

	let selectedItemIndexes: string[] = [];
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
		selectedItemIndexes = [];
		refItems.forEach((v, i) => {
			v.__selected = selectedItemList.some((si) => {
				return headers.findIndex((h) => si[h.value] != v.item[h.value]) === -1;
			});
			if (v.__selected) selectedItemIndexes.push(i);
		});
		console.debug('updateSelected', selectedItemList, refItems);
	}

	function filterAndSort(ritems: readonly any[]) {
		console.debug('filterAndSort', ritems);
		filteredAndSortedItems = Object.freeze(
			ritems.map((v, i) => {
				return { ...v, __itemIndex: i };
			})
		);
	}

	$: {
		refItems = createRefItems(items.slice());
	}

	$: {
		updateSelected(value);
	}

	$: {
		filterAndSort(refItems);
	}

	$: vitems = Object.freeze(filteredAndSortedItems.slice());

	$: {
		changeSelected(selectedItemIndexes);
	}

	function changeSelected(selected: string[]) {
		console.debug('changeSelected', selected);
		if (selected) {
			if (0 < selected.length) {
				refItems.forEach((ritem) => {
					if (0 <= selected.findIndex(s => ritem.__itemIndex == selected)) {
						ritem.__selected = true;
					} else {
						ritem.__selected = false;
					}
				});
			} else {
				refItems.forEach((ritem) => {
					ritem.__selected = false;
				});
			}
		}
	}

	function selectRow(event: any, itemindex: string) {
		let i = Number(itemindex);

		console.debug('selectRow', event, itemindex, refItems[i]);

		if (singleSelect) {
			if (selectedItemIndexes.length === 1) {
				if (selectedItemIndexes[0] === itemindex && radio) {
					console.debug('selectRow', 'do nothing');
					event.preventDefault();
					event.stopPropagation();
				} else if (selectedItemIndexes[0] !== itemindex) {
					console.debug('selectRow', 'shift');
					selectedItemIndexes.shift();
				}
			}
		}
/*
		const itemindex = vitems[rownum].__itemIndex;
		const filterditemindex = filteredAndSortedItems.findIndex((fi) => fi.__itemIndex === itemindex);

		refItems[itemindex].__selected = !refItems[itemindex].__selected;
		filteredAndSortedItems[filterditemindex].__selected =
			!filteredAndSortedItems[filterditemindex].__selected;

		if (singleSelect) {
			value = [];
			selectedItemIndexes = [];
			refItems.forEach((ci, i) => {
				if (i !== itemindex) ci.__selected = false;
			});
			filteredAndSortedItems.forEach((fi) => {
				if (fi.__itemIndex !== itemindex) fi.__selected = false;
			});

			let r = event.target.closest('tbody').rows;
			for (let i = 0; i < r.length; i++) {
				let cb = r[i].cells[0].querySelector('input');
				if (cb.checked && cb.value != itemindex) {
					r[i].classList.remove('mdc-data-table__row--selected');
				}
			}
		}

		value = items.filter((item, index) => refItems[index].__selected);
		*/
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
					{#if !singleSelect && !radio}
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
						<Checkbox
							bind:group={selectedItemIndexes}
							value={vitem.__itemIndex}
							checked={vitem.__selected}
							on:click={(e) => selectRow(e, vitem.__itemIndex)}
						/>
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
