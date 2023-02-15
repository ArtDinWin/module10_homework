/* 
Модуль 10.3 Работа с SVG  Задание 1. 
Сверстайте кнопку, которая будет содержать в себе icon_01 (как в примере в последнем видео). При клике на кнопку иконка должна меняться на icon_02. Повторный клик меняет иконку обратно.
 */
const btn = document.querySelector("#button");
const btn_icon = btn.querySelector(".btn_icon");
const icon1 = `<path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-5.904-2.854a.5.5 0 1 1 .707.708L6.707 9.95h2.768a.5.5 0 1 1 0 1H5.5a.5.5 0 0 1-.5-.5V6.475a.5.5 0 1 1 1 0v2.768l4.096-4.097z" />`;
const icon2 = `<path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-5.904-2.803a.5.5 0 1 1 .707.707L6.707 10h2.768a.5.5 0 0 1 0 1H5.5a.5.5 0 0 1-.5-.5V6.525a.5.5 0 0 1 1 0v2.768l4.096-4.096z"/>`;

btn.addEventListener("click", () => {
  btn_icon.classList.toggle("icon2");
  displayIcon();
});

function displayIcon() {
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" >
    ${btn_icon.matches(".icon2") ? icon2 : icon1}
  </svg>`;
  btn_icon.innerHTML = icon;
}
