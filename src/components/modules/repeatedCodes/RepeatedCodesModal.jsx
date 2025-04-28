import React from "react";
import { FaRegUser } from "react-icons/fa6";

const RepeatedCodesModal = ({ onClose, info }) => {
  const members = [
    { name: info.data.member1, code: info.data.newCode1 },
    { name: info.data.member2, code: info.data.newCode2 },
    { name: info.data.member3, code: info.data.newCode3 },
    { name: info.data.member4, code: info.data.newCode4 },
    { name: info.data.member5, code: info.data.newCode5 },
    { name: info.data.member6, code: info.data.newCode6 },
  ];

  return (
    <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50">
      <div className="bg-white relative rounded-xl shadow-lg p-6 w-full max-w-lg text-right">
        <h2 className="text-lg font-bold mb-8 mt-4 text-center text-gray-700">
          Repeated Codes For The{" "}
          <span className="text-sun">{info.data.serialNo}</span> Serial Number
        </h2>
        <span
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          ×
        </span>
        {members.some((member) => member.name) ? (
          <div className="space-y-5">
            {members.map((member, index) =>
              member.name ? (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                    >
                      <FaRegUser size={20} className="text-sea" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font- text-gray-800">
                        {member.name}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-sea">
                    {member.code}
                  </div>
                </div>
              ) : null
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-15 mb-5">
            No Repeated Codes Found!
          </div>
        )}
      </div>
    </div>
  );
};

export default RepeatedCodesModal;
