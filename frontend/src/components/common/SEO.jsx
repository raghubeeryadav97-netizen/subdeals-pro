import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  jsonLd,
  noindex = false,
}) {
  const settings = useSelector((state) => state.settings.data);
  const siteName = settings?.site_name || 'SubDeals Pro';
  const seo = settings?.seo || {};
  const fullTitle = title ? `${title} | ${siteName}` : seo.title || siteName;
  const metaDescription = description || seo.description || '';
  const metaKeywords = keywords || seo.keywords || '';
  const metaImage = image || settings?.site_logo || '/favicon.svg';
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: typeof window !== 'undefined' ? window.location.origin : '',
    logo: metaImage,
    contactPoint: {
      '@type': 'ContactPoint',
      email: settings?.support_email,
      contactType: 'customer service',
    },
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteName} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
}