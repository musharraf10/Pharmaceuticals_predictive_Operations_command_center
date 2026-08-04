# Pharmaceuticals Operations Command Center — Client Frontend

A high-performance React web application built with Vite, Tailwind CSS, Lucide icons, and React Query for managing pharmaceutical supply chain operations, inventory, suppliers, production batches, and predictive analytics.

---

## 📁 Frontend Architecture & Directory Structure

```text
client/src/
├── api/                  # Axios HTTP client configuration & interceptors
├── components/
│   ├── layout/           # PageContainer, PageHeader, AppLayout, Header, Sidebar
│   └── ui/               # Reusable UI component library (Badge, Button, Card, DataTable,
│                         # EmptyState, Input, KPICard, Loader, Modal, Select, StatusBadge)
├── constants/            # API endpoints, query keys, and sidebar navigation configs
├── context/              # LayoutContext & ThemeContext (Light/Dark mode & Sidebar states)
├── hooks/                # Custom React Query hooks (useSuppliers, useProducts, useInventory, etc.)
├── pages/                # Operational view screens & page components
│   ├── Approvals/        # Workflow approval management
│   ├── Auth/             # Authentication & Login page
│   ├── Complaints/       # Quality complaints & issue tracking
│   ├── Dashboard/        # Centralized command center & KPI charts
│   ├── Forecast/         # AI demand forecasting & trend visualization
│   ├── Inventory/        # Inventory items & stock management
│   ├── NotFound/         # Theme-aware 404 Not Found error page
│   ├── Orders/           # Order placement & fulfillment tracking
│   ├── Production/       # Production batch planning & execution
│   ├── Products/         # Product catalog management
│   ├── Reports/          # Exportable analytics & operational reports
│   ├── Suppliers/        # Supplier network & vendor management
│   ├── Tasks/            # Team task management & assignment
│   ├── Unauthorized/     # Theme-aware Access Denied (403) page
│   └── Users/            # User account & role management
├── routes/               # Routing setup (AppRoutes, ProtectedRoute, PublicRoute, RoleRoute)
├── services/             # API service layer (supplier.service, product.service, etc.)
└── utils/                # Helper utilities (cn, formatDate, exportCsv, statusConfig)
```

---

## 🚀 Key Pages & Recent Implementation Details

### 1. Suppliers Module (`src/pages/Suppliers/Suppliers.jsx`)
- **Updated Schema Support**: Fully integrated new fields (`name`, `contactPerson`, `email`, `phone`, `address`, `rating`, `deliveryDays`, `status`).
- **Responsive DataTable**: Displays vendor name, contact person, email, phone, truncated address, rating stars, delivery lead time badge, and status pill.
- **Multi-Field Search**: Client-side & backend search across `name`, `contactPerson`, `email`, `phone`, `address`, and `status`.
- **Add / Edit Modal**: Form inputs backed by React Hook Form validation with clear inline error feedback.
- **Supplier Detail View Modal**: Inspect complete vendor contact, rating, address, and delivery metrics in a popup view.

### 2. Operations Dashboard (`src/pages/Dashboard/Dashboard.jsx`)
- Executive KPI overview (Total Products, Inventory Items, Active Orders, AI Forecasts, Suppliers, Production Batches, Open Complaints, Pending Tasks).
- Interactive Recharts visualizations (Order Pipeline Bar Chart, Inventory Health Pie Chart, Demand Forecast Trend Area Chart, Production Overview).
- Quick Actions menu and exportable CSV summary reports.

### 3. Theme & UI Components Support (`src/components/ui/`)
- **Theme-Aware EmptyState (`EmptyState.jsx`)**: Supports light and dark mode styles with customizable dashed borders, background, icon badge, title, and description.
- **Theme-Aware Unauthorized (`Unauthorized.jsx`)**: Access denied page with dark mode container, warning badge, and navigation back to dashboard.
- **Theme-Aware NotFound (`NotFound.jsx`)**: 404 error page formatted for full screen with theme background and home navigation button.

---

## 🛠️ Data Flow & State Management

1. **Service Layer**: API requests are formatted in `src/services/` using an Axios instance configured with auth tokens and base URLs.
2. **React Query Hooks**: Data fetching, caching, loading states, and automatic cache invalidations are managed in `src/hooks/`.
3. **Role-Based Protection**: `RoleRoute` ensures only authorized roles (`ADMIN`, `MANAGER`, `ANALYST`, `OPERATOR`) can access specific pages.
