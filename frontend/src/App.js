import Home from "./components/home/Home";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import AddRoom from "./components/room/AddRoom";
import EditRoom from "./components/room/EditRoom";
import ExistingRooms from "./components/room/ExistingRooms";
import {Routes,Route} from "react-router-dom"
import RoomListing from "./components/room/RoomListing";
import Admin from "./components/admin/Admin";
import Checkout from "./components/bookings/Checkout";
import BookingSuccess from "./components/bookings/BookingSuccess";
import Bookings from "./components/bookings/Bookings";
import FindBooking from "./components/bookings/FindBooking";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/auth/Profile";
import RequireAuth from "./components/auth/RequireAuth";
import ExistingUsers from "./components/users/ExistingUsers";
function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        
        <Route path="/" element={<Home/>}/>
        <Route path="/edit-room/:roomId" element={<EditRoom/>}/>
        <Route path="/existing-rooms" element={<ExistingRooms/>}/>
        <Route path="/add-room" element={<AddRoom/>}/>
        <Route path="/browse-all-rooms" element={<RoomListing/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/book-room/:roomId" element={
          <RequireAuth>
            <Checkout/>
          </RequireAuth>
          }/>
        <Route path="/booking-success" element={<BookingSuccess/>}/>
        <Route path="/existing-bookings" element={<Bookings/>}/>
        <Route path="/find-booking" element={<FindBooking/>}/>

        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>

        <Route path="/profile" element={<Profile/>}/>

        <Route path="/existing-users" element={<ExistingUsers/>}/>

      </Routes>
      <Footer/>
    </>
  );
}

export default App;
