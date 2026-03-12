# Team Asset Management App Specification

## 1. Product Overview

A simple and practical asset management app for a team.

The app manages:

* **Personal assets** owned by individual team members
* **Shared team assets** used by the whole team
* **Role-based permissions** for asset operations
* **Controlled master data** for item names, so users mostly choose from predefined options instead of creating random names
* **Simple pricing management** by storing a price value for each asset record

The product should be **easy to use, fast to build, and easy to maintain** without unnecessary complexity.

---

## 2. Main Goals

The app should help the team:

* Know **what assets exist**
* Know **who owns or manages each asset**
* Know **whether an asset is personal or team-owned**
* Control **who can edit which assets**
* Keep asset records consistent by using selectable item names
* Record **price information** for every asset row
* Support future growth without making the first version too complex

---

## 3. Asset Types

The system supports two ownership types.

| Ownership Type | Meaning                                   |
| -------------- | ----------------------------------------- |
| Personal Asset | Asset belongs to one specific team member |
| Team Asset     | Asset belongs to the team and is shared   |

Examples:

| Asset   | Ownership Type |
| ------- | -------------- |
| Camera  | Personal Asset |
| Laptop  | Personal Asset |
| Router  | Team Asset     |
| Printer | Team Asset     |
| TV      | Team Asset     |

---

## 4. Roles and Permissions

The system supports three roles.

### 4.1 Product Administrator

This is the highest permission level.

Permissions:

* Can manage team members
* Can assign or change roles
* Can view all assets
* Can add any asset
* Can edit any asset
* Can delete any asset
* Can manage item master data
* Can manage category or status options if needed

Typical user:

* Equipment manager
* Team admin
* Operations owner

---

### 4.2 Asset Manager

This role manages assets but cannot manage people roles.

Permissions:

* Cannot manage team member roles
* Can view all assets
* Can add any asset
* Can edit any asset
* Can delete any asset
* Can manage item master data

Typical user:

* Staff member responsible for equipment
* Team operations member

---

### 4.3 Team Member

This is a regular user role.

Permissions:

* Can view all assets
* Can add own personal assets
* Can edit own personal assets
* Can delete own personal assets
* Cannot edit other members' personal assets
* Cannot delete other members' assets
* Can view team assets
* Cannot manage roles
* Cannot manage item master data

Typical user:

* Normal team member

---

## 5. Permission Matrix

| Action                  | Product Administrator | Asset Manager |     Team Member |
| ----------------------- | --------------------: | ------------: | --------------: |
| View all assets         |                   Yes |           Yes |             Yes |
| Add asset               |                   Yes |           Yes | Own assets only |
| Edit asset              |                   Yes |           Yes | Own assets only |
| Delete asset            |                   Yes |           Yes | Own assets only |
| Manage user roles       |                   Yes |            No |              No |
| Manage item master data |                   Yes |           Yes |              No |

---

## 6. Core Asset Table

The asset table should follow the spreadsheet-style structure you already use, with one important addition: **Price**.

### Required Columns

| Column            | Description                                                   |
| ----------------- | ------------------------------------------------------------- |
| Item Name         | Main asset name, chosen from predefined options in most cases |
| Category          | Asset category                                                |
| Specification     | Model, brand, size, or technical details                      |
| Quantity          | Number of units                                               |
| Price             | Price for the asset row                                       |
| Status            | Current condition or usage state                              |
| Receiver          | Person responsible or who registered/received the asset       |
| Registration Date | Date the row was created                                      |
| Notes             | Additional information                                        |
| Ownership Type    | Personal or Team                                              |
| Owner             | Team member name, or Team for shared assets                   |

### Notes about Price

The app needs a **Price** column for every item row.

Recommended rule for MVP:

* `Price` = total price for the row
* If needed later, add:

  * `Unit Price`
  * `Total Price`

For the first version, the simplest structure is:

| Field | Meaning                         |
| ----- | ------------------------------- |
| Price | Total cost of this asset record |

Example:

| Item Name | Quantity | Price |
| --------- | -------: | ----: |
| Camera    |        2 |  1200 |
| Monitor   |        3 |   900 |
| Router    |        1 |   150 |

Optional future improvement:

* Add currency field
* Add purchase date
* Add vendor/supplier

---

## 7. Item Name Master Data

Most item names should be selected from predefined options.

This means:

* Users should mostly **choose from dropdown options**
* Users should not freely type new item names during normal asset entry
* New asset rows can still be added
* The item list itself can be maintained by authorized roles

### Who can manage item names?

| Role                  | Can manage item names? |
| --------------------- | ---------------------- |
| Product Administrator | Yes                    |
| Asset Manager         | Yes                    |
| Team Member           | No                     |

### Initial Item Name Options

Based on the sheet and screenshot, the initial selectable items can include:

* Camera
* POE Hub
* Copier
* UPS
* Desktop Computer
* Monitor
* Keyboard
* Router
* WiFi
* Toyota / Vehicle-related entry if needed
* Printer
* TV
* Vacuum Cleaner
* Trash Bin
* Scale
* Whiteboard
* Clock
* Storage Cabinet
* Desk
* TV Mount
* Riveter
* Rolling Chair
* Chair
* Background Screen

Not every item must be used. Unnecessary items can be ignored.

### Item Name Management Rules

* Product Administrator and Asset Manager can add, edit, or remove item options
* Team members cannot manage item options
* When creating an asset row, normal users choose from the available options
* If the team later decides to block deletions, item names can be marked as inactive instead of fully deleted

---

## 8. Status Options

Status should also use predefined values for consistency.

Recommended status options:

* In Use
* Stored
* Under Repair
* Broken
* Lost
* Disposed

This helps:

* filtering
* reporting
* consistent data entry

---

## 9. Ownership Rules

Each asset row must clearly identify whether it is personal or team-owned.

### Ownership Type Values

* Personal
* Team

### Owner Rules

* If `Ownership Type = Personal`, then `Owner` must be a team member
* If `Ownership Type = Team`, then `Owner` can be set to `Team`

Example:

| Item Name | Ownership Type | Owner |
| --------- | -------------- | ----- |
| Camera    | Personal       | Alice |
| Laptop    | Personal       | Bob   |
| Router    | Team           | Team  |
| TV        | Team           | Team  |

---

## 10. Main User Flows

### 10.1 Add Asset

User fills:

* Item Name
* Category
* Specification
* Quantity
* Price
* Status
* Ownership Type
* Owner
* Receiver
* Registration Date
* Notes

### 10.2 Edit Asset

User can edit fields depending on role.

### 10.3 Delete Asset

For the first version, simple delete is acceptable.

Better later version:

* soft delete
* archived state
* disposal history

### 10.4 View Asset List

Users should be able to:

* search
* filter
* sort
* open detail view

---

## 11. Search and Filter

Recommended filters for convenience:

* Item Name
* Category
* Owner
* Ownership Type
* Status
* Registration Date
* Receiver

Recommended search targets:

* Item Name
* Specification
* Notes
* Owner

---

## 12. Suggested UI Structure

### 12.1 Main Pages

1. Login
2. Asset Dashboard
3. Asset List
4. Asset Detail
5. Add/Edit Asset Form
6. User Management
7. Item Master Management

### 12.2 Asset Dashboard

Purpose:

* quick overview
* recent changes
* counts by status
* counts by owner
* quick access to add asset

Suggested dashboard cards:

* Total Assets
* Personal Assets
* Team Assets
* Broken Assets
* Stored Assets
* Total Asset Value

### 12.3 Asset List Page

Features:

* table view
* search bar
* filters
* sorting
* add button
* edit button
* delete button
* row click to detail

Example columns on list page:

* Item Name
* Owner
* Ownership Type
* Quantity
* Price
* Status
* Registration Date

### 12.4 Add/Edit Form

Recommended form fields:

* Item Name dropdown
* Category input or dropdown
* Specification input
* Quantity number input
* Price number input
* Status dropdown
* Ownership Type dropdown
* Owner dropdown
* Receiver dropdown or auto-fill
* Registration Date date picker
* Notes text area

### 12.5 User Management Page

Only Product Administrator can:

* see members
* change user roles
* activate or deactivate users

### 12.6 Item Master Management Page

Only Product Administrator and Asset Manager can:

* add item option
* rename item option
* disable unused item option
* reorder item options if needed

---

## 13. Recommended MVP Scope

The first version should stay simple.

### Include in MVP

* login
* role-based access control
* asset table
* item name dropdown
* add/edit/delete asset
* price column
* ownership type
* owner assignment
* search and filter
* user role management
* item master management

### Exclude from MVP

* barcode or QR scanning
* depreciation accounting
* approval workflows
* maintenance ticketing
* advanced analytics
* multi-team or multi-company hierarchy
* offline sync
* file attachments

---

## 14. Database Design

Database: **SQLite**

Simple and suitable for MVP.

### 14.1 users

| Field         | Type    | Notes                             |
| ------------- | ------- | --------------------------------- |
| id            | INTEGER | Primary key                       |
| name          | TEXT    | User name                         |
| email         | TEXT    | Unique login email                |
| password_hash | TEXT    | Hashed password                   |
| role          | TEXT    | admin, asset_manager, team_member |
| is_active     | INTEGER | 1 or 0                            |
| created_at    | TEXT    | ISO datetime                      |
| updated_at    | TEXT    | ISO datetime                      |

### 14.2 item_master

| Field      | Type    | Notes        |
| ---------- | ------- | ------------ |
| id         | INTEGER | Primary key  |
| name       | TEXT    | Item name    |
| is_active  | INTEGER | 1 or 0       |
| created_at | TEXT    | ISO datetime |
| updated_at | TEXT    | ISO datetime |

### 14.3 assets

| Field              | Type    | Notes                              |
| ------------------ | ------- | ---------------------------------- |
| id                 | INTEGER | Primary key                        |
| item_master_id     | INTEGER | FK to item_master                  |
| item_name_snapshot | TEXT    | Optional snapshot text for history |
| category           | TEXT    | Category                           |
| specification      | TEXT    | Specs                              |
| quantity           | INTEGER | Quantity                           |
| price              | REAL    | Total row price                    |
| status             | TEXT    | In Use, Stored, etc.               |
| ownership_type     | TEXT    | personal or team                   |
| owner_user_id      | INTEGER | Nullable when ownership is team    |
| receiver_user_name | TEXT    | Simple text for MVP                |
| registration_date  | TEXT    | YYYY-MM-DD                         |
| notes              | TEXT    | Extra notes                        |
| created_by_user_id | INTEGER | Creator                            |
| created_at         | TEXT    | ISO datetime                       |
| updated_at         | TEXT    | ISO datetime                       |

### 14.4 optional_audit_logs

Can be added later if needed.

| Field              | Type    | Notes                  |
| ------------------ | ------- | ---------------------- |
| id                 | INTEGER | Primary key            |
| asset_id           | INTEGER | FK to assets           |
| action             | TEXT    | create, update, delete |
| changed_by_user_id | INTEGER | User who made change   |
| change_summary     | TEXT    | Simple summary         |
| created_at         | TEXT    | ISO datetime           |

---

## 15. API Style

API type: **REST**

### Main Endpoints

#### Auth

* `POST /api/auth/login`
* `POST /api/auth/logout`
* `GET /api/auth/me`

#### Users

* `GET /api/users`
* `PATCH /api/users/:id/role`
* `PATCH /api/users/:id/active`

#### Item Master

* `GET /api/items`
* `POST /api/items`
* `PATCH /api/items/:id`
* `DELETE /api/items/:id`

#### Assets

* `GET /api/assets`
* `GET /api/assets/:id`
* `POST /api/assets`
* `PATCH /api/assets/:id`
* `DELETE /api/assets/:id`

### Query Parameters for Asset List

Suggested support:

* `itemName`
* `ownerId`
* `ownershipType`
* `status`
* `category`
* `page`
* `limit`
* `search`
* `sortBy`
* `sortOrder`

Example:

```http
GET /api/assets?status=In%20Use&ownershipType=team&search=router&page=1&limit=20
```

---

## 16. Tech Stack Recommendation

The requested stack is a good fit for this app.

### Frontend

* **React**
* **Tailwind CSS**
* **React Router**
* **TanStack Query** for server state
* **React Hook Form** for forms
* **Zod** for validation
* **Axios** for API calls
* **shadcn/ui** or a similar lightweight component system for fast UI building

Why this works well:

* React is strong for dashboard/table applications
* Tailwind is fast for building admin UIs
* TanStack Query makes data fetching and caching easier
* React Hook Form keeps forms clean and performant
* Zod improves validation and type safety
* shadcn/ui helps make the app look polished without heavy complexity

### Backend

* **Node.js**
* **Express.js**

Why this works well:

* simple REST API development
* lightweight and easy to understand
* large ecosystem
* easy integration with SQLite

Helpful backend packages:

* `express`
* `cors`
* `helmet`
* `morgan`
* `bcrypt`
* `jsonwebtoken`
* `zod`
* `better-sqlite3` or `sqlite3`

### Database

* **SQLite**

Why this works well:

* simple setup
* no database server needed
* ideal for MVP and small team apps
* easy local development
* enough for the first version

### API

* **REST API**

Why this works well:

* simple and familiar
* easy to test
* easy to connect with React frontend
* enough for this app’s requirements

---

## 17. Final Recommended Stack

### Frontend Stack

* React
* Tailwind CSS
* React Router
* TanStack Query
* React Hook Form
* Zod
* Axios
* shadcn/ui

### Backend Stack

* Node.js
* Express.js
* Zod
* JWT authentication
* bcrypt for password hashing

### Database Stack

* SQLite
* better-sqlite3

### API Style

* REST API

---

## 18. Why This Stack Is Good for This Product

This stack is a strong match because the app needs:

* forms
* tables
* filters
* role-based access
* CRUD operations
* fast MVP delivery
* low infrastructure complexity

This stack is especially good because it is:

* simple
* practical
* maintainable
* inexpensive to run
* easy for a small team to build

---

## 19. Future Enhancements

These can be added later after the MVP works well:

* CSV import/export
* Excel upload
* QR code labels
* barcode scanning
* image attachments
* audit log page
* total asset value reports
* dashboard charts
* archived/disposed state workflow
* multi-team support
* vendor management
* purchase history
* unit price + total price split

---

## 20. Summary

This app should be a **simple but strong team asset management system**.

It should provide:

* personal and team asset tracking
* clear role-based permissions
* predefined item options
* a price column for each asset row
* a clean dashboard and list view
* a lightweight technical architecture

### Final Direction

Build the MVP with:

* **Frontend:** React + Tailwind CSS
* **Backend:** Node.js + Express
* **Database:** SQLite
* **API:** REST

This gives a clean and practical foundation without unnecessary complexity.
