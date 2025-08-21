import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-gray-200 py-10 text-center text-sm'>
        <p>&copy; {new Date().getFullYear()} <span className='text-red-500'>Blog</span>. All rights reserved</p>
    </footer>
  )
}

export default Footer