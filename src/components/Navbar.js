import React from 'react'
import './Navbar.css'

function Navbar() {
  return (
    <div className='navbar'>
        <div className='logo' onClick={
            () => {
                window.location.reload()
            }
        }>
          <h3>Pathfinding Visualizer (click here)</h3>
        </div>
    </div>
  )
}

export default Navbar