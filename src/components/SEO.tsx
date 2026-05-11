import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  path: string; // 示例: "sem" 或 "blog/post-slug"
  image?: string;
  type?: string;
  /** * 接收从 schema.ts 生成的对象 
   * 例如: getHomeSchema() 或 getSEMSchema()
   */
  schema?: Record<string, any> | Record<string, any>[];
  noindex?: boolean;
}

const SITE_URL = "https://leadzap.com.my";
const DEFAULT_IMAGE = "https://leadzap.com.my/assets/Logo-BtIJ7fab.webp";

const SEO = ({
  title,
  description,
  path,
  image,
  type = "website",
  schema,
  noindex = false,
}: SEOProps) => {

  /**
   * 核心逻辑：规范化 URL (与你的 schema.ts 路径逻辑保持高度一致)
   */
  const normalizeCanonicalPath = (rawPath: string) => {
    let p = rawPath.toLowerCase().trim();
    if (!p.startsWith("/")) p = `/${p}`;
    
    // 强制结尾斜杠逻辑
    if (p !== "/" && !p.endsWith("/")) {
      p = `${p}/`;
    }
    // 首页保持 "/"
    if (p === "//") p = "/";
    return p;
  };

  const normalizedPath = normalizeCanonicalPath(path);
  const url = `${SITE_URL}${normalizedPath}`;
  const img = image || DEFAULT_IMAGE;

  // 格式化 Schema 数组
  const extraSchemas = schema
    ? Array.isArray(schema)
      ? schema
      : [schema]
    : [];

  return (
    <Helmet>
      {/* 1. 基础 Meta 标签 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      {/* 2. Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={img} />
      <meta property="og:site_name" content="Leadzap Marketing" />

      {/* 3. Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {/* 4. 结构化数据注入 (核心：将你的 schema.ts 内容转为 JSON) */}
      {extraSchemas.map((s, i) => (
        <script type="application/ld+json" key={`schema-${i}`}>
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;