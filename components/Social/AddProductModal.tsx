
import React, { useState, useRef } from 'react';
import { X, UploadCloud, DollarSign, Image, Loader2, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadImage } from '../../src/services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, createProduct } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    type: 'Digital',
    imageUrl: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && user) {
        setIsUploading(true);
        try {
            const url = await uploadImage(e.target.files[0], `products/${user.id}/${Date.now()}`);
            setFormData(prev => ({ ...prev, imageUrl: url }));
        } catch (err) {
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.imageUrl) return alert('Please fill all required fields');
    
    setIsSubmitting(true);
    
    // Create Product Payload
    const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        type: formData.type, // Map UI type to internal type if needed
        images: [formData.imageUrl],
        category: 'Digital', // Default for now
        location: 'Online',
        condition: 'New'
    };

    const res = await createProduct(productData);
    setIsSubmitting(false);
    
    if (res.success) {
        alert('Product added successfully!');
        onClose();
        setFormData({ title: '', price: '', description: '', type: 'Digital', imageUrl: '' });
    } else {
        alert(res.error || 'Failed to add product');
    }
  };

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up font-sans" dir="rtl">
        <div className="bg-[#16181c] w-full max-w-lg rounded-2xl border border-[#2f3336] shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-[#2f3336]">
                <h2 className="text-white font-bold text-lg">إضافة منتج للمتجر</h2>
                <button onClick={onClose}><X className="text-gray-400 hover:text-white w-6 h-6"/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                
                {/* Image Upload */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed border-[#2f3336] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1d9bf0] hover:bg-[#1d9bf0]/5 transition-all relative overflow-hidden"
                >
                    {formData.imageUrl ? (
                        <img src={formData.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                        <>
                            {isUploading ? <Loader2 className="w-8 h-8 text-[#1d9bf0] animate-spin"/> : <UploadCloud className="w-10 h-10 text-gray-500 mb-2"/>}
                            <span className="text-xs text-gray-400">اضغط لرفع صورة المنتج</span>
                        </>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                </div>

                <div>
                    <label className="text-gray-500 text-xs font-bold block mb-1">اسم المنتج</label>
                    <input 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-black border border-[#2f3336] rounded-lg p-3 text-white focus:border-[#1d9bf0] outline-none"
                        placeholder="مثال: قالب سيرة ذاتية احترافي"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-gray-500 text-xs font-bold block mb-1">السعر (ر.س)</label>
                        <div className="relative">
                            <input 
                                type="number"
                                value={formData.price} 
                                onChange={e => setFormData({...formData, price: e.target.value})}
                                className="w-full bg-black border border-[#2f3336] rounded-lg p-3 pl-8 text-white focus:border-[#1d9bf0] outline-none"
                                placeholder="0.00"
                            />
                            <DollarSign className="absolute left-2 top-3 w-4 h-4 text-gray-500"/>
                        </div>
                    </div>
                    <div>
                         <label className="text-gray-500 text-xs font-bold block mb-1">النوع</label>
                         <select 
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                            className="w-full bg-black border border-[#2f3336] rounded-lg p-3 text-white focus:border-[#1d9bf0] outline-none appearance-none"
                         >
                             <option value="Digital">منتج رقمي</option>
                             <option value="Service">خدمة</option>
                             <option value="Physical">منتج ملموس</option>
                         </select>
                    </div>
                </div>

                <div>
                    <label className="text-gray-500 text-xs font-bold block mb-1">الوصف</label>
                    <textarea 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-black border border-[#2f3336] rounded-lg p-3 text-white focus:border-[#1d9bf0] outline-none h-24 resize-none"
                        placeholder="وصف تفصيلي للمنتج..."
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting || isUploading}
                    className="w-full bg-[#eff3f4] hover:bg-[#d4d8d9] text-black font-bold py-3 rounded-full flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : 'إضافة للمتجر'}
                </button>
            </form>
        </div>
    </div>
  );
};
