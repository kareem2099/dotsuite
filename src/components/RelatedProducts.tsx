"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./skeletons/ProductCardSkeleton";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  slug: string;
  category: string;
  githubRepo: string;
  translations: Record<string, { title: string; description: string }>;
}

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
  locale: string;
}

export default function RelatedProducts({ currentProductId, category, locale }: RelatedProductsProps) {
  const t = useTranslations("ProductDetail");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`/api/products?category=${category}&limit=4`);
        const data = await res.json();
        
        // Handle array or object response
        const fetchedProducts: Product[] = data.products || (Array.isArray(data) ? data : []);
        
        // Filter out the current product and take up to 3
        const related = fetchedProducts
          .filter((p) => p._id !== currentProductId)
          .slice(0, 3);
          
        setProducts(related);
      } catch (err) {
        console.error("Failed to fetch related products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchRelated();
    }
  }, [category, currentProductId]);

  const handleCategoryClick = (cat: string) => {
    router.push(`/${locale}/product?category=${cat}`);
  };

  if (loading) {
    return (
      <div className="mt-16 pt-12 border-t border-(--card-border)">
        <h2 className="text-2xl font-bold mb-6">{t("relatedProducts")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-(--card-border)">
      <h2 className="text-2xl font-bold mb-6">{t("relatedProducts")}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            locale={locale} 
            onCategoryClick={handleCategoryClick}
          />
        ))}
      </div>
    </div>
  );
}
