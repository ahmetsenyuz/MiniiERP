# Database Schema Design

## Overview
This document outlines the foundational database schema for the MiniiERP system, defining the core entities and their relationships.

## Entities

### Product
- ID (Primary Key)
- Name
- SKU (Unique)
- Selling Price
- Critical Stock Level

### Supplier
- ID (Primary Key)
- Company Name
- Contact Info

### Purchase Order
- ID (Primary Key)
- Supplier ID (Foreign Key to Supplier)
- Order Date
- Status

### Sales Order
- ID (Primary Key)
- Customer Info
- Order Date
- Status

### Inventory
- Product ID (Foreign Key to Product)
- Quantity On Hand
- Last Updated

## Relationships
- Product ↔ Supplier: Many-to-Many via Purchase Order
- Product ↔ Sales Order: Many-to-Many via Sales Order Details
- Product ↔ Inventory: One-to-One

## Constraints
- Product SKU must be unique
- Inventory quantities must never go below zero
- All tables have appropriate primary and foreign keys