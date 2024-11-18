import axios from 'axios'

export const api=axios.create({
    baseURL:"http://localhost:8080"
})

export const getHeader=()=>{
    const token=localStorage.getItem("token")
    return{
        Authorization:`Bearer ${token}`,
        "Content-Type":"application/json"
    }
}
export async function getAllUsers(){
    try{
        const response=await api.get('/users/getAllUsers',{
            headers:getHeader()
        })
        return response.data
    }catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data)
        }
        else{
            throw new Error(`${error.message}`)
        }

    }
}
export async function getUserProfile(email,token){
    try{
        const response =await api.get(`/users/${email}`,{
        headers:getHeader()
        })
        return response.data
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data)
        }
        else{
            throw new Error(`User login error:${error.message}`)
        }
    }
}

export async function deleteUser(userId){
    try{
        const response=await api.delete(`/users/delete/${userId}`,{
          headers:getHeader()
        })
        return response.data

    }catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data)
        }
        else{
            throw new Error(`${error.message}`)
        }
    }
}

export async function getBookingsByUserId(userId,token){
    try{
        const response=await api.get(`/bookings/bookingsByUserId/${userId}`,{
            headers:getHeader()
        })
        return response.data
    }catch(error){
        throw new Error("Failed to fetch bookings");
    }
}