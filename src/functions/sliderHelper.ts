/** export function scrollByOne(
  container: HTMLElement | null,
  direction: "left" | "right",
) {
  if (container) {
    const item = container.querySelector(
      ".category-item",
    ) as HTMLElement | null;
    if (item) {
      const scrollAmount = item.clientWidth;
      container.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  }
}

export function slide(
  container: HTMLElement | null,
  direction: "left" | "right",
) {
  if (container) {
    const scrollAmount = 200; // Adjust as needed
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }
}
**/