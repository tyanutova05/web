-- PostgreSQL schema for IS_NULL premium resale marketplace
-- Run in DBeaver SQL Editor against a PostgreSQL connection.

begin;

create table if not exists users (
  id bigserial primary key,
  email varchar(255) not null unique,
  full_name varchar(255) not null,
  password_hash varchar(255) not null,
  phone varchar(50),
  role varchar(20) not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists brands (
  id bigserial primary key,
  name varchar(120) not null unique,
  country varchar(120),
  created_at timestamptz not null default now()
);

create table if not exists products (
  id bigserial primary key,
  sku varchar(50) not null unique,
  brand_id bigint not null references brands(id),
  name varchar(255) not null,
  description text,
  category varchar(80) not null,
  condition varchar(40) not null check (condition in ('Pristine', 'Excellent', 'Very Good', 'Good')),
  size_label varchar(30),
  color varchar(50),
  price_usd numeric(12,2) not null check (price_usd >= 0),
  original_price_usd numeric(12,2),
  stock_qty int not null default 1 check (stock_qty >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_images (
  id bigserial primary key,
  product_id bigint not null references products(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 1,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists addresses (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  recipient_name varchar(255) not null,
  line1 varchar(255) not null,
  line2 varchar(255),
  city varchar(120) not null,
  postal_code varchar(30) not null,
  country varchar(120) not null default 'UK',
  created_at timestamptz not null default now()
);

create table if not exists carts (
  id bigserial primary key,
  user_id bigint not null unique references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cart_items (
  id bigserial primary key,
  cart_id bigint not null references carts(id) on delete cascade,
  product_id bigint not null references products(id),
  quantity int not null check (quantity > 0),
  unit_price_usd numeric(12,2) not null check (unit_price_usd >= 0),
  created_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

create table if not exists orders (
  id bigserial primary key,
  order_number varchar(40) not null unique,
  user_id bigint not null references users(id),
  shipping_address_id bigint references addresses(id),
  status varchar(30) not null default 'Processing' check (status in ('Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled', 'Returned')),
  payment_status varchar(30) not null default 'Pending' check (payment_status in ('Pending', 'Paid', 'Failed', 'Refunded')),
  subtotal_usd numeric(12,2) not null check (subtotal_usd >= 0),
  shipping_usd numeric(12,2) not null default 0 check (shipping_usd >= 0),
  tax_usd numeric(12,2) not null default 0 check (tax_usd >= 0),
  total_usd numeric(12,2) not null check (total_usd >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id bigserial primary key,
  order_id bigint not null references orders(id) on delete cascade,
  product_id bigint not null references products(id),
  quantity int not null check (quantity > 0),
  unit_price_usd numeric(12,2) not null check (unit_price_usd >= 0),
  line_total_usd numeric(12,2) not null check (line_total_usd >= 0)
);

create table if not exists delivery_tracking (
  id bigserial primary key,
  order_id bigint not null unique references orders(id) on delete cascade,
  carrier varchar(100),
  tracking_number varchar(100),
  current_status varchar(40) not null default 'Preparing' check (current_status in ('Preparing', 'Packed', 'In Transit', 'Out for Delivery', 'Delivered', 'Issue')),
  expected_delivery_date date,
  last_update timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_products_brand on products(brand_id);
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_price on products(price_usd);
create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_order_items_product on order_items(product_id);

-- Admin analytics views
create or replace view v_sales_analytics as
select
  date_trunc('month', o.created_at) as month,
  count(distinct o.id) as orders_count,
  sum(o.total_usd) as revenue_usd,
  sum(oi.quantity) as items_sold
from orders o
join order_items oi on oi.order_id = o.id
where o.status in ('Paid', 'Shipped', 'Delivered')
group by 1
order by 1;

create or replace view v_popular_products as
select
  p.id,
  p.name,
  b.name as brand_name,
  sum(oi.quantity) as sold_units,
  sum(oi.line_total_usd) as revenue_usd
from order_items oi
join products p on p.id = oi.product_id
join brands b on b.id = p.brand_id
join orders o on o.id = oi.order_id
where o.status in ('Paid', 'Shipped', 'Delivered')
group by p.id, p.name, b.name
order by sold_units desc, revenue_usd desc;

commit;
