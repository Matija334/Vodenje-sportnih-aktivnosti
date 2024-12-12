import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import Events from "./views/Events";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import Profile from "./views/Profile/Profile";

const App = () => {
    return (
        <Router>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="/">Športne Aktivnosti</NavLink>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/">Domov</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/events">Dogodki</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/profile">Profil</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container-fluid mt-4 main-content">
                <Routes>
                    <Route path="/events" element={<Events />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/" element={<div>Domov - še v razvoju</div>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;