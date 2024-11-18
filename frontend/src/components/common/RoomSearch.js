import React, { useState } from 'react'
import { getAvailableRooms } from '../utils/ApiFunctions'
import { Form, Row, Button, Container, Col } from 'react-bootstrap'
import RoomSearchResult from './RoomSearchResult';
import moment from 'moment'
import RoomTypeSelector from './RoomTypeSelector'
const RoomSearch = () => {
    const [searchQuery, setSearchQuery] = useState({
        checkInDate: "",
        checkOutDate: "",
        roomType: ""
    })
    const [errorMessage, setErrorMessage] = useState("");
    const [availableRooms, setAvailableRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        const checkIn = moment(searchQuery.checkInDate)
        const checkOut = moment(searchQuery.checkOutDate)

        if (!checkOut.isSameOrAfter(checkIn)) {
            setErrorMessage("Check-in date must come before check-out date")
            return
        }
        setIsLoading(true)
        getAvailableRooms(
            searchQuery.checkInDate,
            searchQuery.checkOutDate,
            searchQuery.roomType
        ).then((response) => {
            setAvailableRooms(response)
            setTimeout(() => {
                setIsLoading(false)
                setErrorMessage("")
            }, 2000)
        }).catch((error) => {
            setIsLoading(false)
            setErrorMessage(error.message)
        })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setSearchQuery({ ...searchQuery, [name]: value })
    }
    const clearSearch = () => {
        setSearchQuery({
            checkInDate: "",
            checkOutDate: "",
            roomType: ""
        })
    }
    return (
        <>
            <Container className='mt-5 mb-5 py-5 shadow'>
                <Form onSubmit={handleSearch}>
                    <Row className='justify-content-center'>
                        <Col xs={12} md={3}>
                            <Form.Group controlId='checkInDate'>
                                <Form.Label>Check-in data</Form.Label>
                                <Form.Control type='date'
                                    name='checkInDate'
                                    value={searchQuery.checkInDate}
                                    onChange={handleInputChange}
                                    min={moment().format("YYYY-MM-DD")} />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={3}>
                            <Form.Group controlId='checkOutDate'>
                                <Form.Label>Check-out data</Form.Label>
                                <Form.Control type='date'
                                    name='checkOutDate'
                                    value={searchQuery.checkOutDate}
                                    onChange={handleInputChange}
                                    min={moment().format("YYYY-MM-DD")} />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={3}>
                            <Form.Group>
                                <Form.Label>Room Type</Form.Label>
                                <div className='d-flex'>
                                    <RoomTypeSelector
                                        handleRoomInputChange={handleInputChange}
                                        newRoom={searchQuery} />
                                    <Button variant="secondary" type="submit">Search</Button>
                                </div>
                            </Form.Group>

                        </Col>
                    </Row>
                </Form>
                {isLoading ? (
                    <p>Finding available rooms....</p>
                ) : availableRooms ? (
                    <RoomSearchResult results={availableRooms} onClearSearch={clearSearch} />
                ) : (<p>No Rooms available for selected dates and roomtype</p>)
                }

                {errorMessage && <p className='text-danger'>{errorMessage}</p>}
            </Container>
        </>
    )
}

export default RoomSearch