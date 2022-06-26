import { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { app } from "./FirebaseAccess";
import Login from './login';
import Register from './register';
import Reset from './reset';
import UserLists from './userlists';
import DashboardBodySegment from './dashboard';
import 'semantic-ui-css/semantic.min.css'
import './App.css';


function App() {
  useEffect(() => {
    // document.title = "Collaborative TODO App";
    console.log(app)
  }, []);

  return (
    <div>

      <Router>
        <Routes>
          <Route path="/" element={
            <div>
              <Helmet>
                <style>{"body { background-color: #f2f5f4 }"}</style>
              </Helmet>
              <Login />
            </div>} />
          <Route path="/register" element={
            <div>
              <Helmet>
                <style>{"body { background-color: #f2f5f4 }"}</style>
              </Helmet>
              <Register />
            </div>} />
          <Route path="/reset" element={
            <div>
              <Helmet>
                <style>{"body { background-color: #f2f5f4 }"}</style>
              </Helmet>
              <Reset />
            </div>} />
          <Route path="/userlists" element={
            <div className='App' >
              <Helmet>
                <style>{"body { background-color: #b0e8dd }"}</style>
              </Helmet>
              <UserLists />
            </div>
          } />
          <Route path="/dashboard/:listid" element={
            <div className='App' >
              <Helmet>
                <style>{"body { background-color: #b0e8dd }"}</style>
              </Helmet>
              <DashboardBodySegment />
            </div>
          } />
        </Routes>

      </Router>
    </div >
  );
}

export default App;