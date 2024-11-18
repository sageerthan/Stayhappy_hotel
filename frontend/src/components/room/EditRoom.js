import React,{useEffect, useState} from 'react'
import { Link, useParams } from 'react-router-dom';
import { getRoomById, updateRoom } from '../utils/ApiFunctions';
import RoomTypeSelector from '../common/RoomTypeSelector';

const EditRoom = () => {
  const [room, setRoom] = useState({
    photo: null,
    roomType: "",
    roomPrice: ""
});
const [imgPreview, setImgPreview] = useState("");
const [successMessage, setSuccessMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");

const{roomId}=useParams();

useEffect(()=>{
    const fetchRoom=async()=>{
      try{
        const roomData=await getRoomById(roomId)
        setRoom(roomData)
        // Check if the photo is a base64 string and set imgPreview accordingly
        if (roomData.photo) {
          if (roomData.photo.startsWith("data:image")) {
            setImgPreview(roomData.photo);
          } else {
            setImgPreview(`data:image/png;base64,${roomData.photo}`);
          }
        }
      }catch(error){
        console.log(error)
      }
    }
    fetchRoom()
},[roomId])

const handleInputChange = (e) => {
  
  const name = e.target.name;
  let value = e.target.value;
  if (name === "roomPrice") {
    if (!isNaN(value)) {
      value = parseInt(value);
    } else {
      value = "";
    }
  }
  setRoom({ ...room, [name]: value });
};

const handleImageChange = (e) => {
  const selectedImage = e.target.files[0];
  if (selectedImage) {
      setRoom({ ...room, photo: selectedImage });
      setImgPreview(URL.createObjectURL(selectedImage));
  }
}

const handleSubmit = async (e) => {
  e.preventDefault(); 
  try {
    const response=await updateRoom(roomId,room)
     if(response.status===200){
         
         const updatedRoomData=await getRoomById(roomId)
         setRoom(updatedRoomData)
         setImgPreview(updatedRoomData.photo)
         setSuccessMessage("Room updated successfully!")
         setErrorMessage("")
       }
      else {
          setErrorMessage("Error in updating room");
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
                        <h2 className="mt-5 mb-2">Edit a Room</h2>
                        {/* Display success or error messages */}
                        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor='roomType' className="form-label">Room Type</label>
                                <RoomTypeSelector handleRoomInputChange={handleInputChange} newRoom={room} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor='roomPrice' className="form-label">Room Price</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="roomPrice" 
                                    name="roomPrice" 
                                    value={room.roomPrice} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor='photo' className="form-label">Room Photo</label>
                                <input 
                                    type="file" 
                                    className="form-control"  
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
                            <div className='d-grid d-md-flex mt-2'>
                                <Link to={"/existing-rooms"} className='btn btn-outline-info ml-5'>Back</Link>
                                <button type="submit" className="btn btn-outline-success">Edit Room</button>
                            </div>    
                        </form>
                        
                    </div>
                </div>
            </section>
        </>
  )
}

export default EditRoom