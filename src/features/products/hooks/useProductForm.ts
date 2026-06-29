import { useState, useEffect } from 'react';

export const useProductForm = () => {
  const [formData, setFormData] = useState({
    name:             '',
    category:         '',
    sku:              '',
    description:      '',
    costPrice:        '',
    salePrice:        '',
    minPrice:         '',
    taxRate:          '0',
    priceIncludesTax: false,
    initialStock:     '',
    minStock:         '',
    unit:             'unidades',
    productType:      'other' as 'physical' | 'service' | 'digital' | 'composite' | 'other',
    hasVariants:      false,
    isActive:         true,
    trackInventory:   true,
  });

  const [margin, setMargin]           = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cost = parseFloat(formData.costPrice);
    const sale = parseFloat(formData.salePrice);
    if (cost > 0 && sale > 0) {
      setMargin((sale - cost) / sale * 100);
    } else {
      setMargin(null);
    }
  }, [formData.costPrice, formData.salePrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleToggle = (field: 'isActive' | 'trackInventory' | 'priceIncludesTax' | 'hasVariants') => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return { formData, margin, isSubmitting, handleChange, handleToggle, setIsSubmitting };
};
