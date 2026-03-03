
import { createBrowserRouter, RouterProvider } from 'react-router'
import './App.css'

import {HeroUIProvider} from "@heroui/react";
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import { Toaster } from 'react-hot-toast';

import AuthContextProvider from './components/Context/AuthContextProvider/AuthContextProvider';

import Posts from './pages/Posts/Posts';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Profile from './components/Porofile/Profile';


function App() {
  
  const myRouter= createBrowserRouter([
    {path:"/" , element:<Register/>},
    {path:"register" , element:<Register/>},
    {path:"login" , element:<Login/>},
    {path:"posts" ,element:<Posts/> },
    {path:"profile", element: <Profile/>}
  ])


  return (
    <>
     <QueryClientProvider client={new QueryClient()}>
      <AuthContextProvider>
      <HeroUIProvider>
      <Toaster/>
      <RouterProvider router={myRouter}/>
    </HeroUIProvider>
     </AuthContextProvider>
     </QueryClientProvider>
    
    </>
  )
}

export default App
