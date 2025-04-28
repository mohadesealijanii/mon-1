import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { setOffer } from "../../../utils/services";
import toast from "react-hot-toast";

function OfferModal({
  id,
  title,
  onClose,
  offer,
  setOfferModal,
  setRefreshTrigger,
}) {
  const [loading, setLoading] = useState(false);

  const offerHandler = async () => {
    try {
      setLoading(true);
      const res = await setOffer(id);
      if (res === true) {
        toast.success("Done!");
      }
      setLoading(false);
      setOfferModal(false);
      setRefreshTrigger((prev) => !prev);
    } catch (error) {
      console.log(error);
      toast.error("something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-lg mb-9 text-center">
          {offer && (
            <span>
              Do you want to remove the offer from "
              <span className="text-sea">{title}</span> "
            </span>
          )}
          {!offer && (
            <span>
              Do you want to set an offer for "
              <span className="text-sea">{title}</span> "
            </span>
          )}
        </h2>
        <div className="flex justify-around gap-2">
          <button
            onClick={onClose}
            className="px-7 py-2 border-blood/40 an border-2 text-ocean rounded hover:bg-blood/50 hover:text-white transition-colors duration-300"
          >
            Cancel
          </button>
          {loading ? (
            <p className="flex items-center justify-center max-h-10 mb-[1px] px-9 bg-sea text-white rounded">
              <ClipLoader size={20} color="white" />
            </p>
          ) : (
            <button
              onClick={() => offerHandler(id)}
              className="px-9 py-2 bg-sea/45 rounded hover:bg-sea/70 hover:text-white transition-colors duration-300"
            >
              Yes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OfferModal;
