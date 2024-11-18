import React, { useEffect, useState } from 'react'
import { getRoomTypes } from '../utils/ApiFunctions'
import '../../index.css';
const RoomTypeSelector = ({handleRoomInputChange,newRoom}) => {
    const[roomTypes,setRoomTypes]=useState([""])
    const[showNewRoomTypeInputField,setShowNewRoomTypeInputField]=useState(false)
    const[newRoomType,setNewRoomType]=useState("")

    useEffect(()=>{
       getRoomTypes().then((data)=>{
        setRoomTypes(data)
       })
       .catch((error) => {
        console.error('Error occurred while fetching room types:', error);
    });
    },[])

    const handleNewRoomTypeInputChange=(e)=>{
        setNewRoomType(e.target.value)
    }

    const handleAddNewRoomType=()=>{
        if(newRoomType!==""){
            setRoomTypes([...roomTypes,newRoomType])
            setNewRoomType("")
            setShowNewRoomTypeInputField(false)
        }
    }
  return (
   <>
      <div>
        <select  required className="form-select" id="roomType" name="roomType" value={newRoom.roomType} onChange={(e)=>{
            if(e.target.value === "Add New"){
                setShowNewRoomTypeInputField(true)
            }
            else{
                handleRoomInputChange(e)
            }
        }}>
        <option value={""}>select a room type</option>
        <option value={"Add New"}>Add New</option>
        {roomTypes.map((type,index)=>(
            <option key={index} value={type}>
                {type}
            </option>
        ))}
        </select>
        {showNewRoomTypeInputField && (
            <div className='input-group'>
                <input className='form-control' type="text" placeholder='Enter a new room type' value={newRoomType} onChange={handleNewRoomTypeInputChange}/>
                <button className='btn-hotel' type='button' onClick={handleAddNewRoomType}>Add</button>
            </div>
           
        )}
      </div>
   </>
  )
}

export default RoomTypeSelector