"use client";

import { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Flame,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  Search,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  isAvailable: boolean;
  isChefPick: boolean;
  isSignature: boolean;
  dietaryFlags: string;
  allergens: string;
  ingredients?: string | null;
  winePairing?: string | null;
  chefNote?: string | null;
  imageUrl?: string | null;
  category?: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

export default function MenuManager({
  initialItems,
  categories,
}: {
  initialItems: MenuItem[];
  categories: Category[];
}) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: categories[0]?.id || "",
    dietaryFlags: "",
    allergens: "",
    ingredients: "",
    winePairing: "",
    chefNote: "",
    imageUrl: "",
    isChefPick: false,
    isSignature: false,
    isAvailable: true,
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: categories[0]?.id || "",
      dietaryFlags: "",
      allergens: "",
      ingredients: "",
      winePairing: "",
      chefNote: "",
      imageUrl: "",
      isChefPick: false,
      isSignature: false,
      isAvailable: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      categoryId: item.categoryId,
      dietaryFlags: item.dietaryFlags || "",
      allergens: item.allergens || "",
      ingredients: item.ingredients || "",
      winePairing: item.winePairing || "",
      chefNote: item.chefNote || "",
      imageUrl: item.imageUrl || "",
      isChefPick: item.isChefPick,
      isSignature: item.isSignature,
      isAvailable: item.isAvailable,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        // Update
        const res = await fetch(`/api/v1/admin/menu/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setItems((prev) =>
            prev.map((i) => (i.id === editingItem.id ? data.item : i))
          );
          setModalOpen(false);
        } else {
          alert(data.error?.message || "Failed to update dish.");
        }
      } else {
        // Create
        const res = await fetch("/api/v1/admin/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setItems((prev) => [data.item, ...prev]);
          setModalOpen(false);
        } else {
          alert(data.error?.message || "Failed to create dish.");
        }
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you wish to delete this dish permanently?")) return;

    try {
      const res = await fetch(`/api/v1/admin/menu/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        alert(data.error?.message || "Failed to delete dish.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    const nextVal = !item.isAvailable;
    try {
      const res = await fetch(`/api/v1/admin/menu/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: nextVal }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isAvailable: nextVal } : i))
        );
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const filtered = items.filter((i) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      (i.category?.name && i.category.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="p-6 bg-[#191714] border border-white/10 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A9A095]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes or categories..."
            className="w-full bg-[#11100E] border border-white/10 px-4 py-2.5 pl-10 text-xs text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
          />
        </div>

        <button
          onClick={openCreateModal}
          className="btn-terracotta text-xs py-2.5 px-4 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Dishes Table */}
      <div className="bg-[#191714] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#11100E] border-b border-white/10 text-[#A9A095] label-caps">
                <th className="p-4">Dish</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Badges</th>
                <th className="p-4">Available</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#F7F2E9]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#24201C] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <div className="relative w-12 h-12 shrink-0 bg-[#24201C] overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <strong className="block text-sm font-medium">{item.name}</strong>
                        <span className="text-[11px] text-[#A9A095] line-clamp-1 max-w-sm">
                          {item.description}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#D3B98D]">{item.category?.name}</td>
                  <td className="p-4 font-editorial text-base text-[#C86E45]">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {item.isChefPick && (
                        <span className="px-1.5 py-0.5 text-[8px] bg-[#C86E45]/20 text-[#C86E45] border border-[#C86E45]/30 uppercase tracking-wider font-semibold">
                          Chef
                        </span>
                      )}
                      {item.isSignature && (
                        <span className="px-1.5 py-0.5 text-[8px] bg-[#D3B98D]/20 text-[#D3B98D] border border-[#D3B98D]/30 uppercase tracking-wider font-semibold">
                          Signature
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleAvailability(item)}
                      className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold border transition-all ${
                        item.isAvailable
                          ? "bg-[#778064]/20 text-[#778064] border-[#778064]/30"
                          : "bg-red-900/20 text-red-400 border-red-800/30"
                      }`}
                    >
                      {item.isAvailable ? "Active" : "Sold Out"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-[#A9A095] hover:text-[#F7F2E9] hover:bg-white/5"
                        title="Edit Dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-[#A9A095] hover:text-red-400 hover:bg-white/5"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#191714] border border-white/10 p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="font-editorial text-2xl text-[#F7F2E9]">
                {editingItem ? "Edit Dish" : "Add New Dish"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-[#A9A095] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="label-caps text-[#A9A095] block">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dry-Aged Dexter Ribeye"
                    className="w-full bg-[#11100E] border border-white/15 px-3 py-2.5 text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="label-caps text-[#A9A095] block">Price (£) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="64.00"
                    className="w-full bg-[#11100E] border border-white/15 px-3 py-2.5 text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="label-caps text-[#A9A095] block">Course Category *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-[#11100E] border border-white/15 px-3 py-2.5 text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="label-caps text-[#A9A095] block">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Culinary description, flavor profiles..."
                  className="w-full bg-[#11100E] border border-white/15 px-3 py-2 text-[#F7F2E9] focus:outline-none focus:border-[#C86E45] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="label-caps text-[#A9A095] block">Ingredients / Provenance</label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    placeholder="Yorkshire Dexter, Tallow..."
                    className="w-full bg-[#11100E] border border-white/15 px-3 py-2.5 text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="label-caps text-[#A9A095] block">Sommelier Pairing</label>
                  <input
                    type="text"
                    value={formData.winePairing}
                    onChange={(e) => setFormData({ ...formData, winePairing: e.target.value })}
                    placeholder="2016 Château Pontet-Canet..."
                    className="w-full bg-[#11100E] border border-white/15 px-3 py-2.5 text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="label-caps text-[#A9A095] block">Dietary Flags (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.dietaryFlags}
                    onChange={(e) => setFormData({ ...formData, dietaryFlags: e.target.value })}
                    placeholder="VEGETARIAN, GLUTEN_FREE"
                    className="w-full bg-[#11100E] border border-white/15 px-3 py-2.5 text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="label-caps text-[#A9A095] block">Image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#11100E] border border-white/15 px-3 py-2.5 text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isChefPick}
                    onChange={(e) => setFormData({ ...formData, isChefPick: e.target.checked })}
                    className="accent-[#C86E45]"
                  />
                  <span>Chef&apos;s Pick</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSignature}
                    onChange={(e) => setFormData({ ...formData, isSignature: e.target.checked })}
                    className="accent-[#C86E45]"
                  />
                  <span>Signature Creation</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="accent-[#C86E45]"
                  />
                  <span>Available in Kitchen</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-outline-luxury text-xs py-2.5 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-terracotta text-xs py-2.5 px-6"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Dish</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
