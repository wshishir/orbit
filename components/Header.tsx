import React from 'react'

const Header = () => {
  return (
    <div className='absolute top-2 left-0 right-0 z-10 flex justify-between items-center px-8 py-4'>
        <h2 className='text-4xl text-white font-semibold'>Orbit.ai</h2>
        <button className='button py-2 px-4 font-medium cursor-pointer'>Sign In</button>
    </div>
  )
}

export default Header