import React, { useState, useEffect, useRef } from "react";

function InputSelectMultiple({
  title,
  listOptions,
  filterInput,
  setFilter,
}: {
  title: string;
  listOptions: any[];
  filterInput: any[];
  setFilter: (callback: (currValue: any) => any) => void;
}) {
  const [popup, setPopup] = useState(false);
  const wrapperRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative w-64" ref={wrapperRef}>
      <button
        className="bg-white px-2 py-1 w-full text-left outline-none focus:ring-2 focus:ring-sky-300"
        onClick={(e) => {
          setPopup((currValue: boolean) => !currValue);
        }}
      >
        {title}
      </button>
      {popup && (
        <div className="absolute bg-white w-full z-10 mt-1 shadow-md p-2 space-y-2">
          {listOptions.map((option: any, idx: number) => {
            return (
              <div key={idx} className="flex items-center">
                <input
                  id={option.id}
                  type="checkbox"
                  checked={filterInput.some((e: any) => e.id === option.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilter((prev: any) => {
                        return [...prev, option];
                      });
                    } else {
                      setFilter((prev: any) => {
                        return prev.filter((el: any) => {
                          return el.id !== option.id;
                        });
                      });
                    }
                  }}
                  className="w-4 h-4 accent-emerald-300 text-emerald-300 bg-gray-100 rounded border-gray-300 focus:ring-2 focus:ring-emerald-500"
                />
                <label
                  htmlFor={option.id}
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  {option.name}
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default InputSelectMultiple;
