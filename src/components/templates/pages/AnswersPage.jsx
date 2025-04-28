import React, { useEffect, useState } from "react"
import Table from "../../modules/Table"
import { GoTrash } from "react-icons/go"
import { FiEdit } from "react-icons/fi"
import { BiSortAlt2 } from "react-icons/bi"
import { FaCirclePlus } from "react-icons/fa6"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { MdOutlineRadioButtonUnchecked } from "react-icons/md"
import {
  changeAnswerOrder,
  deleteAnswer,
  getAnswers,
} from "../../../utils/services"
import { useParams } from "react-router-dom"
import ToolTip from "../../modules/Tooltip"
import toast from "react-hot-toast"
import ReusableDeleteModal from "../../modules/ReusableDeleteModal"
import ReusableSortModal from "../../modules/ReusableSortModal"
import AddQuesModal from "../../modules/chapter/tests/questions/AddQuesModal"
import EditQuestionModal from "../../modules/chapter/tests/questions/EditQuestionModal"
import AddAnswerModal from "../../modules/chapter/tests/answers/AddAnswerModal"
import EditAnswerModal from "../../modules/chapter/tests/answers/EditAnswerModal"
import SetAnswerModal from "../../modules/chapter/tests/answers/SetAnswrModal"

function AnswersPage() {
  const { quesId } = useParams()
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 1,
    questionId: quesId,
  })
  const [data, setData] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [editingData, setEditingData] = useState([])
  const [selectedAns, setSelectedAns] = useState({
    id: "",
    order: "",
    isCorrect: null,
  })
  const [modelQuestions, setModelQuestions] = useState(null)
  const [modals, setModals] = useState({
    add: false,
    delete: false,
    edit: false,
    sort: false,
    confirm: false,
  })

  useEffect(() => {
    getAns()
  }, [pagination, refreshTrigger])

  const getAns = async () => {
    try {
      setLoading(true)
      const ansResponse = await getAnswers(pagination)
      setData(ansResponse)
      if (ansResponse.data && ansResponse.data.length > 0) {
        setModelQuestions(ansResponse.data[0]?.modelQuestions)
      }
      setLoading(false)
      console.log(ansResponse)
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error("An error occured while fetching Questions")
    }
  }

  const handleSort = async (selectedAns) => {
    console.log(selectedAns)
    try {
      const res = await changeAnswerOrder(selectedAns.id, selectedAns.order)
      if (res.status === 200) {
        setRefreshTrigger((prev) => !prev)
        toast.success("Done!")
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!")
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      const res = await deleteAnswer(selectedAns.id)
      if (res.status === 200) {
        toast.success("Question is successfully deleted!")
        setModals((prev) => ({ ...prev, delete: false }))
        setLoading(false)
        getAns()
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error("Something went wrong!")
    }
  }

  const renderQuestionRow = (item) => {
    const currentModelQuestions = modelQuestions ?? 1
    const baseActions = [
      {
        id: "confirm",
        text: item.isCorrect ? "The Correct Answer" : "Confirm Answer",
        icon: <IoMdCheckmarkCircleOutline />,
        onClick: () => {
          setEditingData(item)
          setModals((prev) => ({ ...prev, confirm: true }))
          setSelectedAns({ id: item.id, order: item.order, title: item.title })
        },
        disabled: item.isCorrect,
        className: item.isCorrect
          ? "bg-green-400 cursor-not-allowed"
          : "bg-white text-sea border border-sea hover:bg-sea hover:text-white cursor-pointer",
      },
      {
        id: "sort",
        icon: <BiSortAlt2 />,
        text: "Sort",
        onClick: () => {
          setModals((prev) => ({ ...prev, sort: true }))
          setSelectedAns({ id: item.id, order: item.order, title: item.title })
          console.log(item)
        },
      },
    ]

    const editAction = {
      id: "edit",
      icon: <FiEdit />,
      text: "Edit Answer",
      onClick: () => {
        setEditingData(item)
        setSelectedAns({ id: item.id, title: item.title })
        setModals((prev) => ({ ...prev, edit: true }))
      },
    }

    const deleteAction = {
      id: "delete",
      icon: <GoTrash />,
      text: "Delete Answer",
      className: "bg-blood/80 hover:bg-blood/100 text-white  cursor-pointer",
      onClick: () => {
        setSelectedAns({ id: item.id })
        setModals((prev) => ({ ...prev, delete: true }))
      },
    }

    let actions = [...baseActions]

    if (currentModelQuestions === 1) {
      actions.push(editAction, deleteAction)
    } else if (currentModelQuestions === 3) {
      actions.push(editAction)
    }

    return (
      <tr key={item.id} className="cursor-pointer hover:bg-gray-100">
        <td className="text-left pl-5">{item.title}</td>
        <td className="p-4 border-slate-300">{item.order}</td>
        <td className="p-4 border-slate-300 flex gap-3 -ml-10">
          {actions.map((action) => {
            const tooltipId = `${action.id}-${item.id}`

            return (
              <button
                key={action.id}
                data-tooltip-id={tooltipId}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!action.disabled) {
                    action.onClick()
                  }
                }}
                disabled={action.disabled}
                className={`flex items-center gap-1 p-2 rounded-md text-sm ${
                  action.disabled ? " text-white" : ""
                } ${
                  action.className ||
                  "bg-sea hover:bg-sea-hover text-white cursor-pointer"
                }`}
              >
                {action.icon}
                <ToolTip id={tooltipId} content={action.text} />
              </button>
            )
          })}
        </td>
      </tr>
    )
  }

  const columns = [
    { key: "title", label: "Title" },
    { key: "order", label: "Order" },
    { key: "controls", label: "Controls" },
  ]
  const addButton = () => (
    <>
      {modelQuestions === 1 && (
        <button
          onClick={() => setModals((prev) => ({ ...prev, add: true }))}
          className="flex bg-sun hover:bg-orange cursor-pointer transition-colors duration-300 py-2 px-2 rounded-md text-nowrap text-white relative overflow-visible"
        >
          <FaCirclePlus size={25} className="mr-4" />
          Add Answer
        </button>
      )}
    </>
  )

  return (
    <div>
      {modals.confirm && (
        <SetAnswerModal
          editingData={editingData}
          setRefreshTrigger={setRefreshTrigger}
          setModal={(value) =>
            setModals((prev) => ({ ...prev, confirm: value }))
          }
        />
      )}

      {modals.edit && (
        <EditAnswerModal
          editingData={editingData}
          setRefreshTrigger={setRefreshTrigger}
          setModal={(value) => setModals((prev) => ({ ...prev, edit: value }))}
        />
      )}
      {modals.add && (
        <AddAnswerModal
          setRefreshTrigger={setRefreshTrigger}
          setModal={(value) => setModals((prev) => ({ ...prev, add: value }))}
        />
      )}

      {modals.sort && (
        <ReusableSortModal
          title={selectedAns.title}
          setModal={(value) => setModals((prev) => ({ ...prev, sort: value }))}
          initialOrder={selectedAns.order}
          setRefreshTrigger={setRefreshTrigger}
          actionHandler={(order) => {
            handleSort({ id: selectedAns.id, order })
            console.log("FINAL ORDER SENT TO HANDLER:", order)
          }}
        />
      )}

      {modals.delete && (
        <ReusableDeleteModal
          headerText='if You want to delete the selected question, type "DELETE" below:'
          setModal={() => setModals((prev) => ({ ...prev, delete: false }))}
          loading={loading}
          setLoading={setLoading}
          setRefreshTrigger={setRefreshTrigger}
          onConfirm={handleDelete}
        />
      )}
      <Table
        title="Answers"
        addButton={addButton()}
        // helpButton={helpButton()}
        data={data.data}
        setData={setData}
        columns={columns}
        totalData={data.totalCount}
        setPagination={setPagination}
        pagination={pagination}
        loading={loading}
        setLoading={setLoading}
        // customHeaderContent={filters}
        renderRow={renderQuestionRow}
      />
    </div>
  )
}

export default AnswersPage
