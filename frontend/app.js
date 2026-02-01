// Main application logic
document.addEventListener('DOMContentLoaded', () => {
  // Navigation setup
  const navLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('section');

  // Hide all sections except dashboard
  sections.forEach(section => {
    if (section.id !== 'dashboard') {
      section.style.display = 'none';
    }
  });

  // Set up navigation click handlers
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Hide all sections
      sections.forEach(section => {
        section.style.display = 'none';
      });
      
      // Show the selected section
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.style.display = 'block';
      }
    });
  });

  // Load initial data for dashboard
  loadDashboardMetrics();

  // Set up form event listeners
  setupFormListeners();
});

// Load dashboard metrics
async function loadDashboardMetrics() {
  try {
    const response = await fetch('/api/dashboard');
    const data = await response.json();
    
    // Update metrics
    document.getElementById('total-products').textContent = data.totalProducts;
    document.getElementById('total-suppliers').textContent = data.totalSuppliers;
    document.getElementById('pending-purchase-orders').textContent = data.pendingPurchaseOrders;
    document.getElementById('pending-sales-orders').textContent = data.pendingSalesOrders;
    
    // Display alerts
    const alertsList = document.getElementById('alert-list');
    alertsList.innerHTML = '';
    
    data.criticalStockItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.productName} stock is critically low (${item.stockQuantity})`;
      alertsList.appendChild(li);
    });
    
  } catch (error) {
    console.error('Error loading dashboard metrics:', error);
  }
}

// Set up form event listeners
function setupFormListeners() {
  // Product form
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitProductForm();
    });
  }

  // Supplier form
  const supplierForm = document.getElementById('supplier-form');
  if (supplierForm) {
    supplierForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitSupplierForm();
    });
  }

  // Inventory form
  const inventoryForm = document.getElementById('inventory-form');
  if (inventoryForm) {
    inventoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitInventoryForm();
    });
  }

  // Purchase order form
  const purchaseOrderForm = document.getElementById('purchase-order-form');
  if (purchaseOrderForm) {
    purchaseOrderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitPurchaseOrderForm();
    });
  }

  // Sales order form
  const salesOrderForm = document.getElementById('sales-order-form');
  if (salesOrderForm) {
    salesOrderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitSalesOrderForm();
    });
  }
}

// Submit product form
async function submitProductForm() {
  const formData = new FormData(document.getElementById('product-form'));
  const productData = {
    name: formData.get('product-name'),
    description: formData.get('product-description'),
    price: parseFloat(formData.get('product-price')),
    category: formData.get('product-category')
  };

  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });

    const result = await response.json();
    
    if (response.ok) {
      alert('Product created successfully!');
      document.getElementById('product-form').reset();
      // Refresh product list
      loadProducts();
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert('Failed to create product');
    console.error('Error submitting product form:', error);
  }
}

// Submit supplier form
async function submitSupplierForm() {
  const formData = new FormData(document.getElementById('supplier-form'));
  const supplierData = {
    name: formData.get('supplier-name'),
    contact: formData.get('supplier-contact'),
    email: formData.get('supplier-email'),
    phone: formData.get('supplier-phone')
  };

  try {
    const response = await fetch('/api/suppliers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(supplierData)
    });

    const result = await response.json();
    
    if (response.ok) {
      alert('Supplier created successfully!');
      document.getElementById('supplier-form').reset();
      // Refresh supplier list
      loadSuppliers();
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert('Failed to create supplier');
    console.error('Error submitting supplier form:', error);
  }
}

// Submit inventory form
async function submitInventoryForm() {
  const formData = new FormData(document.getElementById('inventory-form'));
  const inventoryData = {
    productId: formData.get('inventory-product'),
    quantity: parseInt(formData.get('inventory-quantity')),
    location: formData.get('inventory-location')
  };

  try {
    const response = await fetch('/api/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inventoryData)
    });

    const result = await response.json();
    
    if (response.ok) {
      alert('Inventory updated successfully!');
      document.getElementById('inventory-form').reset();
      // Refresh inventory list
      loadInventory();
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert('Failed to update inventory');
    console.error('Error submitting inventory form:', error);
  }
}

// Submit purchase order form
async function submitPurchaseOrderForm() {
  const formData = new FormData(document.getElementById('purchase-order-form'));
  const purchaseOrderData = {
    supplierId: formData.get('purchase-order-supplier'),
    items: [
      {
        productId: formData.get('purchase-order-product'),
        quantity: parseInt(formData.get('purchase-order-quantity'))
      }
    ]
  };

  try {
    const response = await fetch('/api/purchase-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(purchaseOrderData)
    });

    const result = await response.json();
    
    if (response.ok) {
      alert('Purchase order created successfully!');
      document.getElementById('purchase-order-form').reset();
      // Refresh purchase orders list
      loadPurchaseOrders();
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert('Failed to create purchase order');
    console.error('Error submitting purchase order form:', error);
  }
}

// Submit sales order form
async function submitSalesOrderForm() {
  const formData = new FormData(document.getElementById('sales-order-form'));
  const salesOrderData = {
    customerId: formData.get('sales-order-customer'),
    items: [
      {
        productId: formData.get('sales-order-product'),
        quantity: parseInt(formData.get('sales-order-quantity'))
      }
    ]
  };

  try {
    const response = await fetch('/api/sales-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(salesOrderData)
    });

    const result = await response.json();
    
    if (response.ok) {
      alert('Sales order created successfully!');
      document.getElementById('sales-order-form').reset();
      // Refresh sales orders list
      loadSalesOrders();
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert('Failed to create sales order');
    console.error('Error submitting sales order form:', error);
  }
}

// Load products list
async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    
    const tableBody = document.querySelector('#products-table tbody');
    tableBody.innerHTML = '';
    
    products.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${product._id}</td>
        <td>${product.name}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td>${product.category}</td>
        <td>
          <button onclick="editProduct('${product._id}')">Edit</button>
          <button onclick="deleteProduct('${product._id}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Load suppliers list
async function loadSuppliers() {
  try {
    const response = await fetch('/api/suppliers');
    const suppliers = await response.json();
    
    const tableBody = document.querySelector('#suppliers-table tbody');
    tableBody.innerHTML = '';
    
    suppliers.forEach(supplier => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${supplier._id}</td>
        <td>${supplier.name}</td>
        <td>${supplier.contact}</td>
        <td>${supplier.email}</td>
        <td>${supplier.phone}</td>
        <td>
          <button onclick="editSupplier('${supplier._id}')">Edit</button>
          <button onclick="deleteSupplier('${supplier._id}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading suppliers:', error);
  }
}

// Load inventory list
async function loadInventory() {
  try {
    const response = await fetch('/api/inventory');
    const inventory = await response.json();
    
    const tableBody = document.querySelector('#inventory-table tbody');
    tableBody.innerHTML = '';
    
    inventory.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item._id}</td>
        <td>${item.productId.name}</td>
        <td>${item.quantity}</td>
        <td>${item.location}</td>
        <td>
          <button onclick="editInventory('${item._id}')">Edit</button>
          <button onclick="deleteInventory('${item._id}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading inventory:', error);
  }
}

// Load purchase orders list
async function loadPurchaseOrders() {
  try {
    const response = await fetch('/api/purchase-orders');
    const orders = await response.json();
    
    const tableBody = document.querySelector('#purchase-orders-table tbody');
    tableBody.innerHTML = '';
    
    orders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order._id}</td>
        <td>${order.supplierId.name}</td>
        <td>${order.createdAt}</td>
        <td>${order.status}</td>
        <td>
          <button onclick="confirmPurchaseOrder('${order._id}')">Confirm</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading purchase orders:', error);
  }
}

// Load sales orders list
async function loadSalesOrders() {
  try {
    const response = await fetch('/api/sales-orders');
    const orders = await response.json();
    
    const tableBody = document.querySelector('#sales-orders-table tbody');
    tableBody.innerHTML = '';
    
    orders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order._id}</td>
        <td>${order.customerId.name}</td>
        <td>${order.createdAt}</td>
        <td>${order.status}</td>
        <td>
          <button onclick="confirmSalesOrder('${order._id}')">Confirm</button>
          <button onclick="completeSalesOrder('${order._id}')">Complete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading sales orders:', error);
  }
}