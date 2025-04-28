import logo from "../../pics/logo.png";
import React, { useEffect, useState } from "react";
import { IoChevronForward } from "react-icons/io5";
import { NavLink, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const menuConfig = [
  {
    key: "books",
    title: "Books",
    routes: [
      { path: "/bookCategories", label: "Categories" },
      { path: "/booksList", label: "Book List" },
      { path: "/booksCode", label: "Book Code" },
    ],
  },
  {
    key: "banners",
    title: "Banners",
    routes: [
      { path: "/bannerItems", label: "Banner Items" },
      { path: "/banners", label: "Banner Names" },
    ],
  },
  {
    key: "code",
    title: "Code",
    routes: [
      { path: "/codesList", label: "Codes List" },
      { path: "/repeatedCodes", label: "Repeated Codes" },
      { path: "/connectedCodesLog", label: "Connecteds Log" },
    ],
  },
  {
    key: "settings",
    title: "Settings",
    routes: [
      { path: "/emails", label: "Emails" },
      { path: "/searchSetting", label: "Searches" },
      { path: "/updateSettings", label: "Update Settings" },
    ],
  },
];

function Sidebar() {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuKey) => {
    setOpenMenus((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
    window.location.href = "/signin";
  };

  useEffect(() => {
    const path = location.pathname;
    const newOpenMenus = {};
    menuConfig.forEach((menu) => {
      newOpenMenus[menu.key] = menu.routes.some((route) =>
        path.startsWith(route.path)
      );
    });
    setOpenMenus(newOpenMenus);
  }, [location.pathname]);

  const renderMenu = (menu) => (
    <li key={menu.key}>
      <button
        onClick={() => toggleMenu(menu.key)}
        className={`mb-1 mt-3 hover:text-sea transition duration-300 ease-in-out ${
          openMenus[menu.key] ? "text-sea font-semibold" : ""
        }`}
      >
        <IoChevronForward
          className={`text-sea mr-3 transition-transform duration-300 inline ${
            openMenus[menu.key] ? "rotate-90" : ""
          }`}
        />
        {menu.title}
      </button>
      {openMenus[menu.key] && (
        <ul className="flex flex-col ml-2">
          {menu.routes.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `ml-9 ${
                  path === menu.routes.at(-1)?.path ? "mb-5" : ""
                } hover:text-sea transition duration-300 ${
                  isActive ? "text-sea" : ""
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </ul>
      )}
    </li>
  );

  return (
    <div className="sm:z-1 mx-3 mt-10 max-h-fit py-7 min-w-fit md:block bg-white shadow-xl w-56 p-3 rounded-xl text-nowrap">
      <div className="flex mb-4">
        <img src={logo} alt="logo" className="w-9 mr-2 flex-nowrap" />
        <h1 className="mt-1 font-bold text-ocean text-2xl">Book Plus</h1>
      </div>

      <ul className="text-grey">
        {menuConfig.map(renderMenu)}

        <li className="mt-3">
          <NavLink
            to="/comments"
            className={({ isActive }) =>
              `ml-7 hover:text-sea transition duration-300 ${
                isActive ? "text-sea font-semibold" : ""
              }`
            }
          >
            Comments
          </NavLink>
        </li>

        <li className="mt-3">
          <NavLink
            to="/members"
            className={({ isActive }) =>
              `ml-7 hover:text-sea transition duration-300 ${
                isActive ? "text-sea font-semibold" : ""
              }`
            }
          >
            Members
          </NavLink>
        </li>

        <li className="mt-3">
          <NavLink
            to="/log"
            className={({ isActive }) =>
              `ml-7 hover:text-sea transition duration-300 ${
                isActive ? "text-sea font-semibold" : ""
              }`
            }
          >
            Logs
          </NavLink>
        </li>

        <li>
          <div className="mt-3 ml-7">
            <button
              onClick={handleLogout}
              className="text-red-800 transition duration-300 ease-in-out hover:font-semibold"
            >
              Log out
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
