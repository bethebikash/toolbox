import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Shell } from './Shell';

const HomePage            = lazy(() => import('../pages/HomePage'));
const CategoryPage        = lazy(() => import('../pages/CategoryPage'));
const NotFoundPage        = lazy(() => import('../pages/NotFoundPage'));
const UUIDGeneratorPage   = lazy(() => import('../features/utility/tools/uuid-generator/UUIDGeneratorPage'));
const JSONFormatterPage   = lazy(() => import('../features/developer/tools/json-formatter/JSONFormatterPage'));
const ImageCompressorPage = lazy(() => import('../features/image/tools/compressor/ImageCompressorPage'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '40vh',
      color: 'var(--color-neutral-400)',
      fontFamily: 'var(--font-sans)',
      fontSize: '14px',
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
      { path: 'tools/:category',                  element: page(CategoryPage) },
      { path: 'tools/image/compressor',           element: page(ImageCompressorPage) },
      { path: 'tools/utility/uuid-generator',     element: page(UUIDGeneratorPage) },
      { path: 'tools/developer/json-formatter',   element: page(JSONFormatterPage) },
      { path: '*',                                element: page(NotFoundPage) },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
