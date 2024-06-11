const APIURL = "http://localhost:3000";
const displaySelect = document.querySelector(".faculties");
const attendanceGrid = document.querySelector("#attendance-grid");

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
      document.querySelector(".no-faculty-selected").style.display = "none";
      attendanceGrid.style.display = "block";
      displayAttendanceGrid(result);
    }
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

function displayAttendanceGrid(result) {
  attendanceGrid.innerHTML = "";
  const gridWrapper = document.createElement("div");
  result.forEach((student, index) => {
    const studentDiv = document.createElement("div");
    const sno = document.createElement("p");
    const name = document.createElement("p");
    const attendance = document.createElement("p");
    sno.innerText = index + 1;
    name.innerText = student.name;
    attendance.innerText = "A";
    attendance.classList.add("absent");
    attendance.addEventListener("click", toggleAttendance);

    studentDiv.append(sno, name, attendance);
    gridWrapper.append(studentDiv);
  });

  attendanceGrid.append(gridWrapper);
}

function toggleAttendance(evt) {
  const para = evt.target;
  const attendance = para.innerText;
  para.innerText = attendance === "A" ? "P" : "A";
}

async function apiQuery(endpoint, options = {}) {
  const response = await fetch(APIURL + endpoint, options);
  const result = await response.json();
  return result;
}
