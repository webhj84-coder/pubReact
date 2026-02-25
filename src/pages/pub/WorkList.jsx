import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom'; // Layout에서 보낸 데이터 받기
import { PUB_DATA } from './PubData'; // 데이터 가져오기

const WorkList = () => {
	// Layout에서 검색어 가져오기
	const { searchTerm, isPreviewOpen, openModal} = useOutletContext();

	// 내부 상태 관리
	const [activeFilter, setActiveFilter] = useState('all'); // 필터 상태
	const [previewUrl, setPreviewUrl] = useState(''); // 미리보기 URL 상태

	/* ----------------------------------
		[DATA] 데이터 필터링 및 통계 로직
	----------------------------------- */
	// useMemo는 불필요한 재연산을 방지합니다.
	const {filterData, stats} = useMemo(() => {
		let processedData = JSON.parse(JSON.stringify(PUB_DATA)); // 깊은 복사

		// 통계용 변수 초기화
		const newStats = {total: 0, done: 0, ing: 0, wait: 0, modi: 0, qc: 0};
		let totalCount = 0;
		let doneTotalCount = 0;

		// 검색 및 필터링 로직
		const query = searchTerm.trim().toLowerCase();
		const keywords = query.split(/\s+/).filter(Boolean);

		processedData = processedData.map(section => {
			// 리스트 필터링
			const filteredLists = section.lists.filter(item => {
				// 검색어 필터링
				const modiText = (item.modi || []).map(m => `${m.date} ${m.desc}`).join('').toLowerCase();
				const text = `${item.Depth1} ${item.Depth2} ${item.Depth3} ${item.title} ${item.filename} ${item.date} ${modiText}`.toLowerCase();
				const isSearchMatch = keywords.every(kw => text.includes(kw));

				// 상태 필터링
				let isStatusMatch = true;
				if(activeFilter !== 'all') {
					if(activeFilter === 'done'){
						isStatusMatch = item.status === 'done' || item.status === 'modi';
					}else{
						isStatusMatch = item.status === activeFilter;
					}
				}

				return isSearchMatch && isStatusMatch;
			});

			return {...section, lists: filteredLists};
		}).filter(section => section.lists.length > 0); // 빈 섹션 제거

		// 3. 전체 통계 계산
		PUB_DATA.forEach(section => {
			section.lists.forEach(item => {
				newStats[item.status] = (newStats[item.status] || 0) + 1;
				totalCount++;
				//진행률 계산용 (완료 + 수정)
				if(item.status === 'done' || item.status === 'modi'){
					newStats['doneCountForPercent'] = (newStats['doneCountForPercent'] || 0) + 1;
					doneTotalCount++;
				}
			});
		});

		const percent = totalCount > 0 ? Math.round((doneTotalCount / totalCount) * 100) : 0;

		return {filterData: processedData, stats: {...newStats, total: totalCount, percent}};
	}, [searchTerm, activeFilter]); // 검색어, 필터 변경 시 재계산

	/* ----------------------------------
		[EVENT HANDLERS] 미리보기
	----------------------------------- */
	const handlePreview = (filename) => {
		if(isPreviewOpen) {
			setPreviewUrl(`${filename}.html`);
		}
	};

	/* ----------------------------------
		[EVENT HANDLERS] 모달팝업 열기
	----------------------------------- */
	const handleModalClick = (e, modiList) => {
		e.preventDefault();
		openModal(modiList);
	};

	/* ----------------------------------
		[RENDERING]
	----------------------------------- */
    return (
		<>
		{/* [STATUS] */}
		<div className="gui-status">
			<div className="btns">
				<button type="button" className={`all ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>전체 <span>{stats.total}</span></button>
				<button type="button" className={`wait ${activeFilter === 'wait' ? 'active' : ''}`} onClick={() => setActiveFilter('wait')}>대기 <span>{stats.wait}</span></button>
				<button type="button" className={`ing ${activeFilter === 'ing' ? 'active' : ''}`} onClick={() => setActiveFilter('ing')}>진행 <span>{stats.ing}</span></button>
				<button type="button" className={`qc ${activeFilter === 'qc' ? 'active' : ''}`} onClick={() => setActiveFilter('qc')}>검수 <span>{stats.qc}</span></button>
				<button type="button" className={`done ${activeFilter === 'done' ? 'active' : ''}`} onClick={() => setActiveFilter('done')}>완료 <span>{stats.done}</span></button>
				<button type="button" className={`modi ${activeFilter === 'modi' ? 'active' : ''}`} onClick={() => setActiveFilter('modi')}>수정 <span>{stats.modi}</span></button>
			</div>
			<div className="progress" style={{ '--el-width' : `${stats.percent}%`}}>{stats.percent}</div>
		</div>

		{/* [LIST] */}
		<div className="gui-lists">
			{filterData.map(section =>{
				// 섹션별 렌더링
				const sectionTotal = section.lists.length; // 섹션 내 아이템 수
				const sectionDone = section.lists.filter(i => i.status === 'done' || i.status === 'modi').length; // 섹션 내 완료된 아이템 수
				const sectionPercent = sectionTotal > 0 ? Math.round((sectionDone / sectionTotal) * 100) : 0; // 섹션 완료율

				return (
					<section key={section.categoryID} id={section.categoryID}>
						<div className="gui-tit1">
							<h2>{section.category}</h2>
							<p>진행률 : {sectionDone} / {sectionTotal} ({sectionPercent}%)</p>
						</div>
						<div className="gui-tbl">
							<table>
								<caption>{section.category} 목록</caption>
								<thead>
									<tr>
										<th scope="col" className="no">No.</th>
										<th scope="col" className="d1">1Depth</th>
										<th scope="col" className="d2">2Depth</th>
										<th scope="col" className="d3">3Depth</th>
										<th scope="col" className="name">화면명</th>
										<th scope="col" className="file">파일명</th>
										<th scope="col" className="worker">작업자</th>
										<th scope="col" className="date">완료일</th>
										<th scope="col" className="date">수정일</th>
										<th scope="col" className="status">상태</th>
										<th scope="col" className="etc">비고</th>
									</tr>
								</thead>
								<tbody>
									{section.lists.map((item, idx) => {
											const statusName = { "done": "완료", "ing": "진행", "wait": "대기", "modi": "수정", "qc": "검수" };
											return (
												<tr key={idx} className={item.status} onMouseEnter={() => handlePreview(item.filename)}>
													<td className="no">{idx + 1}</td>
													<td className="d1">{item.Depth1}</td>
													<td className="d2">{item.Depth2}</td>
													<td className="d3">{item.Depth3}</td>
													<td className="name">{item.title}</td>
													<td className="file"><a href={`${item.filename}.html`} target="_blank" rel="noreferrer">{item.filename}</a></td>
													<td className="worker">{item.worker}</td>
													<td className="date">{item.date}</td>
													<td className="revi">
														{item.modi && item.modi.length > 0 ? (
															<a href="#popupRevision" onClick={(e) => handleModalClick(e, item.modi)}>{item.modi[item.modi.length - 1].date}</a>
														) : '-'};
													</td>
													<td className="status"><span className={item.status}>{statusName[item.status]}</span></td>
													<td className="etc">{item.etc}</td>
												</tr>
											)
										})
									}
								</tbody>
							</table>
						</div>
					</section>
				)
			})}
		</div>

		{/* [Preview Area] */}
		{isPreviewOpen && (
			<div className="gui-preview">
				<iframe src={previewUrl} title="preview"></iframe>
			</div>
		)}
		</>
	)
};
export default WorkList;