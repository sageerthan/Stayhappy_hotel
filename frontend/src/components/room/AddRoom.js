import React, { useState } from 'react';
import { addRoom } from '../utils/ApiFunctions';
import RoomTypeSelector from '../common/RoomTypeSelector';
import { Link } from 'react-router-dom';
const AddRoom = () => {
    const [newRoom, setNewRoom] = useState({
        photo: null,
        roomType: "",
        roomPrice: ""
    });
    const [imgPreview, setImgPreview] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleRoomInputChange = (e) => {
        // const { name, value } = e.target;
        // setNewRoom({ ...newRoom, [name]: value });
        const name = e.target.name;
        let value = e.target.value;
        if (name === "roomPrice") {
          if (!isNaN(value)) {
            value = parseInt(value);
          } else {
            value = "";
          }
        }
        setNewRoom({ ...newRoom, [name]: value });
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            setNewRoom({ ...newRoom, photo: selectedImage });
            setImgPreview(URL.createObjectURL(selectedImage));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const success = await addRoom(newRoom.photo, newRoom.roomType, newRoom.roomPrice);
            if (success !== undefined) {
                setSuccessMessage("A new room was added to the database");
                setNewRoom({ photo: null, roomType: "", roomPrice: "" });
                setImgPreview("");
                setErrorMessage("");
            }
            else {
                setErrorMessage("Error in adding new room");
              }
        } catch (error) {
            setErrorMessage(error.message); // Set error message if there's an error
        }
        setTimeout(()=>{
           setSuccessMessage("");
           setErrorMessage("");
        },3000)
    };

    return (
        <>
            <section className="container mt-5 mb-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <h2 className="mt-5 mb-2">Add a New Room</h2>
                        {/* Display success or error messages */}
                        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor='roomType' className="form-label">Room Type</label>
                                <RoomTypeSelector handleRoomInputChange={handleRoomInputChange} newRoom={newRoom} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor='roomPrice' className="form-label">Room Price</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    required 
                                    id="roomPrice" 
                                    name="roomPrice" 
                                    value={newRoom.roomPrice} 
                                    onChange={handleRoomInputChange} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor='photo' className="form-label">Room Photo</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    required 
                                    id="photo" 
                                    name="photo" 
                                    onChange={handleImageChange} 
                                />
                                {imgPreview && (
                                    <img 
                                        src={imgPreview} 
                                        alt="Room photo preview" 
                                        style={{ maxWidth: "400px", maxHeight: "400px", paddingTop: "10px" }} 
                                        className='mb-3' 
                                    />
                                )}
                            </div>
                            <div className='d-grid d-md-flex mt-2 gap-2'>
                                <Link to={"/existing-rooms"} className="btn btn-outline-info ">Existing Rooms</Link>
                                <button type="submit" className="btn btn-outline-success">Add Room</button>
                            </div>    
                        </form>
                        
                    </div>
                </div>
            </section>
        </>
    );
};

export default AddRoom;
