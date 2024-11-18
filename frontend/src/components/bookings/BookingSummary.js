import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { Button } from "react-bootstrap";

const BookingSummary = ({ booking, payment, isFormValid, onConfirm,roomPrice }) => {

  const checkInDate = moment(booking.checkInDate)
  const checkOutDate = moment(booking.checkOutDate)
  const numOfDays = checkOutDate.diff(checkInDate, "days")
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const navigate = useNavigate()

  const handleConfirmBooking = () => {
    setIsProcessingPayment(true)
    setTimeout(() => {
      setIsProcessingPayment(false)
      setIsBookingConfirmed(true)
      onConfirm()
    }, 3000)
  }

  useEffect(() => {
    if (isBookingConfirmed) {
      navigate("/booking-success")
    }
  }, [isBookingConfirmed])

  return (
    <div className="card card-body mt-5">
      <h2 className="hotel-color text-center">Reservation Summary</h2>
      <p>
        FullName : <strong>{booking.guestFullName}</strong>
      </p>
      <p>
        Email : <strong>{booking.guestEmail}</strong>
      </p>
      <p>
        Check-in Date :
        <strong>{moment(booking.checkInDate).format("MMM Do YYYY")}</strong>
      </p>
      <p>
        Check-out Date :
        <strong>{moment(booking.checkOutDate).format("MMM Do YYYY")}</strong>
      </p>
      <p>
        Number of Days Booked : <strong>{numOfDays}</strong>
      </p>
      <p>
        Room price per day : <strong> Rs{roomPrice}</strong>
      </p>
      <div>
        <h5 className="hotel-color">Number of Guest</h5>
        <strong>Adult{booking.numOfAdults > 1 ? "s" : ""} : {booking.numOfAdults}</strong><br/>
        <strong>Children : {booking.numOfChildren}</strong>
      </div>

      {
        payment() > 0 ? 
        (
          <>
            <p>Total payment :<strong>Rs{payment()}</strong></p>
            {isFormValid && !isBookingConfirmed ? 
            (
              <Button variant='success' onClick={handleConfirmBooking}>
                {isProcessingPayment ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2"
                      role="status" aria-hidden="true"></span>
                    Booking confirmed,redirecting to payment....
                  </>
                ) : (
                  "Confirm booking and proceed to payment"
                )}
              </Button>
            ) : isBookingConfirmed ? 
            (
              <div className="d-flex justify-content-center align-items-center">
                <div className='spinner-border text-primary' role="status">
                  <span className='sr-only'>Loading</span>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <p className='text-danger'>
               Something wrong with your inputs..Please check
          </p>
        )}
    </div>
  )
}

export default BookingSummary