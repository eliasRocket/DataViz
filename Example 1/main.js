console.log("Loading the data ...");

function displayOnScreen(data) {
  const ul = document.getElementsByClassName("habitat-list")[0];
  console.log("ul: ", ul);

  data.forEach((habitat) => {
    //console.log("habitat-name: " + habitat.Habitat_name)
    const li = document.createElement("li");
    li.innerHTML = habitat.Habitat_name;
    ul.appendChild(li);
  });
}

async function fetchData() {
  const url = "data.json";
  let response = await fetch(url);

  if (response.ok) {
    // if HTTP-status is 200-299
    // get the response body (the method explained below)
    let json = await response.json();
    console.log("Finally received the response:");
    console.log("Response: ", json);
    displayOnScreen(json);
  } else {
    alert("HTTP-Error: " + response.status);
  }
}

fetchData();
console.log("This is executed before the asynchronous call is finished");
