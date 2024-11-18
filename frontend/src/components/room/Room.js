import React, { useEffect, useState } from 'react'
import { getAllRooms } from '../utils/ApiFunctions';
import RoomPaginator from '../common/RoomPaginator';
import { Col, Container, Row } from 'react-bootstrap';
import RoomFilter from '../common/RoomFilter';
import RoomCard from './RoomCard';


const Room = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(6);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        fetchRooms();
    }, [])

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const rooms = await getAllRooms();
            if (Array.isArray(rooms)) {
                setData(rooms);
                setFilteredData(rooms);
            }
            else {
                throw new Error("Data format is incorrect");
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false)
        }
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }
    const totalPages = Math.ceil(filteredData.length / roomsPerPage);

    const renderRooms = () => {
        const startIndex = (currentPage - 1) * roomsPerPage;
        const endIndex = startIndex + roomsPerPage;
        return filteredData.slice(startIndex, endIndex)
            .map((room) => <RoomCard key={room.id} room={room} />)
    }
    return (
        <>
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <p className="bg-warning text-dark p-3" style={{ fontSize: '1.2rem' }}>
                  <span className="spinner-border spinner-border-sm mr-2"
                    role="status" aria-hidden="true" />  Loading existing rooms...
                </p>
              </div>

            ) : (
                <Container>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    <Row>
                        <Col md={6} className="mb-3 mb-md-0">
                            <RoomFilter data={data} setFilteredData={setFilteredData} />
                        </Col>
                        <Col md={6} className="d-flex align-items-center justify-content-end">
                            <RoomPaginator currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        </Col>
                    </Row>

                    <Row>{renderRooms()}</Row>

                </Container>
            )
            }
        </>
    )
}

export default Room