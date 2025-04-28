import React, { useState } from "react";
import Input from "../modules/Input";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

function ReusableSortModal({
  title,
  id,
  setModal,
  initialOrder,
  setRefreshTrigger,
  actionHandler,
}) {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(initialOrder);

  const handleAction = async () => {
    if (!order) {
      toast.error("Please enter the order");
      return;
    }
    try {
      setLoading(true);
      await actionHandler(order, id);
      setModal(false);
    } catch (error) {
      setModal(false);
      setLoading(false);
    }
    setRefreshTrigger((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white py-6 px-12 rounded-lg shadow-lg max-w-96 relative">
        <button
          onClick={() => setModal(false)}
          className="absolute top-2 cursor-pointer right-2 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-md mb-2 text-center ">
          Please enter the view order for the "
          <span className="text-sea">{title}</span>"
        </h2>
        <div className="flex justify-center mt-5">
          <Input
            label="Order"
            value={order}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                setOrder(val);
              }
            }}
          />
        </div>
        <div className="flex justify-around gap-2 mt-12">
          <button
            onClick={() => setModal(false)}
            className="px-7 py-2 border-blood/60 cursor-pointer border-2 text-ocean rounded hover:bg-blood/70 hover:text-white transition-colors duration-300"
          >
            Cancel
          </button>
          {loading ? (
            <p className="flex items-center justify-center max-h-10 mb-[1px] px-11 bg-sea text-white rounded">
              <ClipLoader size={20} color="white" />
            </p>
          ) : (
            <button
              onClick={handleAction}
              className="px-7 py-2 cursor-pointer bg-sea rounded hover:bg-sea-hover text-white transition-colors duration-300"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReusableSortModal;
