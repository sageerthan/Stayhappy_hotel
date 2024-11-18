package com.project.stayhappy.repository;

import com.project.stayhappy.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room,Long> {
    @Query("SELECT DISTINCT r.roomType FROM room r")
    List<String> findDistinctRoomTypes();
    @Query("SELECT r FROM room r " +
            "WHERE r.roomType LIKE %:roomType% " +
            "AND r.id NOT IN (" +
            "  SELECT br.room.id FROM booked_room br " +
            "  WHERE ((br.checkInDate <= :checkOutDate) AND (br.checkOutDate >= :checkInDate))" +
            ")")
    List<Room> findAvailableRoomsByDateAndType(LocalDate checkInDate, LocalDate checkOutDate, String roomType);
}
