import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// 레이아웃
import PubLayout from './layouts/PubLayout';

// 페이지
import WorkList from './pages/pub/WorkList';
import GuideIntro from './pages/pub/GuideIntro';
import GuideButton from './pages/pub/GuideButton';
// import GuideList from './pages/pub/GuideList'; // /guide/list용 컴포넌트가 있다면 임포트 필요

function App() {
  return(
    // GitHub Pages 정적 호스팅 환경에 맞춰 HashRouter 사용 (basename 불필요)
    <HashRouter>
      <Routes>
        <Route path="/pub" element={<PubLayout />}>
          {/* 작업목록 */}
          {/* 절대 경로(/list)가 아닌 상대 경로(list) 사용 */}
          <Route index element={<Navigate to="list" replace />} />
          <Route path="list" element={<WorkList />}/>

          {/* 가이드 */}
          {/* 절대 경로가 아닌 상대 경로(intro) 사용 */}
          <Route path="guide" element={<Navigate to="intro" replace />} />
          <Route path="guide/intro" element={<GuideIntro />}/>
          <Route path="guide/button" element={<GuideButton />}/>
          
          {/* 사용자가 접근하려는 guide/list 경로가 필요하다면 아래와 같이 추가해야 합니다. */}
          {/* <Route path="guide/list" element={<GuideList />}/> */}

        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App;