import React, { useState } from 'react'
import { cancelBooking, getBookingByConfirmationCode } from '../utils/ApiFunctions'
import moment from 'moment'

const FindBooking = () => {
    const [confirmationCode, setConfirmationCode] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const [bookingInfo, setBookingInfo] = useState({
        bookingId: "",
        room: { id: "",roomType:"" },
        bookingConfirmationCode: "",
        checkInDate: "",
        checkOutDate: "",
        guestFullName: "",
        guestEmail: "",
        numOfAdults: "",
        numOfChildren: "",
        totalNumOfGuest: ""
    })

    const clearBookingInfo = {
        bookingId: "",
        room: { id: "",roomType:""  },
        bookingConfirmationCode: "",
        checkInDate: "",
        checkOutDate: "",
        guestFullName: "",
        guestEmail: "",
        numOfAdults: "",
        numOfChildren: "",
        totalNumOfGuest: ""
    };

    const handleInputChange = (e) => {
        setConfirmationCode(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const data = await getBookingByConfirmationCode(confirmationCode)
            setBookingInfo(data)
            setError("")
        } catch (error) {
            setBookingInfo(clearBookingInfo)
            setError(error.message)
        }
        setTimeout(() => {
            setIsLoading(false)
        }, 2000)
    }

    const handleBookingCancellation = async (bookingId) => {
        try {
            await cancelBooking(bookingId)
            setIsDeleted(true)
            setBookingInfo(clearBookingInfo)
            setConfirmationCode("")
            setError("")
        } catch (error) {
            setError(error.message)
        }
        setTimeout(() => {
            setIsDeleted(false)
        }, 2000)
    }
    return (
        <div className='container mt-5 d-flex flex-column justify-content-center align-items-center'>
            <h2 className="text-center mb-4 hotel-color">Find My Booking</h2>
            <form onSubmit={handleSubmit} className="col-md-6">
                <div className="input-group mb-3">
                    <input
                        className="form-control"
                        type="text"
                        id="confirmationCode"
                        name="confirmationCode"
                        value={confirmationCode}
                        onChange={handleInputChange}
                        placeholder="Enter the booking confirmation code"
                    />

                    <button type="submit" className="btn-hotel">
                        Find booking
                    </button>
                </div>
            </form>
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center mt-3">
                    <span className="spinner-border spinner-border-sm mr-2"
                        role="status" aria-hidden="true" />  Finding Booking...
                </div>
            ) : error ? (
                <div className='text-danger'>{error}</div>
            ) : bookingInfo.bookingConfirmationCode ? (
                <div className='col-md-6 mt-4 mb-5'>
                    <h3>Booking Information</h3>
                    <p className="text-success">
                        Confirmation Code : {bookingInfo.bookingConfirmationCode}
                    </p>
                    <p>Room Number : {bookingInfo.room.id}</p>
                    <p>Room Type : {bookingInfo.room.roomType}</p>
                    <p>
                        Check-in Date :
                        {moment(bookingInfo.checkInDate).subtract(1,"month").format("MMM Do, YYYY")}
                    </p>
                    <p>
                        Check-out Date :
                        {moment(bookingInfo.checkOutDate).subtract(1,"month").format("MMM Do, YYYY")}
                    </p>
                    <p>Full Name : {bookingInfo.guestFullName}</p>
                    <p>Email Address : {bookingInfo.guestEmail}</p>
                    <p>Adults : {bookingInfo.numOfAdults}</p>
                    <p>Children : {bookingInfo.numOfChildren}</p>
                    <p>Total Guest : {bookingInfo.totalNumOfGuest}</p>
                    {!isDeleted && (
                        <button
                            onClick={() => handleBookingCancellation(bookingInfo.bookingId)}
                            className="btn btn-danger"
                        >
                            Cancel Booking
                        </button>
                    )}
                </div>
            ) : null}

            {isDeleted &&
                <div className='alert alert-success mt-3' role='alert'>Booking has been cancelled successfully!</div>}
        </div>
    )
}

export default FindBooking