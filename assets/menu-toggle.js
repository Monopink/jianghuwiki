const menuControl = document.querySelector("#menu-control");

if (menuControl) {
  const syncMenuState = () => {
    document.body.classList.toggle("menu-open", menuControl.checked);
  };

  menuControl.addEventListener("change", syncMenuState);
  syncMenuState();
}
