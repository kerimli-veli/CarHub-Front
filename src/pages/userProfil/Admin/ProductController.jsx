import React, { useEffect, useState } from 'react';
import axios from 'axios';

const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num);

const getStatusColor = (status) => {
  switch (status) {
    case 'Published':
      return 'bg-green-100 text-green-800';
    case 'Out Stock':
      return 'bg-orange-100 text-orange-800';
    case 'Draft List':
      return 'bg-gray-200 text-gray-800';
    case 'Inactive':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ProductController = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    unitPrice: '',
    unitsInStock: '',
    description: '',
    categoryId: ''
  });
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getProducts = () => {
    axios.get('https://localhost:7282/api/Product/GetAll')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Failed to fetch products', err));
  };

  const searchProducts = (value) => {
    if (value.trim() === '') {
      getProducts();
    } else {
      axios.get(`https://localhost:7282/api/Product/GetByNameProduct?name=${value}`)
        .then((res) => setProducts(res.data))
        .catch((err) => console.error('Search failed', err));
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      searchProducts(value);
      setCurrentPage(1);
    }, 500);
    setDebounceTimeout(timeout);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.post(`https://localhost:7282/api/Product/DeleteProduct`, { id: deleteId });
      setShowDeleteModal(false);
      getProducts();
      setCurrentPage(1);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('unitPrice', form.unitPrice);
      formData.append('unitsInStock', form.unitsInStock);
      formData.append('description', form.description);
      formData.append('categoryId', form.categoryId);
      images.forEach((file) => {
        formData.append('imagePath', file);
      });

      await axios.post('https://localhost:7282/api/Product/AddProduct', formData);
      setShowModal(false);
      getProducts();
      setCurrentPage(1);
    } catch (err) {
      console.error('Error adding product', err);
    }
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-4 overflow-x-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center w-1/2 gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
          <button
            onClick={() => {
              searchProducts(search);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => {
            const status = product.unitsInStock === 0 ? 'Out Stock' : 'Published';
            return (
              <tr key={product.id} className="border-b">
                <td className="px-4 py-2">
                  <img
                    src={product.imagePath[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2 font-medium">{product.name}</td>
                <td className="px-4 py-2">${formatNumber(product.unitPrice)}</td>
                <td className="px-4 py-2">{formatNumber(product.unitsInStock)}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </td>
                <td className="px-4 py-2 w-1/3">{product.description}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => confirmDelete(product.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Product</h2>
            <form onSubmit={handleSubmit} className="space-y-3" encType="multipart/form-data">
              <input name="name" placeholder="Name" className="w-full border p-2" value={form.name} onChange={handleChange} required />
              <input name="unitPrice" type="number" placeholder="Unit Price" className="w-full border p-2" value={form.unitPrice} onChange={handleChange} required />
              <input name="unitsInStock" type="number" placeholder="Units In Stock" className="w-full border p-2" value={form.unitsInStock} onChange={handleChange} required />
              <input name="categoryId" type="number" placeholder="Category Id" className="w-full border p-2" value={form.categoryId} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" className="w-full border p-2" value={form.description} onChange={handleChange} required />
              <input type="file" multiple onChange={handleFileChange} className="w-full border p-2" accept="image/*" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg text-center">
            <h3 className="text-lg font-bold mb-4">Bu ürünü silmek istiyor musunuz?</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Hayır
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductController;
