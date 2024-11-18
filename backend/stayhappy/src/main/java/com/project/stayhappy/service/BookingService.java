package com.project.stayhappy.service;

import com.project.stayhappy.exception.InvalidBookingRequestException;
import com.project.stayhappy.exception.ResourceNotFoundException;
import com.project.stayhappy.model.BookedRoom;
import com.project.stayhappy.model.Room;
import com.project.stayhappy.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService implements BookingService_I{
    @Autowired
    BookingRepository bookingRepository;
    @Autowired
    RoomService_I roomService;
    @Override
   public List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
        return  bookingRepository.findByRoomId(roomId);
   }

    @Override
    public List<BookedRoom> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public BookedRoom findByBookingConfirmationCode(String confirmationCode) {

        return bookingRepository.findByBookingConfirmationCode(confirmationCode).orElseThrow(
                ()->new ResourceNotFoundException("No booking found with booking-code:"+confirmationCode)
        );
    }

    @Override
    public String saveBooking(Long roomId, BookedRoom bookingRequest) throws InvalidBookingRequestException {
        if(bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())){
            throw new InvalidBookingRequestException("Check in data must come before check out date");
        }
        Room room=roomService.getRoomById(roomId).get();
        List<BookedRoom> existingBookings =room.getBookings();
        boolean roomIsAvailable =roomIsAvailable(bookingRequest,existingBookings);

        if(roomIsAvailable){
            room.addBooking(bookingRequest);
            bookingRepository.save(bookingRequest);
        }else{
            throw new InvalidBookingRequestException("Sorry,This room is not available for the selected dates");
        }
        return bookingRequest.getBookingConfirmationCode();
    }

    private boolean roomIsAvailable(BookedRoom bookingRequest, List<BookedRoom> existingBookings) {
        return existingBookings.stream()
                .noneMatch(existingBooking ->
                        {
                            // Get dates for easier readability
                            LocalDate requestCheckIn = bookingRequest.getCheckInDate();
                            LocalDate requestCheckOut = bookingRequest.getCheckOutDate();
                            LocalDate existingCheckIn = existingBooking.getCheckInDate();
                            LocalDate existingCheckOut = existingBooking.getCheckOutDate();

                            // Condition 1: Exact match on check-in or check-out dates
                            boolean exactMatch = requestCheckIn.equals(existingCheckIn) || requestCheckOut.equals(existingCheckOut);

                            // Condition 2: Booking overlaps at the beginning (request check-in falls between existing booking dates)
                            boolean overlapsAtBeginning = requestCheckIn.isAfter(existingCheckIn) && requestCheckIn.isBefore(existingCheckOut);

                            // Condition 3: Booking overlaps at the end (request check-out falls between existing booking dates)
                            boolean overlapsAtEnd = requestCheckOut.isAfter(existingCheckIn) && requestCheckOut.isBefore(existingCheckOut);

                            // Condition 4: Booking fully contains an existing booking
                            boolean containsExisting = requestCheckIn.isBefore(existingCheckIn) && requestCheckOut.isAfter(existingCheckOut);

                            // Condition 5: Booking is fully contained within an existing booking
                            boolean containedWithinExisting = requestCheckIn.isAfter(existingCheckIn) && requestCheckOut.isBefore(existingCheckOut);

                            // Return true if any of these conditions indicate a conflict
                            return exactMatch || overlapsAtBeginning || overlapsAtEnd || containsExisting || containedWithinExisting;
                        }
                );
    }

    @Override
    public void cancelBooking(Long bookingId) {
           bookingRepository.deleteById(bookingId);
    }

    @Override
    public List<BookedRoom> getBookingsByUserId(String email) {
        return  bookingRepository.findBookingsByGuestEmail(email);
    }
}
