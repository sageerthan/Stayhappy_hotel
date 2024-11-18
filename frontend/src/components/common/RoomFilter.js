import React, { useState, useEffect } from 'react';

const RoomFilter = ({ data = [], setFilteredData }) => {
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // Ensure filtered data is reset when data changes
    if (Array.isArray(data)) {
      setFilteredData(data);
    }
  }, [data, setFilteredData]);

  const handleSelectChange = (e) => {
    const selectedRoomType = e.target.value;
    setFilter(selectedRoomType);

    const filteredRooms = Array.isArray(data)
      ? data.filter((room) =>
          room.roomType?.toLowerCase().includes(selectedRoomType.toLowerCase())
        )
      : [];
      
    setFilteredData(filteredRooms);
  };

  const clearFilter = () => {
    setFilter("");
    setFilteredData(data);
  };

  const roomTypes = Array.isArray(data)
    ? ["", ...new Set(data.map((room) => room.roomType || ""))]
    : [""];

  return (
    <div className="input-group mb-3">
      <span className="input-group-text" id="room-type-filter">
        Filter rooms by type
      </span>
      <select
        className="form-select"
        value={filter}
        onChange={handleSelectChange}
      >
        <option value="">Select room type to filter</option>
        {roomTypes.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
      </select>
      <button type="button" className="btn-hotel" onClick={clearFilter}>
        Clear Filter
      </button>
    </div>
  );
};

export default RoomFilter;
