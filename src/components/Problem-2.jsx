import React, { useEffect, useState } from 'react';

const Problem2 = () => {
	const [allContacts, setAllContacts] = useState([]);
	const [usContacts, setUsContacts] = useState([]);
	const [hasMorePagesA, setHasMorePagesA] = useState(true);
	const [hasMorePagesB, setHasMorePagesB] = useState(true);
	const [modalAVisible, setModalAVisible] = useState(false);
	const [modalBVisible, setModalBVisible] = useState(false);
	const [modalCVisible, setModalCVisible] = useState(false);
	const [selectedContact, setSelectedContact] = useState(null);
	const [onlyEven, setOnlyEven] = useState(false);
	const [searchQueryA, setSearchQueryA] = useState('');
	const [searchQueryB, setSearchQueryB] = useState('');
	const [pageA, setPageA] = useState(1);
	const [pageB, setPageB] = useState(1);

	const fetchContacts = async (page, country = null, searchQuery = '') => {
		const url = country
			? `https://contact.mediusware.com/api/country-contacts/${country}/?page=${page}&search=${searchQuery}`
			: `https://contact.mediusware.com/api/contacts/?page=${page}&search=${searchQuery}`;

		const response = await fetch(url);
		const data = await response.json();

		const setHasMorePages =
			country === 'United States' ? setHasMorePagesB : setHasMorePagesA;
		setHasMorePages(!!data.next);

		return data.results;
	};

	const loadMoreContacts = async (country, setPage) => {
		setPage((prevPage) => {
			const nextPage = prevPage + 1;
			fetchContacts(
				nextPage,
				country,
				country === 'United States' ? searchQueryB : searchQueryA
			).then((data) => {
				if (country === 'United States') {
					setUsContacts((prevContacts) => [...prevContacts, ...data]);
				} else {
					setAllContacts((prevContacts) => [...prevContacts, ...data]);
				}
			});
			return nextPage;
		});
	};

	useEffect(() => {
		if (modalAVisible) {
			fetchContacts(pageA, null, searchQueryA)
				.then((data) => {
					setAllContacts(data);
				})
				.catch((error) => {
					console.error('Error fetching contacts:', error);
				});
		}
	}, [modalAVisible, pageA, searchQueryA]);

	useEffect(() => {
		const fetchData = async () => {
			setPageB(1);
			const data = await fetchContacts(1, 'United States', searchQueryB);
			setUsContacts(data);
		};

		if (modalBVisible) {
			fetchData();
		}
	}, [modalBVisible, searchQueryB]);

	useEffect(() => {
		setPageA(1);
		fetchContacts(1, null, searchQueryA).then((data) => {
			setAllContacts(data);
		});
	}, [searchQueryA]);

	useEffect(() => {
		setPageB(1);
		fetchContacts(1, 'United States', searchQueryB).then((data) => {
			setUsContacts(data);
		});
	}, [searchQueryB]);

	const openModalC = (contact) => {
		setSelectedContact(contact);
		setModalCVisible(true);
	};

	const filteredContacts = onlyEven
		? allContacts.filter((contact) => contact.id % 2 === 0)
		: allContacts;

	const filteredUsContacts = onlyEven
		? usContacts.filter((contact) => contact.id % 2 === 0)
		: usContacts;

	const switchModals = (modal) => {
		setModalAVisible(modal === 'A');
		setModalBVisible(modal === 'B');
	};

	return (
		<div className='container'>
			<div className='row justify-content-center mt-5'>
				<h4 className='text-center text-uppercase mb-5'>Problem-2</h4>
				<div className='d-flex justify-content-center gap-3'>
					<button
						className='btn btn-lg text-white'
						style={{ backgroundColor: '#46139f' }}
						onClick={() => setModalAVisible(true)}
					>
						All Contacts
					</button>
					<button
						className='btn btn-lg'
						style={{ backgroundColor: '#ff7f50' }}
						onClick={() => setModalBVisible(true)}
					>
						US Contacts
					</button>
				</div>

				{/* All Contacts (Modal A) */}
				<div
					className={`modal ${modalAVisible ? 'd-block' : 'd-none'}`}
					tabIndex='-1'
				>
					<div className='modal-dialog'>
						<div className='modal-content'>
							<div className='modal-header'>
								<h5 className='modal-title'>All Contacts (Modal A)</h5>
								<button
									className='btn btn-danger'
									type='button'
									onClick={() => setModalAVisible(false)}
								>
									Close
								</button>
							</div>
							<div className='modal-body'>
								<input
									type='text'
									className='form-control mb-3'
									placeholder='Search...'
									onChange={(e) => setSearchQueryA(e.target.value)}
								/>
								{/* Display Contacts */}

								<div
									className='list-group'
									onScroll={(event) => {
										const { scrollTop, clientHeight, scrollHeight } =
											event.currentTarget;
										if (scrollHeight - scrollTop === clientHeight) {
											if (modalAVisible && hasMorePagesA) {
												loadMoreContacts(null, setPageA);
											} else if (modalBVisible && hasMorePagesB) {
												loadMoreContacts('United States', setPageB);
											}
										}
									}}
									style={{ maxHeight: '400px', overflowY: 'auto' }}
								>
									{filteredContacts.map((contact) => (
										<a
											href='#'
											className='list-group-item list-group-item-action'
											key={contact.id}
											onClick={() => openModalC(contact)}
										>
											{contact.phone}
										</a>
									))}
								</div>
							</div>
							<div className='modal-footer d-flex justify-content-between'>
								<div>
									{' '}
									<input
										type='checkbox'
										checked={onlyEven}
										className='form-check-input'
										onChange={() => setOnlyEven(!onlyEven)}
									/>{' '}
									Only Even
								</div>
								<div>
									<button
										className='btn text-white me-3'
										style={{ backgroundColor: '#46139f' }}
										onClick={() => switchModals('A')}
									>
										All Contacts
									</button>
									<button
										className='btn'
										style={{ backgroundColor: '#ff7f50' }}
										onClick={() => switchModals('B')}
									>
										US Contacts
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* United States(Modal B) */}
				<div
					className={`modal ${modalBVisible ? 'd-block' : 'd-none'}`}
					tabIndex='-1'
				>
					<div className='modal-dialog'>
						<div className='modal-content'>
							<div className='modal-header'>
								<h5 className='modal-title'>United States(Modal B)</h5>
								<button
									className='btn btn-danger'
									type='button'
									onClick={() => setModalBVisible(false)}
								>
									Close
								</button>
							</div>
							<div className='modal-body'>
								<input
									type='text'
									className='form-control mb-3'
									placeholder='Search...'
									onChange={(e) => setSearchQueryB(e.target.value)}
								/>
								{/* Display Contacts */}
								<div
									className='list-group'
									onScroll={(event) => {
										const { scrollTop, clientHeight, scrollHeight } =
											event.currentTarget;
										if (scrollHeight - scrollTop === clientHeight) {
											if (modalBVisible && hasMorePagesB) {
												loadMoreContacts('United States', setPageB);
											}
										}
									}}
									style={{ maxHeight: '400px', overflowY: 'auto' }}
								>
									{filteredUsContacts.map((contact) => (
										<a
											href='#'
											className='list-group-item list-group-item-action'
											key={contact.id}
											onClick={() => openModalC(contact)}
										>
											{contact.phone}
										</a>
									))}
								</div>
							</div>
							<div className='modal-footer d-flex justify-content-between'>
								<div>
									{' '}
									<input
										type='checkbox'
										checked={onlyEven}
										className='form-check-input'
										onChange={() => setOnlyEven(!onlyEven)}
									/>{' '}
									Only Even
								</div>
								<div>
									<button
										className='btn btn-primary me-3'
										style={{ backgroundColor: '#46139f' }}
										onClick={() => switchModals('A')}
									>
										All Contacts
									</button>
									<button
										className='btn btn-warning'
										style={{ backgroundColor: '#ff7f50' }}
										onClick={() => switchModals('B')}
									>
										US Contacts
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Contact Details (Modal C)*/}
				<div
					className={`modal modal-sm modal-dialog modal-dialog-centered ml-5 ${
						modalCVisible ? 'd-block' : 'd-none'
					}`}
					tabIndex='-1'
				>
					<div className='modal-dialog shadow rounded'>
						<div
							className='modal-content'
							style={{ border: '1px solid #46139f' }}
						>
							<div className='modal-header'>
								<h5 className='modal-title'>Contact Details</h5>
								<button
									className='btn-close'
									onClick={() => setModalCVisible(false)}
								></button>
							</div>
							<div className='modal-body'>
								{selectedContact && (
									<div>
										<p>📝 ID: {selectedContact.id}</p>
										<p>📱 Phone: {selectedContact.phone}</p>
										<p>🗺️ Country: {selectedContact.country.name}</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Problem2;
