import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Shell } from './Shell';

const HomePage               = lazy(() => import('../pages/HomePage'));
const CategoryPage           = lazy(() => import('../pages/CategoryPage'));
const NotFoundPage           = lazy(() => import('../pages/NotFoundPage'));

// Image
const ImageCompressorPage    = lazy(() => import('../features/image/tools/compressor/ImageCompressorPage'));
const ImageResizerPage       = lazy(() => import('../features/image/tools/resizer/ImageResizerPage'));
const ImageConverterPage     = lazy(() => import('../features/image/tools/converter/ImageConverterPage'));
const BulkCompressorPage     = lazy(() => import('../features/image/tools/bulk-compressor/BulkImageCompressorPage'));
const FlipRotatePage         = lazy(() => import('../features/image/tools/flip-rotate/FlipRotatePage'));
const WatermarkPage          = lazy(() => import('../features/image/tools/watermark/WatermarkPage'));
const ImageCropPage          = lazy(() => import('../features/image/tools/crop/ImageCropPage'));

// PDF
const PDFMergerPage          = lazy(() => import('../features/pdf/tools/merger/PDFMergerPage'));
const PDFSplitterPage        = lazy(() => import('../features/pdf/tools/splitter/PDFSplitterPage'));
const PDFCompressorPage      = lazy(() => import('../features/pdf/tools/compressor/PDFCompressorPage'));
const PDFToImagesPage        = lazy(() => import('../features/pdf/tools/to-images/PDFToImagesPage'));

// Developer
const JSONFormatterPage      = lazy(() => import('../features/developer/tools/json-formatter/JSONFormatterPage'));
const Base64Page             = lazy(() => import('../features/developer/tools/base64/Base64Page'));
const HashGeneratorPage      = lazy(() => import('../features/developer/tools/hash-generator/HashGeneratorPage'));
const PasswordGeneratorPage  = lazy(() => import('../features/developer/tools/password-generator/PasswordGeneratorPage'));
const URLEncoderPage         = lazy(() => import('../features/developer/tools/url-encoder/URLEncoderPage'));
const CSSMinifierPage        = lazy(() => import('../features/developer/tools/css-minifier/CSSMinifierPage'));
const JSMinifierPage         = lazy(() => import('../features/developer/tools/js-minifier/JSMinifierPage'));
const JWTDecoderPage         = lazy(() => import('../features/developer/tools/jwt-decoder/JWTDecoderPage'));

// Text
const WordCounterPage        = lazy(() => import('../features/text/tools/word-counter/WordCounterPage'));
const MarkdownConverterPage  = lazy(() => import('../features/text/tools/markdown-converter/MarkdownConverterPage'));
const CaseConverterPage      = lazy(() => import('../features/text/tools/case-converter/CaseConverterPage'));
const TextReverserPage       = lazy(() => import('../features/text/tools/text-reverser/TextReverserPage'));
const RemoveDuplicatesPage   = lazy(() => import('../features/text/tools/remove-duplicates/RemoveDuplicatesPage'));
const RemoveSpacesPage       = lazy(() => import('../features/text/tools/remove-spaces/RemoveSpacesPage'));
const TextSorterPage         = lazy(() => import('../features/text/tools/text-sorter/TextSorterPage'));

// Color & Design
const QRGeneratorPage        = lazy(() => import('../features/color/tools/qr-generator/QRGeneratorPage'));
const ColorPickerPage        = lazy(() => import('../features/color/tools/color-picker/ColorPickerPage'));

// Utility
const UUIDGeneratorPage      = lazy(() => import('../features/utility/tools/uuid-generator/UUIDGeneratorPage'));
const AgeCalculatorPage      = lazy(() => import('../features/utility/tools/age-calculator/AgeCalculatorPage'));
const PercentageCalcPage     = lazy(() => import('../features/utility/tools/percentage-calculator/PercentageCalculatorPage'));
const UnitConverterPage      = lazy(() => import('../features/utility/tools/unit-converter/UnitConverterPage'));
const BMICalculatorPage      = lazy(() => import('../features/utility/tools/bmi-calculator/BMICalculatorPage'));
const CountdownTimerPage     = lazy(() => import('../features/utility/tools/countdown-timer/CountdownTimerPage'));

// Video
const VideoCompressorPage    = lazy(() => import('../features/video/tools/compressor/VideoCompressorPage'));

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
          { path: ':category',                       element: page(CategoryPage) },

          // Image
          { path: 'image/compressor',                element: page(ImageCompressorPage) },
          { path: 'image/resizer',                   element: page(ImageResizerPage) },
          { path: 'image/converter',                 element: page(ImageConverterPage) },
          { path: 'image/bulk-compressor',           element: page(BulkCompressorPage) },
          { path: 'image/flip-rotate',               element: page(FlipRotatePage) },
          { path: 'image/watermark',                 element: page(WatermarkPage) },
          { path: 'image/crop',                      element: page(ImageCropPage) },

          // PDF
          { path: 'pdf/merger',                      element: page(PDFMergerPage) },
          { path: 'pdf/splitter',                    element: page(PDFSplitterPage) },
          { path: 'pdf/compressor',                  element: page(PDFCompressorPage) },
          { path: 'pdf/to-images',                   element: page(PDFToImagesPage) },

          // Developer
          { path: 'developer/json-formatter',        element: page(JSONFormatterPage) },
          { path: 'developer/base64',                element: page(Base64Page) },
          { path: 'developer/hash-generator',        element: page(HashGeneratorPage) },
          { path: 'developer/password-generator',    element: page(PasswordGeneratorPage) },
          { path: 'developer/url-encoder',           element: page(URLEncoderPage) },
          { path: 'developer/css-minifier',          element: page(CSSMinifierPage) },
          { path: 'developer/js-minifier',           element: page(JSMinifierPage) },
          { path: 'developer/jwt-decoder',           element: page(JWTDecoderPage) },

          // Text
          { path: 'text/word-counter',               element: page(WordCounterPage) },
          { path: 'text/markdown-converter',         element: page(MarkdownConverterPage) },
          { path: 'text/case-converter',             element: page(CaseConverterPage) },
          { path: 'text/text-reverser',              element: page(TextReverserPage) },
          { path: 'text/remove-duplicates',          element: page(RemoveDuplicatesPage) },
          { path: 'text/remove-spaces',              element: page(RemoveSpacesPage) },
          { path: 'text/text-sorter',                element: page(TextSorterPage) },

          // Color & Design
          { path: 'color/qr-generator',              element: page(QRGeneratorPage) },
          { path: 'color/color-picker',              element: page(ColorPickerPage) },

          // Utility
          { path: 'utility/uuid-generator',          element: page(UUIDGeneratorPage) },
          { path: 'utility/age-calculator',          element: page(AgeCalculatorPage) },
          { path: 'utility/percentage-calculator',   element: page(PercentageCalcPage) },
          { path: 'utility/unit-converter',          element: page(UnitConverterPage) },
          { path: 'utility/bmi-calculator',          element: page(BMICalculatorPage) },
          { path: 'utility/countdown-timer',         element: page(CountdownTimerPage) },

          // Video
          { path: 'video/compressor',                element: page(VideoCompressorPage) },
        ],
      },
      { path: '*', element: page(NotFoundPage) },
    ],
  },
]);

export function AppRouter() { return <RouterProvider router={router} />; }
