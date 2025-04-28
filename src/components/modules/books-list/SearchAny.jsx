import { useState } from "react"
import { GoTrash } from "react-icons/go"
import { LuSearch } from "react-icons/lu"
import { RxCross2 } from "react-icons/rx"

function SearchAny({
  handleAny,
  anyValue,
  setAnyValue,
  setSearchRow,
  setIsSearchMode,
  isSearchMode,
}) {
  const [sparkles, setSparkles] = useState([])

  const generateSparkles = () => {
    const count = 80
    const dots = Array.from({ length: count }).map((_, index) => ({
      id: Date.now() + index,
      transformEnd: `translate(${(Math.random() - 0.5) * 200}px, ${
        (Math.random() - 0.5) * 200
      }px)`,
    }))
    setSparkles(dots)
    setTimeout(() => setSparkles([]), 900)
  }

  return (
    <div className="relative w-full">
      <div className="flex px-2 mt-3 justify-between">
        <div className="relative w-full">
          <LuSearch
            className="bg-sea hover:bg-sea-hover cursor-pointer shadow-md w-9 h-9 p-1 absolute right-1 top-[23px] -translate-y-1/2 rounded transition-all"
            size={15}
            color="white"
            onClick={handleAny}
          />

          {anyValue && (
            <RxCross2
              onClick={() => {
                setIsSearchMode(false)
                setAnyValue("")
              }}
              className="text-grey cursor-pointer w-6 h-6 p-1 absolute right-12 top-[23px] -translate-y-1/2 transition-all"
            />
          )}

          <input
            id="search-input"
            value={anyValue}
            placeholder=" "
            onChange={(e) => setAnyValue(e.target.value)}
            className="peer w-full border border-grey/30 rounded-md pl-3 pr-10 pt-6 text-sm
                   focus:outline-none focus:border-sea focus:ring-1 focus:ring-sea 
                   hover:border-sea transition-all"
          />
          <label
            htmlFor="search-input"
            className="absolute left-3 top-[0.9px] text-gray-500 text-sm transition-all duration-300 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                   peer-placeholder-shown:text-gray-400
                   peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-sea bg-white px-1 pointer-events-none"
          >
            Search Any
          </label>
        </div>

        <div>
          <div className="relative group">
            <button
              onMouseEnter={generateSparkles}
              className="bg-sea hover:bg-sea-hover cursor-pointer transition-colors duration-300 px-3 mx-2 rounded-md text-nowrap text-white h-11 z-6 relative overflow-visible"
              onClick={() => setSearchRow((prev) => !prev)}
            >
              Advanced Search
            </button>

            <div className="sparkle-container">
              {sparkles.map((sparkle) => (
                <span
                  key={sparkle.id}
                  className="sparkle-dot"
                  style={{
                    top: "50%",
                    left: "50%",
                    "--transform-end": sparkle.transformEnd,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchAny
