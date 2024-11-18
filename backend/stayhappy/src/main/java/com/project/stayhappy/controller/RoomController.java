package com.project.stayhappy.controller;

import com.project.stayhappy.exception.InternalServerException;
import com.project.stayhappy.exception.PhotoRetrievalException;
import com.project.stayhappy.exception.ResourceNotFoundException;
import com.project.stayhappy.model.BookedRoom;
import com.project.stayhappy.model.Room;
import com.project.stayhappy.response.BookingResponse;
import com.project.stayhappy.response.RoomResponse;
import com.project.stayhappy.service.BookingService_I;
import com.project.stayhappy.service.RoomService_I;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
//@CrossOrigin(origins = "http://localhost:3000")
public class RoomController {

    private final RoomService_I roomService;
    private final BookingService_I bookingService;
    @PostMapping("/add/new-room")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomResponse> addNewRoom(@RequestParam("photo") MultipartFile photo,
                                                   @RequestParam("roomType") String roomType,
                                                   @RequestParam("roomPrice") BigDecimal roomPrice) throws SQLException, IOException {

        Room savedRoom = roomService.addNewRoom(photo, roomType, roomPrice);
        RoomResponse response=new RoomResponse(savedRoom.getId(), savedRoom.getRoomType(), savedRoom.getRoomPrice());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/room/types")
    public List<String> getRoomTypes(){
       return roomService.getAllRoomTypes();
    }

    @GetMapping("/allRooms")
    public ResponseEntity<List<RoomResponse>> getAllRooms() throws SQLException {
        List<Room> rooms=roomService.getAllRooms();
        List<RoomResponse> roomResponses =new ArrayList<>();
        for(Room room:rooms){
           // byte[] photoBytes=roomService.getRoomPhotoByRoomId(room.getId());
           // if(photoBytes != null && photoBytes.length >0){
                //String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                RoomResponse roomResponse =getRoomResponse(room);
              //  roomResponse.setPhoto(base64Photo);
                roomResponses.add(roomResponse);
            //}
        }
        return ResponseEntity.ok(roomResponses);
    }

    @DeleteMapping("/delete/room/{roomId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId){
            roomService.deleteRoom(roomId);
            //The <Void> type means there’s no content in the response body; only the status code is returned.
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @PutMapping("/update/room/{roomId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long roomId,
                                                   @RequestParam(value="roomType",required=false) String roomType,
                                                   @RequestParam(value="roomPrice",required=false) BigDecimal roomPrice,
                                                   @RequestParam(value="photo",required=false) MultipartFile photo) throws IOException, SQLException, InternalServerException {
            byte[] photoBytes=photo !=null && !photo.isEmpty() ? photo.getBytes() : roomService.getRoomPhotoByRoomId(roomId);
            Blob photoBlob=new SerialBlob(photoBytes);
            Room theRoom= roomService.updateRoom(roomId,roomType,roomPrice,photoBytes);
            theRoom.setPhoto(photoBlob);
            RoomResponse roomResponse =getRoomResponse(theRoom);
            return ResponseEntity.ok(roomResponse);
    }
    @GetMapping("/room/{roomId}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Long roomId) {
        Optional<Room> theRoom = roomService.getRoomById(roomId);

        // Check if theRoom is present, else throw a ResourceNotFoundException
        Room room = theRoom.orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        // Convert Room to RoomResponse and return
        RoomResponse roomResponse = getRoomResponse(room);
        return ResponseEntity.ok(roomResponse);
    }
    @GetMapping("/availableRooms")
    public ResponseEntity<List<RoomResponse>> getAvailableRooms(
            @RequestParam("checkInDate") @DateTimeFormat(iso=DateTimeFormat.ISO.DATE)LocalDate checkInDate,
            @RequestParam("checkOutDate") @DateTimeFormat(iso=DateTimeFormat.ISO.DATE)LocalDate checkOutDate,
            @RequestParam("roomType") String roomType
            ) throws SQLException {
        List<Room> availableRooms=roomService.getAvailableRooms(checkInDate,checkOutDate,roomType);
        List<RoomResponse> roomResponses=new ArrayList<>();
        for(Room room:availableRooms){
            byte[] photoBytes= roomService.getRoomPhotoByRoomId(room.getId());
            if(photoBytes != null && photoBytes.length>0){
                String photoBae64=Base64.getEncoder().encodeToString(photoBytes);
                RoomResponse roomResponse=getRoomResponse(room);
                roomResponse.setPhoto(photoBae64);
                roomResponses.add(roomResponse);
            }
        }
        if(roomResponses.isEmpty()){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.ok(roomResponses);
        }

    }


    private RoomResponse getRoomResponse(Room room) {
        List<BookedRoom> bookings= getAllBookingsByRoomId(room.getId());
        /*Java Streams provide powerful methods like map(), filter(), collect(), etc.,
          enabling you to perform operations on each element of the list concisely.*/
        List<BookingResponse> bookingInfo = bookings
                                            .stream()
                                            .map(booking ->new BookingResponse(booking.getBookingId(),
                                                            booking.getCheckInDate(),
                                                            booking.getCheckOutDate(),
                                                            booking.getBookingConfirmationCode()
                                                    )).toList();
        byte[] photoBytes=null;
        Blob photoBlob= room.getPhoto();
        if(photoBlob != null){
            try{
                photoBytes =photoBlob.getBytes(1,(int) photoBlob.length());
            }catch(SQLException e){
                throw new PhotoRetrievalException("Error retrieving photo");
            }
        }
        return new RoomResponse(room.getId(),
                room.getRoomType(),
                room.getRoomPrice(),
                room.isBooked(),
                photoBytes,
                bookingInfo
                );
   }

    private List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
          return bookingService.getAllBookingsByRoomId(roomId);
    }

}
