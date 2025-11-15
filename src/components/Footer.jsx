import React from 'react'

export const Footer = () => {
  return (
    <div className='bg-orange-600 text-white py-4 text-center w-full'>
      <p className='text-sm'>
        Copyright © {new Date().getFullYear()} Vetrian Technology Solutions. All rights reserved.
      </p>
    </div>
  )
}