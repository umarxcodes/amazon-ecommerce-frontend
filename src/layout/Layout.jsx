import { Outlet } from "react-router-dom";

// ===*style*===
import "./Layout.css"

import Sign from "../components/Sign_in/Sign_in";




 // ===*Components*===
 import Header from "../components/Header/Header";
 import Footer from "../components/Footer/Footer";


 
// ===*Layout Component*===

export default function Layout(){
    return (
        <>
        <Header/>
        <main className="main-body-layout">
            <Outlet/>
        </main>
        <Sign/>

        <Footer/>
    
        </>
    )
}