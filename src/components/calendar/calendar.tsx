import React from 'react';
import { Props } from '../../@types/calendar';

import styles from './calendar.module.scss';


const TS_FOR_ONE_DAY = 1000 * 60 * 60 * 24;

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
// highlight
// 0: 没有背景
// 1: 开始日期
// 2: 结束日期
// 3: 中间日期
// 4: 开始结束同一天
function getPaddingDates(year: number, month: number, maxDate: number) {
	const beginDate = new Date(year, month, 1);
	const beginTS = beginDate.getTime();
	const endDate = new Date(year, month + 1, 0);

	const beginDay = beginDate.getDay();
	const totalDates = endDate.getDate();
	const dates = [];
	// 开始
	// 日
	if (beginDay === 0) {
		for (let j = 0; j < 6; j++) {
			dates.push({
				value: null,
				highlight: 0,
			})
		}
	}
	// 其他
	else {
		for (let j = 1; j < beginDay; j++) {
			dates.push({
				value: null,
				highlight: 0,
			})
		}
	}

	// 中间
	for (let i = 1; i <= totalDates; i++) {
		const datetime = beginTS + (i - 1) * TS_FOR_ONE_DAY;
		if (i === 1) {
			if (dates.length % 7 === 6) {
				dates.push({
					value: i,
					highlight: 0,
					left: true,
					right: true,
					disabled: datetime > maxDate
				})	
			}
			else {
				dates.push({
					value: i,
					highlight: 0,
					left: true,
					disabled: datetime > maxDate
				})
			}
		}
		else if (i === totalDates) {
			if (dates.length % 7 === 0) {
				dates.push({
					value: i,
					highlight: 0,
					left: true,
					right: true,
					disabled: datetime > maxDate
				})	
			}
			else {
				dates.push({
					value: i,
					highlight: 0,
					right: true,
					disabled: datetime > maxDate
				})	
			}
		}

		else {
			if (dates.length % 7 === 6) {
				dates.push({
					value: i,
					highlight: 0,
					right: true,
					disabled: datetime > maxDate
				})	
			}
			else if (dates.length % 7 === 0) {
				dates.push({
					value: i,
					highlight: 0,
					left: true,
					disabled: datetime > maxDate
				})	
			}
			else {
				dates.push({
					value: i,
					highlight: 0,
					disabled: datetime > maxDate
				})
			}
		}
	}

	// 结束
	const firstLineItemNunber = dates.slice(0, 7).filter(item => item.value !== null).length;
	const paddingItems = 7 - ((totalDates - firstLineItemNunber) % 7)
	if (paddingItems < 7) {
		for (let i = 0; i < paddingItems; i++) {
			dates.push({
				value: null,
				highlight: 0,
			})
		}
	}
	
	return dates;
}


class CalendarWrapper extends React.Component<Props> {
	render() {
		return (
			this.props.visible && <Calendar {...this.props} />
		)
	}
}

class Calendar extends React.Component<Props> {
	scrollDiv: HTMLDivElement;

	days = ['一', '二', '三', '四', '五', '六', '日'];
  state = {
		initOk: false,
		showItems: [],
		selectedDates: {
			start: this.props.start,
			end: this.props.end
		},
	};
	
	today = Date.now();

	componentDidMount() {
		document.body.style.overflow = 'hidden';
		document.body.style.touchAction = 'none';

		const datetimeStart = new Date(this.props.start);
		const year = datetimeStart.getFullYear();
		const month = datetimeStart.getMonth();

		const datetimeEnd = new Date(this.props.end);
		const yearEnd = datetimeEnd.getFullYear();
		const monthEnd = datetimeEnd.getMonth();

		let interval = (yearEnd - year) * 12 + monthEnd - month + 1;
		interval = interval >= 2 && interval || 2;

		const showItems = [];
		let initScrollTop = 0;
		for (let i = -4; i < interval; i++) {
			const currentMonth = month + i;
			const newDatetime = new Date(year, currentMonth);
			const newYear = newDatetime.getFullYear();
			const newMonth = newDatetime.getMonth();
			const newDates = getPaddingDates(newYear, newMonth, this.props.maxDate);
			const height = this.computeBlockHeight(newDates);

			showItems.push({
				id: uuidv4(),
				year: newYear,
				month: newMonth,
				computeMonth: `0${(newMonth + 1)}`.slice(-2),
				height,
				dates: newDates,
			})

			if (i < 0) initScrollTop += height;
		}
		setTimeout(() => {
			this.scrollDiv.scrollTop = initScrollTop;
		})

		this.mutateVisibility(showItems);
		this.setState({ showItems });
	}

	componentWillUnmount() {
		document.body.style.overflow = '';
		document.body.style.touchAction = '';
	}

  render() {
		const { selectedDates } = this.state;
		const start = this.currentStart;
		const end = this.currentEnd;
		const today = this.computeDateByTS(this.today);
    return (
			<div className={styles["modal"]}>
				<div className={styles["content"]}>
					<div className={styles["top-btns"]}>
						<div className={styles["close"]} onClick={this.handleClose}></div>
						<div className={styles["title"]}>修改时间</div>
						<div className={styles["ok"]} onClick={this.handleOk}>确定</div>
					</div>

					<div className={styles["days-container"]}>
						{this.days.map(day => (
							<div>{day}</div>
						))}
					</div>
					
					<div ref={ref => this.scrollDiv = ref}
						style={{overflowY: 'scroll'}}
						className={styles["main-container"]}
						onScroll={this.handleScroll}
					>
						{this.state.showItems.map(item => (
							<div key={item.id}>
								<div className={styles["year-month-container"]}>
									<div className={styles["year-month"]}>{`${item.year}-${item.computeMonth}`}</div>
								</div>
								
								<div className={styles["date-container"]} onClick={this.handleDateSelect}>
									{item.dates.map(date => {
										let dateStyle;
										if (start.year === end.year && start.month === end.month && start.date === end.date) {
											if (start.year === item.year && start.month === item.month && start.date === date.value) {
												dateStyle = styles["end-date"];
											}
										}
										else {
											dateStyle = !selectedDates.end ? null : date.highlight === 1
																		? styles["start-highlight"]
																		: date.highlight === 2 || date.highlight === 4 ? styles["end-highlight"]
																		: date.highlight === 3 ? styles["middle-highlight"] : null;
										}

										let todayStyle;
										if (item.year === today.year && item.month === today.month && date.value == today.date) 
											todayStyle = styles["today"];
										
										if (date.disabled)
											return (
												<div className={styles["disabled"]}>
													{date.value}
												</div>
											)
										return (
											<div key={item.value}
												data-year={item.year}
												data-month={item.month}
												data-date={date.value}
												className={`${dateStyle} ${todayStyle} ${date.left && styles["left-border"]} ${date.right && styles["right-border"]}`}
											>
												{this.renderDate(date)}
											</div>
										)
									})}
								</div>
							</div>
						))}
					</div>

					<div className={styles["footer-container"]}>
						<div className={styles["select-date"]}>{this.currentStartFormatYMD}</div>
						<div className={styles["total-date"]}>
							<div className={styles["total-date-text"]}>{this.getDiffInDays}</div>
						</div>
						<div className={styles["select-date"]}>{this.currentEndFormatYMD}</div>
					</div>
				</div>
			</div>
		);
	}

	renderDate = (date) => {
		// 开始
		if (date.highlight === 1) {
			return (
				<div className={styles["start-date"]}>
					<div data-in="1">{date.value}</div>
					<div data-in="1">开始</div>
				</div>
			)
		}
		// 结束
		else if (date.highlight === 2) {
			return (
				<div className={styles["end-date"]}>
					<div data-in="1">{date.value}</div>
					<div data-in="1">结束</div>
				</div>
			)
		}
		else if (date.highlight === 4) {
			return (
				<div className={styles["end-date"]}>
					<div data-in="1">{date.value}</div>
					<div data-in="1">开/结</div>
				</div>
			)
		}
		// 中间
		else
			return date.value;
	}
	
	get currentStart() {
		const datetime = new Date(this.state.selectedDates.start);
		return {
			year: datetime.getFullYear(),
			month: datetime.getMonth(),
			date:  datetime.getDate(),
			hour: datetime.getHours(),
			minute: datetime.getMinutes(),
			second: datetime.getSeconds(),
		}
	}

	get currentStartFormatYMD() {
		const time = this.currentStart;
		return `${time.year}-${('0' + (time.month + 1)).slice(-2)}-${('0' + time.date).slice(-2)}`;
	}

	get currentEnd() {
		const datetime = new Date(this.state.selectedDates.end);
		return {
			year: datetime.getFullYear(),
			month: datetime.getMonth(),
			date:  datetime.getDate(),
			hour: datetime.getHours(),
			minute: datetime.getMinutes(),
			second: datetime.getSeconds(),
		}
	}
	
	get currentEndFormatYMD() {
		const time = this.currentEnd;
		if (!isNaN(time.year))
			return `${time.year}-${('0' + (time.month + 1)).slice(-2)}-${('0' + time.date).slice(-2)}`;
		else 
			return <div style={{color: '#d5d5d5'}}>未选择</div>
	}

	get getDiffInDays() {
		const selectedDates = this.state.selectedDates;
		if (!selectedDates.end)
			return '共0天';
		return '共' + (Math.floor((selectedDates.end - selectedDates.start) / 1000 / 60 / 60 / 24) + 1) + '天';
	}

	computeDateByTS = ts => {
		const datetime = new Date(ts);
		return {
			year: datetime.getFullYear(),
			month: datetime.getMonth(),
			date:  datetime.getDate(),
			hour: datetime.getHours(),
			minute: datetime.getMinutes(),
			second: datetime.getSeconds(),
		}
	}

	computeBlockHeight = (newDates) => {
		const itemHeight = document.documentElement.clientWidth < document.documentElement.clientHeight 
				? document.documentElement.clientWidth : document.documentElement.clientHeight;
		return itemHeight * 0.13 * newDates.length / 7 + 30;
	}

	computeTotalHeight = () => {
		return this.state.showItems.reduce((a, b) => ({height: a.height + b.height})).height;
	}

	mutateVisibility = (showItems) => {
		const start = this.currentStart;
		const end = this.currentEnd;
		// 同一年
		if (start.year === end.year) {
			this.mutateVisibilityDifferntMonth(showItems, start.year, start, end, start, end);
		}
		// 开始/结束 不同年
		else {
			for (let y = start.year; y <= end.year; y++) {
				// 开始年
				if (y === start.year) {
					this.mutateVisibilityDifferntMonth(
						showItems,
						y,
						start,
						this.computeDateByTS(new Date(`${y}/${12}/31`)),
						start,
						end
					);
				}
				// 中间年
				else if (y > start.year && y < end.year) {
					this.mutateVisibilityDifferntMonth(
						showItems,
						y,
						this.computeDateByTS(new Date(`${y}/${1}/1`)),
						this.computeDateByTS(new Date(`${y}/${12}/31`)),
						start,
						end
					);
				}
				// 结束年
				else {
					this.mutateVisibilityDifferntMonth(
						showItems,
						y,
						this.computeDateByTS(new Date(`${y}/${1}/1`)),
						end,
						start,
						end
					);
				}
			}
		}
	}

	mutateVisibilityDifferntMonth = (showItems, y, start, end, realStart, realEnd) => {
		// 开始/结束 同一个月
		if (start.month === end.month) {
			const m = start.month;
			const item = showItems.find(item => item.year === y && item.month === m);

			item.dates
				.forEach(date => {
					if (date.value === null)
						return;
					else if (y === realEnd.year && y === realStart.year && date.value === end.date && date.value === start.date)
						return date.highlight = 4;
					else if (y === realEnd.year && date.value === end.date)
						return date.highlight = 2;
					else if (y === realStart.year && date.value === start.date) 
						return date.highlight = 1;
					else if (date.value >= start.date && date.value <= end.date)
						return date.highlight = 3;
				})
		}
		// 开始/结束 不同月
		else {
			for (let j = start.month; j <= end.month; j++) {
				const m = j;
				const item = showItems.find(item => item.year === y && item.month === m)

				// 开始月
				if (m === start.month) {
					item.dates
						.forEach(date => {
							if (date.value === null)
								return;
							else if (y === realStart.year && date.value === start.date)
								return date.highlight = 1;
							else if (date.value >= start.date)
								return date.highlight = 3;
						})
				}
				// 中间月
				else if (m > start.month && m < end.month) {
					item.dates
						.forEach(date => {
							if (date.value === null)
								return;
							date.highlight = 3;
						})
				}
				// 结束月
				else {
					item.dates
						.forEach(date => {
							if (date.value === null)
								return;
							else if (y === realEnd.year && date.value === end.date)
								return date.highlight = 2;
							else if (date.value <= end.date)
								return date.highlight = 3;
						})
				}
			}
		}
	}

	clearVisibility = () => {
		this.state.showItems.forEach(item => {
			item.dates.forEach(date => date.highlight = 0);
		})
	}

	handleScroll = (e) => {
		const scrollTop = e.target.scrollTop;
		if (scrollTop < 800) {
			const firstShowItem = this.state.showItems[0];
			const currentMonth = firstShowItem.month - 1;

			const newDatetime = new Date(firstShowItem.year, currentMonth);
			const newYear = newDatetime.getFullYear();
			const newMonth = newDatetime.getMonth();

			const newDates = getPaddingDates(newYear, newMonth, this.props.maxDate);
			const addedHeight = this.computeBlockHeight(newDates);

			if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
				// console.log('before', e.target.scrollTop)
				e.target.scrollTop = scrollTop + addedHeight;
			}
				

			
			
			this.state.showItems.unshift({
				id: uuidv4(),
				year: newYear,
				month: newMonth,
				computeMonth: `0${(newMonth + 1)}`.slice(-2),
				height: addedHeight,
				dates: newDates,
			})

			this.forceUpdate();
		}
		else if (scrollTop + 800 > this.computeTotalHeight()) {
			const lastShowItem = this.state.showItems[this.state.showItems.length - 1];
			const currentMonth = lastShowItem.month + 1;
			const newDatetime = new Date(lastShowItem.year, currentMonth);
			
			if (newDatetime.getTime() > this.props.maxDate) return;
			const newYear = newDatetime.getFullYear();
			const newMonth = newDatetime.getMonth();

			const newDates = getPaddingDates(newYear, newMonth, this.props.maxDate);
			const addedHeight = this.computeBlockHeight(newDates);

			this.state.showItems.push({
				id: uuidv4(),
				year: newYear,
				month: newMonth,
				computeMonth: `0${(newMonth + 1)}`.slice(-2),
				height: addedHeight,
				dates: newDates,
			})

			this.forceUpdate();
		}
	}
	
	getTranslateY(element) {
		const style = getComputedStyle(element);
		const matrix = new WebKitCSSMatrix(style.webkitTransform);
		return matrix.m42;
	}

	handleDateSelect = (e) => {
		// e.stopPropagation();
		let dataset = e.target.dataset;
		if (dataset.in === '1')
			dataset = e.target.parentElement.parentElement.dataset;
		if (!dataset.date) return;

		const date = this.state.showItems
			.find(item => item.year === +dataset.year && item.month === +dataset.month)
			.dates
			.find(date => date.value === +dataset.date)
		


		const dateStr = `${dataset.year}/${+dataset.month + 1}/${dataset.date}`;
		const selectedDates = this.state.selectedDates;
		// 两个都有值, 选的是开始时间
		if (selectedDates.start && selectedDates.end) {
			selectedDates.start = new Date(dateStr).getTime();
			selectedDates.end = undefined;
			this.clearVisibility();
			date.highlight = 1;
		}
		else if (selectedDates.start) {
			const currentSelectedTime = new Date(dateStr).getTime();
			if (currentSelectedTime < selectedDates.start)
				selectedDates.end = selectedDates.start, selectedDates.start = currentSelectedTime;
			else 
				selectedDates.end = currentSelectedTime;
			this.mutateVisibility(this.state.showItems);
		}
		this.forceUpdate();
	}

	handleClose = () => {
		this.props.handleClose && this.props.handleClose();
	}

	handleOk = () => {
		const start = this.state.selectedDates.start;
		const end = this.state.selectedDates.end;

		if (!start)
			return console.log("请选择开始日期", 2, null, false);
		if (!end)
			return console.log("请选择结束日期", 2, null, false);
		if (this.props.maxRange && (end - start >= this.props.maxRange))
			return console.log(`时间区间不能超过${Math.floor(this.props.maxRange / TS_FOR_ONE_DAY)}天`, 2, null, false);
		
			this.props.handleOk && this.props.handleOk({start, end});
	}
}


export default CalendarWrapper;