import React, { useState } from 'react';

const Problem1 = () => {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState({ name: '', status: '' });
	const [show, setShow] = useState('all');

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewTask({ ...newTask, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (newTask.name && newTask.status) {
			setTasks([...tasks, newTask]);
			setNewTask({ name: '', status: '' });
		}
	};

	const handleClick = (val) => {
		setShow(val);
	};

	const getSortOrder = (status) => {
		switch (status.toLowerCase()) {
			case 'active':
				return 1;
			case 'completed':
				return 2;
			default:
				return 3;
		}
	};

	const sortedTasks =
		show === 'all'
			? tasks.sort((a, b) => getSortOrder(a.status) - getSortOrder(b.status))
			: tasks.filter((task) => task.status.toLowerCase() === show);

	return (
		<div className='container'>
			<div className='row justify-content-center mt-5'>
				<h4 className='text-center text-uppercase mb-5'>Problem-1</h4>
				<div className='col-6 '>
					<form
						className='row gy-2 gx-3 align-items-center mb-4'
						onSubmit={handleSubmit}
					>
						<div className='col-auto'>
							<input
								type='text'
								name='name'
								className='form-control'
								placeholder='Name'
								value={newTask.name}
								onChange={handleInputChange}
							/>
						</div>
						<div className='col-auto'>
							<input
								type='text'
								name='status'
								className='form-control'
								placeholder='Status'
								value={newTask.status}
								onChange={handleInputChange}
							/>
						</div>
						<div className='col-auto'>
							<button type='submit' className='btn btn-primary'>
								Submit
							</button>
						</div>
					</form>
				</div>
				<div className='col-8'>
					<ul className='nav nav-pills mb-3' id='pills-tab' role='tablist'>
						<li className='nav-item'>
							<button
								className={`nav-link ${show === 'all' && 'active'}`}
								type='button'
								onClick={() => handleClick('all')}
							>
								All
							</button>
						</li>
						<li className='nav-item'>
							<button
								className={`nav-link ${show === 'active' && 'active'}`}
								type='button'
								onClick={() => handleClick('active')}
							>
								Active
							</button>
						</li>
						<li className='nav-item'>
							<button
								className={`nav-link ${show === 'completed' && 'active'}`}
								type='button'
								onClick={() => handleClick('completed')}
							>
								Completed
							</button>
						</li>
					</ul>
					<div className='tab-content'></div>
					<table className='table table-striped '>
						<thead>
							<tr>
								<th scope='col'>Name</th>
								<th scope='col'>Status</th>
							</tr>
						</thead>
						<tbody>
							{sortedTasks.map((task, idx) => (
								<tr key={idx}>
									<td>{task.name}</td>
									<td>{task.status}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Problem1;
