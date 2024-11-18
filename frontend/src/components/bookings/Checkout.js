import React, { useEffect, useState } from 'react'
import BookingForm from './BookingForm'
import { useParams } from 'react-router-dom'
import { getRoomById } from '../utils/ApiFunctions'
import { FaCar, FaWineGlassAlt, FaParking, FaTv, FaTshirt, FaUtensils, FaWifi } from 'react-icons/fa'

const Checkout = () => {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [roomInfo, setRoomInfo] = useState({
    photo: "",
    roomType: "",
    roomPrice: ""
  })
  const { roomId } = useParams()

  useEffect(() => {
    setTimeout(() => {
      getRoomById(roomId).then((response) => {
        setRoomInfo(response)
        setIsLoading(false)
      }).catch((error) => {
        setError(error)
        setIsLoading(false)
      })
    }, 1000)
  }, [roomId])
  return (
    <div>
      <section className='container'>
        <div className='row flex-column flex-md-row align-items-center'>
          <div className='col-md-4 mt-5 mb-5'>
            {
              isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                  <p className="bg-success text-white" style={{ fontSize: '1.5rem' }}>
                    <span className="spinner-border spinner-border-sm mr-2"
                      role="status" aria-hidden="true" />  Loading existing room...
                  </p>
                </div>
              ) : error ? (
                <p className="alert alert-danger mt-3">{error}</p>
              ) : (
                <div className='room-info'>
                  <img src={`data:image/png;base64,${roomInfo.photo}`}
                    alt="Room photo"
                    style={{ width: "100%", height: "200px" }} />

                  <table className="table table-bordered table-hover">
                    <tbody>
                      <tr>
                        <th>Room Type:</th>
                        <th>{roomInfo.roomType}</th>
                      </tr>
                      <tr>
                        <th>Room Price:</th>
                        <th>Rs {roomInfo.roomPrice}</th>
                      </tr>
                      <tr>
                        <th>Room Services : </th>
                        <td>
                          <ul className='list-unstyled'>
                            <li>
                              <FaWifi /> Wifi
                            </li>
                            <li>
                              <FaTv /> Netfilx Premium
                            </li>
                            <li>
                              <FaUtensils /> Breakfast
                            </li>
                            <li>
                              <FaWineGlassAlt /> Mini bar refreshment
                            </li>
                            <li>
                              <FaCar /> Car Service
                            </li>
                            <li>
                              <FaParking /> Parking Space
                            </li>
                            <li>
                              <FaTshirt /> Laundry
                            </li>
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
          <div className="col-md-8">
            <BookingForm />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Checkout