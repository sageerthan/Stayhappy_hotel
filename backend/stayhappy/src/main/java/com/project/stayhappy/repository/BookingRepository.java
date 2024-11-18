package com.project.stayhappy.repository;

import com.project.stayhappy.model.BookedRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<BookedRoom,Long> {
        List<BookedRoom> findByRoomId(Long roomId);

        Optional<BookedRoom> findByBookingConfirmationCode(String confirmationCode);
        List<BookedRoom> findBookingsByGuestEmail(String email);

}