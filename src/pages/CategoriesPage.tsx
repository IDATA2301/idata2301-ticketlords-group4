import {useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import type Category from "../util/dtos/Category.ts";
import {API_BASE_URL} from "../config.ts";
import "../css/CategoriesPage.css";

function slugifyCategoryName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/categories/`);
      if (!response.ok) {
        setError(`Failed to load categories (${response.status})`);
        return;
      }
      const data = (await response.json()) as Category[];
      setCategories(data);
    } catch {
      setError("Network error while loading categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();

    const onFocus = () => fetchCategories();
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("focus", onFocus)
    };
  }, []);

  const sorted = useMemo(() => {
    return [...categories].sort((a, b) =>
      a.categoryName.localeCompare(b.categoryName)
    );
  }, [categories]);

  return (
    <div className="categories-page">
      <h1>Categories</h1>

      {loading && <p>Loading…</p>}
      {error && <p style={{color: "crimson"}}>{error}</p>}

      {!loading && !error && sorted.length === 0 && (
        <p>No categories available.</p>
      )}

      <div className="categories-list">
        {sorted.map((cat) => {
          const slug = slugifyCategoryName(cat.categoryName);
          return (
            <Link
              key={cat.categoryId}
              className="category-card"
              to={`/events/category/${encodeURIComponent(slug)}`}
            >
              {cat.categoryName}
            </Link>
          );
        })}
      </div>
    </div>
  );


}