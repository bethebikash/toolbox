import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Shell } from './Shell';

const HomePage            = lazy(() => import('../pages/HomePage'));
const CategoryPage        = lazy(() => import('../pages/CategoryPage'));
const NotFoundPage        = lazy(() => import('../pages/NotFoundPage'));
const UUIDGeneratorPage   = lazy(() => import('../features/utility/tools/uuid-generator/UUIDGeneratorPage'));
const JSONFormatterPage   = lazy(() => import('../features/developer/tools/json-formatter/JSONFormatterPage'));
const Base64Page          = lazy(() => import('../features/developer/tools/base64/Base64Page'));
const ImageCompressorPage = lazy(() => import('../features/image/tools/compressor/ImageCompressorPage'));
const PDFMergerPage       = lazy(() => import('../features/pdf/tools/merger/PDFMergerPage'));
const WordCounterPage     = lazy(() => import('../features/text/tools/word-counter/WordCounterPage'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '40vh', color: 'var(--color-text-tertiary)',
      fontFamily: 'var(--font-sans)', fontSize: '14px',
    }}>
      Loading...
    </div>
  );
}

function page(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { index: true,                              element: page(HomePage) },

      // ── Tool routes — must come BEFORE :category wildcard ──
      { path: 'tools/image/compressor',           element: page(ImageCompressorPage) },
      { path: 'tools/pdf/merger',                 element: page(PDFMergerPage) },
      { path: 'tools/utility/uuid-generator',     element: page(UUIDGeneratorPage) },
      { path: 'tools/developer/json-formatter',   element: page(JSONFormatterPage) },
      { path: 'tools/developer/base64',           element: page(Base64Page) },
      { path: 'tools/text/word-counter',          element: page(WordCounterPage) },

      // ── Category pages — catches /tools/:category ──
      { path: 'tools/:category',                  element: page(CategoryPage) },

      { path: '*',                                element: page(NotFoundPage) },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
