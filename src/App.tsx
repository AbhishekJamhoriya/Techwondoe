// import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import {Route,Routes} from "react-router-dom"
import Others from './Components/Other';
import EnhancedTable from './Components/Datatable';

function App() {
  return (
    <div className="App">
      <div style={{margin:"2rem",height:"4rem",position:"relative",marginLeft:"2.5rem",marginBottom:"-1rem"}}>
        <div style={{width:"30%",position:"absolute",height:"40px",bottom:"0px"}}>
        <Link href="/" underline="none" style={{border:"2px solid #DEDCDC",padding:"8px 12px",textDecoration:"none",borderRadius:"5px",cursor:"pointer"}}>General</Link>
      <Link href="/users" underline="none" style={{border:"2px solid #DEDCDC",padding:"8px 12px",textDecoration:"none",borderRadius:"5px",cursor:"pointer"}}>Users</Link>
      <Link href="/plan" underline="none" style={{border:"2px solid #DEDCDC",padding:"8px 12px",textDecoration:"none",borderRadius:"5px",cursor:"pointer"}}>Plan</Link>
      <Link href="/billing" underline="none" style={{border:"2px solid #DEDCDC",padding:"8px 12px",textDecoration:"none",borderRadius:"5px",cursor:"pointer"}}>Billing</Link>
      <Link href="/integration" underline="none" style={{border:"2px solid #DEDCDC",padding:"8px 12px",textDecoration:"none",borderRadius:"5px",cursor:"pointer"}}>Integrations</Link>
        </div>
      
      </div>
       
      <div>
        <Routes>
            <Route path = "/" element ={<Others title="General"/>}/>
            <Route path = "/users" element ={
            // <DataTable/>
            <EnhancedTable/>
            } />
            <Route path = "/plan" element ={<Others title="Plan"/>}/>
            
            <Route path = "/billing" element ={<Others title="Billing"/>}/>
            
            <Route path = "/integration" element ={<Others title="Integrations"/>}/>
            
        </Routes>
   
      </div>
    </div>
  );
}

export default App;
