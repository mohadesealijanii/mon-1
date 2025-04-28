import { FaRegUser } from "react-icons/fa"
import { LuShoppingBag } from "react-icons/lu"
import { Link } from "react-router-dom"
import { AiOutlineCopyright } from "react-icons/ai"
import { useState } from "react"
import Sidebar from "./modules/Sidebar"
import { RxHamburgerMenu } from "react-icons/rx"
import { Hamburger } from "./modules/Hamburger"

function Layout({ children }) {
  const [sidebar, setSidebar] = useState(false)

  return (
    <header>
      <div className="bg-white shadow-lg py-4 flex justify-between px-10 text-3xl">
        <div className="content-center bg-white">
          {/* <Link to="/"> */}
          <Hamburger
            isOpen={sidebar}
            toggle={() => setSidebar((prev) => !prev)}
          />

          {/* </Link> */}
        </div>
        <div className="font-bold">
          <Link to="/">Book Plus</Link>
          <span className="">+</span>
        </div>
        <div className="flex">
          <div className="content-center">
            <Link to="/shopping-cart">
              <LuShoppingBag size={20} />
            </Link>
          </div>
          <div className="pl-4 content-center">
            <Link to="/">
              <FaRegUser size={20} />
            </Link>
          </div>
        </div>
      </div>
      <div className="flex p-5">
        {sidebar && <Sidebar visible={sidebar} setSidebar={setSidebar} />}
        {/* <MuiXLicense /> */}

        <div className="flex-1 mt-10 min-h-screen">{children}</div>
      </div>
      <footer className="text-ocean font-bold bg-white flex justify-center border-t border-ocean/50 shadow-neutral-950 py-4 px-10 mt-20">
        <span className="p-1">
          <AiOutlineCopyright />
        </span>
        2025 Book Plus.
      </footer>
    </header>
  );
}

export default Layout
