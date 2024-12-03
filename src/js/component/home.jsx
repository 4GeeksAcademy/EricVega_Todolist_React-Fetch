import React, { useState, useEffect } from "react";
import "../../styles/index.css";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const apiUrl = "https://playground.4geeks.com/todo/user/alesanchezr";

    // Obtener tareas del servidor al cargar la aplicación
    useEffect(() => {
        fetch(apiUrl)
            .then((resp) => {
                if (!resp.ok) throw new Error("Error fetching tasks");
                return resp.json();
            })
            .then((data) => {
                setTasks(data || []);
            })
            .catch((error) => console.error("Error:", error));
    }, []);

    // Actualizar las tareas en el servidor
    const updateTasksOnServer = (updatedTasks) => {
        fetch(apiUrl, {
            method: "PUT",
            body: JSON.stringify(updatedTasks),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((resp) => {
                if (!resp.ok) throw new Error("Error updating tasks");
                console.log("Tasks updated successfully:", resp.status);
            })
            .catch((error) => console.error("Error:", error));
    };

    const handleAddTask = (e) => {
        if (e.key === "Enter" && e.target.value.trim() !== "") {
            const newTask = { label: e.target.value, done: false };
            const updatedTasks = [...tasks, newTask];
            setTasks(updatedTasks);
            updateTasksOnServer(updatedTasks);
            e.target.value = "";
        }
    };

    const handleDeleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
        updateTasksOnServer(updatedTasks);
    };

    const handleClearTasks = () => {
        fetch(apiUrl, {
            method: "PUT",
            body: JSON.stringify([]),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((resp) => {
                if (!resp.ok) throw new Error("Error clearing tasks");
                console.log("Tasks cleared successfully");
                setTasks([]);
            })
            .catch((error) => console.error("Error:", error));
    };

    return (
        <div className="todo-container">
            <h1 className="title">todos</h1>
            <div className="todo-input">
                <input
                    type="text"
                    placeholder="What needs to be done?"
                    onKeyDown={handleAddTask}
                />
            </div>
            <ul className="todo-list">
                {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                        <li key={index} className="todo-item">
                            <span>{task.label}</span>
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteTask(index)}
                            >
                                ✖
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="no-tasks">No hay tareas, añadir tareas</li>
                )}
            </ul>
            <footer className="footer">
                {tasks.length > 0 ? (
                    <>
                        <span>{tasks.length} item{tasks.length > 1 ? "s" : ""} left</span>
                        <button className="clear-button" onClick={handleClearTasks}>
                            Clear All
                        </button>
                    </>
                ) : null}
            </footer>
        </div>
    );
};

export default Home;

