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
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            🔍
          </span>

          <input
            type="text"
            placeholder="ค้นหาชื่อผลงาน, นักศึกษา, แผนกวิชา หรือปีการศึกษา"
            value={filters.keyword}
            onChange={(e) =>
              onChange({
                ...filters,
                keyword: e.target.value,
              })
            }
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200 shadow-md"
        >
          ค้นหา
        </button>
      </form>
    </div>
  );
}