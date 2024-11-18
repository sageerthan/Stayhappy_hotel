import axios from "axios"
export const api=axios.create({
    baseURL:"http://localhost:8080"
})

export const getHeader=()=>{
   const token=localStorage.getItem("token")
   return{
      Authorization:`Bearer ${token}`
   }
}


export async function addRoom(photo,roomType,roomPrice){
     const formData=new FormData()
     formData.append("photo",photo)
     formData.append("roomType",roomType)
     formData.append("roomPrice",roomPrice)

     const response=await api.post("/rooms/add/new-room",formData,{
      headers:getHeader()
     })

     if(response.status ===201){
        return true
     }
     else{
        return false
     }
}

export async function getRoomTypes(){
    try{
      const response=await api.get("/rooms/room/types")
      return response.data
    }catch(error){
       throw new Error("Error have occured")
    }
}

export async function getAllRooms(){
   try{
      const response=await api.get("/rooms/allRooms")
      return response.data
   }catch(error){
      throw new Error("Error fetching rooms")
   }
}

export async function deleteRoom(roomId){
   try{
      const response=await api.delete(`/rooms/delete/room/${roomId}`,{
         headers:getHeader()
      })
      return response.data
   }catch(error){
      throw new Error("Error deleting room")
   }
}

export async function updateRoom(roomId,roomData){
   try{
      const formData =new FormData()
      formData.append("photo",roomData.photo)
      formData.append("roomType",roomData.roomType)
      formData.append("roomPrice",roomData.roomPrice)
      const response=await api.put(`/rooms/update/room/${roomId}`,formData,{
         headers:getHeader()
        })
      return response
   }catch(error){
      throw new Error("Error updating room")
   }
}

export async function getRoomById(roomId){
   try{
      const response=await api.get(`/rooms/room/${roomId}`)
      return response.data
   }catch(error){
      throw new Error(`Error fetching room ${error.message}`)
   }
}

export async function bookRoom(roomId,booking){
   try{
      const response =await api.post(`/bookings/room/${roomId}/booking`,booking)
      return response.data
   }catch(error){
      if (error.response && error.response.data) {
         const errorMessage = error.response.data.message || JSON.stringify(error.response.data);
         throw new Error(errorMessage);
      } else {
         throw new Error(`Error occurred in booking the room ${roomId} : ${error.message}`);
      }     
   }
}

export async function getAllBookings(){
   try{
      const response =await api.get(`/bookings/all-bookings`,{
         headers:getHeader()
        })
      return response.data
   }catch(error){
     throw new Error(`Error occurred in fetching rooms : ${error.message}`)
   }
}

export async function getBookingByConfirmationCode(confirmationCode){
   try{
      const response=await api.get(`/bookings/confirmation/${confirmationCode}`)
      return response.data

   }catch(error){
      if(error.response && error.response.data){
         const errorMessage=error.response.data.message ||JSON.stringify(error.response.data);
         throw new Error(errorMessage);
      }else{
         throw new Error(`Error occurred in get the confirmation code : ${error.message}`)
      }
   }
}

export async function cancelBooking(bookingId){
   try{
      const response=await api.delete(`/bookings/booking/${bookingId}/delete`)
      return response.data
   }catch(error){
      throw new Error('Error occurred in cancel the booking')
   }
}

export async function getAvailableRooms(checkInDate,checkOutDate,roomType){
   try{
      const response=await api.get(`/rooms/availableRooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`)
      return response.data
   }catch(error){
      if(error.response && error.response.data){
         const errorMessage=error.response.data.message ||JSON.stringify(error.response.data);
         throw new Error(errorMessage);
      }else{
         throw new Error(`Error occurred in fetch available rooms`)
      }
   }
}

