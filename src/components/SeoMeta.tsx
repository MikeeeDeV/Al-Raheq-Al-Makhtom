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
    </Helmet>
  );
};
