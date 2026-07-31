export const getProductImage = (image: string, category: string = '', id: number | string = 0, title: string = '') => {
  if (!image) return getFallbackImage(category, id, title);
  if (image.startsWith('data:') || image.startsWith('blob:')) return image;

  // WORKAROUND: Fakestore API images are currently broken (404).
  // We use a high-precision mapping for the specific 20 products in the API.
  if (image.includes('fakestoreapi.com')) {
    return getFallbackImage(category, id, title);
  }

  // For other images, use a reliable proxy
  return `https://images.weserv.nl/?url=${encodeURIComponent(image)}&w=600&fit=contain&bg=white`;
};

export const getFallbackImage = (category: string, id: number | string = 0, title: string = '') => {
  const productId = typeof id === 'number' ? id : parseInt(id.toString().split('-').pop() || '0');
  
  // High-precision Unsplash mapping for the 20 items in the Fakestore catalog
  const preciseImages: Record<number, string> = {
    1: "photo-1553062407-98eeb64c6a62", // Backpack
    2: "photo-1521572267360-ee0c2909d518", // T-shirt
    3: "photo-1551028719-00167b16eac5", // Jacket
    4: "photo-1596755094514-f87e34085b2c", // Casual shirt
    5: "photo-1515562141207-7a88fb7ce338", // Bracelet
    6: "photo-1605100804763-247f67b3557e", // Gold ring
    7: "photo-1589128777073-263566ae5e4d", // Diamond ring
    8: "photo-1535632066927-ab7c9ab60908", // Earrings
    9: "photo-1531297484001-80022131f5a1", // Hard drive
    10: "photo-1597872200370-496de211a3f4", // SSD
    11: "photo-1591799272175-862705b40537", // SSD
    12: "photo-1542751371-adc38448a05e", // Gaming drive
    13: "photo-1527443224154-c4a3942d3496", // Monitor
    14: "photo-1551645120-d70bfe84c826", // Ultrawide Monitor
    15: "photo-1591047139829-d91aecb6caea", // Snowboard jacket
    16: "photo-1520975916090-3105956dac54", // Leather jacket
    17: "photo-1544923246-77307dd654ca", // Rain jacket
    18: "photo-1503342217505-b0a15ec3261c", // Women's V-neck
    19: "photo-1518310327464-6720233e6802", // Moisture shirt
    20: "photo-1541099649105-f69ad21f3246", // Women's T-shirt
  };

  const imageId = preciseImages[productId] || "photo-1523275335684-37898b6baf30";
  return `https://images.unsplash.com/${imageId}?auto=format&fit=crop&q=80&w=800`;
};
