-- Demo data for IS_NULL schema (PostgreSQL)
-- Run after schema.sql

begin;

insert into users (email, full_name, password_hash, role)
values
  ('elena@holand.studio', 'Elena Holland', 'demo_hash_1', 'customer'),
  ('admin@is-null.store', 'IS_NULL Admin', 'demo_hash_admin', 'admin')
on conflict (email) do nothing;

insert into brands (name, country)
values
  ('Saint Laurent', 'France'),
  ('Prada', 'Italy'),
  ('Loewe', 'Spain'),
  ('Gucci', 'Italy'),
  ('Celine', 'France')
on conflict (name) do nothing;

insert into products (sku, brand_id, name, description, category, condition, size_label, color, price_usd, original_price_usd, stock_qty)
select 'PRD-1001', b.id, 'Sac de Jour Nano', 'Structured leather mini bag, authenticated.', 'Bags', 'Excellent', 'OS', 'Black', 2850, 3400, 1 from brands b where b.name = 'Saint Laurent'
union all
select 'PRD-1002', b.id, 'Spazzolato Leather Pump', 'Pointed leather pumps.', 'Shoes', 'Pristine', '38', 'Burgundy', 850, 1200, 1 from brands b where b.name = 'Prada'
union all
select 'PRD-1003', b.id, 'Small Puzzle Bag', 'Iconic geometric puzzle bag.', 'Bags', 'Excellent', 'OS', 'Tan', 1900, 2500, 1 from brands b where b.name = 'Loewe'
union all
select 'PRD-1004', b.id, 'Oversized Square Acetate', 'Oversized acetate sunglasses.', 'Accessories', 'Very Good', 'OS', 'Black', 340, 520, 2 from brands b where b.name = 'Gucci'
union all
select 'PRD-1005', b.id, 'Galleria Saffiano', 'Saffiano leather top-handle bag.', 'Bags', 'Excellent', 'OS', 'Navy', 2400, 3150, 1 from brands b where b.name = 'Prada'
union all
select 'PRD-1006', b.id, 'Triomphe Wallet', 'Classic triomphe wallet.', 'Accessories', 'Pristine', 'OS', 'Brown', 790, 980, 3 from brands b where b.name = 'Celine'
on conflict (sku) do nothing;

insert into product_images (product_id, image_url, sort_order, is_cover)
select p.id, './assets/Sac%20de%20Jour%20Nano1.webp', 1, true from products p where p.sku = 'PRD-1001'
union all select p.id, './assets/Sac%20de%20Jour%20Nano2.webp', 2, false from products p where p.sku = 'PRD-1001'
union all select p.id, './assets/Sac%20de%20Jour%20Nano3.webp', 3, false from products p where p.sku = 'PRD-1001'
union all select p.id, './assets/Sac%20de%20Jour%20Nano4.webp', 4, false from products p where p.sku = 'PRD-1001'
union all select p.id, './assets/Prada%20%20Spazzolato%20Leather%20Pump1.webp', 1, true from products p where p.sku = 'PRD-1002'
union all select p.id, './assets/Prada%20%20Spazzolato%20Leather%20Pump2.webp', 2, false from products p where p.sku = 'PRD-1002'
union all select p.id, './assets/Prada%20%20Spazzolato%20Leather%20Pump3.webp', 3, false from products p where p.sku = 'PRD-1002'
union all select p.id, './assets/Loewe%20%20Small%20Puzzle%20Bag1.webp', 1, true from products p where p.sku = 'PRD-1003'
union all select p.id, './assets/Loewe%20%20Small%20Puzzle%20Bag2.webp', 2, false from products p where p.sku = 'PRD-1003'
union all select p.id, './assets/Loewe%20%20Small%20Puzzle%20Bag3.webp', 3, false from products p where p.sku = 'PRD-1003'
union all select p.id, './assets/Gucci%20%20Oversized%20Square%20Acetate%201.webp', 1, true from products p where p.sku = 'PRD-1004'
union all select p.id, './assets/Prada%20%20Galleria%20Saffiano1.webp', 1, true from products p where p.sku = 'PRD-1005'
union all select p.id, './assets/Celine%20%20Triomphe%20Wallet1.webp', 1, true from products p where p.sku = 'PRD-1006';

insert into addresses (user_id, recipient_name, line1, city, postal_code, country)
select u.id, 'Elena Holland', '34 Bruton St', 'London', 'W1J 6QX', 'UK'
from users u
where u.email = 'elena@holand.studio'
on conflict do nothing;

insert into carts (user_id)
select u.id from users u where u.email = 'elena@holand.studio'
on conflict (user_id) do nothing;

insert into cart_items (cart_id, product_id, quantity, unit_price_usd)
select c.id, p.id, 1, p.price_usd
from carts c
join users u on u.id = c.user_id and u.email = 'elena@holand.studio'
join products p on p.sku in ('PRD-1001', 'PRD-1003')
on conflict (cart_id, product_id) do nothing;

insert into orders (order_number, user_id, shipping_address_id, status, payment_status, subtotal_usd, shipping_usd, tax_usd, total_usd)
select
  'EC-89231',
  u.id,
  a.id,
  'Shipped',
  'Paid',
  2450.00,
  0.00,
  196.00,
  2646.00
from users u
join addresses a on a.user_id = u.id
where u.email = 'elena@holand.studio'
on conflict (order_number) do nothing;

insert into order_items (order_id, product_id, quantity, unit_price_usd, line_total_usd)
select o.id, p.id, 1, 2450.00, 2450.00
from orders o
join products p on p.name = 'Sac de Jour Nano'
where o.order_number = 'EC-89231'
on conflict do nothing;

insert into delivery_tracking (order_id, carrier, tracking_number, current_status, expected_delivery_date)
select o.id, 'DHL Express', 'DHL-EC-89231', 'In Transit', current_date + interval '2 day'
from orders o
where o.order_number = 'EC-89231'
on conflict (order_id) do nothing;

commit;
