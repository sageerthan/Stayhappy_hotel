package com.project.stayhappy.service;

import com.project.stayhappy.exception.InvalidBookingRequestException;
import com.project.stayhappy.model.BookedRoom;

import java.util.List;

public interface BookingService_I {
    List<BookedRoom> getAllBookingsByRoomId(Long roomId);

    List<BookedRoom> getAllBookings();

    BookedRoom findByBookingConfirmationCode(String confirmationCode);

    String saveBooking(Long roomId, BookedRoom bookingRequest) throws InvalidBookingRequestException;

    void cancelBooking(Long bookingId);

    List<BookedRoom> getBookingsByUserId(String email);

}
