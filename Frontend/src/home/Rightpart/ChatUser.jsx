import React from 'react'
import useConversation from '../../zustand/useConversation'
import { useSocketContext } from "../../context/SocketContext.jsx";
import { CiMenuFries } from "react-icons/ci";

function ChatUser() {
  const { selectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();

  const isOnline = onlineUsers.includes(selectedConversation?._id);

  const getOnlineUsersStatus = (userId) => {
    return onlineUsers.includes(userId) ? "Online" : "Offline";
  };

  return (
    <>
      <div className="relative flex items-center h-[8%] justify-center gap-4 bg-slate-700">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-ghost drawer-button lg:hidden absolute left-5"
        >
          <CiMenuFries className="text-white text-xl" />
        </label>

        <div className='flex space-x-3 h-[10vh] items-center justify-center bg-gray-700'>
          <div className={`avatar ${isOnline?"online":""}`}>
            <div className="w-16 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <div>
            <h1 className='text-xl'>{selectedConversation.fullname}</h1>
            <span className='text-sm'>{getOnlineUsersStatus(selectedConversation._id)}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatUser
