import "./app.css";

import { Routes, Route } from "react-router-dom";
import { FaRegCircle, FaRegCheckCircle, FaMonument } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";


export default function App() {
  const [language, setLanguage] = useState("en");

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home language={language} handleLanguageChange={handleLanguageChange} />} />
      </Routes>
    </div>
  );
}

const Home = ({ language, handleLanguageChange }) => {
  const initialTaskList = [
    { id: 1, title: "Build some websites", done: false, dueDate: moment().add(3, "days").toISOString() },
    { id: 2, title: "Do exercises", done: false, dueDate: moment().add(7, "days").toISOString() },
    { id: 3, title: "Go shopping", done: false, dueDate: moment().add(2, "days").toISOString() },
    { id: 4, title: "House cleaning", done: true, dueDate: moment().subtract(1, "days").toISOString() },
  ];

  const [taskList, setTaskList] = useState(initialTaskList);
  const [showOnlyNotFinished, setShowOnlyNotFinished] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const withDoneParam = new URLSearchParams(location.search).get("withDone");
    setShowOnlyNotFinished(withDoneParam !== "1");
  }, [location.search]);

  useEffect(() => {
    localStorage.setItem("taskList", JSON.stringify(taskList));
  }, [taskList]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const input = event.target.elements["task"];
    const newTask = {
      id: taskList.length + 1,
      title: input.value,
      done: false,
    };
    setTaskList([...taskList, newTask]);
    input.value = "";
  };

  const handleCheckbox = (taskId) => {
    const updatedTaskList = taskList.map((task) =>
      task.id === taskId ? { ...task, done: !task.done } : task
    );
    setTaskList(updatedTaskList);
  };

  const filteredTaskList = showOnlyNotFinished
    ? taskList.filter((task) => !task.done)
    : taskList;

  const undoneTasksCount = taskList.filter((task) => !task.done).length;

  const languageData = {
    en: {
      title: "Todo List",
      header: `You have ${undoneTasksCount} tasks left!`,
      notFinishedOnly: "Not finished only",
      submitButton: "Submit",
      languagePicker: {
        en: "🇺🇸",
        vn: "🇻🇳",
      },
    },
    vn: {
      title: "Danh sách công việc",
      header: `Bạn còn ${undoneTasksCount} công việc!`,
      notFinishedOnly: "Hiển thị công việc chưa hoàn thành",
      submitButton: "Thêm",
      languagePicker: {
        en: "🇺🇸",
        vn: "🇻🇳",
      },
    },
  };

  const currentLanguageData = languageData[language];

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          {currentLanguageData.header}
          <span>
            <span className="item-title">{currentLanguageData.notFinishedOnly}</span>
            {showOnlyNotFinished ? (
              <FaRegCheckCircle
                className="item-done-button"
                color="#9a9a9a"
                onClick={() => setShowOnlyNotFinished(false)}
              />
            ) : (
              <FaRegCircle
                className="item-done-button"
                color="#9a9a9a"
                onClick={() => setShowOnlyNotFinished(true)}
              />
            )}
          </span>
        </div>
        <div className="todo-list-container">
          {filteredTaskList.map((task) => (
            <div
              key={task.id}
              className={`todo-item-container ${task.done ? "done" : ""}`}
            >
              <div
                className="item-done-button"
                onClick={() => handleCheckbox(task.id)}
              >
                {task.done ? (
                  <FaRegCheckCircle color="#9a9a9a" />
                ) : (
                  <FaRegCircle color="#9a9a9a" />
                )}
              </div>
              <div className="item-title">
                {task.title} {task.dueDate && `- ${moment(task.dueDate).format("DD/MM/YYYY")}`}
              </div>
            </div>
          ))}
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <input name="task" placeholder={currentLanguageData.title} />
          <button>{currentLanguageData.submitButton}</button>
        </form>
      </div>
      <h3>Made by Trung</h3>
      <div>
        <span className="languague-picker" onClick={() => handleLanguageChange("en")}>
          {currentLanguageData.languagePicker.en}
        </span>
        <span className="languague-picker" onClick={() => handleLanguageChange("vn")}>
          {currentLanguageData.languagePicker.vn}
        </span>
      </div>
    </div>
  );
};

