import React, { useContext, useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import Logout from '../auth/Logout'
import { AuthContext } from '../auth/AuthProvider'

const Navbar = () => {
    const [showAccount, setShowAccount] = useState(false)
    const [isNavCollapsed, setIsNavCollapsed] = useState(true) // State to manage navbar collapse
    const [isLoggedIn,setIsLoggedIn]=useState(false)
    const [userRole,setUserRole]=useState(null)

    const { user } = useContext(AuthContext)

    const handleAccountClick = () => {
        setShowAccount(!showAccount)
    }

    const handleNavCollapse = () => {
        setIsNavCollapsed(!isNavCollapsed)
    }
    useEffect(()=>{
         setIsLoggedIn(user !== null)
         setUserRole(localStorage.getItem("userRole"))
    },[user])
    


    return (
        <nav className='navbar navbar-expand-lg bg-body-tertiary px-5 shadow sticky-top'>
            <div className="container-fluid">
                <Link to={"/"} className='navbar-brand'>
                    <span className='hotel-color'>Stayhappy Hotel</span>
                </Link>

                {/* Added onClick event to toggle isNavCollapsed state */}
                <button
                    className='navbar-toggler'
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarScroll"
                    aria-controls='navbarScroll'
                    aria-expanded={!isNavCollapsed ? 'true' : 'false'}
                    aria-label='Toggle navigation'
                    onClick={handleNavCollapse} // Toggle collapse state
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Adjusted to toggle show class based on isNavCollapsed */}
                <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id='navbarScroll'>
                    <ul className='navbar-nav me-auto my-1 my-lg-0 navbar-nav-scroll'>
                        <li className='nav-item'>
                            <NavLink className='nav-link' aria-current='page' to={'/browse-all-rooms'}>
                                Browse All Rooms
                            </NavLink>
                        </li>
                        {isLoggedIn && userRole === "ROLE_ADMIN" && (
                            <li className='nav-item'>
                                <NavLink className='nav-link' aria-current='page' to={'/admin'}>
                                    Admin
                                </NavLink>
                            </li>
                        )}

                    </ul>
                    <ul className='navbar-nav d-flex'>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to={'/find-booking'}>
                                Find My Booking
                            </NavLink>
                        </li>

                        {/* Dropdown for Account */}
                        <li className='nav-item dropdown'>
                            <a
                                className={`nav-link dropdown-toggle ${showAccount ? "show" : ""}`}
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                onClick={handleAccountClick} // Toggle dropdown menu
                            >
                                Account
                            </a>
                            <ul className={`dropdown-menu ${showAccount ? "show" : ""}`}
                                aria-labelledby="navbarDropdown"
                            >
                                {isLoggedIn ? (
                                    <li>
                                        <Logout />
                                    </li>   
                                ) :
                                    (
                                        <li>
                                            <Link to={'/login'} className='dropdown-item'>Login</Link>
                                        </li>


                                    )

                                }


                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
