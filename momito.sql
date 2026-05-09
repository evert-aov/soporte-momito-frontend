--
-- PostgreSQL database dump
--

\restrict cbw6CkQoOPMaIEHfBEh4UTq671sYlj4VVGBQUiTYuOuboHcXdyQeJghq2lCjEEy

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: branch_inventory; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.branch_inventory (
    id integer NOT NULL,
    product_id character varying,
    branch_id integer,
    quantity integer,
    min_stock integer,
    last_updated timestamp without time zone
);


ALTER TABLE public.branch_inventory OWNER TO first_exam;

--
-- Name: branch_inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.branch_inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branch_inventory_id_seq OWNER TO first_exam;

--
-- Name: branch_inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.branch_inventory_id_seq OWNED BY public.branch_inventory.id;


--
-- Name: branches; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.branches (
    id integer NOT NULL,
    name character varying,
    location character varying
);


ALTER TABLE public.branches OWNER TO first_exam;

--
-- Name: branches_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.branches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branches_id_seq OWNER TO first_exam;

--
-- Name: branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.branches_id_seq OWNED BY public.branches.id;


--
-- Name: company_info; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.company_info (
    id integer NOT NULL,
    name character varying,
    legal_name character varying,
    tax_id character varying,
    address character varying,
    city character varying,
    country character varying,
    phone character varying,
    email character varying,
    website character varying,
    logo_url character varying
);


ALTER TABLE public.company_info OWNER TO first_exam;

--
-- Name: company_info_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.company_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_info_id_seq OWNER TO first_exam;

--
-- Name: company_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.company_info_id_seq OWNED BY public.company_info.id;


--
-- Name: crm_interactions; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.crm_interactions (
    id integer NOT NULL,
    customer_id integer,
    user_id integer,
    interaction_type character varying,
    description text,
    interaction_date timestamp without time zone,
    status character varying
);


ALTER TABLE public.crm_interactions OWNER TO first_exam;

--
-- Name: crm_interactions_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.crm_interactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.crm_interactions_id_seq OWNER TO first_exam;

--
-- Name: crm_interactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.crm_interactions_id_seq OWNED BY public.crm_interactions.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    segment character varying,
    commercial_name character varying,
    legal_name character varying,
    tax_id character varying,
    credit_limit numeric,
    pricing_profile integer,
    phone character varying,
    delivery_address character varying,
    registration_date timestamp without time zone
);


ALTER TABLE public.customers OWNER TO first_exam;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO first_exam;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    sales_order_id integer,
    invoice_number character varying,
    issue_date timestamp without time zone,
    total_amount numeric,
    payment_status character varying,
    xml_file_url character varying,
    html_file_path character varying
);


ALTER TABLE public.invoices OWNER TO first_exam;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO first_exam;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: payment_settings; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.payment_settings (
    id integer NOT NULL,
    paypal_email character varying,
    qr_image_url character varying
);


ALTER TABLE public.payment_settings OWNER TO first_exam;

--
-- Name: payment_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.payment_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_settings_id_seq OWNER TO first_exam;

--
-- Name: payment_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.payment_settings_id_seq OWNED BY public.payment_settings.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.permissions OWNER TO first_exam;

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissions_id_seq OWNER TO first_exam;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: product_categories; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.product_categories (
    id integer NOT NULL,
    name character varying,
    parent_id integer
);


ALTER TABLE public.product_categories OWNER TO first_exam;

--
-- Name: product_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.product_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_categories_id_seq OWNER TO first_exam;

--
-- Name: product_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.product_categories_id_seq OWNED BY public.product_categories.id;


--
-- Name: product_supplier; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.product_supplier (
    id integer NOT NULL,
    product_id character varying,
    supplier_id integer,
    supplier_product_name character varying,
    min_qty integer,
    delay integer
);


ALTER TABLE public.product_supplier OWNER TO first_exam;

--
-- Name: product_supplier_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.product_supplier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_supplier_id_seq OWNER TO first_exam;

--
-- Name: product_supplier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.product_supplier_id_seq OWNED BY public.product_supplier.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.products (
    id character varying NOT NULL,
    default_code character varying,
    name character varying,
    active boolean,
    type character varying,
    category_id integer,
    uom_id integer,
    uom_po_id integer,
    list_price numeric,
    standard_price numeric,
    purchase_ok boolean,
    sale_ok boolean,
    taxes_id integer,
    supplier_taxes_id integer,
    image_url character varying
);


ALTER TABLE public.products OWNER TO first_exam;

--
-- Name: purchase_order_lines; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.purchase_order_lines (
    id integer NOT NULL,
    purchase_order_id integer,
    product_id character varying,
    quantity integer,
    unit_price numeric,
    subtotal numeric
);


ALTER TABLE public.purchase_order_lines OWNER TO first_exam;

--
-- Name: purchase_order_lines_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.purchase_order_lines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_order_lines_id_seq OWNER TO first_exam;

--
-- Name: purchase_order_lines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.purchase_order_lines_id_seq OWNED BY public.purchase_order_lines.id;


--
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.purchase_orders (
    id integer NOT NULL,
    supplier_id integer,
    user_id integer,
    issue_date timestamp without time zone,
    estimated_arrival_date timestamp without time zone,
    status character varying,
    total_amount numeric
);


ALTER TABLE public.purchase_orders OWNER TO first_exam;

--
-- Name: purchase_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.purchase_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_orders_id_seq OWNER TO first_exam;

--
-- Name: purchase_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.purchase_orders_id_seq OWNED BY public.purchase_orders.id;


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.role_permissions (
    role_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO first_exam;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying,
    description character varying
);


ALTER TABLE public.roles OWNER TO first_exam;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO first_exam;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: sales_order_lines; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.sales_order_lines (
    id integer NOT NULL,
    sales_order_id integer,
    product_id character varying,
    quantity integer,
    unit_price numeric,
    subtotal numeric
);


ALTER TABLE public.sales_order_lines OWNER TO first_exam;

--
-- Name: sales_order_lines_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.sales_order_lines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_order_lines_id_seq OWNER TO first_exam;

--
-- Name: sales_order_lines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.sales_order_lines_id_seq OWNED BY public.sales_order_lines.id;


--
-- Name: sales_orders; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.sales_orders (
    id integer NOT NULL,
    customer_id integer,
    user_id integer,
    order_date timestamp without time zone,
    status character varying,
    subtotal numeric,
    total_discount numeric,
    total_amount numeric,
    payment_terms character varying,
    source_channel character varying,
    payment_method character varying,
    paypal_order_id character varying,
    guest_email character varying,
    delivery_type character varying,
    contact_name character varying,
    contact_phone character varying,
    delivery_address character varying
);


ALTER TABLE public.sales_orders OWNER TO first_exam;

--
-- Name: sales_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.sales_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_orders_id_seq OWNER TO first_exam;

--
-- Name: sales_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.sales_orders_id_seq OWNED BY public.sales_orders.id;


--
-- Name: shipments; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.shipments (
    id integer NOT NULL,
    sales_order_id integer,
    carrier character varying,
    tracking_number character varying,
    dispatch_date timestamp without time zone,
    estimated_delivery_date timestamp without time zone,
    delivery_status character varying
);


ALTER TABLE public.shipments OWNER TO first_exam;

--
-- Name: shipments_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.shipments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shipments_id_seq OWNER TO first_exam;

--
-- Name: shipments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.shipments_id_seq OWNED BY public.shipments.id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    name character varying,
    company_id integer,
    country_of_origin character varying,
    email character varying
);


ALTER TABLE public.suppliers OWNER TO first_exam;

--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suppliers_id_seq OWNER TO first_exam;

--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- Name: units_of_measure; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.units_of_measure (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.units_of_measure OWNER TO first_exam;

--
-- Name: units_of_measure_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.units_of_measure_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.units_of_measure_id_seq OWNER TO first_exam;

--
-- Name: units_of_measure_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.units_of_measure_id_seq OWNED BY public.units_of_measure.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: first_exam
--

CREATE TABLE public.users (
    id integer NOT NULL,
    role_id integer,
    full_name character varying,
    email character varying,
    password_hash character varying,
    is_active boolean,
    last_login timestamp without time zone,
    branch_id integer,
    customer_id integer
);


ALTER TABLE public.users OWNER TO first_exam;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: first_exam
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO first_exam;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: first_exam
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: branch_inventory id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.branch_inventory ALTER COLUMN id SET DEFAULT nextval('public.branch_inventory_id_seq'::regclass);


--
-- Name: branches id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.branches ALTER COLUMN id SET DEFAULT nextval('public.branches_id_seq'::regclass);


--
-- Name: company_info id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.company_info ALTER COLUMN id SET DEFAULT nextval('public.company_info_id_seq'::regclass);


--
-- Name: crm_interactions id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.crm_interactions ALTER COLUMN id SET DEFAULT nextval('public.crm_interactions_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: payment_settings id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.payment_settings ALTER COLUMN id SET DEFAULT nextval('public.payment_settings_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: product_categories id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.product_categories ALTER COLUMN id SET DEFAULT nextval('public.product_categories_id_seq'::regclass);


--
-- Name: product_supplier id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.product_supplier ALTER COLUMN id SET DEFAULT nextval('public.product_supplier_id_seq'::regclass);


--
-- Name: purchase_order_lines id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.purchase_order_lines ALTER COLUMN id SET DEFAULT nextval('public.purchase_order_lines_id_seq'::regclass);


--
-- Name: purchase_orders id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.purchase_orders ALTER COLUMN id SET DEFAULT nextval('public.purchase_orders_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: sales_order_lines id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.sales_order_lines ALTER COLUMN id SET DEFAULT nextval('public.sales_order_lines_id_seq'::regclass);


--
-- Name: sales_orders id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.sales_orders ALTER COLUMN id SET DEFAULT nextval('public.sales_orders_id_seq'::regclass);


--
-- Name: shipments id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.shipments ALTER COLUMN id SET DEFAULT nextval('public.shipments_id_seq'::regclass);


--
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- Name: units_of_measure id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.units_of_measure ALTER COLUMN id SET DEFAULT nextval('public.units_of_measure_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: branch_inventory; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.branch_inventory (id, product_id, branch_id, quantity, min_stock, last_updated) FROM stdin;
2	PROD002	1	100	10	2026-05-02 12:53:55.207068
4	PROD004	1	2	10	2026-05-05 00:28:58.754485
1	PROD001	1	94	10	2026-05-05 02:55:01.527349
3	PROD003	1	98	10	2026-05-05 02:55:01.526206
\.


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.branches (id, name, location) FROM stdin;
1	Sucursal Principal	Santa Cruz, Bolivia
\.


--
-- Data for Name: company_info; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.company_info (id, name, legal_name, tax_id, address, city, country, phone, email, website, logo_url) FROM stdin;
1	TUMOMITO S.A.	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: crm_interactions; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.crm_interactions (id, customer_id, user_id, interaction_type, description, interaction_date, status) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.customers (id, segment, commercial_name, legal_name, tax_id, credit_limit, pricing_profile, phone, delivery_address, registration_date) FROM stdin;
1	B2B	Distribuidora El Buen Sabor	El Buen Sabor S.R.L.	1234567890	50000	\N	+591 70012345	Av. Roca y Coronado, Santa Cruz	2026-05-02 12:53:55.199687
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.invoices (id, sales_order_id, invoice_number, issue_date, total_amount, payment_status, xml_file_url, html_file_path) FROM stdin;
1	2	INV-20260502-00002	2026-05-02 13:14:03.515073	8.5	paid	data:text/xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48SW52b2ljZT48TnVtYmVyPklOVi0yMDI2MDUwMi0wMDAwMjwvTnVtYmVyPjxPcmRlcklkPjI8L09yZGVySWQ+PEFtb3VudD44LjU8L0Ftb3VudD48RGF0ZT4yMDI2LTA1LTAyVDEzOjE0OjAzLjUxNTA2MDwvRGF0ZT48U3RhdHVzPnBhaWQ8L1N0YXR1cz48L0ludm9pY2U+	\N
2	1	INV-20260502-00001	2026-05-02 13:14:54.681039	8.5	paid	data:text/xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48SW52b2ljZT48TnVtYmVyPklOVi0yMDI2MDUwMi0wMDAwMTwvTnVtYmVyPjxPcmRlcklkPjE8L09yZGVySWQ+PEFtb3VudD44LjU8L0Ftb3VudD48RGF0ZT4yMDI2LTA1LTAyVDEzOjE0OjU0LjY4MTAxMTwvRGF0ZT48U3RhdHVzPnBhaWQ8L1N0YXR1cz48L0ludm9pY2U+	\N
3	3	INV-20260502-00003	2026-05-02 13:41:52.85575	8.5	paid	data:text/xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48SW52b2ljZT48TnVtYmVyPklOVi0yMDI2MDUwMi0wMDAwMzwvTnVtYmVyPjxPcmRlcklkPjM8L09yZGVySWQ+PEFtb3VudD44LjU8L0Ftb3VudD48RGF0ZT4yMDI2LTA1LTAyVDEzOjQxOjUyLjg1MzA1NDwvRGF0ZT48U3RhdHVzPnBhaWQ8L1N0YXR1cz48L0ludm9pY2U+	invoices/INV-20260502-00003.html
4	4	INV-20260505-00004	2026-05-05 00:18:46.786192	8.5	paid	invoices/INV-20260505-00004.xml	invoices/INV-20260505-00004.html
5	5	INV-20260505-00005	2026-05-05 01:02:16.05662	5	paid	invoices/INV-20260505-00005.xml	invoices/INV-20260505-00005.html
6	6	INV-20260505-00006	2026-05-05 02:39:10.388405	8.5	paid	invoices/INV-20260505-00006.xml	invoices/INV-20260505-00006.html
7	7	INV-20260505-00007	2026-05-05 02:46:56.170887	13.5	paid	invoices/INV-20260505-00007.xml	invoices/INV-20260505-00007.html
8	17	INV-20260505-00017	2026-05-05 03:08:06.918103	15.0	paid	invoices/INV-20260505-00017.xml	invoices/INV-20260505-00017.html
\.


--
-- Data for Name: payment_settings; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.payment_settings (id, paypal_email, qr_image_url) FROM stdin;
1	momito@business.example.com	
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.permissions (id, name) FROM stdin;
1	view_inventory
2	create_order
3	approve_po
4	manage_users
5	view_reports
\.


--
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.product_categories (id, name, parent_id) FROM stdin;
1	Bebidas	\N
2	Snacks	\N
\.


--
-- Data for Name: product_supplier; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.product_supplier (id, product_id, supplier_id, supplier_product_name, min_qty, delay) FROM stdin;
1	PROD001	1	Coca Cola 2L	10	3
2	PROD002	1	Pepsi 1.5L	10	3
3	PROD003	1	Chips Lay's	10	3
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.products (id, default_code, name, active, type, category_id, uom_id, uom_po_id, list_price, standard_price, purchase_ok, sale_ok, taxes_id, supplier_taxes_id, image_url) FROM stdin;
PROD002	SKU-002	Pepsi 1.5L	t	Storable	1	1	2	7.5	4.5	t	t	\N	\N	\N
PROD003	SKU-003	Chips Lay's	t	Storable	2	1	1	5.0	2.5	t	t	\N	\N	\N
PROD001	SKU-001	Coca Cola 2L	t	Storable	1	1	2	8.5	5.0	t	t	\N	\N	https://storage.googleapis.com/preminens-slbu-p/pim/cc/bo/product-ecommerce-alta/EMB/21075.jpg
PROD004	SKU-004	Datejust	t	Storable	\N	\N	\N	100	80	t	t	\N	\N	
\.


--
-- Data for Name: purchase_order_lines; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.purchase_order_lines (id, purchase_order_id, product_id, quantity, unit_price, subtotal) FROM stdin;
1	1	PROD004	2	80	160
\.


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.purchase_orders (id, supplier_id, user_id, issue_date, estimated_arrival_date, status, total_amount) FROM stdin;
1	1	1	2026-05-02 13:18:50.138919	2026-05-02 00:00:00	received	160
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.role_permissions (role_id, permission_id) FROM stdin;
1	1
1	2
1	3
1	4
1	5
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.roles (id, name, description) FROM stdin;
2	VENDEDOR	Sales representative
1	SUPER_ADMIN	Full system access
3	CLIENTE	Customer portal access
\.


--
-- Data for Name: sales_order_lines; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.sales_order_lines (id, sales_order_id, product_id, quantity, unit_price, subtotal) FROM stdin;
1	1	PROD001	1	8.5	8.5
2	2	PROD001	1	8.5	8.5
3	3	PROD001	1	8.5	8.5
4	4	PROD001	1	8.5	8.5
5	5	PROD003	1	5	5
6	6	PROD001	1	8.5	8.5
7	7	PROD003	1	5	5
8	7	PROD001	1	8.5	8.5
9	8	PROD003	1	5	5
10	8	PROD001	1	8.5	8.5
11	9	PROD003	1	5	5
12	9	PROD001	1	8.5	8.5
13	10	PROD001	1	8.5	8.5
14	11	PROD001	1	8.5	8.5
15	12	PROD001	1	8.5	8.5
16	13	PROD003	1	5	5
17	14	PROD001	1	8.5	8.5
18	15	PROD002	2	7.5	15.0
19	16	PROD002	2	7.5	15.0
20	17	PROD002	2	7.5	15.0
\.


--
-- Data for Name: sales_orders; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.sales_orders (id, customer_id, user_id, order_date, status, subtotal, total_discount, total_amount, payment_terms, source_channel, payment_method, paypal_order_id, guest_email, delivery_type, contact_name, contact_phone, delivery_address) FROM stdin;
7	\N	1	2026-05-05 02:46:16.796702	delivered	13.5	0	13.5	\N	ecommerce	paypal	2B526798C6978673P	admin@tumomito.com	pickup	Super Admin	342432	\N
8	\N	1	2026-05-05 02:53:41.429119	cancelled	13.5	0	13.5	\N	ecommerce	paypal	6PE1970765620192K	admin@tumomito.com	pickup	Super Admin	23345456	\N
9	\N	1	2026-05-05 02:54:12.482072	cancelled	13.5	0	13.5	\N	ecommerce	paypal	4KS930647N428253Y	admin@tumomito.com	pickup	Super Admin	3455345	\N
2	\N	1	2026-05-02 13:13:36.898416	delivered	8.5	0	8.5	\N	ecommerce	paypal	2AK50326HX6572913	admin@tumomito.com	pickup	Super Admin	60962433	\N
10	\N	1	2026-05-05 02:55:30.724309	pending_payment	8.5	0	8.5	\N	ecommerce	paypal	0Y170635AS506281L	admin@tumomito.com	pickup	Super Admin	34232456	\N
11	\N	1	2026-05-05 02:57:20.137263	pending_payment	8.5	0	8.5	\N	ecommerce	paypal	6BP48474P4041564L	admin@tumomito.com	pickup	Super Admin	543534	\N
1	\N	1	2026-05-02 12:54:58.2199	delivered	8.5	0	8.5	\N	ecommerce	qr	\N	\N	pickup	\N	\N	\N
12	\N	1	2026-05-05 02:58:34.40315	pending_payment	8.5	0	8.5	\N	ecommerce	paypal	2DE27034UP333981J	admin@tumomito.com	pickup	Super Admin	12345678	\N
13	\N	1	2026-05-05 02:59:52.313338	pending_payment	5	0	5	\N	ecommerce	paypal	1GB26400P9446780M	admin@tumomito.com	pickup	Super Admin	12345785	\N
3	\N	1	2026-05-02 13:41:33.330746	delivered	8.5	0	8.5	\N	ecommerce	paypal	7G1193563A547924J	admin@tumomito.com	pickup	Super Admin	60962433	\N
14	\N	1	2026-05-05 03:02:19.791967	pending_payment	8.5	0	8.5	\N	ecommerce	paypal	6U4647424Y906472F	admin@tumomito.com	pickup	Super Admin	32424	\N
15	\N	1	2026-05-05 03:03:24.664017	pending_payment	15.0	0	15.0	\N	ecommerce	paypal	71613562EH382323D	admin@tumomito.com	pickup	Super Admin	32432	\N
16	\N	1	2026-05-05 03:05:16.746141	pending_payment	15.0	0	15.0	\N	ecommerce	paypal	78990807N1039712M	admin@tumomito.com	pickup	Super Admin	424324	\N
4	\N	1	2026-05-05 00:18:08.394127	delivered	8.5	0	8.5	\N	ecommerce	paypal	7JS932206P156630D	admin@tumomito.com	pickup	Super Admin	60962433	\N
17	\N	1	2026-05-05 03:07:49.580313	paid	15.0	0	15.0	\N	ecommerce	paypal	90S45247NB4151617	admin@tumomito.com	pickup	Super Admin	32424	\N
5	\N	3	2026-05-05 01:01:56.742679	delivered	5	0	5	\N	ecommerce	paypal	6AH213932K532863R	joah@gmail.com	pickup	Joah L	60962433	\N
6	\N	1	2026-05-05 02:34:20.622542	delivered	8.5	0	8.5	\N	ecommerce	paypal	97F79209SE419150P	admin@tumomito.com	pickup	Super Admin	609423452	\N
\.


--
-- Data for Name: shipments; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.shipments (id, sales_order_id, carrier, tracking_number, dispatch_date, estimated_delivery_date, delivery_status) FROM stdin;
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.suppliers (id, name, company_id, country_of_origin, email) FROM stdin;
1	Proveedor Alfa S.R.L.	\N	Bolivia	ventas@alfa.com
\.


--
-- Data for Name: units_of_measure; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.units_of_measure (id, name) FROM stdin;
1	Unidad
2	Docena
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: first_exam
--

COPY public.users (id, role_id, full_name, email, password_hash, is_active, last_login, branch_id, customer_id) FROM stdin;
1	1	Super Admin	admin@tumomito.com	$2b$12$ZXqp/5jDI77B.sWnllaBTuOR7ICsNOovLvTRvFxX3jGaDieToTgZ.	t	\N	1	\N
2	2	Juan Vendedor	vendedor@tumomito.com	$2b$12$89LSrxwsmcmwx7OXrfYqh.xKSevB.ohHwfIDv3o4KkpiUeUNCp7/C	t	\N	1	\N
3	3	Joah	joah@gmail.com	$2b$12$sgXZkeLkcezV11JDt.lf3OJcD50WfxdwmAGQL14x/Tnxcv64rk5F2	t	\N	\N	\N
\.


--
-- Name: branch_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.branch_inventory_id_seq', 4, true);


--
-- Name: branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.branches_id_seq', 1, true);


--
-- Name: company_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.company_info_id_seq', 1, true);


--
-- Name: crm_interactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.crm_interactions_id_seq', 1, false);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.customers_id_seq', 1, true);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.invoices_id_seq', 8, true);


--
-- Name: payment_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.payment_settings_id_seq', 1, true);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.permissions_id_seq', 5, true);


--
-- Name: product_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.product_categories_id_seq', 2, true);


--
-- Name: product_supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.product_supplier_id_seq', 3, true);


--
-- Name: purchase_order_lines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.purchase_order_lines_id_seq', 1, true);


--
-- Name: purchase_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.purchase_orders_id_seq', 1, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- Name: sales_order_lines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.sales_order_lines_id_seq', 20, true);


--
-- Name: sales_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.sales_orders_id_seq', 17, true);


--
-- Name: shipments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.shipments_id_seq', 1, false);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 1, true);


--
-- Name: units_of_measure_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.units_of_measure_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: first_exam
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: branch_inventory branch_inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.branch_inventory
    ADD CONSTRAINT branch_inventory_pkey PRIMARY KEY (id);


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- Name: company_info company_info_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.company_info
    ADD CONSTRAINT company_info_pkey PRIMARY KEY (id);


--
-- Name: crm_interactions crm_interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.crm_interactions
    ADD CONSTRAINT crm_interactions_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: payment_settings payment_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.payment_settings
    ADD CONSTRAINT payment_settings_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- Name: product_supplier product_supplier_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.product_supplier
    ADD CONSTRAINT product_supplier_pkey PRIMARY KEY (id);


--
-- Name: products products_default_code_key; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_default_code_key UNIQUE (default_code);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: purchase_order_lines purchase_order_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.purchase_order_lines
    ADD CONSTRAINT purchase_order_lines_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sales_order_lines sales_order_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.sales_order_lines
    ADD CONSTRAINT sales_order_lines_pkey PRIMARY KEY (id);


--
-- Name: sales_orders sales_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_pkey PRIMARY KEY (id);


--
-- Name: shipments shipments_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: units_of_measure units_of_measure_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.units_of_measure
    ADD CONSTRAINT units_of_measure_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: branch_inventory branch_inventory_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.branch_inventory
    ADD CONSTRAINT branch_inventory_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: branch_inventory branch_inventory_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.branch_inventory
    ADD CONSTRAINT branch_inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: crm_interactions crm_interactions_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.crm_interactions
    ADD CONSTRAINT crm_interactions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: crm_interactions crm_interactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.crm_interactions
    ADD CONSTRAINT crm_interactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: invoices invoices_sales_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_sales_order_id_fkey FOREIGN KEY (sales_order_id) REFERENCES public.sales_orders(id);


--
-- Name: product_categories product_categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.product_categories(id);


--
-- Name: product_supplier product_supplier_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.product_supplier
    ADD CONSTRAINT product_supplier_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_supplier product_supplier_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.product_supplier
    ADD CONSTRAINT product_supplier_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_categories(id);


--
-- Name: products products_uom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_uom_id_fkey FOREIGN KEY (uom_id) REFERENCES public.units_of_measure(id);


--
-- Name: products products_uom_po_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_uom_po_id_fkey FOREIGN KEY (uom_po_id) REFERENCES public.units_of_measure(id);


--
-- Name: purchase_order_lines purchase_order_lines_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.purchase_order_lines
    ADD CONSTRAINT purchase_order_lines_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: purchase_order_lines purchase_order_lines_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.purchase_order_lines
    ADD CONSTRAINT purchase_order_lines_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id);


--
-- Name: purchase_orders purchase_orders_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: purchase_orders purchase_orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id);


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: sales_order_lines sales_order_lines_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.sales_order_lines
    ADD CONSTRAINT sales_order_lines_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: sales_order_lines sales_order_lines_sales_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.sales_order_lines
    ADD CONSTRAINT sales_order_lines_sales_order_id_fkey FOREIGN KEY (sales_order_id) REFERENCES public.sales_orders(id);


--
-- Name: sales_orders sales_orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: sales_orders sales_orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: shipments shipments_sales_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_sales_order_id_fkey FOREIGN KEY (sales_order_id) REFERENCES public.sales_orders(id);


--
-- Name: users users_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: users users_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: first_exam
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- PostgreSQL database dump complete
--

\unrestrict cbw6CkQoOPMaIEHfBEh4UTq671sYlj4VVGBQUiTYuOuboHcXdyQeJghq2lCjEEy

