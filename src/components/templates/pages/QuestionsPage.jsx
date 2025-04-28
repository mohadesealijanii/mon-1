import React, { useEffect, useState } from "react"
import Table from "../../modules/Table"
import { GoTrash } from "react-icons/go"
import { FiEdit } from "react-icons/fi"
import { BiSortAlt2 } from "react-icons/bi"
import { FaCirclePlus } from "react-icons/fa6"
import { BsChatRightText } from "react-icons/bs"
import {
  changeQuesOrder,
  deleteQuestion,
  getQuestions,
} from "../../../utils/services"
import { useNavigate, useParams } from "react-router-dom"
import ToolTip from "../../modules/Tooltip"
import toast from "react-hot-toast"
import ReusableDeleteModal from "../../modules/ReusableDeleteModal"
import ReusableSortModal from "../../modules/ReusableSortModal"
import AddQuesModal from "../../modules/chapter/tests/questions/AddQuesModal"
import EditQuestionModal from "../../modules/chapter/tests/questions/EditQuestionModal"

function QuestionsPage() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 1,
    bookChapterAssetId: testId,
    // enable: null,
    // isFree: null,
    // title: "",
    // modelQuestions: 1,
  })
  const [data, setData] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [editingData, setEditingData] = useState([])
  const [modals, setModals] = useState({
    add: false,
    delete: false,
    edit: false,
    sort: false,
    answer: false,
  })
  const [selectedQuestion, setSelectedQuestion] = useState({
    id: null,
    order: null,
    title: "",
  })
  useEffect(() => {
    getQues()
  }, [pagination, refreshTrigger])

  const getQues = async () => {
    try {
      setLoading(true)
      const questionsResponse = await getQuestions(pagination)
      setData(questionsResponse)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error("An error occured while fetching Questions")
    }
  }

  const handleSort = async (selectedQuestion) => {
    try {
      const res = await changeQuesOrder(
        selectedQuestion.id,
        selectedQuestion.order
      )
      if (res.status === 200) {
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
      const res = await deleteQuestion(selectedQuestion.id)
      if (res.status === 200) {
        toast.success("Question is successfully deleted!")
        setModals((prev) => ({ ...prev, delete: false }))
        setLoading(false)
        getQues()
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error("Something went wrong!")
    }
  }

  const renderQuestionRow = (item) => {
    const actions = [
      {
        id: "answers",
        icon: <BsChatRightText />,
        text: "Answers",
        onClick: () => navigate(`answer/${item.id}`),
      },
      {
        id: "sort",
        icon: <BiSortAlt2 />,
        text: "Sort",
        onClick: () => {
          setModals((prev) => ({ ...prev, sort: true }))
          setSelectedQuestion({
            id: item.id,
            order: item.order,
            title: item.title,
          })
          console.log(item)
        },
      },
      {
        id: "edit",
        icon: <FiEdit />,
        text: "Edit Question",
        onClick: () => {
          setEditingData(item)
          setSelectedQuestion((prev) => ({
            ...prev,
            id: item.id,
            title: item.title,
          }))
          setModals((prev) => ({ ...prev, edit: true }))
        },
      },
      {
        id: "delete",
        icon: <GoTrash />,
        text: "Delete Question",
        className: "bg-blood/80 hover:bg-blood/100",
        onClick: () => {
          setSelectedQuestion((prev) => ({ ...prev, id: item.id }))
          setModals((prev) => ({ ...prev, delete: true }))
        },
      },
    ]
    const questionTypeMap = {
      1: "multiple choice",
      2: "true or false",
      3: "fill in the blank",
    }

    return (
      <tr key={item.id} className="cursor-pointer hover:bg-gray-100 transition">
        <td className="text-left pl-5">{item.title}</td>
        <td className="p-4 border-slate-300">{item.order}</td>
        <td className="p-4 border-slate-300">
          {questionTypeMap[item.modelQuestions] || "unknown"}
        </td>
        <td className="p-4 border-slate-300 flex gap-3 -ml-10">
          {actions.map((action) => (
            <button
              key={action.id}
              data-tooltip-id={action.id}
              onClick={(e) => {
                e.stopPropagation()
                action.onClick()
              }}
              className={`flex items-center cursor-pointer gap-1 p-2 rounded-md text-sm text-white ${
                action.className || "bg-sea hover:bg-sea-hover"
              }`}
            >
              {action.icon}
              <ToolTip id={action.id} content={action.text} />
            </button>
          ))}
        </td>
      </tr>
    )
  }

  const columns = [
    { key: "title", label: "Title" },
    { key: "order", label: "Order" },
    { key: "questionType", label: "Question Type" },
    { key: "controls", label: "Controls" },
  ]
  const addButton = () => (
    <button
      onClick={() => setModals((prev) => ({ ...prev, add: true }))}
      className="flex bg-sun hover:bg-orange cursor-pointer transition-colors duration-300 py-2 px-2 rounded-md text-nowrap text-white relative overflow-visible"
    >
      <FaCirclePlus size={25} className="mr-4" />
      Add Question
    </button>
  )
  return (
    <div>
      {modals.edit && (
        <EditQuestionModal
          editingData={editingData}
          setRefreshTrigger={setRefreshTrigger}
          setModal={(value) => setModals((prev) => ({ ...prev, edit: value }))}
        />
      )}
      {modals.add && (
        <AddQuesModal
          setRefreshTrigger={setRefreshTrigger}
          setModal={(value) => setModals((prev) => ({ ...prev, add: value }))}
        />
      )}

      {modals.sort && (
        <ReusableSortModal
          title={selectedQuestion.title}
          setModal={(value) => setModals((prev) => ({ ...prev, sort: value }))}
          initialOrder={selectedQuestion.order}
          setRefreshTrigger={setRefreshTrigger}
          actionHandler={(order) =>
            handleSort({ id: selectedQuestion.id, order })
          }
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
        title="Questions"
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

export default QuestionsPage
