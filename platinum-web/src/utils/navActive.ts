export function isNavActive(pathname: string, href: string): boolean {
  const path = pathname.toLowerCase();
  const target = (href || "/").toLowerCase();

  if (target === "/" || target === "") {
    return path === "/";
  }
  if (target === "/catalogo") {
    return (
      path === "/catalogo" ||
      path.startsWith("/catalogo/") ||
      path.startsWith("/producto/") ||
      path.startsWith("/kit/")
    );
  }
  if (target === "/productos") {
    return path.startsWith("/productos");
  }
  if (target === "/boletines") {
    return path === "/boletines" || path.startsWith("/boletines/");
  }
  if (target === "/blogs") {
    return path === "/blogs" || path.startsWith("/blogs/");
  }
  return path === target || path.startsWith(`${target}/`);
}
