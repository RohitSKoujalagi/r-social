import React from 'react'

function ProfilesSkeleton() {
  return (
    <>
    <div className="h-auto pt-6 mt-2">
      <div className="max-w-sm mx-auto bg-gray-200 rounded-lg shadow-lg overflow-hidden animate-pulse">
        <div className="border-b px-4 pb-6">
          <div className="text-center my-4">
            <div className="h-32 w-32 rounded-full bg-gray-300 mx-auto my-4 animate-pulse" />
          </div>
          <div className="py-2">
            <div className="h-6 bg-gray-300 rounded-lg animate-pulse" />
            <div className="h-4 bg-gray-300 rounded-lg mt-2 animate-pulse" />
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="flex gap-2 items-center text-gray-300 mb-4 animate-pulse">
            <div className="h-6 w-6 bg-gray-300 rounded-lg animate-pulse" />
            <span className="h-4 bg-gray-300 rounded-lg animate-pulse" />
          </div>
          <div className="flex items-center animate-pulse">
            <div className="flex justify-end mr-2 h-10 w-10 bg-gray-300 rounded-lg" />
            <div className="flex justify-end mr-2 h-10 w-10 bg-gray-300 rounded-lg" />
            <div className="flex justify-end mr-2 h-10 w-10 bg-gray-300 rounded-lg" />
            <div className="h-10 w-10 bg-gray-300 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  

    </>
  )
}

export default ProfilesSkeleton