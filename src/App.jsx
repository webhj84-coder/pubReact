import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 레이아웃
import PubLayout from './layouts/PubLayout';

// 페이지\
import WorkList from './pages/pub/WorkList';
import GuideIntro from './pages/pub/GuideIntro';
import GuideButton from './pages/pub/GuideButton';

function App() {
	return(
		<BrowserRouter>
			<Routes>
				<Route path="/pub" element={<PubLayout />}>
					{/* 작업목록 */}
					<Route index element={<Navigate to="/list" replace />} />
					<Route path="list" element={<WorkList />}/>

					{/* 가이드 */}
					<Route path="guide" element={<Navigate to="intro" replace />} />
					<Route path="guide/intro" element={<GuideIntro />}/>
					<Route path="guide/button" element={<GuideButton />}/>

				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App;