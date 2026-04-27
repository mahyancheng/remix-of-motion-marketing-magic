import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
  /** Optional JSON-LD structured data (object or array of objects) */
  schema?: Record<string, unknown> | Record<string, unknown>[];
  /** Set true for pages that should not be indexed (e.g. admin, 404) */
  noindex?: boolean;
}

const SITE_URL = "https://leadzap.com.my";
const DEFAULT_IMAGE = "https://leadzap.com.my/assets/Logo-BtIJ7fab.webp";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Leadzap Marketing",
  url: SITE_URL,
  logo: `${SITE_URL}/assets/Logo-BtIJ7fab.webp`,
  description:
    "Digital marketing agency in Malaysia specializing in SEO, Google Ads, Social Media Marketing, and Custom Software Development.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "16-1, Jln SS19/6, SS 19",
    addressLocality: "Subang Jaya",
    addressRegion: "Selangor",
    postalCode: "47500",
    addressCountry: "MY",
  },
  telephone: "+60-111-1335119",
  email: "sales@leadzap.com.my",
  sameAs: [],
};

const SEO = ({
  title,
  description,
  path,
  image,
  type = "website",
  schema,
  noindex = false,
}: SEOProps) => {
  // Ensure path starts with "/"
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${SITE_URL}${normalizedPath}`;
  const img = image || DEFAULT_IMAGE;

  const extraSchemas = schema
    ? Array.isArray(schema)
      ? schema
      : [schema]
    : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={img} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {/* Organization schema (always emitted) */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* Page-specific schema(s) */}
      {extraSchemas.map((s, i) => (
        <script type="application/ld+json" key={i}>
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
