const colorWheel = document.querySelector(".color-wheel");
const background = document.querySelector("#background");

function updateColorWheel(tokenData) {
  // select the inner wheel to adjust the rotation
  const innerWheel = colorWheel.querySelector(".inner-wheel");

  // The center is indicating around what point we are rotating
  // The SVG itself has a size of 387.52 (which is visible in the index.hml -> SVGs viewbox: viewBox="0 0 387.52 387.52")
  // We want to rotate exactly around the center of it, so we divide by 2.
  const centerX = 387.52 / 2;
  const centerY = 387.52 / 2;

  // adjust the current rotation
  // innerWheel.style.transform = `rotate(${tokenData.rotation})`;
  innerWheel.setAttribute(
    "transform",
    `rotate(${tokenData.rotation}, ${centerX}, ${centerY})`
  );

  // adjust the position
  const xPosPercentage = tokenData.relativeX * 100;
  const yPosPercentage = tokenData.relativeY * 100;

  const wheelSize = 200; // has to match the size set in style.css
  // Remark: It would be better if this size was save in 1 place, so adjusting it would not break our app...

  colorWheel.style.top = `calc(${yPosPercentage}% - ${wheelSize / 2}px)`;
  colorWheel.style.left = `calc(${xPosPercentage}% - ${wheelSize / 2}px)`;
}

function addColorWheel(tokenData) {
  colorWheel.classList.add("is-visible");
}

function udpateBackground(tokenData) {
  let color;

  // detecting in what quarter of the wheel we are
  if (0 <= tokenData.rotation && tokenData.rotation < 90) {
    color = "yellow";
  } else if (90 <= tokenData.rotation && tokenData.rotation < 180) {
    color = "blue";
  } else if (180 <= tokenData.rotation && tokenData.rotation < 270) {
    color = "red";
  } else if (270 <= tokenData.rotation && tokenData.rotation <= 360) {
    color = "green";
  }
  background.classList.remove(...background.classList); // quick way to remove all classes which are in the classList
  background.classList.add(`is-${color}`);
}

function listenToTokens() {
  const server = `ws://localhost:6050`;
  const ws = new WebSocket(server);

  ws.onopen = () => {
    console.log("🧦 Websocket connection established.");
  };

  ws.onerror = (error) => {
    console.log(`WebSocket error: `, error);
  };
  //ici c'est que pour recevoir les info de l'app donc pas besoin de trop capter
  ws.onmessage = (msg) => {
    let json;

    // sometimes (for example the first message)
    // is no stringified JSON, then we don't want to proceed
    try {
      json = JSON.parse(msg?.data);
    } catch (error) {
      return;
    }

    const data = json.args;
    console.log("🖲️ New data from token: ", data);

    if (json?.type === "/tracker/add") {
      addColorWheel(data);
    } else if (json?.type === "/tracker/update") {
      updateColorWheel(data);
      udpateBackground(data);
    }
  };
}

listenToTokens();
