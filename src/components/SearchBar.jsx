export default function SearchBar({ filters, onChange, onSearch }) {
  return (
    <div className="w-full flex justify-center items-center py-10">
      <form
        className="w-full max-w-3xl flex flex-col md:flex-row items-center gap-3 bg-surface-main p-4 rounded-2xl shadow-lg border border-border-subtle"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <div className="mt-10 flex justify-center">

          <div className="flex bg-surface-main rounded-xl shadow-lg overflow-hidden w-full max-w-3xl">

            <input
              className="flex-1 px-6 py-4 outline-none"
              value={filters.q || ''}
              onChange={(e) => onChange({ ...filters, q: e.target.value })}
              placeholder="ค้นหาประเภท ชื่อผู้วิจัย ชื่องานวิจัย หรือ keyword"
              aria-label="ค้นหาผลงานวิจัย"
            />

            <button className="bg-primary-container hover:opacity-90 text-on-primary px-8"
            >
              ค้นหา
            </button>

          </div>

        </div>

      </form>
    </div>

  );
}
