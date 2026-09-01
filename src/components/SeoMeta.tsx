import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoMetaProps {
  title?: string;
  description?: string;
  path?: string;
}

export const SeoMeta: React.FC<SeoMetaProps> = ({
  title = 'الرحيق المختوم | المنصة التفاعلية للسيرة النبوية المطهرة',
  description = 'منظومة تفاعلية عصرية لقراءة ودراسة واختبار كتاب الرحيق المختوم في السيرة النبوية للمباركفوري. تضم 1200 سؤال موثق وقارئ عالي الدقة.',
  path = '',
}) => {
  const baseUrl = 'https://al-raheeq-al-makhtom.vercel.app';
  const fullUrl = `${baseUrl}${path}`;
  const ogImageUrl = `${baseUrl}/og-image.png`;

  // JSON-LD Structured Data Schema for Google Search Console & Rich Snippets
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'الرحيق المختوم',
        description: description,
        inLanguage: 'ar',
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
    ],
  };

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImageUrl} />

      {/* Twitter Cards */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* Google Search Console JSON-LD Rich Snippets */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
};

export default SeoMeta;
