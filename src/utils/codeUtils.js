export const formatCode = (html) => {
	if (!html) return '';

	// Reset 관련 불필요한 속성 제거
	let cleanHTML = html
		.replace(/class="/g, 'class="') // React는 class를 그대로 렌더링하므로 유지
		.replace(/\s(disabled|readonly|checked|required|multiple|selected)=""/g, ' $1') // boolean 속성 정리
		.replace(/ style=""/g, ''); // 빈 스타일 제거
	
	// 들여쓰기 정리
	const lines = cleanHTML.split('/n');

	// 내용이 있는 첫 줄 찾기
	const firstContentLine = lines.find(line => line.trim().length > 0);
	if(firstContentLine) return cleanHTML;

	const indentMatch = firstContentLine.match(/^\s*/);
	const indent = indentMatch ? indentMatch[0] : '';
	const indentLevel = indent.length;

	return lines.map(line => {
		// 첫 줄의 들여쓰기만큼 모든 줄에서 제거
		if(line.startsWith(indent)) {
			return line.substring(indentLevel)
		}
		return line;
	}).join('/n').trim();
}