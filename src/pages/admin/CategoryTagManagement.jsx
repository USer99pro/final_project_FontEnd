import { useEffect, useState } from "react";
import api from "../../api/client";

export default function CategoryTagManagement() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  const [catName, setCatName] = useState("");
  const [tagName, setTagName] = useState("");
  const [deptName, setDeptName] = useState("");

  const load = async () => {
    try {
      const [categoriesRes, tagsRes, deptsRes] = await Promise.all([
        api.get("/api/public/categories").catch(() => api.get("/api/categories")),
        api.get("/api/public/tags").catch(() => api.get("/api/tags")),
        api.get("/api/departments").catch(() => ({ data: [] })),
      ]);

      setCategories(categoriesRes.data?.categories || categoriesRes.data || []);
      setTags(tagsRes.data?.tags || tagsRes.data || []);
      setDepartments(deptsRes.data?.departments || deptsRes.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addCategory = async () => {
    if (!catName.trim()) return;
    try {
      await api.post('/api/categories', { name: catName });
      setCatName("");
      load();
    } catch (err) {
      alert(err.response?.data?.error || "ไม่สามารถเพิ่มหมวดหมู่ได้");
    }
  };

  const addTag = async () => {
    if (!tagName.trim()) return;
    try {
      await api.post("/api/tags", { name: tagName });
      setTagName("");
      load();
    } catch (err) {
      alert(err.response?.data?.error || "ไม่สามารถเพิ่มแท็กได้");
    }
  };

  const addDepartment = async () => {
    if (!deptName.trim()) return;
    try {
      await api.post("/api/departments", { name: deptName });
      setDeptName("");
      load();
    } catch (err) {
      alert(err.response?.data?.error || "ไม่สามารถเพิ่มสาขาวิชา/แผนกได้");
    }
  };

  const editCategory = async (item) => {
    const name = prompt("แก้ไขชื่อหมวดหมู่", item.name);
    if (!name || name === item.name) return;
    try {
      await api.patch(`/api/categories/${item._id}`, { name });
      load();
    } catch (err) {
      alert(err.response?.data?.error || "ไม่สามารถแก้ไขหมวดหมู่ได้");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("ต้องการลบหมวดหมู่นี้ใช่หรือไม่?")) return;
    try {
      await api.delete(`/api/categories/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "ไม่สามารถลบหมวดหมู่ได้");
    }
  };

  const editTag = async (item) => {
    const name = prompt("แก้ไขชื่อแท็ก", item.name);
    if (!name || name === item.name) return;
    try {
      await api.patch(`/api/tags/${item._id}`, { name });
      load();
    } catch (err) {
      alert(err.response?.data?.error || "ไม่สามารถแก้ไขแท็กได้");
    }
  };

  const deleteTag = async (id) => {
    if (!window.confirm("ต้องการลบแท็กนี้ใช่หรือไม่?")) return;
    try {
      await api.delete(`/api/tags/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "ไม่สามารถลบแท็กได้");
    }
  };

  const editDepartment = async (item) => {
    const name = prompt("แก้ไขชื่อสาขาวิชา/แผนก", item.name);
    if (!name || name === item.name) return;
    try {
      await api.patch(`/api/departments/${item._id}`, { name });
      load();
    } catch (err) {
      alert(err.response?.data?.error || "ไม่สามารถแก้ไขสาขาวิชาได้");
    }
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm("ต้องการลบสาขาวิชานี้ใช่หรือไม่?")) return;
    try {
      await api.delete(`/api/departments/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "ไม่สามารถลบสาขาวิชาได้");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          จัดการหมวดหมู่และแท็ก
        </h1>
        <p className="text-gray-500 mt-2">
          เพิ่ม แก้ไข และลบข้อมูลหมวดหมู่และแท็ก
        </p>
      </div>

      {/* หมวดหมู่ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">หมวดหมู่</h2>

          <div className="flex gap-3">
            <input
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="เพิ่มหมวดหมู่"
              className="w-72 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={addCategory}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              เพิ่ม
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-3 text-left w-20">ลำดับ</th>
                <th className="px-4 py-3 text-left">ชื่อหมวดหมู่</th>
                <th className="px-4 py-3 text-center w-48">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((c, index) => (
                <tr
                  key={c._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3">{c.name}</td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => editCategory(c)}
                        className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                      >
                        แก้ไข
                      </button>

                      <button
                        onClick={() => deleteCategory(c._id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* แท็ก */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">แท็ก</h2>

          <div className="flex gap-3">
            <input
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="เพิ่มแท็ก"
              className="w-72 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />

            <button
              onClick={addTag}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              เพิ่ม
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-3 text-left w-20">ลำดับ</th>
                <th className="px-4 py-3 text-left">ชื่อแท็ก</th>
                <th className="px-4 py-3 text-center w-48">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {tags.map((t, index) => (
                <tr
                  key={t._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3">{t.name}</td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => editTag(t)}
                        className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                      >
                        แก้ไข
                      </button>

                      <button
                        onClick={() => deleteTag(t._id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* สาขาวิชา / แผนก */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">สาขาวิชา / แผนก (Departments)</h2>

          <div className="flex gap-3">
            <input
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              placeholder="เพิ่มสาขาวิชา"
              className="w-72 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={addDepartment}
              className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              เพิ่ม
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-3 text-left w-20">ลำดับ</th>
                <th className="px-4 py-3 text-left">ชื่อสาขาวิชา / แผนก</th>
                <th className="px-4 py-3 text-center w-48">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                    — ไม่มีข้อมูลสาขาวิชา —
                  </td>
                </tr>
              ) : (
                departments.map((d, index) => (
                  <tr
                    key={d._id || index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{d.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => editDepartment(d)}
                          className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => deleteDepartment(d._id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}