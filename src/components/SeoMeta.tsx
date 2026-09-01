import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoMetaProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}

export const SeoMeta: React.FC<SeoMetaProps> = ({
  title = 'الرحيق المختوم | المنصة التفاعلية للسيرة النبوية المطهرة',
  description = 'منظومة تفاعلية عصرية لقراءة ودراسة واختبار كتاب الرحيق المختوم في السيرة النبوية للمباركفوري. تضم 1200 سؤال موثق وقارئ عالي الدقة وبنك مراجعة ذكي.',
  path = '',
  image = '/og-image.png',
}) => {
  const baseUrl = 'https://al-raheq-al-makhtom.vercel.app';
  const fullUrl = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const ogImageUrl = image.startsWith('http') ? image : `${baseUrl}${image.startsWith('/') ? image : `/${image}`}`;

  // Multi-Schema Structured Data for Google Search Console & Rich Snippets
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'الرحيق المختوم',
        alternateName: 'منصة الرحيق المختوم التفاعلية للسيرة النبوية',
        description: description,
        inLanguage: 'ar',
        publisher: {
          '@type': 'Organization',
          name: 'الرحيق المختوم',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: ogImageUrl,
          },
        },
      },
      {
        '@type': 'Book',
        '@id': `${baseUrl}/#book`,
        name: 'الرحيق المختوم',
        author: {
          '@type': 'Person',
          name: 'صفي الرحمن المباركفوري',
        },
        about: 'بحث في السيرة النبوية الشريفة على صاحبها أفضل الصلاة والسلام',
        inLanguage: 'ar',
        numberOfPages: 543,
        educationalUse: 'دراسة واختبارات السيرة النبوية المطهرة',
        publisher: {
          '@type': 'Organization',
          name: 'الرحيق المختوم - المنصة التفاعلية',
          url: baseUrl,
        },
        image: ogImageUrl,
      },
      {
        '@type': 'EducationalApplication',
        '@id': `${baseUrl}/#app`,
        name: 'منصة الرحيق المختوم التفاعلية',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'ما هو كتاب الرحيق المختوم؟',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'كتاب الرحيق المختوم هو أحد أشهر وأوثق الكتب المعاصرة في السيرة النبوية الشريفة، صَنّفه الشيخ صفي الرحمن المباركفوري وحاز به المركز الأول في مسابقة رابطة العالم الإسلامي.',
            },
          },
          {
            '@type': 'Question',
            name: 'كم عدد الأسئلة والتحديات التفاعلية بالمنصة؟',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'تضم المنصة أكثر من 1200 سؤال وجواب تفاعلي وموثق مقسّمة على 4 أجزاء وشاملة لكافة فصول وأحداث السيرة النبوية.',
            },
          },
        ],
      },
    ],
  };

  return (
    <Helmet>
      {/* HTML Language & Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Meta Tags (WhatsApp, Facebook, LinkedIn, Telegram) */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="الرحيق المختوم" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:secure_url" content={ogImageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="الرحيق المختوم - المنصة التفاعلية للسيرة النبوية المطهرة" />
      <meta property="og:locale" content="ar_AR" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content="الرحيق المختوم - المنصة التفاعلية للسيرة النبوية المطهرة" />

      {/* Google Search Console JSON-LD Rich Snippets */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
};

export default SeoMeta;
