import { useState, useEffect } from 'react';


export const useProductForm = () => {
  const [formData, setFormData] = useState({
    name: '', category: '', sku: '', description: '',
    purchasePrice: '', salePrice: '', tax: '0',
    initialStock: '', minStock: '', unit: 'unidades',
    isActive: true, trackInventory: true,
  });

  const [margin, setMargin] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const purchase = parseFloat(formData.purchasePrice);
    const sale     = parseFloat(formData.salePrice);
    if (purchase > 0 && sale > 0) {
      setMargin((sale - purchase) / sale * 100);
    } else {
      setMargin(null);
    }
  }, [formData.purchasePrice, formData.salePrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleToggle = (field: 'isActive' | 'trackInventory') => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return { formData, margin, isSubmitting, handleChange, handleToggle, setIsSubmitting };
};