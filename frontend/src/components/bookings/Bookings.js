import React, { useState, useEffect } from "react";
import { cancelBooking, getAllBookings } from "../utils/ApiFunctions";
import Header from "../common/Header";
import BookingsTable from "./BookingsTable";

const Bookings = () => {
  const [bookingInfo, setBookingInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setTimeout(() => {
      getAllBookings()
        .then((data) => {
          setBookingInfo(data);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setIsLoading(false);
        });
    }, 1000);
  }, []);

  const handleBookingCancellation = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      const data = await getAllBookings();
      setBookingInfo(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section style={{ backgroundColor: "whitesmoke" }}>
      <Header title={"Existing Bookings"} />
      {error && <div className="text-danger mt-3">{error}</div>}
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center mt-3">
        <p className="bg-success text-white" style={{ fontSize: '1.5rem',borderRadius:'5px'}}>
          <span className="spinner-border spinner-border-sm mr-2"
            role="status" aria-hidden="true" />  Loading existing bookings...
        </p>
      </div>
      ) : (
        <BookingsTable
          bookingInfo={bookingInfo}
          handleBookingCancellation={handleBookingCancellation}
        />
      )}
    </section>
  );
};

export default Bookings;