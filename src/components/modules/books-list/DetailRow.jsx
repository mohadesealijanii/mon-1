import React, { useState } from "react"
import { GoTrash, GoCommentDiscussion } from "react-icons/go"
import { MdOutlineLocalOffer } from "react-icons/md"
import { TbCurrencyDollarOff } from "react-icons/tb"
import { SiWikibooks } from "react-icons/si"
import { FaBarcode, FaDollarSign } from "react-icons/fa6"
import { FiEdit } from "react-icons/fi"
import { BiSortAlt2 } from "react-icons/bi"
import ToolTip from "../Tooltip"
import OfferModal from "./OfferModal"
import FreeModal from "./FreeModal"
import OrderModal from "./OrderModal"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"
import EditBookModal from "./EditBookModal"
import DeleteBookModal from "./DeleteBookModal"

function DetailRow({
  author,
  tag,
  description,
  category,
  start,
  end,
  id,
  title,
  version,
  initialOrder,
  free,
  offer,
  imageSrc,
  setRefreshTrigger,
}) {
  const [modal, setModal] = useState(null)
  // const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const handleModal = (modalType) => {
    setModal((prev) => (prev === modalType ? null : modalType))
  }

  console.log(author)
  const firstGroup = [
    {
      id: "offer",
      icon: <MdOutlineLocalOffer />,
      text: offer ? "Remove Offer" : "Set Offer",
      onClick: () => handleModal("offer"),
      className: offer
        ? "bg-sun hover:bg-orange text-white"
        : "bg-sea text-white hover:bg-sea-hover shadow-indigo-500/50",
    },
    {
      id: "free",
      icon: free ? <TbCurrencyDollarOff /> : <FaDollarSign />,
      text: free ? "Activate Payment" : "Set Free",
      onClick: () => handleModal("free"),
      className: free
        ? "bg-green-400 hover:bg-green-500 text-white"
        : "bg-sea text-white hover:bg-sea-hover shadow-indigo-500/50",
    },
    {
      id: "order",
      icon: <BiSortAlt2 />,
      text: "Sort Book",
      onClick: () => handleModal("order"),
    },
    {
      id: "chapters",
      icon: <SiWikibooks />,
      text: "Chapters",
      onClick: () => navigate(`/chapters/${id}`),
    },
  ]

  const secondGroup = [
    {
      id: "code",
      icon: <FaBarcode />,
      text: "Book Codes",
      onClick: () => handleModal("code"),
    },
    {
      id: "edit",
      icon: <FiEdit />,
      text: "Edit Book",
      onClick: () => {
        handleModal("edit")
      },
    },
    { id: "comments", icon: <GoCommentDiscussion />, text: "Comments" },
    {
      id: "delete",
      icon: <GoTrash />,
      text: "Delete Book",
      className: "bg-blood/80 text-white hover:bg-blood/100 hover:text-white",
      onClick: () => handleModal("delete"),
    },
  ]

  return (
    <>
      {modal === "delete" && (
        <DeleteBookModal
          onClose={() => setModal(null)}
          title={title}
          id={id}
          setRefreshTrigger={setRefreshTrigger}
        />
      )}

      {modal === "edit" && (
        <EditBookModal
          editingData={{
            Title: title,
            Version: version,
            Authors: author,
            Tags: tag,
            Category: category,
            Description: description,
          }}
          setModal={setModal}
        />
      )}
      <div className="flex gap-20 p-2">
        {modal === "offer" && (
          <OfferModal
            id={id}
            title={title}
            onClose={() => setModal(false)}
            setOfferModal={setModal}
            setRefreshTrigger={setRefreshTrigger}
            offer={offer}
          />
        )}
        {modal === "free" && (
          <FreeModal
            id={id}
            title={title}
            onClose={() => setModal(false)}
            setModal={setModal}
            free={free}
            setRefreshTrigger={setRefreshTrigger}
          />
        )}

        {modal === "code" && navigate(`/bookCodes/${id}`)}

        {modal === "order" && (
          <OrderModal
            id={id}
            title={title}
            onClose={() => setModal(false)}
            setModal={setModal}
            initialOrder={initialOrder}
            setRefreshTrigger={setRefreshTrigger}
          />
        )}
        <div className="flex items-center w-fit h-24 border border-violet shadow-indigo-500/50 rounded-xl pr-1 shadow-sm">
          <div>
            <img
              src={imageSrc}
              className="min-w-20 max-w-20 object-cover rounded-md ml-2"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/pics/nopic.png"
              }}
            />
          </div>

          <div className="pl-3 text-sm">
            <p className="font-bold pb-1 whitespace-nowrap overflow-hidden text-ellipsis w-70">
              Author: <span className="font-light">{author}</span>
            </p>
            <p className="font-bold pb-1 whitespace-nowrap overflow-hidden text-ellipsis w-70">
              Tag: <span className="font-light">{tag}</span>
            </p>
            <p className="font-bold pb-1 whitespace-nowrap overflow-hidden text-ellipsis w-70">
              Version: <span className="font-light">{version}</span>
            </p>
            {description && (
              <p className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                Description: {description}
              </p>
            )}

            {console.log(dayjs(end).format("DD MMM YYYY"))}
            {console.log(dayjs(start).format("DD MMM YYYY"))}
            {free ? (
              <p className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                Free: ‌
                {!dayjs(end).isSame(dayjs(start), "day") ? (
                  <span className="font-light">
                    {dayjs(start).format("DD MMM YYYY")}
                    <span className="font-bold"> to </span>
                    {dayjs(end).format("DD MMM YYYY")}
                  </span>
                ) : (
                  <span className="font-light"> Just today</span>
                )}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[firstGroup, secondGroup].map((group, index) => (
            <div key={index} className="flex gap-4 p-1 rounded-md -mr-50">
              {group.map(({ id, icon, text, onClick, className }) => (
                <div key={id} className="relative group">
                  <div
                    className={`p-2 text-white shadow-lg cursor-pointer rounded-lg transition-colors duration-400 ${
                      className ||
                      "bg-sea hover:bg-sea-hover shadow-indigo-500/50"
                    }`}
                    data-tooltip-id={id}
                    onClick={onClick}
                  >
                    {icon}
                  </div>
                  <ToolTip id={id} content={text} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default DetailRow
