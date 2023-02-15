/* 
Модуль 10.5 Screen size  Задание 2.
Сверстайте кнопку, клик на которую будет выводить данные о размерах экрана с помощью alert. 
*/

const btn = document.querySelector(".button");
btn.addEventListener("click", () => {
  alert(
    `Ширина монитора экрана: ${window.screen.width}px, Высота экрана: ${window.screen.height}px`
  );
  const windowInnerWidth = window.innerWidth;
  const windowInnerHeight = window.innerHeight;
  alert(
    `Ширина viewport ${windowInnerWidth}px, высота viewport ${windowInnerHeight}px (с учётом полосы прокрутки).`
  );
  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;
  alert(
    `Ширина viewport ${clientWidth}px, высота viewport ${clientHeight}px (без учёта полосы прокрутки).`
  );
});
