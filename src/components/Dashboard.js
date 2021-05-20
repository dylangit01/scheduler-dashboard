import React, { Component } from 'react';
import Loading from './Loading';
import Panel from './Panel';
import axios from 'axios'
import {
 getTotalInterviews,
 getLeastPopularTimeSlot,
 getMostPopularDay,
 getInterviewsPerDay
} from "helpers/selectors";
import { setInterview } from 'helpers/reducers';

import classnames from 'classnames';

const data = [
	{
		id: 1,
		label: 'Total Interviews',
		getValue: getTotalInterviews,
	},
	{
		id: 2,
		label: 'Least Popular Time Slot',
		getValue: getLeastPopularTimeSlot,
	},
	{
		id: 3,
		label: 'Most Popular Day',
		getValue: getMostPopularDay,
	},
	{
		id: 4,
		label: 'Interviews Per Day',
		getValue: getInterviewsPerDay,
	},
];

class Dashboard extends Component {
	state = {
		loading: true,
		focused: null,
		days: [],
		appointments: {},
		interviewers: {},
	};

	componentDidMount() {
		const focused = JSON.parse(localStorage.getItem('focused'));
		if (focused) {
			// This is to keep the focused value stay whenever refresh the page
			this.setState({ focused });
		}

		// Fetch data:
		Promise.all([axios.get('/api/days'), axios.get('/api/appointments'), axios.get('/api/interviewers')]).then(
			([days, appointments, interviewers]) => {
				this.setState({
					loading: false,
					days: days.data,
					appointments: appointments.data,
					interviewers: interviewers.data,
				});
			}
		);

		// Create a WebSockets instance variable
    this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    
    this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (typeof data === 'object' && data.type === 'SET_INTERVIEW') {
				this.setState((previousState) => setInterview(previousState, data.id, data.interview));
			}
		};
	}

	componentDidUpdate(previousProps, previousState) {
		// This is to update the focused whenever the focused value changes, and save to localStorage
		if (previousState.focused !== this.state.focused) {
			localStorage.setItem('focused', JSON.stringify(this.state.focused));
		}
	}

	selectPanel(id) {
		// this.setState({focused: this.state.focused !== null ? null : id})
		this.setState((prev) => ({ focused: prev.focused !== null ? null : id }));
	}

	componentWillUnmount() {
		this.socket.close();
	}

	render() {
		const dashboardClasses = classnames('dashboard', {
			'dashboard--focused': this.state.focused,
		});

		return (
			<>
				{this.state.loading ? (
					<Loading />
				) : (
					<main className={dashboardClasses}>
						{data
							.filter((panel) => this.state.focused === null || this.state.focused === panel.id)
							.map((panel) => (
								<Panel
									key={panel.id}
									label={panel.label}
									value={panel.getValue(this.state)}
									onSelect={() => this.selectPanel(panel.id)}
								/>
							))}
					</main>
				)}
			</>
		);
	}
}

export default Dashboard;
