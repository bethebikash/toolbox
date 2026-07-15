import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Shell } from './Shell';

const HomePage = lazy(() => import('../pages/HomePage'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Image
const ImageCompressorPage = lazy(() => import('../features/image/tools/compressor/ImageCompressorPage'));
const ImageResizerPage = lazy(() => import('../features/image/tools/resizer/ImageResizerPage'));
const ImageConverterPage = lazy(() => import('../features/image/tools/converter/ImageConverterPage'));
const BulkCompressorPage = lazy(() => import('../features/image/tools/bulk-compressor/BulkImageCompressorPage'));
const FlipRotatePage = lazy(() => import('../features/image/tools/flip-rotate/FlipRotatePage'));
const WatermarkPage = lazy(() => import('../features/image/tools/watermark/WatermarkPage'));
const ImageCropPage = lazy(() => import('../features/image/tools/crop/ImageCropPage'));
const ImageToBase64Page = lazy(() => import('../features/image/tools/to-base64/ImageToBase64Page'));
const EXIFViewerPage = lazy(() => import('../features/image/tools/exif-viewer/EXIFViewerPage'));
const ImageFiltersPage = lazy(() => import('../features/image/tools/filters/ImageFiltersPage'));

// PDF
const PDFMergerPage = lazy(() => import('../features/pdf/tools/merger/PDFMergerPage'));
const PDFSplitterPage = lazy(() => import('../features/pdf/tools/splitter/PDFSplitterPage'));
const PDFCompressorPage = lazy(() => import('../features/pdf/tools/compressor/PDFCompressorPage'));
const PDFToImagesPage = lazy(() => import('../features/pdf/tools/to-images/PDFToImagesPage'));

// Developer
const JSONFormatterPage = lazy(() => import('../features/developer/tools/json-formatter/JSONFormatterPage'));
const Base64Page = lazy(() => import('../features/developer/tools/base64/Base64Page'));
const HashGeneratorPage = lazy(() => import('../features/developer/tools/hash-generator/HashGeneratorPage'));
const PasswordGeneratorPage = lazy(() => import('../features/developer/tools/password-generator/PasswordGeneratorPage'));
const URLEncoderPage = lazy(() => import('../features/developer/tools/url-encoder/URLEncoderPage'));
const CSSMinifierPage = lazy(() => import('../features/developer/tools/css-minifier/CSSMinifierPage'));
const JSMinifierPage = lazy(() => import('../features/developer/tools/js-minifier/JSMinifierPage'));
const JWTDecoderPage = lazy(() => import('../features/developer/tools/jwt-decoder/JWTDecoderPage'));
const ContrastCheckerPage = lazy(() => import('../features/color/tools/contrast-checker/ContrastCheckerPage'));
const EscapeUnescapePage     = lazy(() => import('../features/developer/tools/escape-unescape/EscapeUnescapePage'));
const MarkdownTablePage       = lazy(() => import('../features/developer/tools/markdown-table/MarkdownTablePage'));
const URLParserPage          = lazy(() => import('../features/developer/tools/url-parser/URLParserPage'));
const CronParserPage = lazy(() => import('../features/developer/tools/cron-parser/CronParserPage'));
const JSONToTypeScriptPage = lazy(() => import('../features/developer/tools/json-to-typescript/JSONToTypeScriptPage'));
const NumberFormatterPage = lazy(() => import('../features/developer/tools/number-formatter/NumberFormatterPage'));
const PasswordStrengthPage = lazy(() => import('../features/developer/tools/password-strength/PasswordStrengthPage'));
const SimpleInterestPage     = lazy(() => import('../features/utility/tools/simple-interest/SimpleInterestPage'));
const DiscountCalculatorPage  = lazy(() => import('../features/utility/tools/discount-calculator/DiscountCalculatorPage'));
const TemperatureConverterPage= lazy(() => import('../features/utility/tools/temperature-converter/TemperatureConverterPage'));
const MortgageCalculatorPage = lazy(() => import('../features/utility/tools/mortgage-calculator/MortgageCalculatorPage'));
const CalorieCalculatorPage = lazy(() => import('../features/utility/tools/calorie-calculator/CalorieCalculatorPage'));
const DateCalculatorPage = lazy(() => import('../features/utility/tools/date-calculator/DateCalculatorPage'));
const SpeedCalculatorPage = lazy(() => import('../features/utility/tools/speed-calculator/SpeedCalculatorPage'));
const BaseConverterPage = lazy(() => import('../features/utility/tools/base-converter/BaseConverterPage'));
const AspectRatioPage = lazy(() => import('../features/utility/tools/aspect-ratio/AspectRatioPage'));
const TextStatisticsPage = lazy(() => import('../features/text/tools/text-statistics/TextStatisticsPage'));
const PalindromeCheckerPage  = lazy(() => import('../features/text/tools/palindrome-checker/PalindromeCheckerPage'));
const FindReplacePage = lazy(() => import('../features/text/tools/find-replace/FindReplacePage'));
const DiffToolPage = lazy(() => import('../features/developer/tools/diff-tool/DiffToolPage'));
const ColorConverterPage = lazy(() => import('../features/developer/tools/color-converter/ColorConverterPage'));
const HTMLMinifierPage = lazy(() => import('../features/developer/tools/html-minifier/HTMLMinifierPage'));
const XMLFormatterPage = lazy(() => import('../features/developer/tools/xml-formatter/XMLFormatterPage'));
const RegexTesterPage = lazy(() => import('../features/developer/tools/regex-tester/RegexTesterPage'));

// Text
const WordCounterPage = lazy(() => import('../features/text/tools/word-counter/WordCounterPage'));
const MarkdownConverterPage = lazy(() => import('../features/text/tools/markdown-converter/MarkdownConverterPage'));
const CaseConverterPage = lazy(() => import('../features/text/tools/case-converter/CaseConverterPage'));
const TextReverserPage = lazy(() => import('../features/text/tools/text-reverser/TextReverserPage'));
const RemoveDuplicatesPage = lazy(() => import('../features/text/tools/remove-duplicates/RemoveDuplicatesPage'));
const RemoveSpacesPage = lazy(() => import('../features/text/tools/remove-spaces/RemoveSpacesPage'));
const TextSorterPage = lazy(() => import('../features/text/tools/text-sorter/TextSorterPage'));
const TextToSlugPage = lazy(() => import('../features/text/tools/text-to-slug/TextToSlugPage'));
const LoremIpsumPage = lazy(() => import('../features/text/tools/lorem-ipsum/LoremIpsumPage'));
const ReadingTimePage = lazy(() => import('../features/text/tools/reading-time/ReadingTimePage'));
const UnicodeConverterPage = lazy(() => import('../features/text/tools/unicode-converter/UnicodeConverterPage'));

// Color & Design
const QRGeneratorPage = lazy(() => import('../features/color/tools/qr-generator/QRGeneratorPage'));
const ColorPalettePage = lazy(() => import('../features/color/tools/color-palette/ColorPalettePage'));
const ColorPickerPage = lazy(() => import('../features/color/tools/color-picker/ColorPickerPage'));
const FaviconGeneratorPage = lazy(() => import('../features/color/tools/favicon-generator/FaviconGeneratorPage'));
const GradientGeneratorPage = lazy(() => import('../features/color/tools/gradient-generator/GradientGeneratorPage'));
const BarcodeGeneratorPage = lazy(() => import('../features/color/tools/barcode-generator/BarcodeGeneratorPage'));

// Utility
const UUIDGeneratorPage = lazy(() => import('../features/utility/tools/uuid-generator/UUIDGeneratorPage'));
const AgeCalculatorPage = lazy(() => import('../features/utility/tools/age-calculator/AgeCalculatorPage'));
const PercentageCalcPage = lazy(() => import('../features/utility/tools/percentage-calculator/PercentageCalculatorPage'));
const UnitConverterPage = lazy(() => import('../features/utility/tools/unit-converter/UnitConverterPage'));
const BMICalculatorPage = lazy(() => import('../features/utility/tools/bmi-calculator/BMICalculatorPage'));
const CountdownTimerPage = lazy(() => import('../features/utility/tools/countdown-timer/CountdownTimerPage'));
const TimestampConverterPage = lazy(() => import('../features/utility/tools/timestamp-converter/TimestampConverterPage'));
const TipCalculatorPage = lazy(() => import('../features/utility/tools/tip-calculator/TipCalculatorPage'));
const LoanCalculatorPage = lazy(() => import('../features/utility/tools/loan-calculator/LoanCalculatorPage'));
const RandomGeneratorPage = lazy(() => import('../features/utility/tools/random-generator/RandomGeneratorPage'));
const NumberToWordsPage = lazy(() => import('../features/utility/tools/number-to-words/NumberToWordsPage'));
const CharFrequencyPage = lazy(() => import('../features/utility/tools/char-frequency/CharFrequencyPage'));
const CurrencyConverterPage = lazy(() => import('../features/utility/tools/currency-converter/CurrencyConverterPage'));

// Video
const VideoCompressorPage = lazy(() => import('../features/video/tools/compressor/VideoCompressorPage'));
const VideoTrimmerPage = lazy(() => import('../features/video/tools/trimmer/VideoTrimmerPage'));

// Audio
const ExtractAudioPage = lazy(() => import('../features/audio/tools/extract-audio/ExtractAudioPage'));

// SEO
const MetaTagGeneratorPage = lazy(() => import('../features/seo/tools/meta-tag-generator/MetaTagGeneratorPage'));
const RobotsGeneratorPage = lazy(() => import('../features/seo/tools/robots-generator/RobotsGeneratorPage'));
const OGPreviewPage = lazy(() => import('../features/seo/tools/og-preview/OGPreviewPage'));
const SERPPreviewPage = lazy(() => import('../features/seo/tools/serp-preview/SERPPreviewPage'));
const SitemapGeneratorPage = lazy(() => import('../features/seo/tools/sitemap-generator/SitemapGeneratorPage'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-sans)', fontSize: '14px' }}>
      Loading...
    </div>
  );
}

function page(Component: React.ComponentType, name?: string) {
  return <ErrorBoundary toolName={name}><Suspense fallback={<PageLoader />}><Component /></Suspense></ErrorBoundary>;
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
          { path: ':category', element: page(CategoryPage) },

          // Image
          { path: 'image/compressor', element: page(ImageCompressorPage) },
          { path: 'image/resizer', element: page(ImageResizerPage) },
          { path: 'image/converter', element: page(ImageConverterPage) },
          { path: 'image/bulk-compressor', element: page(BulkCompressorPage) },
          { path: 'image/flip-rotate', element: page(FlipRotatePage) },
          { path: 'image/watermark', element: page(WatermarkPage) },
          { path: 'image/crop', element: page(ImageCropPage) },
          { path: 'image/to-base64', element: page(ImageToBase64Page) },
          { path: 'image/exif-viewer', element: page(EXIFViewerPage) },
          { path: 'image/filters', element: page(ImageFiltersPage) },

          // PDF
          { path: 'pdf/merger', element: page(PDFMergerPage) },
          { path: 'pdf/splitter', element: page(PDFSplitterPage) },
          { path: 'pdf/compressor', element: page(PDFCompressorPage) },
          { path: 'pdf/to-images', element: page(PDFToImagesPage) },

          // Developer
          { path: 'developer/json-formatter', element: page(JSONFormatterPage) },
          { path: 'developer/base64', element: page(Base64Page) },
          { path: 'developer/hash-generator', element: page(HashGeneratorPage) },
          { path: 'developer/password-generator', element: page(PasswordGeneratorPage) },
          { path: 'developer/url-encoder', element: page(URLEncoderPage) },
          { path: 'developer/css-minifier', element: page(CSSMinifierPage) },
          { path: 'developer/js-minifier', element: page(JSMinifierPage) },
          { path: 'developer/jwt-decoder', element: page(JWTDecoderPage) },
          { path: 'developer/escape-unescape',       element: page(EscapeUnescapePage) },
          { path: 'developer/markdown-table',        element: page(MarkdownTablePage) },
          { path: 'developer/url-parser',            element: page(URLParserPage) },
          { path: 'developer/cron-parser', element: page(CronParserPage) },
          { path: 'developer/json-to-typescript', element: page(JSONToTypeScriptPage) },
          { path: 'developer/number-formatter', element: page(NumberFormatterPage) },
          { path: 'developer/password-strength', element: page(PasswordStrengthPage) },
          { path: 'developer/diff-tool', element: page(DiffToolPage) },
          { path: 'developer/color-converter', element: page(ColorConverterPage) },
          { path: 'developer/html-minifier', element: page(HTMLMinifierPage) },
          { path: 'developer/xml-formatter', element: page(XMLFormatterPage) },
          { path: 'developer/regex-tester', element: page(RegexTesterPage) },

          // Text
          { path: 'text/word-counter', element: page(WordCounterPage) },
          { path: 'text/markdown-converter', element: page(MarkdownConverterPage) },
          { path: 'text/case-converter', element: page(CaseConverterPage) },
          { path: 'text/text-reverser', element: page(TextReverserPage) },
          { path: 'text/remove-duplicates', element: page(RemoveDuplicatesPage) },
          { path: 'text/remove-spaces', element: page(RemoveSpacesPage) },
          { path: 'text/text-sorter', element: page(TextSorterPage) },
          { path: 'text/text-statistics', element: page(TextStatisticsPage) },
          { path: 'text/palindrome-checker',         element: page(PalindromeCheckerPage) },
          { path: 'text/find-replace', element: page(FindReplacePage) },
          { path: 'text/text-to-slug', element: page(TextToSlugPage) },
          { path: 'text/lorem-ipsum', element: page(LoremIpsumPage) },
          { path: 'text/reading-time', element: page(ReadingTimePage) },
          { path: 'text/unicode-converter', element: page(UnicodeConverterPage) },

          // Color & Design
          { path: 'color/contrast-checker', element: page(ContrastCheckerPage) },
          { path: 'color/qr-generator', element: page(QRGeneratorPage) },
          { path: 'color/color-palette', element: page(ColorPalettePage) },
          { path: 'color/color-picker', element: page(ColorPickerPage) },
          { path: 'color/favicon-generator', element: page(FaviconGeneratorPage) },
          { path: 'color/gradient-generator', element: page(GradientGeneratorPage) },
          { path: 'color/barcode-generator', element: page(BarcodeGeneratorPage) },

          // Utility
          { path: 'utility/uuid-generator', element: page(UUIDGeneratorPage) },
          { path: 'utility/age-calculator', element: page(AgeCalculatorPage) },
          { path: 'utility/percentage-calculator', element: page(PercentageCalcPage) },
          { path: 'utility/unit-converter', element: page(UnitConverterPage) },
          { path: 'utility/bmi-calculator', element: page(BMICalculatorPage) },
          { path: 'utility/countdown-timer', element: page(CountdownTimerPage) },
          { path: 'utility/simple-interest',         element: page(SimpleInterestPage) },
          { path: 'utility/discount-calculator',     element: page(DiscountCalculatorPage) },
          { path: 'utility/temperature-converter',   element: page(TemperatureConverterPage) },
          { path: 'utility/mortgage-calculator', element: page(MortgageCalculatorPage) },
          { path: 'utility/calorie-calculator', element: page(CalorieCalculatorPage) },
          { path: 'utility/date-calculator', element: page(DateCalculatorPage) },
          { path: 'utility/speed-calculator', element: page(SpeedCalculatorPage) },
          { path: 'utility/base-converter', element: page(BaseConverterPage) },
          { path: 'utility/aspect-ratio', element: page(AspectRatioPage) },
          { path: 'utility/timestamp-converter', element: page(TimestampConverterPage) },
          { path: 'utility/tip-calculator', element: page(TipCalculatorPage) },
          { path: 'utility/loan-calculator', element: page(LoanCalculatorPage) },
          { path: 'utility/random-generator', element: page(RandomGeneratorPage) },
          { path: 'utility/number-to-words', element: page(NumberToWordsPage) },
          { path: 'utility/char-frequency', element: page(CharFrequencyPage) },
          { path: 'utility/currency-converter', element: page(CurrencyConverterPage) },

          // Video
          { path: 'video/compressor', element: page(VideoCompressorPage) },
          { path: 'video/trimmer', element: page(VideoTrimmerPage) },

          // Audio
          { path: 'audio/extract-audio', element: page(ExtractAudioPage) },

          // SEO
          { path: 'seo/meta-tag-generator', element: page(MetaTagGeneratorPage) },
          { path: 'seo/robots-generator', element: page(RobotsGeneratorPage) },
          { path: 'seo/og-preview', element: page(OGPreviewPage) },
          { path: 'seo/serp-preview', element: page(SERPPreviewPage) },
          { path: 'seo/sitemap-generator', element: page(SitemapGeneratorPage) },
        ],
      },
      { path: '*', element: page(NotFoundPage) },
    ],
  },
]);

export function AppRouter() { return <RouterProvider router={router} />; }
