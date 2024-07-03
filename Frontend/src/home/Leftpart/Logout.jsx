import React, { useState } from 'react'
import { BiLogOutCircle } from "react-icons/bi"
import axios from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

function Logout() {
    const [loading, setloading]=useState(false)
    const handleLogout= async()=>{
        setloading(true)
       try {
          const res = await axios.post('/api/user/logout');
          localStorage.removeItem('ChatApp')
          Cookies.remove('jwt')
          setloading(false)
          toast.success("logged out successfully");
          window.location.reload();

        } catch (error) {
           console.log("Error in logout", error);
        }
    }
    return ( 
    <>
    <div className=' h-[6vh]'>
        <div>
        <BiLogOutCircle className='text-6xl text-white hover:bg-slate-700 
            duration-300 rounded-full px-2 ml-3' onClick={handleLogout}/>
        </div>
    </div>
    </>
    )
}

export default Logout
