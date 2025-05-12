import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import getUserFromToken from "../../common/GetUserFromToken";
import { Transition } from "@headlessui/react";

const CategoryController = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [expandedDescriptionId, setExpandedDescriptionId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editData, setEditData] = useState({ id: null, name: "", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const wrapperRef = useRef([]);

  const fetchCategories = async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch("https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/Category/GetAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Upload category error:", err);
    }
  };

  const addCategory = async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch("https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/Category/Add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDescription,
        }),
      });
      if (response.ok) {
        setNewCategoryName("");
        setNewCategoryDescription("");
        fetchCategories();
        setShowInput(false);
      } else {
        const errData = await response.json();
        console.error("Could not add category:", errData);
      }
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/Category/Remove?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchCategories();
      } else {
        console.error("Delete failed:", await response.text());
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const updateCategory = async (data) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch("https://carhubwebapp-cfbqhfawa9g9b4bh.italynorth-01.azurewebsites.net/api/Category/Update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Update failed:", await response.text());
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  useEffect(() => {
    getUserFromToken();
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current.every((ref) => ref && !ref.contains(event.target))
      ) {
        setExpandedDescriptionId(null);
        setEditingCategoryId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const visibleCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleDescription = (id) => {
    setExpandedDescriptionId(expandedDescriptionId === id ? null : id);
    setEditingCategoryId(null); 
  };

  const openEditForm = (e, category) => {
    e.stopPropagation();
    setEditingCategoryId(category.id);
    setExpandedDescriptionId(null); 
    setEditData({ id: category.id, name: category.name, description: category.description || "" });
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-800"> Category Controller</h2>
      <div className="mb-6">
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Add Category
          </button>
        ) : (
          <div className="flex flex-col gap-3 mt-4">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Kategori adı girin"
              className="border border-gray-300 p-2 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <textarea
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              placeholder="Açıklama girin"
              className="border border-gray-300 p-2 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="flex gap-2">
              <button
                onClick={addCategory}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Add
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                ✖️
              </button>
            </div>
          </div>
        )}
      </div>

      <ul className="space-y-4">
        {visibleCategories.map((cat, index) => (
          <li
            key={cat.id}
            ref={(el) => (wrapperRef.current[index] = el)}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-all border cursor-pointer"
            onClick={() => toggleDescription(cat.id)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">{cat.name}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => openEditForm(e, cat)}
                  className="text-blue-500 hover:text-blue-700 text-xl"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCategory(cat.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-xl"
                >
                  ❌
                </button>
              </div>
            </div>

            <Transition
              show={expandedDescriptionId === cat.id}
              enter="transition-all duration-300 ease-out"
              enterFrom="opacity-0 max-h-0"
              enterTo="opacity-100 max-h-[100px]"
              leave="transition-all duration-200 ease-in"
              leaveFrom="opacity-100 max-h-[100px]"
              leaveTo="opacity-0 max-h-0"
            >
              <div className="mt-2 text-gray-600 text-sm overflow-hidden">
                {cat.description || "Açıklama bulunmuyor."}
              </div>
            </Transition>

            {editingCategoryId === cat.id && (
              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  placeholder="Kategori adı"
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Açıklama"
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateCategory(editData);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Ok
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="flex justify-center mt-10">
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-lg">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition text-xl ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            &lt;
          </button>

          <span className="text-gray-700 font-medium text-sm">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition text-xl ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryController;
