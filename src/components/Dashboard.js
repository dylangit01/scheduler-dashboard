import React, { Component } from 'react';
import Loading from './Loading';
import Panel from './Panel';

import classnames from 'classnames';

const data = [
	{
		id: 1,
		label: 'Total Interviews',
		value: 6,
	},
	{
		id: 2,
		label: 'Least Popular Time Slot',
		value: '1pm',
	},
	{
		id: 3,
		label: 'Most Popular Day',
		value: 'Wednesday',
	},
	{
		id: 4,
		label: 'Interviews Per Day',
		value: '2.3',
	},
];

class Dashboard extends Component {
	state = {
		loading: false,
		focused: null,
	};

	selectPanel(id) {
    // this.setState({focused: this.state.focused !== null ? null : id})
    this.setState(prev => ({focused : prev.focused !== null ? null : id}))
	};

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
								<Panel key={panel.id} {...panel} onSelect={() => this.selectPanel(panel.id)} />
							))}
					</main>
				)}
			</>
		);
	}
}

export default Dashboard;
