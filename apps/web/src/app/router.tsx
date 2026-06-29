import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Shell } from './Shell';

const HomePage              = lazy(() => import('../pages/HomePage'));
const CategoryPage          = lazy(() => import('../pages/CategoryPage'));
const NotFoundPage          = lazy(() => import('../pages/NotFoundPage'));
const ImageCompressorPage   = lazy(() => import('../features/image/tools/compressor/ImageCompressorPage'));
const PDFMergerPage         = lazy(() => import('../features/pdf/tools/merger/PDFMergerPage'));
const JSONFormatterPage     = lazy(() => import('../features/developer/tools/json-formatter/JSONFormatterPage'));
const Base64Page            = lazy(() => import('../features/developer/tools/base64/Base64Page'));
const HashGeneratorPage     = lazy(() => import('../features/developer/tools/hash-generator/HashGeneratorPage'));
const PasswordGeneratorPage = lazy(() => import('../features/developer/tools/password-generator/PasswordGeneratorPage'));
const URLEncoderPage        = lazy(() => import('../features/developer/tools/url-encoder/URLEncoderPage'));
const WordCounterPage       = lazy(() => import('../features/text/tools/word-counter/WordCounterPage'));
const UUIDGeneratorPage     = lazy(() => import('../features/utility/tools/uuid-generator/UUIDGeneratorPage'));
const VideoCompressorPage   = lazy(() => import('../features/video/tools/compressor/VideoCompressorPage'));

function PageLoader() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'40vh', color:'var(--color-text-tertiary)', fontFamily:'var(--font-sans)', fontSize:'14px' }}>
      Loading...
    </div>
  );
}

function page(Component: React.ComponentType) {
  return <Suspense fallback={<PageLoader />}><Component /></Suspense>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { index: true, element: page(HomePage) },
      {
        path: 'tools',
        children: [
          { path: ':category',                  element: page(CategoryPage) },
          { path: 'image/compressor',           element: page(ImageCompressorPage) },
          { path: 'pdf/merger',                 element: page(PDFMergerPage) },
          { path: 'developer/json-formatter',   element: page(JSONFormatterPage) },
          { path: 'developer/base64',           element: page(Base64Page) },
          { path: 'developer/hash-generator',   element: page(HashGeneratorPage) },
          { path: 'developer/password-generator', element: page(PasswordGeneratorPage) },
          { path: 'developer/url-encoder',      element: page(URLEncoderPage) },
          { path: 'text/word-counter',          element: page(WordCounterPage) },
          { path: 'utility/uuid-generator',     element: page(UUIDGeneratorPage) },
          { path: 'video/compressor',           element: page(VideoCompressorPage) },
        ],
      },
      { path: '*', element: page(NotFoundPage) },
    ],
  },
]);

export function AppRouter() { return <RouterProvider router={router} />; }
