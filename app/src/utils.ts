export const getProductImage = (image: string, category: string = '', title: string = '') => {
  // If the image is a data URL or local blob, use it directly
  if (image.startsWith('data:') || image.startsWith('blob:')) return image;

  // High-quality fallbacks from Unsplash based on categories
  const categoryImages: Record<string, string> = {
    "electronics": "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600&auto=format&fit=crop",
    "jewelery": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce33e?q=80&w=600&auto=format&fit=crop",
    "men's clothing": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
    "women's clothing": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop",
    "beauty": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop"
  };

  // We still try to use the original image through a proxy first
  // But if it's known to be broken (like fakestoreapi currently), we could prioritize the fallback
  // For now, let's return the original URL wrapped in a proxy, and the component's onError will handle the switch
  return `https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto,w_600/${image}`;
};

export const getFallbackImage = (category: string) => {
  const categoryImages: Record<string, string> = {
    "electronics": "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600&auto=format&fit=crop",
    "jewelery": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce33e?q=80&w=600&auto=format&fit=crop",
    "men's clothing": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
    "women's clothing": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop"
  };
  return categoryImages[category] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"; // Default generic product
};
