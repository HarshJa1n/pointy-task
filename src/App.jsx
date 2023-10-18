// import { useState } from 'react'
import './App.css'
// import Calander from './components/Calander'
import styled from "styled-components";
import HomePage from './pages/HomePage';
import AvailabilityPage from './pages/AvailabilityPage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const WrapperContainer = styled.div`
background-color: #dcdcdc;
width: 80%;
height: 80%;
margin: auto;
border-radius: 20px;
padding: 50px;

`;

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/availability",
      element: <AvailabilityPage />,
    },
  ]);


  return (
    <>
      <WrapperContainer>


        <RouterProvider router={router} />
      </WrapperContainer>

    </>
  )
}

export default App
