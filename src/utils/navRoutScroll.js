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

// =====================================================
// export const handleScrollLinkClick = (sectionId, router, locale = "ru") => {
//   const isHome = router.pathname === "/" || router.pathname === `/${locale}`;

//   const scrollToTarget = () => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       window.scrollTo({
//         top: element.offsetTop - 80,
//         behavior: "smooth",
//       });
//     }
//   };

//   if (!isHome) {
//     // переход на главную
//     const localePath = locale === "ru" ? "/ru" : "";
//     router.push(`/${localePath}`).then(() => {
//       setTimeout(scrollToTarget, 100);
//     });
//   } else {
//     scrollToTarget();
//   }
// };
// =============================================
// export const handleScrollLinkClick = (section, navigate) => {
//   // Проверяем, находимся ли мы не на главной странице ("/")
//   if (window.location.pathname !== '/' || window.location.pathname !== '/ru/') {
//     // Если не на главной странице, переходим на главную
//     if (window.location.pathname === '/') {
//       navigate('/');
//     } else {
//       navigate('/ru/');
//     }

//     // После небольшой задержки выполняем прокрутку до нужной секции
//     setTimeout(() => {
//       const targetElement = document.getElementById(section);
//       if (targetElement) {
//         window.scrollTo({
//           top: targetElement.offsetTop - 30,
//           behavior: 'smooth',
//         });
//       }
//     }, 100); // Настройте продолжительность задержки при необходимости
//   } else {
//     // Если уже на главной странице, выполняем прокрутку до нужной секции
//     const targetElement = document.getElementById(section);
//     if (targetElement) {
//       targetElement.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start',
//         inline: 'nearest',
//       });
//     }
//   }
// };
// utils/handleScrollLinkClick.js
