import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineBedroomParent } from "react-icons/md";
import { TbBrandBooking } from 'react-icons/tb';
import { PiUsersThreeBold } from "react-icons/pi";
import { getAllBookings } from '../utils/ApiFunctions';
import { getAllRooms } from '../utils/ApiFunctions';
import { getAllUsers } from '../utils/UserApiFunction';
const Admin = () => {
  const [rooms, setRooms] = useState([])
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    fetchRooms()
    fetchBookings()
    fetchUsers()
  }, [])

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const result = await getAllRooms();
      if (Array.isArray(result)) {
        setRooms(result);
      } else {
        throw new Error("Data format is incorrect");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const result = await getAllBookings()
      if (Array.isArray(result)) {
        setBookings(result)
      }
      else {
        throw new Error("Data format is incorrect")
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false)
    }
  }
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const result = await getAllUsers()
      if (Array.isArray(result)) {
        setUsers(result)
      }
      else {
        throw new Error("Data format is incorrect")
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <section className="container mt-5">
      <h2 className="text-center fw-bold mb-4" style={{ color: "#f172b7" }}>Welcome to the Admin Panel</h2>
      <hr className="mb-5" />
      <div className="row">
        <div className="col-12 col-md-3">
          <div className="sidebar-wrapper bg-light shadow rounded p-3">
            <nav id="sidebar">
              <ul className="list-unstyled components">
                <li className="mb-3">
                  <Link
                    to="/existing-rooms"
                    className="d-flex align-items-center text-decoration-none text-dark py-2 px-3 rounded hover-effect"
                  >
                    <MdOutlineBedroomParent className="me-2 fs-5" />
                    <span className="fw-semibold">Manage Rooms</span>
                  </Link>
                </li>
                <li className="mb-3">
                  <Link
                    to="/existing-bookings"
                    className="d-flex align-items-center text-decoration-none text-dark py-2 px-3 rounded hover-effect"
                  >
                    <TbBrandBooking className="me-2 fs-5" />
                    <span className="fw-semibold">Manage Bookings</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/existing-users"
                    className="d-flex align-items-center text-decoration-none text-dark py-2 px-3 rounded hover-effect"
                  >
                    <PiUsersThreeBold className="me-2 fs-5" />
                    <span className="fw-semibold">Manage Users</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="col-12 col-md-9 text-center">
          <div className="bg-light shadow rounded p-5">
            {
              isLoading ? (
                <div className="d-flex justify-content-center align-items-center" >
                  <p className="text-dark p-3" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    <span className="spinner-border spinner-border-sm mr-2"
                      role="status" aria-hidden="true" />  Loading ...
                  </p>
                </div>
              ) : (
                <>
                  {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                  <div className="row pr-4">
                    <div className="col-xl-4 col-sm-6 mb-3">
                      <div className="card text-white bg-secondary o-hidden h-100">
                        <div className="card-body">
                          <div className="text-center card-font-size"><MdOutlineBedroomParent className="me-2 fs-5" /> Rooms <i class="fa fa-product-hunt"></i><br /> <b>{rooms.length}</b></div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-4 col-sm-6 mb-3">
                      <div className="card text-white bg-success o-hidden h-100">
                        <div className="card-body">
                          <div className="text-center card-font-size"><TbBrandBooking className="me-2 fs-5" /> Bookings <i class="fa fa-product-hunt"></i><br /> <b>{bookings.length}</b></div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-4 col-sm-6 mb-3">
                      <div className="card text-white bg-warning o-hidden h-100">
                        <div className="card-body">
                          <div className="text-center card-font-size"> <PiUsersThreeBold className="me-2 fs-5" /> Users <i class="fa fa-product-hunt"></i><br /> <b>{users.length}</b></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </>
              )
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default Admin;
