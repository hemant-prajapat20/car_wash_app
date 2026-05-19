import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import api from '../../services/axiosConfig';

export const CreatePlan: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const existingPlan = location.state?.plan;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    servicesIncluded: '',
    tenureValue: '',
    tenureUnit: 'Days',
    supportedVehicles: '',
    features: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && existingPlan) {
      setFormData({
        title: existingPlan.title,
        description: existingPlan.description,
        price: existingPlan.price.toString(),
        servicesIncluded: existingPlan.servicesIncluded.toString(),
        tenureValue: existingPlan.tenure.value.toString(),
        tenureUnit: existingPlan.tenure.unit,
        supportedVehicles: existingPlan.supportedVehicles?.join(', ') || '',
        features: existingPlan.features?.join(', ') || ''
      });
    }
  }, [id, existingPlan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      servicesIncluded: Number(formData.servicesIncluded),
      tenure: {
        value: Number(formData.tenureValue),
        unit: formData.tenureUnit
      },
      supportedVehicles: formData.supportedVehicles.split(',').map(v => v.trim()).filter(v => v),
      features: formData.features.split(',').map(f => f.trim()).filter(f => f)
    };

    try {
      if (id) {
        await api.put(`/plans/vendor/${id}`, payload);
      } else {
        await api.post('/plans/vendor', payload);
      }
      navigate('/vendor/plans');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ChevronLeft size={16} />
        Back to Plans
      </button>

      <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {id ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Offer prepaid services to your customers with a custom plan.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Plan Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Premium Wash Pack"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what's included in this plan..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹)</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Services Included</label>
              <input
                type="number"
                name="servicesIncluded"
                required
                min="1"
                value={formData.servicesIncluded}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tenure Value</label>
              <input
                type="number"
                name="tenureValue"
                required
                min="1"
                value={formData.tenureValue}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tenure Unit</label>
              <select
                name="tenureUnit"
                value={formData.tenureUnit}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              >
                <option value="Days">Days</option>
                <option value="Months">Months</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Supported Vehicles (Comma Separated)</label>
              <input
                type="text"
                name="supportedVehicles"
                value={formData.supportedVehicles}
                onChange={handleChange}
                placeholder="e.g. Hatchback, Sedan, SUV"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Features (Comma Separated)</label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="e.g. Priority Booking, Free Interior Cleaning"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Saving...' : id ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
