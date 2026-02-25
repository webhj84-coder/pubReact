import { useState } from 'react';
import CodeBox from './GuideCodeBox';

const ButtonGuide = () => {
// 옵션 상태 관리
    const [btnClass, setBtnClass] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);

	return (
	<div className="gui-component">
		<section className="gui-section">
			<h2 className="gui-tit1">유형1</h2>

			<div className="gui-area">
				<h3 className="gui-tit2">유형1_1</h3>
				<div className="gui-info">
					<p>페이지의 최종 액션(확인, 취소 등)이 일어나는 바</p>
					<div className="gui-tbl">
						<table summary="버튼유형1_1에 대한 속성정보">
							<tbody>
								<tr>
									<th>클래스</th>
									<td><code>btn-com1</code></td>
								</tr>
								<tr>
									<th>설명</th>
									<td>기본 버튼 스타일</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<CodeBox 
					title="타이틀1"
					controls={
					<>
						<select title="색상변경" onChange={(e) => setBtnClass(e.target.value)} value={btnClass}>
							<option value="">기본</option>
							<option value="c1">색상1</option>
							<option value="c2">색상2</option>
							<option value="c3">색상3</option>
						</select>
						<select title="속성변경" onChange={(e) => setIsDisabled(e.target.value)} value={isDisabled.toString()}>
							<option value="">기본</option>
                            <option value="true">비활성화</option>
						</select>
					</>
					}
				>
					<button type="button" className={`btn-action ${btnClass}`} disabled={isDisabled}>버튼명</button>
				</CodeBox>
			</div>
		</section>
	</div>
	)
}

export default ButtonGuide;