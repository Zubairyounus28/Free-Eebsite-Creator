
import React from 'react';
import { Product } from '../types';
import { Trash2, Plus, Package } from 'lucide-react';

interface Props {
  products: Product[];
  onChange: (products: Product[]) => void;
}

const ProductEditor: React.FC<Props> = ({ products, onChange }) => {
  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: 'New Product',
      price: '$0.00',
      description: 'Product description goes here...',
      imageUrl: 'https://picsum.photos/seed/' + Math.random() + '/400/400'
    };
    onChange([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    onChange(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const removeProduct = (id: string) => {
    onChange(products.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-4">
      {products.map((p) => (
        <div key={p.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-600 font-semibold">
              <Package className="w-4 h-4" />
              Product Details
            </div>
            <button 
              onClick={() => removeProduct(p.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={p.name}
              onChange={(e) => updateProduct(p.id, { name: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Price"
              value={p.price}
              onChange={(e) => updateProduct(p.id, { price: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={p.description}
              onChange={(e) => updateProduct(p.id, { description: e.target.value })}
              className="col-span-2 px-3 py-2 border rounded-lg h-20"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={p.imageUrl}
              onChange={(e) => updateProduct(p.id, { imageUrl: e.target.value })}
              className="col-span-2 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      ))}
      <button
        onClick={addProduct}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Another Product
      </button>
    </div>
  );
};

export default ProductEditor;
