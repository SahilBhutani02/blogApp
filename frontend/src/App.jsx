import React from 'react'
import Signup from './pages/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Blog from './pages/Blog'
import Footer from './components/Footer'
import About from './pages/About'
import ProtectedRoute from './components/ProtectedRoute'
import YourBlog from './pages/YourBlog'
import BlogView from './pages/BlogView'
import WriteBlog from './pages/WriteBlog'

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar/><Home /><Footer/></>
  },
  {
    path: "/blogs",
    element: <><Navbar/><Blog /><Footer/></>
  },
  {
    path: "/blogs/:blogId",
    element: <><Navbar/><ProtectedRoute><BlogView /></ProtectedRoute><Footer/></>
  },
  {
    path: "/about",
    element: <><Navbar/><About /><Footer/></>
  },
  {
    path: "/signup",
    element: <><Navbar/><Signup /><Footer/></> 
  },
  {
    path: "/login",
    element: <><Navbar/><Login /><Footer/></>
  },
  {
    path: "your-blog",
    element:<><Navbar/><ProtectedRoute><YourBlog/></ProtectedRoute><Footer/></>
  },
   {
    path: "write-blog",
    element:<><Navbar/><ProtectedRoute><WriteBlog/></ProtectedRoute><Footer/></>
  },
  {
    path: "write-blog/:blogId",
    element:<><Navbar/><ProtectedRoute><WriteBlog/></ProtectedRoute><Footer/></>
  },
])

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
