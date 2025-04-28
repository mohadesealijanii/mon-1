import toast from "react-hot-toast"
import { getAllBooks, getBooksAny } from "../../../utils/services"
import Table from "../../modules/Table"
import { useEffect, useState } from "react"
import SearchAny from "../../modules/books-list/SearchAny"
import DetailRow from "../../modules/books-list/DetailRow"
import { MdOutlineExpandCircleDown, MdOutlineLocalOffer } from "react-icons/md"
import { TbCurrencyDollarOff } from "react-icons/tb"
import StarRating from "../../modules/StarRating"
import { FaCirclePlus } from "react-icons/fa6"
import AddBookModal from "../../modules/books-list/AddBookModal"
import { GrHelp } from "react-icons/gr"
import HelpModal from "../../modules/books-list/HelpModal"
import nopic from "../../../pics/nopic.png"
import ToolTip from "../../modules/Tooltip"
import dayjs from "dayjs"

function BookListPage() {
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 1,
    category: "",
    categoryList: [],
    title: "",
    authors: "",
    tags: "",
    isOffer: null,
  })
  const [data, setData] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [detailRow, setDetailRow] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [searchRow, setSearchRow] = useState(false)
  const [anyValue, setAnyValue] = useState("")
  const [addBookModal, setAddBookModal] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const handleAny = () => {
    if (!anyValue.trim()) return

    setPagination((prev) => {
      if (prev.text !== anyValue.trim()) {
        return {
          ...prev,
          pageNumber: 1,
          text: anyValue.trim(),
        }
      }
      return prev
    })
    setIsSearchMode(true)
  }

  useEffect(() => {
    async function fetchBooks() {
      console.log(pagination, isSearchMode, refreshTrigger)
      try {
        setLoading(true)
        let bookResponse
        if (isSearchMode && pagination.text) {
          bookResponse = await getBooksAny(pagination)
          console.log("searchany")
        } else {
          bookResponse = await getAllBooks({ pagination })
          console.log("defaultsearch")
        }
        setData(bookResponse || { data: [] })
      } catch (error) {
        console.log(error)
        toast.error("Error fetching books")
        setData({ data: [] })
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [pagination, isSearchMode, refreshTrigger])

  const columns = [
    { key: "expand", label: " " },
    { key: "image", label: "Image" },
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "rate", label: "Rate" },
  ]

  const filters = (
    <div className="justify-between w-full">
      <div className="block">
        <SearchAny
          setPagination={setPagination}
          pagination={pagination}
          setLoading={setLoading}
          setSearchRow={setSearchRow}
          handleAny={handleAny}
          anyValue={anyValue}
          setAnyValue={setAnyValue}
          isSearchMode={isSearchMode}
          setIsSearchMode={setIsSearchMode}
        />
      </div>
    </div>
  )
  const BASE_URL = "https://stg-core.bpapp.net/"
  const THUMB = "Content/Images/Book/Thumb/"

  const renderBookRow = (item) => (
    <>
      <tr
        className={`w-full hover:bg-ocean/6 transition-colors duration-400 border-t border-slate-300 overflow-x-scroll cursor-pointer text-nowrap ${
          detailRow === item.id ? "bg-ocean/5 text-bold" : ""
        }`}
        onClick={() =>
          setDetailRow((prev) => (prev === item.id ? null : item.id))
        }
      >
        <td className="pl-4 text-sea-hover">
          <button className="">
            <MdOutlineExpandCircleDown
              size={20}
              className={`transform transition-transform duration-300 ${
                detailRow === item.id ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </td>
        <td className="pl-2">
          <img
            src={`${BASE_URL}${THUMB}${item.imageName}`}
            alt=" "
            className="w-16 h-auto p-2 "
            onError={(e) => {
              e.target.onerror = null
              e.target.src = nopic
            }}
          />
        </td>
        <td className="sm:pl-4 lg:pl-4 md:pl-4 border-slate-300">{item.id}</td>
        <td className="flex p-4 border-slate-300 ">
          {item.title}
          {item.isOffer && (
            <span className="ml-3 p-1 max-h-6 bg-sun rounded text-white mr-1">
              <MdOutlineLocalOffer renderRow />
            </span>
          )}
          {item.isFree ? (
            <span
              data-tooltip-id="freeDate"
              className="ml-1 p-1 max-h-6 bg-green-400 rounded text-white"
            >
              <TbCurrencyDollarOff />
              <ToolTip
                id="freeDate"
                content={`from ${dayjs(item.start).format("DD MMM YYYY")} to ${dayjs(item.end).format("DD MMM YYYY")}`}
              />
            </span>
          ) : null}
        </td>
        <td className="p-4 border-slate-300">{item.category}</td>
        <td>
          <StarRating score={item.score} />
        </td>
      </tr>
      {detailRow === item.id && (
        <tr className="transition-all duration-500 ease-in-out max-h-[500px] opacity-100 overflow-hidden">
          <td colSpan={6}>
            <DetailRow
              author={item.authors}
              tag={item.tags}
              version={item.version}
              description={item.description}
              end={item.end}
              start={item.start}
              id={item.id}
              title={item.title}
              category={item.category}
              offer={item.isOffer}
              initialOrder={item.order}
              free={item.isFree}
              imageSrc={`${BASE_URL}${THUMB}${item.imageName}`}
              renderRow={renderBookRow}
              setRefreshTrigger={setRefreshTrigger}
            />
          </td>
        </tr>
      )}
    </>
  )

  const addButton = () => (
    <button
      onClick={() => setAddBookModal((prev) => !prev)}
      className="flex bg-sun hover:bg-orange cursor-pointer transition-colors duration-300 px-[22px] py-2 rounded-md text-nowrap text-white relative overflow-visible"
    >
      <FaCirclePlus size={25} className="mr-4" />
      Add Book
    </button>
  )

  const helpButton = () => (
    <button onClick={() => setShowHelpModal(true)}>
      <GrHelp
        size={30}
        className="bg-sea hover:bg-sea-hover text-white cursor-pointer shadow-md w-9 h-9 p-1 mr-2 rounded transition-all"
      data-tooltip-id="help"
      />
      <ToolTip id="help" content="Buttons Guide"/>
    </button>
  )

  return (
    <div>
      {addBookModal && (
        <AddBookModal
          setAddBookModal={setAddBookModal}
          pagination={pagination}
          setRefreshTrigger={setRefreshTrigger}
          setPagination={setPagination}
        />
      )}

      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}

      <Table
        title="Books List"
        addButton={addButton()}
        helpButton={helpButton()}
        data={data.data}
        setData={setData}
        columns={columns}
        totalData={data.totalCount}
        setPagination={setPagination}
        pagination={pagination}
        loading={loading}
        setLoading={setLoading}
        detailRow={detailRow}
        setDetailRow={setDetailRow}
        customHeaderContent={filters}
        renderRow={renderBookRow}
        searchRow={searchRow}
        setSearchRow={setSearchRow}
      />
    </div>
  )
}

export default BookListPage
