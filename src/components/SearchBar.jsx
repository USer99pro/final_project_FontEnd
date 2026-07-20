export default function SearchBar({ filters, onChange, onSearch }) {
  return (
    <div className="w-full flex justify-center items-center py-10">
      <form
        className="w-full max-w-3xl flex flex-col md:flex-row items-center gap-3 bg-white p-4 rounded-2xl shadow-lg border border-gray-200"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <div className="mt-10 flex justify-center">

          <div className="flex bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-3xl">

            <input
              className="flex-1 px-6 py-4 outline-none"
              placeholder="ค้นหาชื่องานวิจัย นักศึกษา แผนกวิชา หรืออาจารย์ที่ปรึกษา"
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              ค้นหา
            </button>

          </div>

        </div>

      </form>
    </div>

  );
}