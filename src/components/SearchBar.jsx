export default function SearchBar({ filters, onChange, onSearch }) {
  return (
    <form
      className="search-bar"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <input
        placeholder="ค้นหาชื่อผลงาน / คำสำคัญ"
        value={filters.q}
        onChange={(e) => onChange({ ...filters, q: e.target.value })}
      />
      <input
        placeholder="ชื่อนักศึกษา"
        value={filters.studentName}
        onChange={(e) => onChange({ ...filters, studentName: e.target.value })}
      />
      <input
        placeholder="สาขาวิชา"
        value={filters.major}
        onChange={(e) => onChange({ ...filters, major: e.target.value })}
      />
      <input
        placeholder="ปีการศึกษา"
        value={filters.academicYear}
        onChange={(e) => onChange({ ...filters, academicYear: e.target.value })}
      />
      <button type="submit">ค้นหา</button>
    </form>
  );
}
