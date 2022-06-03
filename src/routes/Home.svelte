<script lang="ts">
	import Card, { Content } from '@smui/card';
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import HelperText from '@smui/textfield/helper-text';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Select, { Option } from '@smui/select';
	import Cycle from '../lib/Cycle.svelte';
	import Table from '../lib/DataTable.svelte';
	//	import List, { Item, Text, Meta, Label } from '@smui/list';
	//	import Checkbox from '@smui/checkbox';
	//	import SegmentedButton, { Segment } from '@smui/segmented-button';
	//	import { Label } from '@smui/common';
	//	import Radio from '@smui/radio';
	//	import FormField from '@smui/form-field';

	export const prerender = true;

	let innerHeight: number;
	let weight: number = 65;
	let height: number = 172;
	let age: number = 40;
	let bodyfatpercentage: number = 15;
	let gender: string;
	//	let genders = ['Female', 'Male', 'Other'];
	let activitylevel: number = 1.4;
	let restdaycalp: number = 20;
	let workoutdaycalp: number = 10;
	let dayspercycle: number = 7;
	let startdt = new Date(Date.now()).toISOString().substring(0, 10);
	let cycledays: boolean[] = [];
	let executionCycles: number = 8;
	let dayheader: string[] = ['1', '2', '3', '4', '5', '6', '7'];
	let bmrTblHeaders: any[] = [
		{
			text: 'Method',
			value: 'name'
		},
		{
			text: 'BMR (㎉)',
			value: 'calories'
		}
	];
	let bmrTblItems: any[] = [];
	let selectedBrm: any[] = [];
	let scheduleTblHeaders: any[] = [
		{
			text: 'Date',
			value: 'date'
		},
		{
			text: 'Weight',
			value: 'weight'
		},
		{
			text: 'Calorie',
			value: 'cal'
		},
		{
			text: 'Protein',
			value: 'protein'
		},
		{
			text: 'Fat',
			value: 'fat'
		},
		{
			text: 'Carb',
			value: 'carb'
		}
	];

	function mifflinStJoer(gen: string, w: number, h: number, a: number): number {
		if (!gen || !w || !h || !a) return 0;
		if (gen.toUpperCase().startsWith('M')) {
			return 9.99 * w + 6.25 * h - 4.92 * a + 5;
		} else if (gen.toUpperCase().startsWith('F') || gen.toUpperCase().startsWith('W')) {
			return 9.99 * w + 6.25 * h - 4.92 * a - 161;
		}
		return 0;
	}

	function ganpuleEtAl2007(gen: string, w: number, h: number, a: number): number {
		if (!gen || !w || !h || !a) return 0;
		if (gen.toUpperCase().startsWith('M')) {
			return ((0.0481 * w + 0.0234 * h - 0.0138 * a - 0.4235) * 1000) / 4.186;
		} else if (gen.toUpperCase().startsWith('F') || gen.toUpperCase().startsWith('W')) {
			return ((0.0481 * w + 0.0234 * h - 0.0138 * a - 0.9708) * 1000) / 4.186;
		}
		return 0;
	}

	function schofield(gen: string, w: number, a: number): number {
		if (!gen || !w || !a || a < 18) return 0;
		if (gen.toUpperCase().startsWith('M')) {
			if (a < 30) return ((0.063 * w + 2.896) * 1000) / 4.186;
			if (a < 60) return ((0.048 * w + 3.653) * 1000) / 4.186;
			return ((0.049 * w + 2.459) * 1000) / 4.186;
		} else if (gen.toUpperCase().startsWith('F') || gen.toUpperCase().startsWith('W')) {
			if (a < 30) return ((0.062 * w + 2.036) * 1000) / 4.186;
			if (a < 60) return ((0.034 * w + 3.538) * 1000) / 4.186;
			return ((0.038 * w + 2.755) * 1000) / 4.186;
		}
		return 0;
	}

	function faoWhoUnu(gen: string, w: number, h: number, a: number): number {
		if (!gen || !w || !h || !a || a < 18) return 0;
		if (gen.toUpperCase().startsWith('M')) {
			if (a < 30) return (64.4 * w - (113.0 * h) / 100 + 3000) / 4.186;
			if (a < 60) return (47.2 * w + (66.9 * h) / 100 + 3769) / 4.186;
			return (36.8 * w + (4719.5 * h) / 100 - 4481) / 4.186;
		} else if (gen.toUpperCase().startsWith('F') || gen.toUpperCase().startsWith('W')) {
			if (a < 30) return (55.6 * w + (1397.4 * h) / 100 + 148) / 4.186;
			if (a < 60) return (36.4 * w + (104.6 * h) / 100 + 3619) / 4.186;
			return (38.5 * w + (2665.2 * h) / 100 - 1264) / 4.186;
		}
		return 0;
	}

	function katchMcArdle(w: number, bfp: number): number {
		if (!w || !bfp) return 0;
		return 370 + 21.6 * (w - (w * bfp) / 100);
	}

	function toString(value: Date): string {
		return new Intl.DateTimeFormat().format(value);
	}

	type BmrMethod =
		| 'Mifflin-St Jeor Equation'
		| 'Ganpule et al., 2007'
		| 'Schofield Equation'
		| 'FAO/WHO/UNU Equation'
		| 'Katch-McArdle Formula';

	function calcBmr(m: BmrMethod, g: string, w: number, h: number, a: number, bfp: number): number {
		if (m === 'Mifflin-St Jeor Equation') {
			return mifflinStJoer(g, w, h, a);
		} else if (m === 'Ganpule et al., 2007') {
			return ganpuleEtAl2007(g, w, h, a);
		} else if (m === 'Schofield Equation') {
			return schofield(g, w, a);
		} else if (m === 'FAO/WHO/UNU Equation') {
			return faoWhoUnu(g, w, h, a);
		} else if (m === 'Katch-McArdle Formula') {
			return katchMcArdle(w, bfp);
		} else {
			return 0;
		}
	}

	function calcBmrs(g: string, w: number, h: number, a: number, bfp: number) {
		const bmrMethods: BmrMethod[] = [
			'Mifflin-St Jeor Equation',
			'Ganpule et al., 2007',
			'Schofield Equation',
			'FAO/WHO/UNU Equation',
			'Katch-McArdle Formula'
		];
		let newBmrs: { name: BmrMethod; calories: number }[] = [];

		bmrMethods.forEach((bmrm) => {
			let bmr = calcBmr(bmrm, g, w, h, a, bfp);
			if (bmr) newBmrs.push({ name: bmrm, calories: Math.round(bmr) });
		});

		bmrTblItems = newBmrs.slice();
		console.debug('update brm items');
	}

	$: {
		calcBmrs(gender, weight, height, age, bodyfatpercentage);
	}

	function resetSelectedBrm(v: any[]) {
		if (0 < v.length) {
			let ave =
				v.reduce((previousValue, currentValue) => {
					return { calories: previousValue.calories + currentValue.calories };
				}).calories / v.length;
			selectedBrm = [
				v.reduce((previousValue, currentValue) =>
					Math.abs(previousValue.calories - ave) <= Math.abs(currentValue.calories - ave)
						? previousValue
						: currentValue
				)
			];
		}
		console.debug('restSelectedBrm', selectedBrm);
	}

	$: {
		resetSelectedBrm(bmrTblItems);
	}

	$: bmr = selectedBrm ? selectedBrm[0].calories : undefined;
	$: bmrMethod = selectedBrm ? selectedBrm[0].name : undefined;
	$: tdee = Math.round(bmr * activitylevel);

	function resetCycle(dpc: number) {
		let newCycledays: boolean[] = [];
		let numofworkoutday = Math.floor(dpc / 2);
		let newDayHeader: string[] = [];

		for (let i = 0; i < dpc; i++) {
			newCycledays.push(i % 2 === 0 && i / 2 < numofworkoutday);
			newDayHeader.push((i + 1).toLocaleString('en'));
		}
		cycledays = newCycledays;
		dayheader = newDayHeader;
	}

	$: {
		resetCycle(dayspercycle);
	}

	$: endDt = new Date(
		new Date(startdt).getTime() + dayspercycle * executionCycles * 24 * 60 * 60 * 1000
	);

	function calcDailySchedule(
		w: number,
		tdee: number,
		bmrm: BmrMethod,
		wods: boolean[],
		ec: number,
		wodcp: number,
		rdcp: number,
		sdt: string,
		al: number,
		g: string,
		h: number,
		a: number,
		bfp: number
	): any[] {
		let r: any[] = [];
		const fatKCalPerG: number = 9;
		const proteinKCalPerG: number = 4;
		const fatWaterRatio: number = 0.25;
		const proteinWaterRatio: number = 3.17;
		const fatBurnRatio: number = 0.9;
		const fatIncreaseRatio: number = 0.9;
		const proteinFeedWeightRatio: number = 1.3;
		const fatFeedWeightRatio: number = 1;
		let dt = new Date(sdt);

		if (!w || !tdee || !wods || !ec || !wodcp || !rdcp || !sdt) return r;

		console.debug(w, tdee, wods, ec, wodcp, rdcp, sdt);

		for (let i = 0; i < ec; i++) {
			r = r.concat(
				wods.map((wod) => {
					let calDiff = (tdee * (wod ? wodcp : rdcp)) / 100;
					let calDiffFat = calDiff * (calDiff < 0 ? fatBurnRatio : fatIncreaseRatio);
					let calDiffProt = calDiff - calDiffFat;
					let weightDiffFat = ((calDiffFat / fatKCalPerG) * (1 + fatWaterRatio)) / 1000;
					let weightDiffProt = ((calDiffProt / proteinKCalPerG) * (1 + proteinWaterRatio)) / 1000;
					let r = {
						date: dt.toISOString().substring(0, 10),
						weight: Math.round(w),
						cal: Math.round(tdee + calDiff),
						protein: Math.round(w * proteinFeedWeightRatio),
						fat: Math.round(w * fatFeedWeightRatio),
						carb: Math.round(
							(Math.round(tdee + calDiff) -
								Math.round(w * proteinFeedWeightRatio) * 4 -
								Math.round(w * fatFeedWeightRatio) * 9) /
								4
						)
					};
					w = w + weightDiffFat + weightDiffProt;
					tdee = calcBmr(bmrm, g, w, h, a, bfp) * al;
					dt = new Date(dt.getTime() + 24 * 60 * 60 * 1000);
					return r;
				})
			);
		}

		console.debug('calcDailySchedule', r);

		return r;
	}

	$: scheduleTblItems = calcDailySchedule(
		weight,
		tdee,
		bmrMethod,
		cycledays,
		executionCycles,
		workoutdaycalp,
		-restdaycalp,
		startdt,
		activitylevel,
		gender,
		height,
		age,
		bodyfatpercentage
	);
</script>

<svelte:window bind:innerHeight />

<svelte:head>
	<title>IFI</title>
</svelte:head>

<LayoutGrid class="g-0">
	<Cell spanDevices={{ desktop: 12, tablet: 8, phone: 4 }}>
		<div class="mdc-typography--subtitle1">Intermittent Fasting Calculator</div>
	</Cell>
	<Cell spanDevices={{ desktop: 6, tablet: 8, phone: 4 }}>
		<Card>
			<Content>
				<div class="mdc-typography--subtitle1">Your profile</div>
				<LayoutGrid class="g-0">
					<Cell>
						<Textfield
							bind:value={weight}
							type="number"
							label="Weight"
							suffix="㎏"
							input$min="3"
							input$max="999"
						>
							<HelperText slot="helper" />
						</Textfield>
					</Cell>
					<Cell>
						<Textfield
							bind:value={bodyfatpercentage}
							type="number"
							label="Body fat"
							suffix="%"
							input$min="1"
							input$max="100"
						>
							<HelperText slot="helper" />
						</Textfield>
					</Cell>
					<Cell>
						<Textfield
							bind:value={height}
							type="number"
							label="Height"
							suffix="㎝"
							input$min="1"
							input$max="300"
						>
							<HelperText slot="helper" />
						</Textfield>
					</Cell>
					<Cell>
						<Textfield
							bind:value={age}
							type="number"
							label="Age"
							suffix=""
							input$min="0"
							input$max="99"
						>
							<HelperText slot="helper" />
						</Textfield>
					</Cell>
					<Cell>
						<Select bind:value={gender} label="Gender">
							<Option value="" />
							<Option value="F">Female</Option>
							<Option value="M">Male</Option>
						</Select>
					</Cell>
					<!--
				<Cell>
					<SegmentedButton segments={genders} let:segment singleSelect bind:gender>
						<Segment {segment}>
							<Label>{segment}</Label>
						</Segment>
					</SegmentedButton>
				</Cell>
				<Cell>
					<FormField>
						<Radio bind:group={gender} value="Female" touch /><span slot="label">Female</span>
					</FormField>
					<FormField>
						<Radio bind:group={gender} value="Male" touch /><span slot="label">Male</span>
					</FormField>
					<FormField>
						<Radio bind:group={gender} value="Other" touch /><span slot="label">Other</span>
					</FormField>
				</Cell>
				-->
				</LayoutGrid>
			</Content>
		</Card>
	</Cell>
	<Cell spanDevices={{ desktop: 12, tablet: 8, phone: 4 }}>
		<Card>
			<Content>
				Plan
				<LayoutGrid>
					<Cell spanDevices={{ desktop: 12, tablet: 8, phone: 4 }}>
						<div class="floating-label">Select a BMR calculation method.</div>
						<Table
							headers={bmrTblHeaders}
							items={bmrTblItems}
							bind:value={selectedBrm}
							showSelect
							singleSelect
						/>
					</Cell>
					<Cell spanDevices={{ desktop: 4, tablet: 8, phone: 4 }}>
						<Textfield
							bind:value={activitylevel}
							type="number"
							label="BMR × Activity Level = TDEE"
							input$min="1.0"
							input$step="0.1"
							input$max="2.0"
							prefix={bmr + ' ×'}
							suffix={'= ' + Math.round(bmr * activitylevel) + ' ㎉'}
							input$style="text-align: center;"
						>
							<HelperText slot="helper">Low: 1.4, Mid: 1.6, High: 1.8</HelperText>
						</Textfield>
					</Cell>
					<Cell>
						<Textfield
							bind:value={workoutdaycalp}
							type="number"
							label="Gain day"
							input$min="0"
							input$max="100"
							prefix={tdee + ' + '}
							suffix={'% = ' + Math.round(tdee * (1 + workoutdaycalp / 100)) + ' ㎉'}
							input$style="text-align: center;"
						>
							<HelperText slot="helper" />
						</Textfield>
					</Cell>
					<Cell>
						<Textfield
							bind:value={restdaycalp}
							type="number"
							label="Cut day"
							input$min="0"
							input$max="100"
							prefix={tdee + ' - '}
							suffix={'% = ' + Math.round(tdee * (1 - restdaycalp / 100)) + ' ㎉'}
							input$style="text-align: center;"
						>
							<HelperText slot="helper" />
						</Textfield>
					</Cell>
					<Cell>
						<Textfield
							bind:value={dayspercycle}
							type="number"
							label="Days/Cycle"
							suffix="days"
							input$min="2"
							input$max="7"
						>
							<HelperText slot="helper" />
						</Textfield>
					</Cell>
					<Cell spanDevices={{ desktop: 6, tablet: 8, phone: 4 }}>
						<div class="floating-label">Check the gain day in a cycle.</div>
						<Cycle headers={dayheader} values={cycledays} />
					</Cell>
					<!--
					<Cell>
						<List class="cycledaylist" checkList>
							{#each cycledays as cycleday, i}
								<Item>
									<Label>{i + 1}</Label>
									<Meta>
										<Checkbox bind:checked={cycledays[i]} />
									</Meta>
								</Item>
							{/each}
						</List>
					</Cell>
					-->
					<Cell>
						<Textfield
							bind:value={executionCycles}
							type="number"
							label="Execution cycles"
							prefix={dayspercycle + ' days × '}
							suffix={'cycles = ' + executionCycles * dayspercycle + ' days'}
							input$min="1"
							input$max="99"
							input$style="text-align: center;"
						>
							<HelperText slot="helper" />
						</Textfield>
					</Cell>
					<Cell>
						<Textfield
							bind:value={startdt}
							type="date"
							label="From - To"
							suffix={' - ' + toString(endDt)}
							input$style="text-align: center;"
						>
							<Icon class="material-icons" slot="leadingIcon">calendar_today</Icon>
							<HelperText slot="helper" />
						</Textfield>
					</Cell>
				</LayoutGrid>
			</Content>
		</Card>
	</Cell>
	<Cell spanDevices={{ desktop: 12, tablet: 8, phone: 4 }}>
		<Card>
			<Content>
				<div class="mdc-typography--subtitle1">Schedule.</div>
				<Table headers={scheduleTblHeaders} items={scheduleTblItems} height={innerHeight - 80} />
			</Content>
		</Card>
	</Cell>
</LayoutGrid>

<style global>
	.g-0 {
		margin: 0;
		padding-left: 0;
		padding-right: 0;
	}
	.mw-100 {
		min-width: 100px;
	}
</style>
