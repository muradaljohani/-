
import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';

export interface Product {
  id: string;
  title: string;
  price: number;
  type: string;
  image: string;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onBuy }) => {
  return (
    <div className="bg-[#16181c] border border-[#2f3336] rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_20px_rgba(29,155,240,0.1)] group flex flex-col h-full">
      {/* Image Section */}
      <div className="aspect-video w-full overflow-hidden relative bg-black">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
        />
        {/* Type Tag */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-[#eff3f4] font-bold uppercase tracking-wider border border-white/10 shadow-lg">
          {product.type}
        </div>
      </div>
      
      {/* Details Section */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-[#e7e9ea] text-[15px] leading-snug line-clamp-2">{product.title}</h3>
            {product.rating && (
                <div className="flex items-center gap-1 text-[10px] text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-current" /> {product.rating}
                </div>
            )}
        </div>
        
        {/* Footer Actions */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#2f3336]">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#71767b] font-medium">السعر</span>
            <div className="text-emerald-400 font-mono font-black text-lg leading-none">
              {product.price} <span className="text-[10px] text-emerald-600 font-sans">SAR</span>
            </div>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onBuy(product);
            }}
            className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white px-5 py-2 rounded-full font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>شراء الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
