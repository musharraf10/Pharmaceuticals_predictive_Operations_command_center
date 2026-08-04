# 📡 API Documentation

**Base URL**

```
http://localhost:5000/api
```

---

# 🔐 Authentication

## Login

**POST**

```
/auth/login
```

### Request

```json
{
  "email": "admin@gmail.com",
  "password": "Admin@123"
}
```

---

## Logout

**POST**

```
/auth/logout
```

---

## Current User

**GET**

```
/auth/me
```

---

# 👥 User Management

## Create User

**POST**

```
/users
```

### Example

```json
{
  "name": "Rahul Kumar",
  "email": "rahul@test.com",
  "password": "Rahul@123",
  "role": "OPERATOR",
  "department": "Warehouse"
}
```

---

## Get Users

**GET**

```
/users
```

---

## Get User

**GET**

```
/users/:id
```

---

## Update User

**PUT**

```
/users/:id
```

---

## Delete User

**DELETE**

```
/users/:id
```

---

# 📦 Products

## Create Product

**POST**

```
/products
```

```json
{
  "name": "Paracetamol 500mg",
  "sku": "PCM-001",
  "category": "Tablet",
  "manufacturer": "Cipla",
  "description": "Pain Relief Tablet",
  "unitPrice": 15,
  "reorderLevel": 100
}
```

---

## Get Products

**GET**

```
/products
```

---

## Get Product

**GET**

```
/products/:id
```

---

## Update Product

**PUT**

```
/products/:id
```

---

## Delete Product

**DELETE**

```
/products/:id
```

---

# 📦 Inventory

## Create Inventory

**POST**

```
/inventory
```

```json
{
  "product": "<PRODUCT_ID>",
  "quantity": 500,
  "warehouse": "Main Warehouse",
  "location": "Rack A1",
  "expiryDate": "2028-12-31"
}
```

---

## Get Inventory

**GET**

```
/inventory
```

---

## Update Inventory

**PUT**

```
/inventory/:id
```

---

## Update Stock

**PATCH**

```
/inventory/:id/stock
```

```json
{
  "quantity": -20
}
```

---

## Delete Inventory

**DELETE**

```
/inventory/:id
```

---

# 🏭 Suppliers

## Create Supplier

**POST**

```
/suppliers
```

```json
{
  "name": "ABC Pharma",
  "email": "abc@gmail.com",
  "phone": "9876543210",
  "address": "Hyderabad"
}
```

---

## Get Suppliers

**GET**

```
/suppliers
```

---

## Update Supplier

**PUT**

```
/suppliers/:id
```

---

## Delete Supplier

**DELETE**

```
/suppliers/:id
```

---

# 🏭 Production Batches

## Create Batch

**POST**

```
/production-batches
```

```json
{
  "batchNumber": "BATCH-1001",
  "product": "<PRODUCT_ID>",
  "quantity": 500,
  "manufacturedDate": "2026-08-04",
  "expiryDate": "2028-08-04",
  "productionLine": "Line 1",
  "remarks": "First Batch"
}
```

---

## Get Batches

**GET**

```
/production-batches
```

---

## Update Batch

**PUT**

```
/production-batches/:id
```

---

## Update Status

**PATCH**

```
/production-batches/:id/status
```

```json
{
  "status": "IN_PROGRESS"
}
```

---

## Delete Batch

**DELETE**

```
/production-batches/:id
```

---

# 🚚 Orders

## Create Order

**POST**

```
/orders
```

```json
{
  "product": "<PRODUCT_ID>",
  "quantity": 20,
  "customerName": "Apollo Pharmacy",
  "destination": "Hyderabad",
  "expectedDelivery": "2026-08-10"
}
```

---

## Get Orders

**GET**

```
/orders
```

---

## Update Order

**PUT**

```
/orders/:id
```

---

## Update Status

**PATCH**

```
/orders/:id/status
```

```json
{
  "status": "DISPATCHED"
}
```

---

## Delete Order

**DELETE**

```
/orders/:id
```

---

# 🤖 Forecast

## Run Forecast

**POST**

```
/forecast/run
```

---

## Get Forecasts

**GET**

```
/forecast
```

---

## Get Forecast

**GET**

```
/forecast/:id
```

---

# ✅ Tasks

## Create Task

**POST**

```
/tasks
```

```json
{
  "title": "Check Inventory",
  "description": "Verify stock levels",
  "priority": "HIGH",
  "dueDate": "2026-08-10"
}
```

---

## Get Tasks

**GET**

```
/tasks
```

---

## Assign Task

**PATCH**

```
/tasks/:id/assign
```

```json
{
  "assignedTo": "<USER_ID>"
}
```

---

## Update Status

**PATCH**

```
/tasks/:id/status
```

```json
{
  "status": "COMPLETED"
}
```

---

## Delete Task

**DELETE**

```
/tasks/:id
```

---

# ⚠ Complaints

## Create Complaint

**POST**

```
/complaints
```

```json
{
  "title": "Damaged Tablets",
  "description": "Packaging damaged",
  "product": "<PRODUCT_ID>",
  "reportedBy": "Apollo Pharmacy",
  "severity": "HIGH"
}
```

---

## Get Complaints

**GET**

```
/complaints
```

---

## Update Complaint

**PUT**

```
/complaints/:id
```

---

## Update Status

**PATCH**

```
/complaints/:id/status
```

```json
{
  "status": "UNDER_REVIEW"
}
```

---

## Delete Complaint

**DELETE**

```
/complaints/:id
```

---

# ✔ Approval Workflow

## Approve / Reject Forecast

**POST**

```
/approvals
```

```json
{
  "forecast": "<FORECAST_ID>",
  "decision": "APPROVED",
  "reason": "Demand verified"
}
```

---

## Get Approvals

**GET**

```
/approvals
```

---

# 🔔 Notifications

## Get Notifications

**GET**

```
/notifications
```

---

## Mark Read

**PATCH**

```
/notifications/:id/read
```

---

## Mark All Read

**PATCH**

```
/notifications/mark-all-read
```

---

# 📊 Dashboard

## Dashboard Data

**GET**

```
/dashboard
```

---

# 📈 Reports

## Summary

```
GET /reports/summary
```

## Inventory

```
GET /reports/inventory
```

## Orders

```
GET /reports/orders
```

## Production

```
GET /reports/production
```

## Forecast

```
GET /reports/forecast
```

## Tasks

```
GET /reports/tasks
```

## Complaints

```
GET /reports/complaints
```

---

# 📜 Audit Logs

## Get Logs

```
GET /audit-logs
```

---

## Get Log

```
GET /audit-logs/:id
```

---

# 👥 User Roles

| Role         | Permissions                                                       |
| ------------ | ----------------------------------------------------------------- |
| **ADMIN**    | Full System Access                                                |
| **MANAGER**  | Manage Products, Inventory, Orders, Production, Tasks, Complaints |
| **ANALYST**  | Dashboard, Forecasts, Reports, Analytics                          |
| **OPERATOR** | Update Stock, Create Orders, Complete Tasks, Create Complaints    |

---

# 🚀 Technology Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Role-Based Access Control (RBAC)
- REST API
- AI Forecast Service (Rule-Based, Gemini Ready)
