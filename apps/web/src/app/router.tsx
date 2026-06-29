import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Shell } from './Shell';

// Pages
const HomePage     = lazy(() => import('../pages/HomePage'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Image tools
const ImageCompressorPage = lazy(() => import('../features/image/tools/compressor/ImageCompressorPage'));

// PDF tools
const PDFMergerPage = lazy(() => import('../features/pdf/tools/merger/PDFMergerPage'));

// Developer tools
const JSONFormatterPage = lazy(() => import('../features/developer/tools/json-formatter/JSONFormatterPage'));
const Base64Page        = lazy(() => import('../features/developer/tools/base64/Base64Page'));

// Text tools
const WordCounterPage = lazy(() => import('../features/text/tools/word-counter/WordCounterPage'));

// Utility tools
const UUIDGeneratorPage = lazy(() => import('../features/utility/tools/uuid-generator/UUIDGeneratorPage'));

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
      { index: true, element: page(HomePage) },

      // tools/ — nested so specific routes always win over :category
      {
        path: 'tools',
        children: [
          // Category index pages
          { path: ':category', element: page(CategoryPage) },

          // Image
          { path: 'image/compressor', element: page(ImageCompressorPage) },

          // PDF
          { path: 'pdf/merger',       element: page(PDFMergerPage) },

          // Developer
          { path: 'developer/json-formatter', element: page(JSONFormatterPage) },
          { path: 'developer/base64',         element: page(Base64Page) },

          // Text
          { path: 'text/word-counter', element: page(WordCounterPage) },

          // Utility
          { path: 'utility/uuid-generator', element: page(UUIDGeneratorPage) },
        ],
      },

      { path: '*', element: page(NotFoundPage) },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
