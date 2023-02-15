/* 
10.6 Event Source, WebSocket. Задание 3.
Реализовать чат на основе эхо-сервера wss://echo-ws-service.herokuapp.com.
Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить».

При клике на кнопку «Отправить» сообщение должно появляться в окне переписки.
Эхо-сервер будет отвечать вам тем же сообщением, его также необходимо выводить в чат:
Добавить в чат механизм отправки гео-локации:

При клике на кнопку «Гео-локация» необходимо отправить данные серверу и в чат вывести ссылку на https://www.openstreetmap.org/ с вашей гео-локацией. Сообщение, которое отправит обратно эхо-сервер, не выводить.
 */

const wsUri = "wss://echo-ws-service.herokuapp.com/";
const btnMessage = document.querySelector(".btn-message");
const btnGeo = document.querySelector(".btn-geo");
const btnDisconnect = document.querySelector(".btn-disconnect");
const content = document.querySelector(".content");
const input = document.querySelector("#input");
let connectStatus = false;
let geoStatus = false;
let websocket;

function pageLoaded() {
  // функция вывода информации в чат
  function writeInfo(info, from = "none") {
    const message = document.createElement("p");
    if (info == "CONNECTED") {
      message.style.cssText = "color:green;text-align: center;";
      message.innerText = "*** Соединение УСТАНОВЛЕНО ***";
      console.log(`%c${message.innerText}`, "color: green;");
    } else if (info == "DISCONNECTED") {
      message.style.cssText = "color:red;text-align: center;";
      message.innerText = "*** Соединение РАЗОРВАНО ***";
      console.log(`%c${message.innerText}`, "color: red;");
    } else {
      const contentMessage = document.createElement("span");
      if (from == "client") {
        message.classList.add("content-client");
        contentMessage.classList.add("message");
        contentMessage.classList.add("message-client");
        contentMessage.innerHTML = `${info}`;
        message.append(contentMessage);
        console.log("client: " + info);
      } else if (from == "server") {
        message.classList.add("content-server");
        contentMessage.classList.add("message");
        contentMessage.classList.add("message-server");
        contentMessage.innerHTML = `${info}`;
        message.append(contentMessage);
        console.log("server: " + info);
      } else {
        message.style.cssText = "text-align: center;";
        message.innerHTML = `${info}`;
        console.log("info: " + info);
      }
    }
    content.append(message);
  }

  // функция установки соединения по кнопке .btn-disconnect
  function toggleConnect() {
    connectStatus
      ? ((connectStatus = !connectStatus), closeConnect())
      : ((connectStatus = !connectStatus),
        btnDisconnect.classList.toggle("active"),
        openConnect());
    if (connectStatus != false) {
      btnGeo.removeAttribute("disabled");
      if (input.value != "") {
        btnMessage.removeAttribute("disabled");
      } else {
        btnMessage.setAttribute("disabled", "true");
      }
    } else {
      btnMessage.setAttribute("disabled", "true");
      btnGeo.setAttribute("disabled", "true");
    }
  }

  // функция установки соединения
  function openConnect() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function (evt) {
      writeInfo("CONNECTED");
      connectStatus = true;
      btnDisconnect.classList.add("active");
      btnGeo.removeAttribute("disabled");
    };
    websocket.onclose = function (evt) {
      writeInfo("DISCONNECTED");
      connectStatus = false;
      btnDisconnect.classList.remove("active");
    };
    websocket.onmessage = function (evt) {
      if (!geoStatus) {
        writeInfo(evt.data, "server");
      } else {
        console.log("server RESPONCE GEO: ", evt.data);
        geoStatus = !geoStatus;
      }
    };
    websocket.onerror = function (evt) {
      writeInfo(
        '<span style="color: red;">ERROR:</span> ' + evt.data,
        "server"
      );
    };
  }

  // функция закрытия соединения
  function closeConnect() {
    websocket.close();
    websocket = null;
  }

  // функция отправки сообщения на сервер
  function sendMessage(message, href = "") {
    if (message) {
      if (href == "") {
        writeInfo(message, "client");
        websocket.send(message);
      } else {
        writeInfo(message, "client");
        websocket.send(href);
      }
    }
  }

  // Функция, выводящая текст об ошибке при определении местоположения
  const errorGeo = () => {
    writeInfo("Невозможно получить ваше местоположение!", "server");
  };

  // Функция, срабатывающая при успешном получении геолокации
  const successGeo = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    let mapLink = document.createElement("a");
    mapLink.setAttribute(
      "href",
      `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
    );
    mapLink.setAttribute("target", "_blank");
    mapLink.textContent = "Гео-локация";
    console.log(`Широта: ${latitude} °, Долгота: ${longitude} °`);
    if (mapLink.href) {
      geoStatus = true;
      sendMessage(mapLink.outerHTML, mapLink.href);
    }
  };

  // обработка события для кнопки .btn-message
  btnMessage.addEventListener("click", () => {
    sendMessage(input.value);
  });

  // обработка события нажатие на enter на клавиатуре
  document.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
      //checks whether the pressed key is "Enter"
      // console.log(e.target.type);
      if (e.target.type == "search" && input.value) {
        sendMessage(input.value);
      }
    }
  });

  // обработка события для кнопки .btn-geo
  btnGeo.addEventListener("click", () => {
    if (!navigator.geolocation) {
      writeInfo("Geolocation не поддерживается вашим браузером");
    } else {
      writeInfo("Определение местоположения…");
      navigator.geolocation.getCurrentPosition(successGeo, errorGeo);
    }
  });

  // обработка события для кнопки .btn-disconnect
  btnDisconnect.addEventListener("click", toggleConnect);

  // обработка события по изменения значения поля input
  input.addEventListener("input", function () {
    if (this.value && connectStatus != false) {
      btnMessage.removeAttribute("disabled");
    } else {
      btnMessage.setAttribute("disabled", "true");
    }
  });

  // запуск функции установки соединения
  openConnect();
}

// запуск функции pageLoaded
document.addEventListener("DOMContentLoaded", pageLoaded);
