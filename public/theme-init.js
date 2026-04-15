(function () {
  try {
    var saved = localStorage.getItem("examprep_theme");
    var theme = saved === "light" ? "light" : "dark";
    if (theme === "dark") document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
