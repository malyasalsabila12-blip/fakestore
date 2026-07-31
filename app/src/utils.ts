export const getProductImage = (image: string, category: string = '') => {
  if (!image) return getFallbackImage(category);
  if (image.startsWith('data:') || image.startsWith('blob:')) return image;

  // WORKAROUND: Fakestore API images are currently broken (404).
  // We switch to high-quality fallbacks immediately for these.
  if (image.includes('fakestoreapi.com')) {
    return getFallbackImage(category);
  }

  // For other images, use a reliable proxy
  return `https://images.weserv.nl/?url=${encodeURIComponent(image)}&w=600&fit=contain&bg=white`;
};

export const getFallbackImage = (category: string) => {
  const cat = category.toLowerCase();
  const categoryImages: Record<string, string> = {
    "electronics": "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80",
    "jewelery": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
    "men's clothing": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80",
    "women's clothing": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    "beauty": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
  };
  return categoryImages[cat] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
};
