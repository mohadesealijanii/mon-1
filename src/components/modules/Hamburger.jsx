import { RxHamburgerMenu } from "react-icons/rx"
import { RxCross2 } from "react-icons/rx"
import { useState } from "react"

export function Hamburger({ isOpen, toggle }) {
  const [rotating, setRotating] = useState(false)

  const handleClick = () => {
    setRotating(true)
    setTimeout(() => {
      toggle()
      setRotating(false)
    }, 300) // مدت چرخش
  }

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <div
        className={`transition-transform duration-300`}
        style={{
          transform: rotating ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {isOpen ? <RxCross2 size={20} /> : <RxHamburgerMenu size={20} />}
      </div>
    </div>
  )
}
