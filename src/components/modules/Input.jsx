import React, { forwardRef } from "react";

const Input = forwardRef(
  ({ label, value, onChange, onFocus, onBlur, type = "text" }, ref) => {
    return (
      <div className="relative lg:w-77">
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder=" "
          // onFocus={onFocus}
          onBlur={onBlur}
          className="max-h-12 peer w-full border border-grey/30 rounded-md px-3 pt-6 pb-2 text-sm
                   focus:outline-none focus:border-sea focus:ring-sea hover:border hover:border-sea 
                   bg-white transition-all "
        />
        <label
          className="absolute left-3 -top-[4px] text-gray-500 text-sm transition-all duration-300 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                   peer-placeholder-shown:text-gray-400
                   peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-sea bg-white px-1"
        >
          <span className="text-sm">{label}</span>
        </label>
      </div>
    );
  }
);

export default Input;
