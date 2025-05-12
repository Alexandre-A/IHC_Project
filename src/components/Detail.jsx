const Detail = ({ label, value, children }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="p-2 bg-gray-100 border rounded text-gray-800 break-words whitespace-normal">
        {value || children || "Not provided"}
      </div>
    </div>
  );

export default Detail;