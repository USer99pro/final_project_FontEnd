import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../api/client";

const TYPES = {
  categories: { label: "หมวดหมู่", endpoint: "categories" },
  tags: { label: "แท็ก", endpoint: "tags" },
  departments: { label: "สาขาวิชา / แผนก", endpoint: "departments" },
};

export default function CategoryTagManagement() {
  const [data, setData] = useState({ categories: [], tags: [], departments: [] });
  const [activeType, setActiveType] = useState("categories");
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState({ categories: [], tags: [], departments: [] });
  const selectAllRef = useRef(null);

  const load = async () => {
    try {
      const [categoriesRes, tagsRes, departmentsRes] = await Promise.all([
        api.get("/api/public/categories").catch(() => api.get("/api/categories")),
        api.get("/api/public/tags").catch(() => api.get("/api/tags")),
        api.get("/api/departments").catch(() => ({ data: [] })),
      ]);
      setData({
        categories: categoriesRes.data?.categories || categoriesRes.data || [],
        tags: tagsRes.data?.tags || tagsRes.data || [],
        departments: departmentsRes.data?.departments || departmentsRes.data || [],
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { setPage(1); }, [activeType, search, pageSize]);

  const type = TYPES[activeType];
  const items = data[activeType];
  const filteredItems = useMemo(
    () => items.filter((item) => item.name?.toLowerCase().includes(search.trim().toLowerCase())),
    [items, search]
  );
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectedIds = selected[activeType];
  const allSelected = filteredItems.length > 0 && filteredItems.every((item) => selectedIds.includes(item._id));
  const someSelected = !allSelected && filteredItems.some((item) => selectedIds.includes(item._id));

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const updateSelected = (ids) => setSelected((previous) => ({ ...previous, [activeType]: ids }));
  const toggleItem = (id) => updateSelected(selectedIds.includes(id)
    ? selectedIds.filter((selectedId) => selectedId !== id)
    : [...selectedIds, id]);
  const toggleAll = () => {
    const filteredIds = filteredItems.map((item) => item._id);
    updateSelected(allSelected
      ? selectedIds.filter((id) => !filteredIds.includes(id))
      : [...new Set([...selectedIds, ...filteredIds])]);
  };

  const addItem = async () => {
    if (!newName.trim()) return;
    try {
      await api.post(`/api/${type.endpoint}`, { name: newName.trim() });
      setNewName("");
      load();
    } catch (error) {
      alert(error.response?.data?.error || "ไม่สามารถเพิ่มข้อมูลได้");
    }
  };

  const editItem = async (item) => {
    const name = prompt(`แก้ไขชื่อ${type.label}`, item.name);
    if (!name?.trim() || name.trim() === item.name) return;
    try {
      await api.patch(`/api/${type.endpoint}/${item._id}`, { name: name.trim() });
      load();
    } catch (error) {
      alert(error.response?.data?.error || "ไม่สามารถแก้ไขข้อมูลได้");
    }
  };

  const deleteItems = async (ids) => {
    if (!ids.length || !window.confirm(`ต้องการลบ${type.label} ${ids.length} รายการใช่หรือไม่?`)) return;
    const results = await Promise.allSettled(ids.map((id) => api.delete(`/api/${type.endpoint}/${id}`)));
    const failed = results.filter((result) => result.status === "rejected").length;
    if (failed) alert(`ลบข้อมูลไม่สำเร็จ ${failed} รายการ`);
    updateSelected(selectedIds.filter((id) => !ids.includes(id)));
    load();
  };

  return (
    <div className="min-h-screen w-full bg-[#f7f9fc] p-4 md:p-6">
      <div className="mx-auto max-w-[1440px] space-y-5">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_18px_rgba(45,55,75,0.08)]">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_230px_250px] lg:items-end">
            <label className="block">
              <span className="mb-2 block text-base font-bold text-slate-800">ค้นหารายการ</span>
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3">
                <span className="mr-2 text-slate-400">⌕</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาจากชื่อหมวดหมู่, แท็ก หรือสาขาวิชา" className="h-11 w-full bg-transparent text-lg outline-none placeholder:text-slate-400" />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-base font-bold text-slate-800">ประเภทข้อมูล</span>
              <select value={activeType} onChange={(event) => setActiveType(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-lg text-slate-600 outline-none focus:ring-2 focus:ring-indigo-200">
                {Object.entries(TYPES).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
              </select>
            </label>
            <div className="flex gap-2">
              <input value={newName} onChange={(event) => setNewName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addItem()} placeholder={`เพิ่ม${type.label}`} className="h-11 min-w-0 flex-1 rounded-xl border border-slate-300 px-4 text-base outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
              <button onClick={addItem} className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 px-6 text-sm font-bold text-white shadow-md shadow-indigo-500/20 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition cursor-pointer">เพิ่ม</button>
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_18px_rgba(45,55,75,0.08)]">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800">สรุป{type.label}</h1>
              <p className="mt-0.5 text-sm font-medium text-slate-500">จัดการข้อมูลทั้งหมด {filteredItems.length} รายการ</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-600">แสดง</span>
              <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} className="h-10 rounded-xl border border-slate-300 bg-white px-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500">
                <option value={10}>10 รายการ</option><option value={25}>25 รายการ</option><option value={50}>50 รายการ</option>
              </select>
              <button disabled={!selectedIds.length} onClick={() => deleteItems(selectedIds)} className="h-10 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold px-4 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer">ลบที่เลือก ({selectedIds.length})</button>
            </div>
          </div>

          <div className="max-h-[520px] overflow-auto">
            <table className="w-full min-w-[760px] text-left text-base">
              <thead className="sticky top-0 z-10 bg-[#f7f8fc] text-[14px] font-bold uppercase tracking-wide text-slate-500 shadow-sm">
                <tr>
                  <th className="w-14 px-5 py-3 text-center"><input ref={selectAllRef} type="checkbox" checked={allSelected} onChange={toggleAll} disabled={!filteredItems.length} aria-label="เลือกทั้งหมด" className="h-4 w-4 cursor-pointer accent-indigo-600" /></th>
                  <th className="w-28 px-3 py-3">ลำดับ</th>
                  <th className="px-3 py-3">ชื่อ{type.label}</th>
                  <th className="w-40 px-3 py-3">สถานะ</th>
                  <th className="w-44 px-5 py-3 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {pageItems.length ? pageItems.map((item, index) => (
                  <tr key={item._id} className="border-b border-slate-100 transition hover:bg-indigo-50/30">
                    <td className="px-5 py-3 text-center"><input type="checkbox" checked={selectedIds.includes(item._id)} onChange={() => toggleItem(item._id)} aria-label={`เลือก ${item.name}`} className="h-4 w-4 cursor-pointer accent-indigo-600" /></td>
                    <td className="px-3 py-3 font-semibold text-slate-500">{(currentPage - 1) * pageSize + index + 1}</td>
                    <td className="px-3 py-3 font-bold text-slate-800">{item.name}</td>
                    <td className="px-3 py-3"><span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">ใช้งานอยู่</span></td>
                    <td className="px-5 py-3"><div className="flex justify-center gap-2"><button onClick={() => editItem(item)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 transition cursor-pointer">แก้ไข</button><button onClick={() => deleteItems([item._id])} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition cursor-pointer">ลบ</button></div></td>
                  </tr>
                )) : <tr><td colSpan={5} className="px-5 py-12 text-center text-lg text-slate-400">ไม่พบข้อมูล{type.label}</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-base sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-slate-500">แสดง {(currentPage - 1) * pageSize + (pageItems.length ? 1 : 0)}–{(currentPage - 1) * pageSize + pageItems.length} จาก {filteredItems.length} รายการ</span>
            <div className="flex items-center gap-1.5"><button onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition flex items-center justify-center font-bold">‹</button>{Array.from({ length: totalPages }, (_, index) => index + 1).slice(Math.max(0, currentPage - 3), currentPage + 2).map((number) => <button key={number} onClick={() => setPage(number)} className={`w-8 h-8 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition cursor-pointer ${number === currentPage ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"}`}>{number}</button>)}<button onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition flex items-center justify-center font-bold">›</button></div>
          </div>
        </section>
      </div>
    </div>
  );
}
