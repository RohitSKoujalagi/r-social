import React from 'react'

const ProfilesSrchSkeleton = () => {
    return (
        <div className="rounded-lg w-48 h-32 flex flex-col justify-center items-center px-3 py-2 bg-gray-100 animate-pulse">
          {/* Placeholder for username */}
          <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
          
          {/* Placeholder for profile picture */}
          <div className="h-14 w-14 bg-gray-300 rounded-full"></div>
        </div>
      );
}

export default ProfilesSrchSkeleton