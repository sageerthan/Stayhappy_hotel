import React,{useState, useEffect} from 'react'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom'
import BookingSummary from './BookingSummary'
import {bookRoom, getRoomById} from '../utils/ApiFunctions'
import { Form, FormControl } from "react-bootstrap";

const BookingForm = () => {
    const [isValidated, setIsValidated] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [roomPrice, setRoomPrice] = useState(0)
    const currentUser=localStorage.getItem("userId")
    const [booking, setBooking] = useState({
        guestFullName: "",
        guestEmail: currentUser,
        checkInDate: "",
        checkOutDate: "",
        numOfAdults: "",
        numOfChildren: ""
    })

    const { roomId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getRoomPriceById(roomId)
    }, [roomId])

    const getRoomPriceById = async (roomId) => {
        try {
            const response = await getRoomById(roomId);
            setRoomPrice(response.roomPrice)
        } catch (error) {
            throw new Error(error)
        }
    }
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBooking({ ...booking, [name]: value });
        setErrorMessage("");
    }
   
    const calculatePayment = () => {
        const checkInDate = moment(booking.checkInDate)

        const checkOutDate = moment(booking.checkOutDate)
        const diffInDays = checkOutDate.diff(checkInDate,"days")
        return roomPrice * diffInDays
    }

    const isGuestValid = () => {
        const adultCount = parseInt(booking.numOfAdults)
        const childrenCount = parseInt(booking.numOfChildren)
        const totalCount = adultCount + childrenCount
        return totalCount >= 1 && adultCount >= 1
    }

    const isCheckOutDateValid = () => {
        if (moment(booking.checkOutDate).isBefore(moment(booking.checkInDate))) {
            setErrorMessage("Checkout Date must come after the checkin date")
            return false;
        }
        else {
            setErrorMessage("")
            return true;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget
        if (form.checkValidity() === false || !isGuestValid() || !isCheckOutDateValid()) {
            e.stopPropagation()
        }
        else {
            setIsSubmitted(true)
        }
        setIsValidated(true)
    }

    const handleBooking = async () => {
        try {
            const confirmationCode = await bookRoom(roomId, booking)
            setIsSubmitted(true)
            navigate("/booking-success", { state: { message: confirmationCode } })
        } catch (error) {
            const errorMessage=error.message
            navigate("/booking-success", { state: { error: errorMessage } })
        }
    }
    return (
        <div className='container mb-5'>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='card card-body mt-5'>
                        <h4 className='text-center hotel-color'>Reserve Room</h4>
                        <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label htmlFor="guestFullName" className="hotel-color">Full Name:</Form.Label>

                                <FormControl
                                    required
                                    type='text'
                                    id='guestFullName'
                                    name='guestFullName'
                                    value={booking.guestFullName}
                                    placeholder="Enter your fullname"
                                    onChange={handleInputChange}
                                />

                                <Form.Control.Feedback type="invalid">
                                    Please enter your fullname.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor="email" className="hotel-color mt-3">
                                    Email :
                                </Form.Label>
                                <FormControl
                                    required
                                    type="email"
                                    name="guestEmail"
                                    id="email"
                                    placeholder="Enter your Email"
                                    value={booking.guestEmail}
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter your email
                                </Form.Control.Feedback>
                            </Form.Group>
                            <fieldset style={{ border: "2px" }}>
                                <div className="row">
                                    <div className="col-6 mt-3">
                                        <Form.Label
                                            htmlFor="check-in-date"
                                            className="hotel-color"
                                        >
                                            Check-In Date :
                                        </Form.Label>
                                        <FormControl
                                            required
                                            type="date"
                                            name="checkInDate"
                                            id="check-in-date"
                                            placeholder="check-in date"
                                            value={booking.checkInDate}
                                            onChange={handleInputChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please select a check-in date
                                        </Form.Control.Feedback>
                                    </div>

                                    <div className="col-6 mt-3">
                                        <Form.Label
                                            htmlFor="check-out-date"
                                            className="hotel-color"
                                        >
                                            Check-Out Date :
                                        </Form.Label>
                                        <FormControl
                                            required
                                            type="date"
                                            name="checkOutDate"
                                            id="check-out-date"
                                            placeholder="check-out date"
                                            value={booking.checkOutDate}
                                            onChange={handleInputChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please select a check-out date
                                        </Form.Control.Feedback>
                                    </div>
                                    {errorMessage && (
                                        <p className="error-message text-danger">
                                            {errorMessage}
                                        </p>
                                    )}
                                </div>
                            </fieldset>
                            <fieldset style={{ border: "2px" }}>
                                <div className="row">
                                    <div className="col-6">
                                        <Form.Label
                                            htmlFor="numOfAdults"
                                            className="hotel-color mt-3"
                                        >
                                            Adults :
                                        </Form.Label>
                                        <FormControl
                                            required
                                            type="number"
                                            name="numOfAdults"
                                            id="numOfAdults"
                                            placeholder="0"
                                            value={booking.numOfAdults}
                                            onChange={handleInputChange}
                                            min={1}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please select at least 1 adult.
                                        </Form.Control.Feedback>
                                    </div>

                                    <div className="col-6 mt-3">
                                        <Form.Label
                                            htmlFor="numOfChildren"
                                            className="hotel-color"
                                        >
                                            Children :
                                        </Form.Label>
                                        <FormControl
                                            required
                                            type="number"
                                            name="numOfChildren"
                                            id="numOfChildren"
                                            placeholder="0"
                                            value={booking.numOfChildren}
                                            onChange={handleInputChange}
                                            min={0}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Select 0 if no children
                                        </Form.Control.Feedback>
                                    </div>
                                    
                                </div>
                            </fieldset>
                            <div className="form-group mt-3 mb-2 flex-shrink-0">
                                <button type="submit" className="btn" style={{backgroundColor: '#f172b7', color: '#fff', border: 'none'}}>
                                    Continue
                                </button>
                            </div>

                        </Form>
                    </div>
                </div>
                <div className='col-md-6'>
                    {isSubmitted && (
                    <BookingSummary 
                       booking={booking}
                       payment={calculatePayment}
                       isFormValid={isValidated}
                       onConfirm={handleBooking}
                       roomPrice={roomPrice}/>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookingForm