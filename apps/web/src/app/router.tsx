import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Shell } from './Shell';

const HomePage              = lazy(() => import('../pages/HomePage'));
const CategoryPage          = lazy(() => import('../pages/CategoryPage'));
const NotFoundPage          = lazy(() => import('../pages/NotFoundPage'));

// Image
const ImageCompressorPage   = lazy(() => import('../features/image/tools/compressor/ImageCompressorPage'));
const ImageResizerPage      = lazy(() => import('../features/image/tools/resizer/ImageResizerPage'));
const ImageConverterPage    = lazy(() => import('../features/image/tools/converter/ImageConverterPage'));
const BulkCompressorPage    = lazy(() => import('../features/image/tools/bulk-compressor/BulkImageCompressorPage'));

// PDF
const PDFMergerPage         = lazy(() => import('../features/pdf/tools/merger/PDFMergerPage'));
const PDFSplitterPage       = lazy(() => import('../features/pdf/tools/splitter/PDFSplitterPage'));
const PDFCompressorPage     = lazy(() => import('../features/pdf/tools/compressor/PDFCompressorPage'));
const PDFToImagesPage       = lazy(() => import('../features/pdf/tools/to-images/PDFToImagesPage'));

// Developer
const JSONFormatterPage     = lazy(() => import('../features/developer/tools/json-formatter/JSONFormatterPage'));
const Base64Page            = lazy(() => import('../features/developer/tools/base64/Base64Page'));
const HashGeneratorPage     = lazy(() => import('../features/developer/tools/hash-generator/HashGeneratorPage'));
const PasswordGeneratorPage = lazy(() => import('../features/developer/tools/password-generator/PasswordGeneratorPage'));
const URLEncoderPage        = lazy(() => import('../features/developer/tools/url-encoder/URLEncoderPage'));

// Text + Utility
const WordCounterPage       = lazy(() => import('../features/text/tools/word-counter/WordCounterPage'));
const UUIDGeneratorPage     = lazy(() => import('../features/utility/tools/uuid-generator/UUIDGeneratorPage'));

// Video
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
          { path: ':category',                    element: page(CategoryPage) },

          // Image
          { path: 'image/compressor',             element: page(ImageCompressorPage) },
          { path: 'image/resizer',                element: page(ImageResizerPage) },
          { path: 'image/converter',              element: page(ImageConverterPage) },
          { path: 'image/bulk-compressor',        element: page(BulkCompressorPage) },

          // PDF
          { path: 'pdf/merger',                   element: page(PDFMergerPage) },
          { path: 'pdf/splitter',                 element: page(PDFSplitterPage) },
          { path: 'pdf/compressor',               element: page(PDFCompressorPage) },
          { path: 'pdf/to-images',                element: page(PDFToImagesPage) },

          // Developer
          { path: 'developer/json-formatter',     element: page(JSONFormatterPage) },
          { path: 'developer/base64',             element: page(Base64Page) },
          { path: 'developer/hash-generator',     element: page(HashGeneratorPage) },
          { path: 'developer/password-generator', element: page(PasswordGeneratorPage) },
          { path: 'developer/url-encoder',        element: page(URLEncoderPage) },

          // Text + Utility
          { path: 'text/word-counter',            element: page(WordCounterPage) },
          { path: 'utility/uuid-generator',       element: page(UUIDGeneratorPage) },

          // Video
          { path: 'video/compressor',             element: page(VideoCompressorPage) },
        ],
      },
      { path: '*', element: page(NotFoundPage) },
    ],
  },
]);

export function AppRouter() { return <RouterProvider router={router} />; }
