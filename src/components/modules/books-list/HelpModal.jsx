import React from "react"
import { GoTrash, GoCommentDiscussion } from "react-icons/go"
import { MdOutlineLocalOffer } from "react-icons/md"
import { TbCurrencyDollarOff } from "react-icons/tb"
import { SiWikibooks } from "react-icons/si"
import { FaBarcode, FaDollarSign } from "react-icons/fa6"
import { FiEdit } from "react-icons/fi"
import { BiSortAlt2 } from "react-icons/bi"

const HelpModal = ({ onClose }) => {
  const actions = [
    {
      icon: <MdOutlineLocalOffer className="text-sea" />,
      title: "Offer",
      description: "Apply or remove offer from the book",
    },
    {
      icon: <TbCurrencyDollarOff className="text-green-500" />,
      title: "Activate Payment",
      description: "Mark the book as free",
    },
    {
      icon: <FaDollarSign className="text-green-500" />,
      title: "Set Free",
      description: "Mark the book as free",
    },
    {
      icon: <BiSortAlt2 className="text-purple-500" />,
      title: "Order Book",
      description: "Organize the order of books",
    },
    {
      icon: <SiWikibooks className="text-yellow-500" />,
      title: "Chapters",
      description: "Navigate to book chapters page",
    },
    {
      icon: <FaBarcode className="text-red-500" />,
      title: "Book Codes",
      description: "View and manage book codes",
    },
    {
      icon: <FiEdit className="text-blue-500" />,
      title: "Edit Book",
      description: "Modify the details of the book",
    },
    {
      icon: <GoCommentDiscussion className="text-gray-500" />,
      title: "Comments",
      description: "View and manage book comments",
    },
    {
      icon: <GoTrash className="text-red-500" />,
      title: "Delete Book",
      description: "Remove the book from the list",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50">
      <div className="bg-white relative rounded-xl shadow-lg p-6 w-full max-w-lg text-right">
        <h2 className="text-xl font-semibold mb-9 text-center">
          Buttons Guide
        </h2>
        <span
          onClick={onClose}
          className="absolute top-3 right-4 text-xl text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          ×
        </span>
        <div className="space-y-4">
          {actions.map((action, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center border-2 border-sea rounded-full shadow-md">
                {action.icon}
              </div>
              <div className="text-sm text-gray-800">
                <span className="font-semibold">{action.title}</span>
                <span className="ml-1">– {action.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HelpModal
