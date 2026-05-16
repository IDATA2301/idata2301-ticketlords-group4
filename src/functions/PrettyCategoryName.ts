/**
 * Changes category name to look prettier by replacing hyphens with spaces and capitalizing the first letter.
 *
 * @param categoryName slugified category name
 * @returns A formatted string
 */
export function prettyCategoryName(categoryName: string): string {
  if (!categoryName) return "";
  return categoryName.replaceAll("-", " ").charAt(0).toUpperCase()
    + categoryName.replaceAll("-", " ").slice(1);
}