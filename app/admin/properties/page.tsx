'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';

interface Property {
  $id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  state: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  status: string;
  images: string;
  $createdAt: string;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    city: '',
    state: '',
    property_type: 'Apartment',
    bedrooms: '',
    bathrooms: '',
    area_sqft: '',
    status: 'available',
    image: null as File | null,
    imageUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties');
      const data = await response.json();
      if (data.success) {
        setProperties(data.properties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (key === 'image' && value instanceof File) {
            formDataToSend.append(key, value);
          } else if (key !== 'image') {
            formDataToSend.append(key, String(value));
          }
        }
      });

      const url = editingId ? `/api/properties?id=${editingId}` : '/api/properties';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        await fetchProperties();
        resetForm();
        setShowForm(false);
      } else {
        setError(data.error || 'Failed to save property');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`/api/properties?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        await fetchProperties();
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      location: '',
      city: '',
      state: '',
      property_type: 'Apartment',
      bedrooms: '',
      bathrooms: '',
      area_sqft: '',
      status: 'available',
      image: null,
      imageUrl: '',
    });
    setImagePreview('');
    setEditingId(null);
    setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Property Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              {properties.length} properties in database
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-[#171817] text-white px-6 py-3 rounded-lg hover:bg-[#171817]/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Property
          </button>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingId ? 'Edit Property' : 'Add New Property'}
                </h2>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#171817]"
                      placeholder="e.g., Luxury 2BHK in Andheri"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#171817]"
                      placeholder="Describe the property..."
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#171817]"
                      placeholder="8500000"
                    />
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type *
                    </label>
                    <select
                      required
                      value={formData.property_type}
                      onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#171817]"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Plot">Plot</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#171817]"
                      placeholder="2"
                    />
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#171817]"
                      placeholder="2"
                    />
                  </div>

                  {/* Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area (sq ft)
                    </label>
                    <input
                      type="number"
                      value={formData.area_sqft}
                      onChange={(e) => setFormData({ ...formData, area_sqft: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#171817]"
                      placeholder="1200"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#171817]"
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#171817]"
                      placeholder="Andheri West, Mumbai"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#171817]"
                      placeholder="Mumbai"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#171817]"
                      placeholder="Maharashtra"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#171817] transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      {imagePreview && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image URL (alternative) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL (alternative)
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#171817]"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#171817] text-white py-3 rounded-lg hover:bg-[#171817]/90 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? 'Saving...' : (editingId ? 'Update Property' : 'Add Property')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Properties List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">🏠</div>
              <p className="text-gray-500">No properties added yet</p>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="mt-4 text-[#171817] font-medium hover:underline"
              >
                Add your first property →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Image</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">BHK</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.$id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {property.images ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={property.images}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                            📷
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium">{property.title}</td>
                      <td className="px-6 py-4 font-medium">Rs. {property.price ? property.price.toLocaleString("en-IN") : 0}</td>
                      <td className="px-6 py-4 text-sm">{property.location}</td>
                      <td className="px-6 py-4">{property.bedrooms}BHK</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          property.status === 'available' ? 'bg-green-100 text-green-800' :
                          property.status === 'sold' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(property.$id);
                              setFormData({
                                title: property.title,
                                description: property.description || '',
                                price: String(property.price),
                                location: property.location,
                                city: property.city || '',
                                state: property.state || '',
                                property_type: property.property_type || 'Apartment',
                                bedrooms: String(property.bedrooms || ''),
                                bathrooms: String(property.bathrooms || ''),
                                area_sqft: String(property.area_sqft || ''),
                                status: property.status || 'available',
                                image: null,
                                imageUrl: property.images || '',
                              });
                              setImagePreview(property.images || '');
                              setShowForm(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(property.$id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}