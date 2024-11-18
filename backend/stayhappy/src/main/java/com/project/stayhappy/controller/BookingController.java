package com.project.stayhappy.controller;

import com.project.stayhappy.exception.InvalidBookingRequestException;
import com.project.stayhappy.exception.ResourceNotFoundException;
import com.project.stayhappy.model.BookedRoom;
import com.project.stayhappy.model.Room;
import com.project.stayhappy.response.BookingResponse;
import com.project.stayhappy.response.RoomResponse;
import com.project.stayhappy.service.BookingService_I;
import com.project.stayhappy.service.RoomService_I;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
@RestController
@RequestMapping("/bookings")

public class BookingController {
    @Autowired
    BookingService_I bookingService ;
    @Autowired
    RoomService_I roomService;
    @GetMapping("/all-bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings(){
        List<BookedRoom> bookings=bookingService.getAllBookings();
        List<BookingResponse> bookingResponses=new ArrayList<>();
        for(BookedRoom booking:bookings){
           BookingResponse bookingResponse = getBookingResponse(booking);
           bookingResponses.add(bookingResponse);
        }

        return ResponseEntity.ok(bookingResponses);
}
   @GetMapping("/confirmation/{confirmationCode}")
   public ResponseEntity<?> getBookingByConfirmationCode(@PathVariable String confirmationCode){
        try{
            BookedRoom booking=bookingService.findByBookingConfirmationCode(confirmationCode);
            BookingResponse bookingResponse =getBookingResponse(booking);
            return ResponseEntity.ok(bookingResponse);
        }catch(ResourceNotFoundException ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
   }
   @PostMapping("/room/{roomId}/booking")
   public ResponseEntity<?> saveBooking(@PathVariable Long roomId,
                                        @RequestBody BookedRoom bookingRequest) throws InvalidBookingRequestException {
       String confirmationCode=bookingService.saveBooking(roomId,bookingRequest);
       return ResponseEntity.ok("Room booked successfully,Your booking confirmation code is :"+confirmationCode);
   }
   @DeleteMapping("/booking/{bookingId}/delete")
   public void cancelBooking(@PathVariable Long bookingId){
        bookingService.cancelBooking(bookingId);
   }

   @GetMapping("/bookingsByUserId/{email}")
   public ResponseEntity<List<BookingResponse>>getBookingsByUserId(@PathVariable String email){
            List<BookedRoom> booking=bookingService.getBookingsByUserId(email);
            List<BookingResponse> bookingResponses=new ArrayList<>();
            for(BookedRoom bookings:booking){
              BookingResponse bookingResponse=getBookingResponse(bookings);
              bookingResponses.add(bookingResponse);
            }
            return ResponseEntity.ok(bookingResponses);
   }

    private BookingResponse getBookingResponse(BookedRoom booking) {
           Room theRoom= roomService.getRoomById(booking.getRoom().getId()).get();
           RoomResponse room=new RoomResponse(theRoom.getId(), theRoom.getRoomType(),theRoom.getRoomPrice());
           return new BookingResponse(
                   booking.getBookingId(),booking.getCheckInDate(),booking.getCheckOutDate(),
                   booking.getGuestFullName(),booking.getGuestEmail(),booking.getNumOfAdults(),
                   booking.getNumOfChildren(),booking.getTotalNumOfGuest(),booking.getBookingConfirmationCode(),room);
    }
}
