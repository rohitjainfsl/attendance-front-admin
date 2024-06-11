const APIURL = "http://localhost:3000";
const toggleSwitches = document.querySelectorAll(".toggleSwitch");
const addFacultyForm = document.querySelector("#addFaculty");
const addStudentForm = document.querySelector("#addStudent");

window.addEventListener("load", async () => {
  let facultyList = await getFaculties();
  displayFaculties(facultyList);
  displayFacultiesinSelect(facultyList);

  let studentList = await getStudents();
  displayStudents(studentList);

  toggleSwitches.forEach((swit) => {
    swit.addEventListener("click", (e) => {
      const divToToggle = e.target.parentElement.nextElementSibling;
      divToToggle.classList.contains("hidden")
        ? divToToggle.classList.remove("hidden")
        : divToToggle.classList.add("hidden");
    });
  });

  addFacultyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fname = document.querySelector("#fname");
    const faadhaar = document.querySelector("#faadhaar");
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fname.value,
        aadhaar: Number(faadhaar.value),
      }),
    };
    const result = await apiQuery("/saveFaculty", options);
    alert(result);
  });

  addStudentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const sname = document.querySelector("#sname");
    const saadhaar = document.querySelector("#saadhaar");
    const sfaculty = document.querySelector("#sfaculty");
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: sname.value,
        aadhaar: Number(saadhaar.value),
        faculty: sfaculty.value,
      }),
    };
    const result = await apiQuery("/saveStudent", options);
    alert(result);
  });
});

async function getFaculties() {
  const options = {
    method: "GET",
  };
  return await apiQuery("/getFaculty", options);
}

function displayFaculties(list) {
  const displayDiv = document.querySelector(".faculties .display");
  displayDiv.innerHTML = "";
  list.forEach((item, index) => {
    const div = document.createElement("div");
    const sno = document.createElement("p");
    const name = document.createElement("p");
    const delIcon = document.createElement("i");

    div.classList.add("faculty");
    sno.innerText = index + 1;
    name.innerText = item.name;
    delIcon.classList.add("fa-solid", "fa-trash");
    delIcon.addEventListener("click", () => deleteFaculty(item.id));

    div.append(sno, name, delIcon);
    displayDiv.append(div);
  });
}

function displayFacultiesinSelect(list) {
  // console.log(list);
  const displaySelect = document.querySelector(".addStudent select");
  displaySelect.innerHTML =
    "<option value='' selected disabled>Who will be the faculty?</option>";

  list.forEach((item, index) => {
    const option = document.createElement("option");
    option.innerText = item.name;
    option.value = item.name;
    displaySelect.append(option);
  });
}

async function deleteFaculty(id) {
  const options = {
    method: "DELETE",
  };
  const result = await apiQuery("/deleteFaculty/" + id, options);
  if (result === "Faculty Deleted") {
    let facultyList = await getFaculties();
    displayFaculties(facultyList);
  }
}

function displayStudents(list) {
  // console.log(list);
  const displayDiv = document.querySelector(".students .display");
  displayDiv.innerHTML = "";
  list.forEach((item, index) => {
    const div = document.createElement("div");
    const sno = document.createElement("p");
    const name = document.createElement("p");
    const delIcon = document.createElement("i");

    div.classList.add("faculty");
    sno.innerText = index + 1;
    name.innerText = item.name;
    delIcon.classList.add("fa-solid", "fa-trash");
    delIcon.addEventListener("click", () => deleteStudent(item.id));

    div.append(sno, name, delIcon);
    displayDiv.append(div);
  });
}

async function deleteStudent(id) {
  const options = {
    method: "DELETE",
  };
  const result = await apiQuery("/deleteStudent/" + id, options);
  if (result === "Student Deleted") {
    let studentList = await getStudents();
    displayStudents(studentList);
  }
}

async function getStudents() {
  const options = { method: "GET" };
  return await apiQuery("/getStudent", options);
}

async function apiQuery(endpoint, options = {}) {
  const response = await fetch(APIURL + endpoint, options);
  const result = await response.json();
  return result;
}
