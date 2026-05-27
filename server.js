import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/config", (_req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL || "",
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ""
  });
});

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("select 1");
    res.json({ ok: true, db: "connected" });
  } catch {
    res.status(500).json({ ok: false, db: "disconnected" });
  }
});

app.get("/api/products", async (_req, res) => {
  try {
    const query = `
      select
        p.id,
        p.sku,
        p.name,
        b.name as brand,
        p.category,
        p.condition,
        p.size_label as size,
        p.price_usd as price,
        coalesce(
          json_agg(pi.image_url order by pi.sort_order) filter (where pi.image_url is not null),
          '[]'
        ) as gallery
      from products p
      join brands b on b.id = p.brand_id
      left join product_images pi on pi.product_id = p.id
      where p.is_active = true
      group by p.id, b.name
      order by p.id;
    `;
    const { rows } = await pool.query(query);
    const normalized = rows.map((row) => ({
      id: row.sku,
      name: row.name,
      brand: row.brand,
      category: row.category,
      condition: row.condition,
      size: row.size,
      price: Number(row.price),
      badge: "Кураторский выбор",
      image: row.gallery?.[0] || "",
      gallery: row.gallery || []
    }));
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: "Cannot load products", error: error.message });
  }
});

app.get("/api/orders", async (req, res) => {
  const userEmail = req.query.userEmail || "elena@holand.studio";
  try {
    const query = `
      select
        o.order_number as id,
        u.full_name as client,
        to_char(o.created_at, 'Mon DD, YYYY') as date,
        o.total_usd as amount,
        o.status,
        coalesce(dt.carrier || ' / ' || dt.current_status, 'Без трекинга') as delivery
      from orders o
      join users u on u.id = o.user_id
      left join delivery_tracking dt on dt.order_id = o.id
      where u.email = $1
      order by o.created_at desc;
    `;
    const { rows } = await pool.query(query, [userEmail]);
    res.json(rows.map((row) => ({ ...row, amount: Number(row.amount) })));
  } catch (error) {
    res.status(500).json({ message: "Cannot load orders", error: error.message });
  }
});

app.get("/api/admin/analytics", async (_req, res) => {
  try {
    const [sales, popular] = await Promise.all([
      pool.query("select * from v_sales_analytics order by month desc limit 6"),
      pool.query("select * from v_popular_products limit 4")
    ]);
    res.json({ sales: sales.rows, popular: popular.rows });
  } catch (error) {
    res.status(500).json({ message: "Cannot load analytics", error: error.message });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
