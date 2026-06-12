import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'

const Home         = lazy(() => import('./pages/Home'))
const Resources    = lazy(() => import('./pages/Resources'))
const Roadmaps     = lazy(() => import('./pages/Roadmaps'))
const Predictor    = lazy(() => import('./pages/Predictor'))
const InnovationHub = lazy(() => import('./pages/InnovationHub'))
const DSA          = lazy(() => import('./pages/DSA'))
const YouTube      = lazy(() => import('./pages/YouTube'))
const Internships  = lazy(() => import('./pages/Internships'))
const Community    = lazy(() => import('./pages/Community'))
const MSBTE        = lazy(() => import('./pages/MSBTE'))
const Scholarships = lazy(() => import('./pages/Scholarships'))
const Placement    = lazy(() => import('./pages/Placement'))
const OpenSource   = lazy(() => import('./pages/OpenSource'))
const About        = lazy(() => import('./pages/About'))

export default function App() {
  return (
    <HashRouter>
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <main>
          <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
            <Routes>
              <Route path="/"              element={<Home />} />
              <Route path="/resources"     element={<Resources />} />
              <Route path="/roadmaps"      element={<Roadmaps />} />
              <Route path="/predictor"     element={<Predictor />} />
              <Route path="/innovation-hub" element={<InnovationHub />} />
              <Route path="/dsa"           element={<DSA />} />
              <Route path="/youtube"       element={<YouTube />} />
              <Route path="/internships"   element={<Internships />} />
              <Route path="/community"     element={<Community />} />
              <Route path="/msbte"         element={<MSBTE />} />
              <Route path="/scholarships"  element={<Scholarships />} />
              <Route path="/placement"     element={<Placement />} />
              <Route path="/opensource"    element={<OpenSource />} />
              <Route path="/about"         element={<About />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </HashRouter>
  )
}