import { useState, useRef, useEffect } from 'react';
import hljs from "highlight.js";
import { formatCode } from '../../utils/codeUtils.js';

const CodeBox = ({
	title, 
	titleTag = 'h4',        // 기본값: h4
	titleClass = 'gui-tit3', // 기본값: gui-tit3
	children, 
	controls
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [code, setCode] =  useState('');
	const previewRef = useRef(null);
	const codeRef = useRef(null);
	const HeadingTag = titleTag;

	// 미리보기 영역의 HTML을 읽어서 코드로 변환
	const updateCode = () => {
		if (previewRef.current) {
			const rawHTML = previewRef.current.innerHTML;
			const formatted = formatCode(rawHTML);
			setCode(formatted);
		}
	}

	// 내용 변경 감지
	useEffect(() => {
		updateCode();
	},[children,controls])

	// children(내용물)이나 controls(옵션)이 바뀔 때마다 코드 업데이트
	useEffect(() => {
		if(isOpen && codeRef.current) {
			delete codeRef.current.dataset.highlighted;
			hljs.highlightElement(codeRef.current);
		}
	}, [isOpen, code])

	// [EVENT] 복사하기
	const handleCopy = () => {
		navigator.clipboard.writeText(code).then(() => {
			alert('코드가 복사되었습니다.')
		})
	}

	return (
		<div className="gui-code-box">
			{title && <HeadingTag className={titleClass}>{title} </HeadingTag>}
			{controls && <div className='gui-code-opt'>{controls}</div>}
			<div className='gui-code-item'>
				<div ref={previewRef}>{children}</div>
			</div>
			<div className="gui-code-btns">
				<button type="button" className="btn-code-view" onClick={() => setIsOpen(!isOpen)}>{isOpen ? '코드닫기' : '코드보기'}</button>
				<button type="button" className="btn-code-copy" onClick={handleCopy}>코드복사</button>
			</div>
			{isOpen && (
				<div className="gui-code-view active">
					<pre><code ref={codeRef} className="language-html">{code}</code></pre>
				</div>
			)}
		</div>
	)
}

export default CodeBox