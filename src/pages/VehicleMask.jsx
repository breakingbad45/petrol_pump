import React from "react";

const VehicleMask = ({ value, onChange, name }) => {
  const handleChange = (e) => {
    let raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    let part1 = raw.slice(0, 3).replace(/[^A-Z]/g, "");     // Only letters
    let part2 = raw.slice(3, 5).replace(/[^0-9]/g, "");     // Only digits
    let part3 = raw.slice(5, 9).replace(/[^0-9]/g, "");     // Only digits

    let formatted = part1;
    if (part2) formatted += " " + part2;
    if (part3) formatted += "-" + part3;

    onChange({ target: { name, value: formatted } });
  };

  return (
    <div className="form-group">
      <label className="col-sm-4 control-label">Vehicle No</label>
      <div className="col-sm-8">
        <input
          required
          className="form-control"
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder="ABC 12-3456"
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default VehicleMask;
