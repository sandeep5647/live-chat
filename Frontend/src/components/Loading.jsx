import React from 'react'

function Loading() {
  return (
    <div className='flex h-screen items-center justify-center'>
        <div className="flex w-52 flex-col gap-4 bg-transparent">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
        </div>
    </div>
    // <p className='flex h-screen items-center justify-center italic ' 
    //    style={{ maxHeight: '80vh', overflowY: 'scroll', 
    //    scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    // >Loading....</p>
  )
}

export default Loading
