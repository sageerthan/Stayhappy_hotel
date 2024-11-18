import React, { useState, useEffect } from 'react'
import { Card, Carousel, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {getAllRooms} from '../utils/ApiFunctions'

const RoomCarousel = () => {
    const [rooms, setRooms] = useState([])
    const [erroMessage, setErrorMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true);
        getAllRooms().then((room) => {
            setRooms(room)
            setIsLoading(false)
        }).catch((error) => {
            setErrorMessage(error.message)
            setIsLoading(false)
        })
    }, [])
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <p className="bg-warning text-dark p-3" style={{ fontsize: '1.5rem' }}>
                    Loading Rooms.....
                </p>
            </div>
        )
    }
    if (erroMessage) {
        return <div className='text-danger mb-5 mt-5'>Error:{erroMessage}</div>
    }
    return (
        <section className="bg-light mb-5 mt-5 shadow">
            <Link to={"/browse-all-rooms"} className="hotel-color text-center">
                Browse all rooms
            </Link>
            <Container>
                <Carousel indicators={false}>
                    {[...Array(Math.ceil(rooms.length / 4))].map((_, index) => (
                        <Carousel.Item key={index}>
                            <Row>
                                {rooms.slice(index * 4, index * 4 + 4).map((room) => (
                                    <Col key={room.id} className="mb-4" xs={12} md={6} lg={3}>
                                        <Card>
                                            <Link to={`/book-room/${room.id}`}>
                                                <Card.Img
                                                    variant="top"
                                                    src={`data:image/png;base64,${room.photo}`}
                                                    alt="Room photo"
                                                    className="w-100"
                                                    style={{ height: "200px" }}
                                                />
                                            </Link>
                                            <Card.Body>
                                                <Card.Title><div className="hotel-color">{room.roomType}</div></Card.Title>
                                                <Card.Title><div className="room-price">{room.roomPrice}.00</div></Card.Title>
                                                <div className='flex-shrink-0 mt-3'>
                                                    <Link className='btn-hotel btn-sm btn' to={`/book-room/${room.id}`}>
                                                        Book Now
                                                    </Link>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>
        </section >
    )
}

export default RoomCarousel