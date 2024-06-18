const APIURL = "http://localhost:3000";
const displaySelect = document.querySelector(".faculties");
const attendanceGrid = document.querySelector("#attendance-grid");
const todaysAttendance = document.querySelector(".todays-attendance");
const saveAttendance = attendanceGrid.querySelector("button");
let studentsData = [];

window.addEventListener("load", async () => {
  let facultyList = await getFaculties();
  displayFacultiesinSelect(facultyList);

  displaySelect.addEventListener("change", async () => {
    const options = {
      method: "GET",
    };
    const result = await apiQuery(
      "/getStudentByFaculty/" + displaySelect.value,
      options
    );
    if (result.length > 0) {
      console.log(result);
      document.querySelector(".no-faculty-selected").classList.add("hidden");
      attendanceGrid.classList.remove("hidden");
      studentsData = result;
      displayAttendanceGrid();
    }
  });

  saveAttendance.addEventListener("click", async () => {
    const attendanceDataToSubmit = {
      faculty: displaySelect.value,
      attendance: studentsData,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attendanceDataToSubmit),
    };
    const result = await apiQuery("/saveAttendance", options);
    console.log(result);
    const alert = document.querySelector(".alert-success");
    alert.classList.remove("hidden");
    alert.innerText = result;
    window.scrollY = 0;
  });
});

async function getFaculties() {
  const options = {
    method: "GET",
  };
  return await apiQuery("/getFaculty", options);
}

function displayFacultiesinSelect(list) {
  list.forEach((item, index) => {
    const option = document.createElement("option");
    option.innerText = item.name;
    option.value = item.name;
    displaySelect.append(option);
  });
}

function displayAttendanceGrid() {
  todaysAttendance.innerHTML = "";
  const gridWrapper = document.createElement("div");
  gridWrapper.classList.add(
    "w-1/2",
    "p-2",
    "border-green-500",
    "border-solid",
    "border-2",
    "rounded"
  );

  studentsData.forEach((student) => {
    student.attendance = "A";
  });

  studentsData.forEach((student, index) => {
    const studentDiv = document.createElement("div");
    const sno = document.createElement("p");
    const name = document.createElement("p");
    const attendance = document.createElement("p");

    sno.classList.add("w-1/6");
    name.classList.add("w-1/4");
    studentDiv.classList.add(
      "flex",
      "py-4",
      "px-2",
      "mb-4",
      "items-center",
      "border-b-2",
      "last-of-type:border-b-0",
      "border-green-500"
    );
    attendance.classList.add("ml-4", "w-1/2", "text-center");

    sno.innerText = index + 1;
    name.innerText = student.name;
    attendance.innerText = student.attendance;
    attendance.classList.add("absent", "bg-red-500", "text-white");
    attendance.addEventListener("click", (e) =>
      toggleAttendance(e, student.aadhaar)
    );

    studentDiv.append(sno, name, attendance);
    gridWrapper.append(studentDiv);
  });

  todaysAttendance.append(gridWrapper);
}

function toggleAttendance(evt, aadhaar) {
  const para = evt.target;
  const attendance = para.innerText;
  if (attendance === "A") {
    para.innerText = "P";
    changeToGreen(para);
  } else {
    para.innerText = "A";
    changeToRed(para);
  }
  studentsData.forEach((student) => {
    if (student.aadhaar === aadhaar)
      student.attendance = student.attendance === "A" ? "P" : "A";
  });

  console.log(studentsData);
}

function changeToGreen(para) {
  para.classList.remove("bg-red-500");
  para.classList.add("bg-green-500");
}

function changeToRed(para) {
  para.classList.remove("bg-green-500");
  para.classList.add("bg-red-500");
}

async function apiQuery(endpoint, options = {}) {
  const response = await fetch(APIURL + endpoint, options);
  const result = await response.json();
  return result;
}
