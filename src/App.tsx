import { Routes, Route } from 'react-router-dom';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import { CustomCursor } from '@/components/layout/CustomCursor';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { SpiderWebBackground } from '@/components/effects/SpiderWebBackground';
import { HomePage } from './pages/HomePage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <ScrollProgress />
      <SpiderWebBackground />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SmoothScrollProvider>
  );
}
