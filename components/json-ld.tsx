interface BreadcrumbItem {
  name: string;
  item: string;
}

interface JsonLdBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function JsonLdBreadcrumb({ items }: JsonLdBreadcrumbProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
