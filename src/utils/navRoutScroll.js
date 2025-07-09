//скрол при переходе на главную с другой страницы
export const handleScrollLinkClick = (sectionId, router) => {
  const isHome = location.pathname === "/";

  const scrollToTarget = () => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (!isHome) {
    // Навигация без then
    router.push("/");

    // Ждём немного и пробуем скролл
    setTimeout(scrollToTarget, 300); // увеличить таймер до 300мс для стабильности
  } else {
    scrollToTarget();
  }
};
