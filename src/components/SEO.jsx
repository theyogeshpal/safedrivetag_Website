import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, url, type = "website", schema, image = "https://safedrivetag.com/safedrivetag-og-image.webp" }) => {
  const brandName = "SafeDriveTag";
  const defaultDesc = "SafeDriveTag smart QR tags for cars, bikes and luggage. Let anyone contact the owner through a secure QR scan without revealing personal phone numbers.";
  const canonicalUrl = `https://safedrivetag.com${url}`;

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SafeDriveTag",
    "url": "https://safedrivetag.com/",
    "email": "safedrivetag@gmail.com",
    "description": "SafeDriveTag provides smart QR communication tags for vehicles and luggage, helping people connect with owners in parking, emergency and other situations while protecting personal contact information.",
    "logo": "https://safedrivetag.com/images/logo.png",
    "sameAs": [
      "https://www.instagram.com/safedrivetag/",
      "https://www.facebook.com/safedrivetag",
      "https://www.linkedin.com/company/safedrivetag/",
      "https://www.youtube.com/@SafeDriveTag",
      "https://x.com/safedrivetag"
    ]
  };

  const schemas = schema ? [orgSchema, schema] : [orgSchema];

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{title}</title>
      <meta name="description" content={description || defaultDesc} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={brandName} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemas)}
      </script>
    </Helmet>
  );
};

export default SEO;
