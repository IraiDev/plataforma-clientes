import React from 'react'

function Loading({ isLoading = false }) {
  return (
    <>
      {
        isLoading && (
          <div className="fixed flex items-center justify-center w-full min-h-screen bg-black bg-opacity-40 z-loading">
            <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center">
              <i className="fas fa-spinner animate-spin fa-3x text-gray-500"></i>
            </div>
          </div>)
      }
    </>
  )
}

export default Loading