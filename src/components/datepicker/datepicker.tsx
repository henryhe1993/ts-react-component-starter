import React from 'react';
import styles from './datepicker.module.scss';

const optionHeight = 30;
const halfOptionHeight = optionHeight / 2;
const optionItems = 3;
const offset = optionHeight * optionItems;

enum OPTIONS {
	year = 'Year',
	month = 'Month',
	date = 'Date',
	hour = 'Hour',
	minute = 'Minute',
	second = 'Second'
}

const YEARS = Array.from(Array(50).keys()).map(_i => `${_i + 1980}`);
const MONTHS = Array.from(Array(12).keys()).map(_i => `${_i + 1}`);
const HOURS = Array.from(Array(24).keys()).map(_i => ('0' + _i).slice(-2));
const MINUTES = Array.from(Array(60).keys()).map(_i => ('0' + _i).slice(-2));
const SECONDS = MINUTES;

interface OptionInterface {
	name: OPTIONS;
	ref: HTMLDivElement;
  values: string[];
  style?: React.CSSProperties;
}
interface Props {
	timestamp: number;
	onOk(timestamp: number): void;
  onDismiss(): void;
  format?: 'yyyy-MM-dd HH:mm:ss' | 'yyyy-MM' | 'yyyy-MM-dd' | 'yyyy';
}
export default class extends React.Component<Props> {
	touchStartPosition = undefined;
	touchStartTranslatedY = undefined;
	touchStartTime = undefined;

	current = {
		[OPTIONS.year]: undefined,
		[OPTIONS.month]: undefined,
		[OPTIONS.date]: undefined,
		[OPTIONS.hour]: undefined,
		[OPTIONS.minute]: undefined,
		[OPTIONS.second]: undefined
	}

	original = {
		[OPTIONS.year]: undefined,
		[OPTIONS.month]: undefined,
		[OPTIONS.date]: undefined,
		[OPTIONS.hour]: undefined,
		[OPTIONS.minute]: undefined,
		[OPTIONS.second]: undefined
	};

	yearOptionsRef: HTMLDivElement;
	monthOptionsRef: HTMLDivElement;
	dateOptionsRef: HTMLDivElement;
	hourOptionsRef: HTMLDivElement;
	minuteOptionsRef: HTMLDivElement;
	secondOptionsRef: HTMLDivElement;

	allOptions: OptionInterface[] = [];
  
  showOptions: OptionInterface[] = [];

	componentDidMount() {
		document.addEventListener('touchmove', this.preventScroll);
		// document.body.style.touchAction = 'none';
		
		this.allOptions = [{
			name: OPTIONS.year,
			ref: this.yearOptionsRef,
			values: YEARS,
		}, {
			name: OPTIONS.month,
			ref: this.monthOptionsRef,
			values: MONTHS,
		}, {
			name: OPTIONS.date,
			ref: this.dateOptionsRef,
			values: []
		}, {
			name: OPTIONS.hour,
			ref: this.hourOptionsRef,
			values: HOURS,
			style: {
				color: '#55b3ff'
			}
		}, {
			name: OPTIONS.minute,
			ref: this.minuteOptionsRef,
			values: MINUTES,
			style: {
				color: '#55b3ff'
			}
		}, {
			name: OPTIONS.second,
			ref: this.secondOptionsRef,
			values: SECONDS,
			style: {
				color: '#55b3ff'
			}
		}];

		const datetime = new Date(this.props.timestamp);
		const current = {
			[OPTIONS.year]: datetime.getFullYear(),
			[OPTIONS.month]: datetime.getMonth() + 1,
			[OPTIONS.date]:  datetime.getDate(),
			[OPTIONS.hour]: datetime.getHours(),
			[OPTIONS.minute]: datetime.getMinutes(),
			[OPTIONS.second]: datetime.getSeconds(),
		}

		const itemsArr = Object.values(current);
    const dateValues = new Date(current[OPTIONS.year], current[OPTIONS.month], 0).getDate();
    
    if (this.props.format === 'yyyy')
      this.showOptions = this.allOptions.filter(item => item.name === OPTIONS.year);
    else if (this.props.format === 'yyyy-MM')
      this.showOptions = this.allOptions.filter(item => item.name === OPTIONS.year || item.name === OPTIONS.month);
    else if (this.props.format === 'yyyy-MM-dd')
      this.showOptions = this.allOptions.filter(item => item.name === OPTIONS.year || item.name === OPTIONS.month || item.name === OPTIONS.date);
    else
      this.showOptions = this.allOptions;
    
    const date = this.showOptions.find(_o => _o.name === OPTIONS.date);
    if (date) 
      date.values = Array.from(Array(dateValues).keys()).map(_i => `${_i + 1}`);
		
		this.showOptions.forEach((_o, _i) => {
			const valueIndex = _o.values.findIndex(v => +v === itemsArr[_i]);
      this.current[_o.name] = _o.values[valueIndex];
      setTimeout(() => {
        _o.ref.style.transform = `translateY(${-optionHeight * valueIndex + offset}px)`;
      })
		})
		this.original = JSON.parse(JSON.stringify(this.current));
		this.forceUpdate();
	}

	componentWillUnmount() {
    document.removeEventListener('touchmove', this.preventScroll);
    // document.body.style.touchAction = '';
	}

	render() {
		return (
			<div className={styles["modal"]} onClick={this.handleDismiss}>
				<div className={styles["content"]} onClick={e => e.stopPropagation()}>
					<div className={styles["btn-container"]}>
						<div onClick={this.handleDismiss}>取消</div>
						<div onClick={this.handleOk}>确定</div>
					</div>

					<div className={styles["select-container"]}>
						<div className={styles["option-indicator"]} />
						{this.showOptions.map(option => (
							<div className={styles["option-container"]} key={option.name}
								onTouchStart={e => this.handleTouchStart(e, option.ref)}
								onTouchMove={e => this.handleTouchMove(e, option.ref)}
								onTouchEnd={e => this.handleTouchEnd(e, option, option.values.length)}
								onTransitionEnd={() => this.handleTransitionEnd(option)}
							>
								<div className={styles["option-mask"]} />
								<div className={styles["options"]}
									ref={ref => option.ref = ref}
								>
									{option.values.map(y => (
										<div key={y} className={styles["option"]} style={option.style}>{y}</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}

	get currentYear() {
		return this.current[OPTIONS.year]
	}

	set currentYear(year) {
		this.current[OPTIONS.year] = year;
	}

	get currentMonth() {
		return this.current[OPTIONS.month]
	}

	set currentMonth(month) {
		this.current[OPTIONS.month] = month;
	}

	get currentDate() {
		return this.current[OPTIONS.date]
	}

	set currentDate(date) {
		this.current[OPTIONS.date] = date;
	}

	get currentHour() {
		return this.current[OPTIONS.hour]
	}

	set currentHour(hour) {
		this.current[OPTIONS.hour] = hour;
	}

	get currentMinute() {
		return this.current[OPTIONS.minute]
	}

	set currentMinute(minute) {
		this.current[OPTIONS.minute] = minute;
	} 

	get currentSecond() {
		return this.current[OPTIONS.second]
	}

	set currentSecond(second) {
		this.current[OPTIONS.second] = second;
	}

	getCurrent = (option: OPTIONS, translateY: number) => {
		const currentOption = this.showOptions.find(item => item.name === option);
		const itemIndex = Math.round(Math.abs(translateY - offset) / optionHeight);
		return currentOption.values[itemIndex];
	}

	preventScroll = (e) => {
		e.preventDefault()
	}

	getTranslateY(element: HTMLDivElement) {
		const style = getComputedStyle(element);
		const matrix = new WebKitCSSMatrix(style.webkitTransform);
		return matrix.m42;
	}

	handleTouchStart = (e, element:HTMLDivElement) => {
		this.touchStartTranslatedY = this.getTranslateY(element);
		element.style.transitionDuration = '';
		this.touchStartPosition = e.changedTouches[0].clientY - this.touchStartTranslatedY;
		this.touchStartTime = Date.now();
	}

	handleTouchMove = (e, element: HTMLDivElement) => {
		element.style.transform = `translateY(${e.changedTouches[0].clientY - this.touchStartPosition}px)`;
	}

	handleTouchEnd = (e, option: OptionInterface, optionLength) => {
		const element = option.ref;
		const translatedY = this.getTranslateY(element);
		element.style.transitionDuration = '500ms';
		const timeDiff = Date.now() - this.touchStartTime;
		let additonalMomentum = 0;
		if (timeDiff < 100) {
			const total = (translatedY - this.touchStartTranslatedY) / timeDiff * 350;
			const fraction = total % optionHeight;
			additonalMomentum = total - fraction;
		}
		else if (timeDiff < 150) {
			const total = (translatedY - this.touchStartTranslatedY) / timeDiff * 200;
			const fraction = total % optionHeight;
			additonalMomentum = total - fraction;
		}
		else if (timeDiff < 200) {
			const total = (translatedY - this.touchStartTranslatedY) / timeDiff * 180;
			const fraction = total % optionHeight;
			additonalMomentum = total - fraction;
		}

		let translateY;
		// 超出上边界
		if (translatedY + additonalMomentum > 90)
			translateY = offset;
		// 超出下边界
		else if (translatedY + additonalMomentum < -(optionLength - optionItems - 1) * optionHeight)
			translateY = -(optionLength - optionItems - 1) * optionHeight;
		else {
			// 可能是小数
			const remain = translatedY % optionHeight;
			
			if (translatedY > 0) {
				if (Math.abs(remain) <= halfOptionHeight) 
					translateY = Math.round(translatedY - remain + additonalMomentum);
				else 
					translateY = Math.round(translatedY + optionHeight - remain + additonalMomentum);
			}
			else {
				if (Math.abs(remain) <= halfOptionHeight) 
					translateY = Math.round(translatedY - remain + additonalMomentum);
				else 
					translateY = Math.round(translatedY - optionHeight - remain + additonalMomentum);
			}
			if (remain === 0) {
				this['current' + option.name] = this.getCurrent(option.name, translateY);
				this.handleTransitionEnd(option);
			}
		}
		element.style.transform = `translateY(${translateY}px)`;
		this['current' + option.name] = this.getCurrent(option.name, translateY);
	}

	handleTransitionEnd = (option: OptionInterface) => {
    if (option.name !== OPTIONS.month && option.name !== OPTIONS.year) return;
    const date = this.showOptions.find(_o => _o.name === OPTIONS.date);
    if (!date) return;

		const dateValues = new Date(+this.currentYear, +this.currentMonth, 0).getDate();
		date.values = Array.from(Array(dateValues).keys()).map(_i => `${_i + 1}`);
		this.calculateDate(dateValues);
		this.forceUpdate();
	}

	calculateDate = (dateValues) => {
		const currentDate = this.showOptions.find(item => item.name === OPTIONS.date);
		const translatedY = this.getTranslateY(currentDate.ref);
		if (translatedY < -(dateValues - optionItems - 1) * optionHeight) {
			const translateY = -(dateValues - optionItems - 1) * optionHeight;
			currentDate.ref.style.transitionDuration = '';
			currentDate.ref.style.transform = `translateY(${translateY}px)`;
			this.current[OPTIONS.date] = this.getCurrent(OPTIONS.date, translateY);
		}
	}

	handleOk = () => {
    const ts = new Date(`${this.currentYear}/${this.currentMonth || 1}/${this.currentDate || 1} ${this.currentHour || 0}:${this.currentMinute || 0}:${this.currentSecond || 0}`).getTime();
    this.props.onOk(ts);
	}

	handleDismiss = () => {
		this.props.onDismiss();
	}
}