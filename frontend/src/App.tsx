import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { router } from "./configs/routes"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/course" />} />
                {router.map((item) => (
                    <Route key={item.path} element={item.element} path={item.path} />
                ))}
            </Routes>
        </BrowserRouter>
    )
}

export default App

