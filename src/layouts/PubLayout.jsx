import { useState, useMemo } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import QuickNav from '../pages/pub/QuickNav'; // 경로 확인
import { PUB_DATA } from '../pages/pub/PubData'; // 데이터 가져오기
import '../assets/css/pub.css';

const PubLayout = () => {
	const location = useLocation();
	const isGuidePage = location.pathname.includes('pub/guide');

	/* ----------------------------------
		[DATA] 가이드 메뉴 목록 정의
	----------------------------------- */
    const GUIDE_MENU = [
        { path: '/pub/guide/intro', label: '기본정보', name : 'INFO' },
        { path: '/pub/guide/icon', label: '아이콘' , name : 'ICON' },
        { path: '/pub/guide/button', label: '버튼' , name : 'BUTTON' },
        { path: '/pub/guide/title', label: '타이틀', name : 'TITLE'},
        { path: '/pub/guide/text', label: '텍스트', name : 'TEXT' },
        { path: '/pub/guide/form', label: '폼' , name : 'FORM'},
    ];

	// 현재 URL과 path가 일치하는 메뉴 객체를 찾습니다.
	const currentMenu = useMemo(() => {
        return GUIDE_MENU.find(menu => menu.path === location.pathname) || { name: 'GUIDE', label: '가이드' };
    }, [location.pathname]);

	/* ----------------------------------
		[STATE MANAGEMENT]
	----------------------------------- */
	const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
	const [isPreviewOpen, setIsPreviewOpen] = useState(false); // 미리보기 모달 상태
	const [modalData, setModalData] = useState(null); // 모달에 표시할 데이터 상태
	const [activeNav, setActiveNav] = useState(''); // 현재 활성화된 카테고리 ID

	/* ----------------------------------
		[EVENT HANDLERS] 팝업 오픈
	----------------------------------- */
	const openModal = (modiList) => {
		setModalData(modiList);
		document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
	};

	/* ----------------------------------
		[EVENT HANDLERS] 팝업 닫기
	----------------------------------- */
	const closeModal = () => {
		setModalData(null);
		document.body.style.overflow = ''; // 배경 스크롤 복원
	};

	/* ----------------------------------
		[EVENT HANDLERS] 스크롤 이벤트
	----------------------------------- */
	const handleScroll = (e, targetId) => {
		e.preventDefault();
		setActiveNav(targetId); // 활성화 상태 변경

		const targetEl = document.getElementById(targetId);
		if(targetEl) {
			targetEl.scrollIntoView({behavior : 'smooth'});
		}
	};

	return(
		<>
		<div className='gui-wrap'>
			{/* ### [HEADER] ### */}
			<header className='gui-header'>
				<h1><strong>프로젝트명</strong><em>{isGuidePage ? 'GUIDE' : 'WORK LIST'}</em><span>PUBLISHING REACT GUIDE </span></h1>

				{/* [SEARCH BAR] */}
				{!isGuidePage && (
					<div className='gui-search'>
						<input
							type="text"
							placeholder="검색어를 입력해주세요"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				)}

				{/* [카테고리] */}
				<nav className='gui-nav'>
					{isGuidePage ? (
						<>
						{GUIDE_MENU.map((menu) => (
							<NavLink key={menu.path} to={menu.path} className={({isActive}) => isActive ? 'active' : ''}>
								{menu.label}
							</NavLink>
						))}
						</>
					) : (
						<>
						{PUB_DATA.map(section => (
							<a key={section.categoryID} href={`#${section.categoryID}`} className={activeNav === section.categoryID ? 'active' : ''} onClick={(e) => handleScroll(e, section.categoryID)}>
								{section.category}
							</a>
						))}
						</>
					)}
				</nav>

				{/* [BUTTONS] */}
				{!isGuidePage ? (
					<>
					<Link to="guide" className="gui-btn link">가이드</Link>
					<button type="button" className={`gui-btn view ${isPreviewOpen ? 'open' : ''}`} onClick={() => setIsPreviewOpen(!isPreviewOpen)} >
						{isPreviewOpen ? '미리보기 닫기' : '미리보기 열기'}
					</button>
					</>
				) : (
					<Link to="list" className="gui-btn link">작업목록</Link>
				)}
			</header>
			{/* ### [MAIN CONTENT] ### */}
			<div className={`gui-container ${isPreviewOpen ? 'preview' : ''}`}>
				<>
				{isGuidePage ? (
					<>
					<div className="gui-contents">
						<h1 className="gui-page">{currentMenu.name} <span>{currentMenu.label}</span></h1>
						<Outlet context={{ openModal }} />
					</div>
					<QuickNav />
					</>
				) : (
					<Outlet context={{ searchTerm, isPreviewOpen, openModal }} />
				)}
				</>
			</div>
		</div>
		{modalData && (
			<div className="modal-wrap modal-open" id="popupRevision">
				<article>
					<header>
						<h1>수정내역</h1>
						<button type="button" className="modal-close" onClick={closeModal}>수정내역 닫기</button>
					</header>
					<div className="modal-contents">
						<ul className="gui-list">
							{modalData.map((modi, i) => {
									return (
									<li key={i}>
										<div className="date">{modi.date}</div>
										<div className="cont">{modi.desc}</div>
									</li>
									)
								})
							}
						</ul>
					</div>
				</article>
			</div>
		)}
		</>
	)
}

export default PubLayout;