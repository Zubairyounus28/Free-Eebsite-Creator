
import React from 'react';
import { TEMPLATES } from '../constants';
import { TemplateId } from '../types';

interface Props {
  selectedId: TemplateId;
  onSelect: (id: TemplateId) => void;
}

const TemplateSelector: React.FC<Props> = ({ selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`group relative overflow-hidden rounded-2xl border-4 transition-all ${
            selectedId === t.id ? 'border-blue-500 ring-4 ring-blue-100' : 'border-transparent hover:border-slate-300'
          }`}
        >
          <img src={t.previewUrl} alt={t.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
          <div className="p-4 bg-white text-left">
            <h3 className="font-bold text-slate-900">{t.name}</h3>
            <p className="text-sm text-slate-500">{t.description}</p>
          </div>
          {selectedId === t.id && (
            <div className="absolute top-4 right-4 bg-blue-500 text-white p-1 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default TemplateSelector;
