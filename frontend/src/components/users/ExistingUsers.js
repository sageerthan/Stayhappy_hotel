import React, { useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import Paginator from './Paginator'
import { deleteUser, getAllUsers } from '../utils/UserApiFunction'

const ExistingUsers = () => {
    const [users,setUsers]=useState([])
    const [isLoading,setIsLoading]=useState(false)
    const [currentPage,setCurrentPage]=useState(1)
    const usersPerPage=4
    const [successMessage,setSuccessMessage]=useState("")
    const [errorMessage,setErrorMessage]=useState("")

    useEffect(()=>{
        fetchUsers()
    },[])

    const fetchUsers=async()=>{
        setIsLoading(true)
        try{
            const result=await getAllUsers()
            if(Array.isArray(result)){
                setUsers(result)    
            }
            else{
                throw new Error("Data format is incorrect")
            }
        }catch(error){
            setErrorMessage(error.message);
        }finally{
            setIsLoading(false)
        }    
    }

    const handlePaginationClick=(pageNumber)=>{
        setCurrentPage(pageNumber)
    }

    const calculateTotalPages=()=>{
        return Math.ceil(users.length/usersPerPage)
    }

    const handleDelete=async(userId)=>{
        try{
            await deleteUser(userId)
            setSuccessMessage(`User Id:${userId} was deleted`)
            fetchUsers()
        }catch(error){
            setErrorMessage(error.message)
        }
        setTimeout(() => {
            setSuccessMessage("")
            setErrorMessage("")
        }, 3000)
    }

    const indexOfFirstUser=(currentPage-1)*usersPerPage
    const indexOfLastUser=indexOfFirstUser+usersPerPage
    const currentUsers=users.slice(indexOfFirstUser,indexOfLastUser)

  return (
    <>
    { isLoading?(
        <div className='d-flex justify-content-center align-items-center' style={{height:'100vh'}}>
            <p className='bg-warning text-dark p-3' style={{fontSize:'1.2rem',fontWeight:'bold'}}>
                <span className='spinner-border spinner-border-sm mr-2'
                  role='status' aria-hidden='true'/> Loading existing users...
            </p>
        </div>
    ):(
        <section className='container mt-5 mb-5'>
            <div className='d-flex justify-content-center mt-5 mb-5'>
                <h2>Existing Users</h2>
            </div>
            {successMessage && <div className='alert alert-success mt-3'>{successMessage}</div>}
            {errorMessage && <div className='alert alert-danger mt-3'>{errorMessage}</div>}

            <table className='table table-bordered table-hover'>
                <thead>
                    <tr className='text-center'>
                        <th>ID</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user)=>(
                        <tr key={user.id} className='text-center'>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.roles.map((role) => role.name).join(', ')}</td>
                            <td>
                                <button className='btn btn-danger btn-sm' type='button' onClick={()=>handleDelete(user.email)}><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Paginator
              currentPage={currentPage}
              totalPages={calculateTotalPages()}
              onPageChange={handlePaginationClick}
            />
        </section>

    )

    }
    </>
  )
}

export default ExistingUsers
