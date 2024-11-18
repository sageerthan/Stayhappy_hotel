import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import RoomFilter from '../common/RoomFilter';
import RoomPaginator from '../common/RoomPaginator';
import { deleteRoom, getAllRooms } from '../utils/ApiFunctions';
import { FaEye, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { BsHouseAddFill } from 'react-icons/bs';

const ExistingRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const result = await getAllRooms();
      if (Array.isArray(result)) {
        setRooms(result);
        setFilteredRooms(result);
      } else {
        throw new Error("Data format is incorrect");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRoomType === "") {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter((room) => room.roomType === selectedRoomType);
      setFilteredRooms(filtered);
    }
    setCurrentPage(1);
  }, [rooms, selectedRoomType]);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const calculateTotalPages = () => {
    const totalRooms = filteredRooms.length > 0 ? filteredRooms.length : rooms.length;
    return Math.ceil(totalRooms / roomsPerPage);
  };

  const handleDelete = async (roomId) => {
    try {
      const result = await deleteRoom(roomId)
      if (result === "") {
        setSuccessMessage(`Room No ${roomId} was deleted`)
        fetchRooms()
      } else {
        console.error(`Error deleting room :${result.message}`)
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
    setTimeout(() => {
      setSuccessMessage("")
      setErrorMessage("")
    }, 3000)
  }

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <p className="bg-warning text-dark p-3" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span className="spinner-border spinner-border-sm mr-2"
              role="status" aria-hidden="true" />  Loading existing rooms...
          </p>
        </div>
      ) : (
        <section className="mt-5 mb-5 container">
          <div className="d-flex justify-content-center  mb-3 mt-5">
            <h2>Existing Rooms</h2>
          </div>
          {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
          {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
          <Row>

            <Col md={6} className="mb-3 mb-md-0">
              <RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
            </Col>

            <Col md={6} className='d-flex justify-content-end'>
              <Link to={"/add-room"} className="btn text-success"> <BsHouseAddFill /> Add New Room</Link>
            </Col>

          </Row>

          <table className="table table-bordered table-hover">
            <thead>
              <tr className="text-center">
                <th>ID</th>
                <th>Room Type</th>
                <th>Room Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRooms.map((room) => (
                <tr key={room.id} className="text-center">
                  <td>{room.id}</td>
                  <td>{room.roomType}</td>
                  <td>{room.roomPrice}</td>
                  <td>
                    <Link to={`/edit-room/${room.id}`}>
                      <span className='btn btn-primary btn-sm'><FaEye /></span>
                      <span className='btn btn-warning btn-sm mx-2'>Edit</span>
                    </Link>
                    <button className="btn btn-danger btn-sm" type="button" onClick={() => handleDelete(room.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <RoomPaginator
            currentPage={currentPage}
            totalPages={calculateTotalPages()}
            onPageChange={handlePaginationClick}
          />
        </section>
      )}
    </>
  );
};

export default ExistingRooms;
