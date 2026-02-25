import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const QuickNav = () => {
	const location = useLocation();
    const [sections, setSections] = useState([]);
    const [activeIds, setActiveIds] = useState(new Set());

    useEffect(() => {
		setSections([]);
		setActiveIds(new Set());

		const scanAndObserve = () => {
			// h2, h3 태그 찾기
			const titles = document.querySelectorAll('h2, h3');

			if(titles.length === 0) return;

			const navItems = Array.from(titles).map((title, idx) => {
				const id = title.id || `guiSection${idx + 1}`;
				title.id = id; 
				return {
					id,
					text : title.textContent,
					type : title.tagName.toLowerCase() === 'h3' ? 'd2' : 'd1'
				};
			});
			setSections(navItems);

			// 스크롤 감지 (IntersectionObserver)
			const observer = new IntersectionObserver((entries) => {
				setActiveIds((prevIds) => {
					const newIds = new Set(prevIds);

					entries.forEach(entry => {
						if (entry.isIntersecting) {
							newIds.add(entry.target.id);// 화면에 보이면 Set에 추가
						} else {
							newIds.delete(entry.target.id);  // 화면에서 사라지면 Set에서 제거
						}
					});

					return newIds;
				})
			}, {rootMargin:'128px 0px 0px 0px',threshold: 0.3 });

			titles.forEach(t => observer.observe(t));
			return observer;
		}

		let observer = null;
		const timer = setTimeout(() => {
			observer = scanAndObserve();
		}, 100);

		return () => {
			clearTimeout(timer);
			if(observer) observer.disconnect();
		}

    }, [location.pathname]);

    const handleScroll = (e, id) => {
        e.preventDefault();
        const target = document.getElementById(id);
        if(target) {
            target.scrollIntoView({behavior : 'smooth'});
        }
    };

    if(sections.length === 0) return null;

    return (
        <div className="gui-quick">
            {sections.map(sec => (
                <a 
                    key={sec.id} 
                    href={`#${sec.id}`} 
                    className={`${sec.type} ${activeIds.has(sec.id) ? 'active' : ''}`} 
                    onClick={(e) => handleScroll(e, sec.id)}
                >
                    {sec.text}
                </a>
            ))}
        </div>
    );
};

export default QuickNav;