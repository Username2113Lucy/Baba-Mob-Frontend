import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/customer_log';

export const Billing_page = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'addCustomer';
  });

  const [shopType, setShopType] = useState(() => {
    return localStorage.getItem('shopType') || 'service';
  });

  const [customers, setCustomers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    issue: '',
    cost: '',
    brand: '',
    stock: '',
    model: '',
    password: '',
    paymentMode: '',
    warrantyDays: ''
  });
  const [actionStatus, setActionStatus] = useState({});

// Add these to your component state - SEPARATE FOR SALES AND SERVICE
const [salesOfferMessage, setSalesOfferMessage] = useState(''); // Final sales offer
const [serviceOfferMessage, setServiceOfferMessage] = useState(''); // Final service offer
const [currentOffer, setCurrentOffer] = useState(''); // Temporary input value

  const [filterData, setFilterData] = useState({
    name: '',
    phone: '',
    invoiceNumber: '',
    date: '',
    status: '',
    paymentMode: ''
  });

  // Stock Management States
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockLoading, setStockLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductName, setEditProductName] = useState('');
  const [editingVariant, setEditingVariant] = useState(null);
  const [editVariantName, setEditVariantName] = useState('');
  const [editVariantDescription, setEditVariantDescription] = useState('');
  const [editLowStockThreshold, setEditLowStockThreshold] = useState('');

  // Add Product States
  const [productForm, setProductForm] = useState({
    name: '',
    image: null
  });
  const [productVariants, setProductVariants] = useState([
    { id: 1, productName: '', variantName: '', description: '', price: '', quantity: '', lowStockThreshold: '5' }
  ]);
  const [savingVariants, setSavingVariants] = useState(false);

  // Stock Management API Functions
  const fetchStockData = async () => {
    try {
      setStockLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      // Fetch products and variants based on shop type
      const productsResponse = await fetch(`${API_BASE_URL}/products?shopType=${shopType}`);
      if (!productsResponse.ok) {
        throw new Error(`Products fetch error: ${productsResponse.status}`);
      }
      const productsResult = await productsResponse.json();
      
      if (productsResult.success) {
        setProducts(productsResult.data);
      }

      const variantsResponse = await fetch(`${API_BASE_URL}/variants?shopType=${shopType}`);
      if (!variantsResponse.ok) {
        throw new Error(`Variants fetch error: ${variantsResponse.status}`);
      }
      const variantsResult = await variantsResponse.json();
      
      if (variantsResult.success) {
        setVariants(variantsResult.data);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      alert('Error fetching stock data: ' + error.message);
    } finally {
      setStockLoading(false);
    }
  };

const saveProduct = async (productData) => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    
    console.log('🔄 Sending product data:', productData); // Debug log
    
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: productData.name.toUpperCase(),
        shopType: shopType // Make sure shopType is included
      })
    });

    console.log('📡 Response status:', response.status); // Debug log
    
    if (!response.ok) {
      // Try to get the actual error message from backend
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Product save result:', result); // Debug log
    return result;
    
  } catch (error) {
    console.error('❌ Error saving product:', error);
    throw error;
  }
};

  const saveVariants = async (variantsData) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const variantsToSave = variantsData.map(variant => ({
        productName: variant.productName,
        variantName: variant.variantName,
        description: variant.description || '',
        price: parseFloat(variant.price) || 0,
        quantity: parseInt(variant.quantity) || 0,
        lowStockThreshold: parseInt(variant.lowStockThreshold) || 5,
        shopType: shopType
      }));

      const response = await fetch(`${API_BASE_URL}/variants/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ variants: variantsToSave }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving variants:', error);
      throw error;
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const updateVariant = async (variantId, variantData) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_BASE_URL}/variants/${variantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variantData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating variant:', error);
      throw error;
    }
  };

  const deleteVariant = async (variantId) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_BASE_URL}/variants/${variantId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting variant:', error);
      throw error;
    }
  };

  // Stock Management Helper Functions
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setEditingProduct(null);
  };

  const handleEditProductClick = (product, e) => {
    e.stopPropagation();
    setEditingProduct(product._id);
    setEditProductName(product.name);
  };

  const handleSaveProductClick = async (productId, e) => {
    e.stopPropagation();
    
    if (!editProductName.trim()) {
      alert('Product name cannot be empty');
      return;
    }

    const uppercaseName = editProductName.trim().toUpperCase();
    const oldProduct = products.find(p => p._id === productId);

    try {
      const result = await updateProduct(productId, { name: uppercaseName });

      if (result.success) {
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === productId 
              ? { ...product, name: uppercaseName }
              : product
          )
        );
        
        setVariants(prevVariants =>
          prevVariants.map(variant =>
            variant.productName === oldProduct.name || variant.product?.name === oldProduct.name
              ? {
                  ...variant,
                  productName: uppercaseName,
                  product: variant.product ? { ...variant.product, name: uppercaseName } : variant.product
                }
              : variant
          )
        );
        
        if (selectedProduct && selectedProduct._id === productId) {
          setSelectedProduct(prev => ({
            ...prev,
            name: uppercaseName
          }));
        }
        
        setEditingProduct(null);
      } else {
        alert(`Failed to update product: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}" and all its variants?`)) {
      return;
    }

    try {
      const result = await deleteProduct(productId);

      if (result.success) {
        fetchStockData();
        if (selectedProduct && selectedProduct._id === productId) {
          setSelectedProduct(null);
        }
      } else {
        alert(result.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleDeleteVariant = async (variantId, variantName) => {
    if (!window.confirm(`Are you sure you want to delete variant "${variantName}"?`)) {
      return;
    }

    try {
      const result = await deleteVariant(variantId);

      if (result.success) {
        setVariants(prevVariants => 
          prevVariants.filter(variant => variant._id !== variantId)
        );
        alert('Variant deleted successfully!');
      } else {
        alert(result.message || 'Failed to delete variant');
      }
    } catch (error) {
      console.error('Error deleting variant:', error);
      alert('Error deleting variant');
    }
  };

  const getSelectedProductVariants = () => {
    if (!selectedProduct) return [];
    
    return variants.filter(v => 
      v.product?._id === selectedProduct._id || 
      v.productName?.toUpperCase().trim() === selectedProduct.name?.toUpperCase().trim() ||
      (v.product && v.product._id === selectedProduct._id)
    );
  };

  const calculateTotalQuantity = (productName) => {
    const productVariants = variants.filter(v => 
      v.productName === productName || 
      v.product?.name === productName ||
      (v.product && products.find(p => p._id === v.product?._id)?.name === productName)
    );
    return productVariants.reduce((total, variant) => total + (parseInt(variant.quantity) || 0), 0);
  };

  // Add Product Functions
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, JPG, PNG, WEBP)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      setProductForm({...productForm, image: file});
    }
  };

  const addVariant = () => {
    setProductVariants([...productVariants, { 
      id: Date.now(), 
      productName: '', 
      variantName: '', 
      description: '', 
      price: '', 
      quantity: '',
      lowStockThreshold: '5'
    }]);
  };

  const removeVariant = (id) => {
    if (productVariants.length > 1) {
      setProductVariants(productVariants.filter(variant => variant.id !== id));
    }
  };

  const updateProductVariant = (id, field, value) => {
    setProductVariants(productVariants.map(variant => 
      variant.id === id ? { ...variant, [field]: value } : variant
    ));
  };

const handleSaveProductForm = async (e) => {
  e.preventDefault();
  
  if (!productForm.name?.trim()) {
    alert('Please fill product name');
    return;
  }

  try {
    console.log('🔄 Attempting to save product:', productForm.name);
    console.log('🏪 Current shop type:', shopType);
    
    const result = await saveProduct(productForm);

    if (result.success) {
      await fetchStockData();
      setProductForm({ name: '', image: null });
      
      if (result.existsInOtherShop) {
        alert(`✅ Product "${productForm.name.toUpperCase()}" added to ${shopType}!\n\nNote: This brand already exists in ${shopType === 'service' ? 'sales' : 'service'} with different variants.`);
      } else {
        alert('Product saved successfully!');
      }
    } else {
      alert(`Failed to save product: ${result.message}`);
    }
  } catch (error) {
    console.error('❌ Error saving product:', error);
    
    // More user-friendly error messages
    if (error.message.includes('already exists')) {
      alert(`This brand already exists in ${shopType}. Please use a different name or switch to the other shop type.`);
    } else {
      alert(`Error saving product: ${error.message}`);
    }
  }
};

  const handleSaveProductVariants = async (e) => {
    e.preventDefault();
    setSavingVariants(true);
    
    try {
      const incompleteVariants = productVariants.some(variant => 
        !variant.productName || !variant.variantName || !variant.price || !variant.quantity
      );
      
      if (incompleteVariants) {
        alert('Please fill all required fields in all variants');
        setSavingVariants(false);
        return;
      }
      
      if (products.length === 0) {
        alert('Please save a product first before adding variants');
        setSavingVariants(false);
        return;
      }

      const result = await saveVariants(productVariants);

      if (result.success) {
        const savedCount = result.data ? result.data.length : 0;
        alert(`Successfully saved ${savedCount} variants!`);
        setProductVariants([{ id: 1, productName: '', variantName: '', description: '', price: '', quantity: '' }]);
        await fetchStockData();
      } else {
        const errorMessage = result.message || 'Failed to save variants';
        const errors = result.errors ? `\nErrors: ${result.errors.join(', ')}` : '';
        alert(`${errorMessage}${errors}`);
      }
    } catch (error) {
      console.error('Error saving variants:', error);
      alert('Error saving variants: ' + error.message);
    } finally {
      setSavingVariants(false);
    }
  };

  const calculateTotalQuantityAllProducts = () => {
    if (!variants || variants.length === 0) return 0;
    
    return variants.reduce((total, variant) => {
      const quantity = parseInt(variant.quantity) || 0;
      return total + quantity;
    }, 0);
  };

  const calculateTotalInvestment = () => {
    if (!variants || variants.length === 0) return 0;
    
    return variants.reduce((total, variant) => {
      const price = parseFloat(variant.price) || 0;
      const quantity = parseInt(variant.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  // Fetch all customers on component mount and when shop type changes
  useEffect(() => {
    fetchAllCustomers();
    fetchStockData();
  }, [shopType]);

  // Format date to DD/MM/YYYY with time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    
    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  };

  // API Functions
  const fetchAllCustomers = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        shopType: shopType // Always filter by current shop type
      }).toString();
      
      const response = await fetch(`${API_BASE_URL}/customers?${queryParams}`);
      const result = await response.json();
      
      if (result.success) {
        setCustomers(result.data);
        setAllCustomers(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Error fetching customers: ' + error.message);
    }
  };

  const fetchFilteredCustomers = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/customers?${queryParams}`);
      const result = await response.json();
      
      if (result.success) {
        setCustomers(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Error fetching customers: ' + error.message);
    }
  };

  const createCustomer = async (customerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...customerData,
          shopType: shopType // Add shop type to customer data
        })
      });

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  };

  const updateCustomerStatus = async (customerId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format phone number input
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setCustomerData(prev => ({
        ...prev,
        phone: value
      }));
    }
  };

  // Format name to Title Case
  const handleNameChange = (e) => {
    const value = e.target.value;
    const titleCaseValue = value.toLowerCase().split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setCustomerData(prev => ({
      ...prev,
      name: titleCaseValue
    }));
  };

  // Add new customer
  const handleAddCustomer = async () => {
    // Validation based on shop type
    if (shopType === 'service') {
      if (!customerData.name || !customerData.phone || !customerData.cost || !customerData.brand || !customerData.stock) {
        alert('Please fill all required fields (Name, Phone, Cost, Brand, Stock Item)');
        return;
      }
    } else { // sales
      if (!customerData.name || !customerData.phone || !customerData.cost || !customerData.brand || !customerData.model || !customerData.paymentMode) {
        alert('Please fill all required fields (Name, Phone, Cost, Brand, Model Item, Payment Mode)');
        return;
      }
    }

    // Stock validation for service
    if (shopType === 'service') {
      const selectedVariant = variants.find(v => 
        (v.productName === customerData.brand || v.product?.name === customerData.brand) &&
        v.variantName === customerData.stock
      );

      if (!selectedVariant) {
        alert('Selected stock item not found');
        return;
      }

      const currentQuantity = parseInt(selectedVariant.quantity) || 0;
      if (currentQuantity <= 0) {
        alert('Selected stock item is out of stock');
        return;
      }
    }

const generateInvoiceNumber = (shopType) => {
  const shopCode = shopType === 'service' ? 'SRV' : 'SAL';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `INV-${shopCode}-${timestamp}-${random}`;
};

const newCustomer = {
  invoiceNumber: generateInvoiceNumber(shopType),
  customerName: customerData.name,
  phone: customerData.phone,
  issue: customerData.issue,
  cost: parseFloat(customerData.cost),
  brand: customerData.brand,
  stock: customerData.stock,
  model: customerData.model,
  password: customerData.password,
  paymentMode: customerData.paymentMode,
  warrantyDays: parseInt(customerData.warrantyDays) || 0, 
  shopType: shopType
};

    try {
      // For service, decrement stock
      if (shopType === 'service') {
        const selectedVariant = variants.find(v => 
          (v.productName === customerData.brand || v.product?.name === customerData.brand) &&
          v.variantName === customerData.stock
        );

        if (selectedVariant) {
          const decrementResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/variants/${selectedVariant._id}/decrement`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (!decrementResponse.ok) {
            const errorData = await decrementResponse.json();
            throw new Error(`Failed to update stock: ${errorData.message || 'Server error'}`);
          }

          const decrementResult = await decrementResponse.json();
          if (!decrementResult.success) {
            throw new Error(`Failed to update stock: ${decrementResult.message}`);
          }

          // Update local variants state
          setVariants(prevVariants => 
            prevVariants.map(variant => 
              variant._id === selectedVariant._id 
                ? { ...variant, quantity: (parseInt(selectedVariant.quantity) - 1).toString() }
                : variant
            )
          );
        }
      }

      // Create the customer
      const savedCustomer = await createCustomer(newCustomer);
      
      // Update local state
      setAllCustomers(prev => [savedCustomer, ...prev]);
      setCustomers(prev => [savedCustomer, ...prev]);
      setCustomerData({ 
        name: '', 
        phone: '', 
        issue: '', 
        cost: '',
        brand: '',
        stock: '',
        model: '',
        password: '',
        paymentMode: ''
      });
      setActionStatus(prev => ({ ...prev, [savedCustomer._id]: '' }));
    } catch (error) {
      alert('Error creating customer: ' + error.message);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCustomer();
    }
  };

  // Handle status change
  const handleStatusChange = async (customerId, newStatus) => {
    try {
      await updateCustomerStatus(customerId, newStatus);
      const updatedCustomers = customers.map(cust =>
        cust._id === customerId ? { ...cust, status: newStatus } : cust
      );
      const updatedAllCustomers = allCustomers.map(cust =>
        cust._id === customerId ? { ...cust, status: newStatus } : cust
      );
      setCustomers(updatedCustomers);
      setAllCustomers(updatedAllCustomers);
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

// Handle actions (Print/Download) - Alternative approach
const handleAction = async (customerId, action) => {
  setActionStatus(prev => ({
    ...prev,
    [customerId]: `${action === 'download' ? 'Downloading' : 'Printing'}...`
  }));

  try {
    if (action === 'download') {
      // Your existing download code...
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const customer = customers.find(c => c._id === customerId);
      link.download = `Bill_${customer.invoiceNumber}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setActionStatus(prev => ({
        ...prev,
        [customerId]: '✅ Downloaded!'
      }));

    } else if (action === 'print') {
      // Create a hidden iframe and trigger print immediately
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = `${API_BASE_URL}/customers/${customerId}/print`;
      document.body.appendChild(iframe);

      // Wait for iframe to load then print
      iframe.onload = function() {
        try {
          // Trigger print dialog immediately
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          
          setActionStatus(prev => ({
            ...prev,
            [customerId]: '✅ Print dialog opened!'
          }));
          
          // Clean up after a delay
          setTimeout(() => {
            if (iframe.parentNode) {
              document.body.removeChild(iframe);
            }
          }, 3000);
          
        } catch (error) {
          // If direct print fails, fallback to opening in new tab
          console.warn('Direct print failed, opening in new tab:', error);
          window.open(`${API_BASE_URL}/customers/${customerId}/print`, '_blank');
          setActionStatus(prev => ({
            ...prev,
            [customerId]: '🖨️ Opened for printing'
          }));
        }
      };

      // Fallback timeout
      setTimeout(() => {
        if (iframe.parentNode && iframe.contentWindow) {
          try {
            iframe.contentWindow.print();
          } catch (e) {
            window.open(`${API_BASE_URL}/customers/${customerId}/print`, '_blank');
          }
        }
      }, 3000);

    }

  } catch (error) {
    console.error('Error processing action:', error);
    setActionStatus(prev => ({
      ...prev,
      [customerId]: '❌ ' + error.message
    }));
  }

  setTimeout(() => {
    setActionStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[customerId];
      return newStatus;
    });
  }, 5000);
};

  // Handle filter apply - Frontend filtering
  const handleApplyFilter = () => {
    // If no filters are applied, show all customers for current shop type
    if (!filterData.name && !filterData.phone && !filterData.invoiceNumber && !filterData.date && !filterData.status && !filterData.paymentMode) {
      setCustomers(allCustomers);
      return;
    }

    // Filter customers on frontend
    const filteredCustomers = allCustomers.filter(customer => {
      // Name filter (case-insensitive)
      if (filterData.name && !customer.customerName.toLowerCase().includes(filterData.name.toLowerCase())) {
        return false;
      }
      
      // Phone filter
      if (filterData.phone && !customer.phone.includes(filterData.phone)) {
        return false;
      }
      
      // Invoice number filter (case-insensitive)
      if (filterData.invoiceNumber && !customer.invoiceNumber.toLowerCase().includes(filterData.invoiceNumber.toLowerCase())) {
        return false;
      }
      
      // Date filter
      if (filterData.date) {
        const [day, month, year] = filterData.date.split('/');
        if (day && month && year) {
          const filterDate = new Date(`${year}-${month}-${day}`);
          const customerDate = new Date(customer.date);
          
          if (filterDate.toDateString() !== customerDate.toDateString()) {
            return false;
          }
        }
      }
      
      // Status filter (for service)
      if (shopType === 'service' && filterData.status && customer.status !== filterData.status) {
        return false;
      }
      
      // Payment mode filter (for sales)
      if (shopType === 'sales' && filterData.paymentMode && customer.paymentMode !== filterData.paymentMode) {
        return false;
      }
      
      return true;
    });

    setCustomers(filteredCustomers);
  };

  // Handle filter reset
  const handleResetFilter = () => {
    setFilterData({
      name: '',
      phone: '',
      invoiceNumber: '',
      date: '',
      status: '',
      paymentMode: ''
    });
    setCustomers(allCustomers);
  };

// Calculate summary based on current shop type customers - CORRECTED
const calculateSummary = () => {
  const today = new Date().toLocaleDateString();
  
  // Today's customers for current shop type
  const todayCustomers = allCustomers.filter(customer => 
    new Date(customer.date).toLocaleDateString() === today
  );
  
  // For service: use paidAmount, for sales: use cost (since sales are paid immediately)
  const todayIncome = todayCustomers.reduce((sum, customer) => {
    if (shopType === 'service') {
      return sum + (customer.paidAmount || 0);
    } else {
      // For sales, all costs are considered as income since payment is immediate
      return sum + (customer.cost || 0);
    }
  }, 0);
  
  // Pending balance only applies to service (sales are paid immediately)
  const pendingBalance = allCustomers.reduce((sum, customer) => {
    if (shopType === 'service') {
      return sum + (customer.balance || 0);
    } else {
      return 0; // Sales have no pending balance
    }
  }, 0);
  
  // Total income calculation
  const totalIncome = allCustomers.reduce((sum, customer) => {
    if (shopType === 'service') {
      return sum + (customer.paidAmount || 0);
    } else {
      // For sales, all costs are income
      return sum + (customer.cost || 0);
    }
  }, 0);

  return {
    todayIncome: todayIncome,
    pendingBalance: pendingBalance,
    totalIncome: totalIncome
  };
};

  const summary = calculateSummary();

  // Handle paid amount change
  const handlePaidAmountChange = (customerId, value) => {
    const paidAmount = parseFloat(value) || 0;
    const updatedCustomers = customers.map(cust => {
      if (cust._id === customerId) {
        const cost = cust.cost || 0;
        const balance = cost - paidAmount;
        let status = cust.status;
        
        // Auto-update status based on payment
        if (paidAmount === 0) {
          status = 'not paid';
        } else if (paidAmount >= cost) {
          status = 'paid';
        } else if (paidAmount > 0 && paidAmount < cost) {
          status = 'part paid';
        }
        
        return {
          ...cust,
          paidAmount,
          balance,
          status
        };
      }
      return cust;
    });
    
    setCustomers(updatedCustomers);
  };

  // Handle paid amount save to backend
  const handlePaidAmountSave = async (customerId, value) => {
    try {
      const paidAmount = parseFloat(value) || 0;
      const customer = customers.find(c => c._id === customerId);
      const cost = customer.cost || 0;
      const balance = cost - paidAmount;
      
      let status = customer.status;
      if (paidAmount === 0) {
        status = 'not paid';
      } else if (paidAmount >= cost) {
        status = 'paid';
      } else if (paidAmount > 0 && paidAmount < cost) {
        status = 'part paid';
      }

      // Update in backend
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paidAmount,
          balance,
          status
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Update both local states
        const updatedCustomers = customers.map(cust =>
          cust._id === customerId ? result.data : cust
        );
        const updatedAllCustomers = allCustomers.map(cust =>
          cust._id === customerId ? result.data : cust
        );
        
        setCustomers(updatedCustomers);
        setAllCustomers(updatedAllCustomers);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error updating paid amount:', error);
      alert('Error updating paid amount: ' + error.message);
    }
  };

  // Handle expected delivery date change
  const handleExpectedDeliveryChange = (customerId, value) => {
    const updatedCustomers = customers.map(cust =>
      cust._id === customerId ? { ...cust, expectedDelivery: value } : cust
    );
    setCustomers(updatedCustomers);
  };

  // Handle expected delivery date save to backend
  const handleExpectedDeliverySave = async (customerId, value) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expectedDelivery: value
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const updatedCustomers = customers.map(cust =>
          cust._id === customerId ? result.data : cust
        );
        const updatedAllCustomers = allCustomers.map(cust =>
          cust._id === customerId ? result.data : cust
        );
        
        setCustomers(updatedCustomers);
        setAllCustomers(updatedAllCustomers);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error updating expected delivery:', error);
      alert('Error updating expected delivery: ' + error.message);
    }
  };

  // Handle shop type change
  const handleShopTypeChange = (newShopType) => {
    setShopType(newShopType);
    localStorage.setItem('shopType', newShopType);
    // Reset customer data when switching shop types
    setCustomerData({
      name: '',
      phone: '',
      issue: '',
      cost: '',
      brand: '',
      stock: '',
      model: '',
      password: '',
      paymentMode: ''
    });
    // Reset filter data
    setFilterData({
      name: '',
      phone: '',
      invoiceNumber: '',
      date: '',
      status: '',
      paymentMode: ''
    });
  };

  // Variant editing functions
  const handleVariantEditClick = (variant, e) => {
    e.stopPropagation();
    setEditingVariant(variant._id);
    setEditVariantName(variant.variantName);
    setEditVariantDescription(variant.description || '');
    setEditLowStockThreshold(variant.lowStockThreshold?.toString() || '5');
  };

  const handleVariantSaveClick = async (variantId, e) => {
    e.stopPropagation();
    
    if (!editVariantName.trim()) {
      alert('Variant name cannot be empty');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/variants/${variantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantName: editVariantName.trim(),
          description: editVariantDescription.trim(),
          lowStockThreshold: parseInt(editLowStockThreshold) || 5
        })
      });

      const result = await response.json();

      if (result.success) {
        setVariants(prevVariants => 
          prevVariants.map(variant => 
            variant._id === variantId 
              ? { 
                  ...variant, 
                  variantName: editVariantName.trim(),
                  description: editVariantDescription.trim(),
                  lowStockThreshold: parseInt(editLowStockThreshold) || 5
                }
              : variant
          )
        );
        setEditingVariant(null);
      } else {
        alert(`Failed to update variant: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating variant:', error);
      alert('Error updating variant');
    }
  };

  // Handle price change for variants
  const handlePriceChange = async (variantId, newPrice) => {
    if (newPrice < 0) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/variants/${variantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: newPrice
        })
      });

      const result = await response.json();

      if (result.success) {
        setVariants(prevVariants => 
          prevVariants.map(variant => 
            variant._id === variantId 
              ? { ...variant, price: newPrice.toString() }
              : variant
          )
        );
      } else {
        alert(`Failed to update price: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Error updating price');
    }
  };

  // Handle quantity change for variants
  const handleQuantityChange = async (variantId, newQuantity) => {
    if (newQuantity < 0) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/variants/${variantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: newQuantity
        })
      });

      const result = await response.json();

      if (result.success) {
        setVariants(prevVariants => 
          prevVariants.map(variant => 
            variant._id === variantId 
              ? { ...variant, quantity: newQuantity.toString() }
              : variant
          )
        );
      } else {
        alert(`Failed to update quantity: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error updating quantity');
    }
  };

  // Add this function to group customers by date and calculate daily totals
  const getCustomersWithDailyTotals = () => {
    if (customers.length === 0) return [];
    
    const groupedByDate = {};
    
    // Group customers by date
    customers.forEach(customer => {
      const date = new Date(customer.date).toLocaleDateString();
      
      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date: customer.date,
          customers: [],
          totalCost: 0,
          totalPaid: 0,
          count: 0
        };
      }
      
      groupedByDate[date].customers.push(customer);
      groupedByDate[date].totalCost += customer.cost || 0;
      groupedByDate[date].totalPaid += customer.paidAmount || 0;
      groupedByDate[date].count++;
    });
    
    // Convert to array and sort by date (newest first)
    const dateGroups = Object.values(groupedByDate)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create flattened array with customers and daily totals
    const result = [];
    
    dateGroups.forEach((group, groupIndex) => {
      // Add daily total row FIRST for each group
      result.push({
        type: 'dailyTotal',
        data: group,
        id: `daily-total-${group.date}`
      });
      
      // Then add all customers for that date
      group.customers.forEach(customer => {
        result.push({
          type: 'customer',
          data: customer,
          id: customer._id
        });
      });
    });
    
    return result;
  };

  // Handle warranty days change
const handleWarrantyDaysChange = (customerId, value) => {
  const warrantyDays = parseInt(value) || 0;
  const updatedCustomers = customers.map(cust =>
    cust._id === customerId ? { ...cust, warrantyDays } : cust
  );
  setCustomers(updatedCustomers);
};

// Handle warranty days save to backend
const handleWarrantyDaysSave = async (customerId, value) => {
  try {
    const warrantyDays = parseInt(value) || 0;

    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        warrantyDays
      })
    });

    const result = await response.json();
    
    if (result.success) {
      const updatedCustomers = customers.map(cust =>
        cust._id === customerId ? result.data : cust
      );
      const updatedAllCustomers = allCustomers.map(cust =>
        cust._id === customerId ? result.data : cust
      );
      
      setCustomers(updatedCustomers);
      setAllCustomers(updatedAllCustomers);
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error updating warranty days:', error);
    alert('Error updating warranty days: ' + error.message);
  }
};

// WhatsApp PDF Sender - Fixed with correct API endpoint
const handleWhatsAppPDF = async (customerId) => {
  setActionStatus(prev => ({
    ...prev,
    [customerId]: '❗ Checking WhatsApp connection...'
  }));

  try {
    const statusResponse = await fetch('http://localhost:5000/whatsapp/status');
    const statusResult = await statusResponse.json();

    if (!statusResult.ready) {
      throw new Error('WhatsApp is not connected. Please wait a moment and try again.');
    }

    setActionStatus(prev => ({
      ...prev,
      [customerId]: '📡 Fetching customer data...'
    }));

    // Try different possible API endpoints
    let customer = null;
    let customerShopType = null;

    try {
      // Option 1: Try the direct customer endpoint
      const customerResponse = await fetch(`http://localhost:5000/api/customers/${customerId}`);
      const customerData = await customerResponse.json();
      
      if (customerData.success && customerData.customer) {
        customer = customerData.customer;
        customerShopType = customer.shopType;
      } else if (customerData.shopType) {
        // Option 2: If the response has shopType directly
        customerShopType = customerData.shopType;
      } else {
        // Option 3: Try to get customer from the PDF generation or another endpoint
        console.log('🔄 Trying alternative method to get customer shop type...');
        
        // Since we're sending to WhatsApp, let's use the shopType from your current context
        // or make an educated guess based on available data
        const allCustomersResponse = await fetch('http://localhost:5000/api/customers');
        const allCustomers = await allCustomersResponse.json();
        
        if (allCustomers.success) {
          const foundCustomer = allCustomers.customers.find(c => c._id === customerId);
          if (foundCustomer) {
            customerShopType = foundCustomer.shopType;
          }
        }
      }
    } catch (fetchError) {
      console.warn('⚠️ Could not fetch customer details, using current shop type:', fetchError);
      // Fallback to current shopType from your component state
      customerShopType = shopType;
    }

    // Final fallback - use current component shopType
    if (!customerShopType) {
      customerShopType = shopType;
      console.log(`🔄 Using current component shopType: ${shopType}`);
    }

    // Select the correct offer message based on customer's shop type
    const relevantOfferMessage = customerShopType === 'service' ? serviceOfferMessage : salesOfferMessage;

    console.log(`📤 Sending to ${customerShopType} customer with ${relevantOfferMessage ? 'offer' : 'no offer'}`);

    setActionStatus(prev => ({
      ...prev,
      [customerId]: relevantOfferMessage ? '📩 Sending PDF with offer...' : '📩 Sending PDF...'
    }));

    const response = await fetch('http://localhost:5000/whatsapp/send-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        customerId: customerId, 
        offerMessage: relevantOfferMessage
      })
    });

    const result = await response.json();

    if (result.success) {
      setActionStatus(prev => ({
        ...prev,
        [customerId]: relevantOfferMessage ? '✅ PDF with Offer Sent!' : '✅ PDF Sent!'
      }));
    } else {
      throw new Error(result.message);
    }

  } catch (error) {
    console.error('Error:', error);
    setActionStatus(prev => ({
      ...prev,
      [customerId]: '❌ ' + error.message
    }));
  }

  setTimeout(() => {
    setActionStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[customerId];
      return newStatus;
    });
  }, 5000);
};

  return (
  <div className="min-h-screen min-w-screen bg-gradient-to-br from-orange-50 to-amber-50 p-3 w-full">
    {/* Shop Type Tabs */}
    <div className="bg-white rounded-lg shadow-md mb-4 border border-orange-100">
      <div className="flex gap-0.5 border-b border-orange-200">
        <button
          onClick={() => handleShopTypeChange('sales')}
          className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 rounded-tr-lg ${
            shopType === 'sales' 
            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-inner' 
            : '!bg-white text-gray-800 hover:bg-orange-50 hover:text-orange-700'
          }`}
        >
          🛒 SALES
        </button>
        <button
          onClick={() => handleShopTypeChange('service')}
          className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 rounded-tl-lg ${
            shopType === 'service' 
            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-inner' 
            : '!bg-white text-gray-800 hover:bg-orange-50 hover:text-orange-700'
          }`}
        >
          🔧 SERVICE
        </button>

      </div>
      
      {/* Main Navigation Tabs */}
      <div className="flex gap-0.5">
        <button
          onClick={() => {
            setActiveTab('addCustomer');
            localStorage.setItem('activeTab', 'addCustomer');
            setCustomers(allCustomers);
          }}
          className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 ${
            activeTab === 'addCustomer' 
            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-inner' 
            : '!bg-white text-gray-800 hover:bg-orange-50 hover:text-orange-700'
          }`}
        >
          📝 Add Customer
        </button>
        <button
          onClick={() => {
            setActiveTab('filter');
            localStorage.setItem('activeTab', 'filter');
          }}
          className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 ${
            activeTab === 'filter' 
            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-inner' 
            : '!bg-white text-gray-800 hover:bg-orange-50 hover:text-orange-700'
          }`}
        >
          🔍 Filter Records
        </button>
        <button
          onClick={() => {
            setActiveTab('items');
            localStorage.setItem('activeTab', 'items');
          }}
          className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 ${
            activeTab === 'items' || activeTab === 'addProduct' 
            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-inner' 
            : '!bg-white text-gray-800 hover:bg-orange-50 hover:text-orange-700'
          }`}
        >
          📦 Items
        </button>
      </div>
    </div>

    {/* Add Customer Form */}
    {activeTab === 'addCustomer' && (
      <div className="bg-white rounded-lg p-4 shadow-md mb-4 border border-orange-100">
        <div className="flex items-center mb-4">
          <div className="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
          <h2 className="text-xl font-bold text-gray-800">
            Add New Customer - {shopType === 'service' ? '🔧 SERVICE' : '🛒 SALES'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              👤 Customer Name *
            </label>
            <input
              type="text"
              name="name"
              value={customerData.name}
              onChange={handleNameChange}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomer()}
              className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200"
              placeholder="Enter customer full name"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              📞 Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={customerData.phone}
              onChange={handlePhoneChange}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomer()}
              maxLength={10}
              className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200"
              placeholder="Enter 10-digit phone number"
            />
          </div>

          {/* Service-specific fields */}
          {shopType === 'service' && (
            <div className="md:col-span-2 space-y-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                📋 Issue Description
              </label>
              <textarea
                name="issue"
                value={customerData.issue}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomer()}
                rows={2}
                className="text-gray-800 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 resize-none"
                placeholder="Describe the mobile issue or service required..."
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              💰 Cost (₹) *
            </label>
            <input
              type="number"
              name="cost"
              value={customerData.cost}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomer()}
              className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200"
              placeholder="Enter cost"
              min="0"
              step="0.01"
            />
          </div>

          {/* Brand Dropdown */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              🏷️ Brand *
            </label>
            <select
              name="brand"
              value={customerData.brand}
              onChange={handleInputChange}
              className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 bg-white"
            >
              <option value="">Select Brand</option>
              {products.map((product) => (
                <option key={product._id} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Service: Stock Dropdown */}
          {shopType === 'service' && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                📦 Stock Item *
              </label>
              <select
                name="stock"
                value={customerData.stock}
                onChange={handleInputChange}
                disabled={!customerData.brand}
                className={`text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 bg-white ${
                  !customerData.brand ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <option value="">Select Stock Item</option>
                {variants
                  .filter(v => 
                    v.productName === customerData.brand || 
                    v.product?.name === customerData.brand
                  )
                  .map((variant) => (
                    <option key={variant._id} value={variant.variantName}>
                      {variant.variantName} - ₹{variant.price} (Stock: {variant.quantity})
                    </option>
                  ))
                }
              </select>
            </div>
          )}

          {/* Sales: Model Item Dropdown */}
{shopType === 'sales' && (
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-gray-700 mb-1">
      📱 Model Item *
    </label>
    <select
      name="model"
      value={customerData.model}
      onChange={handleInputChange}
      disabled={!customerData.brand}
      className={`text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 bg-white ${
        !customerData.brand ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <option value="">Select Model Item</option>
      {variants
        .filter(v => 
          (v.productName === customerData.brand || 
           v.product?.name === customerData.brand) &&
          v.shopType === 'sales' // Only show sales variants
        )
        .map((variant) => (
          <option key={variant._id} value={variant.variantName}>
            {variant.variantName} - ₹{variant.price} (Stock: {variant.quantity})
          </option>
        ))
      }
    </select>
    {/* {!customerData.brand && (
      <p className="text-xs text-gray-500 mt-1">Please select a brand first</p>
    )} */}
  </div>
)}

          {/* Service: Password Field */}
          {shopType === 'service' && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                🔒 Password
              </label>
              <input
                type="number"
                name="password"
                value={customerData.password}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomer()}
                className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200"
                placeholder="Enter device password"
              />
            </div>
          )}

{/* Sales: Payment Mode */}
{shopType === 'sales' && (
  <div className="space-y-3">
    <label className="block text-sm font-bold text-gray-900 mb-2">
      💳 Payment Mode *
    </label>
    <div className="flex gap-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <label className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative">
          <input
            type="radio"
            name="paymentMode"
            value="cash"
            checked={customerData.paymentMode === 'cash'}
            onChange={handleInputChange}
            className="sr-only"
          />
          <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
            customerData.paymentMode === 'cash' 
              ? 'border-green-500 bg-green-500' 
              : 'border-gray-400 group-hover:border-green-400'
          }`}>
            {customerData.paymentMode === 'cash' && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
        </div>
        <span className="text-gray-900 font-medium group-hover:text-green-600 transition-colors">
          💵 Cash
        </span>
      </label>
      
      <label className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative">
          <input
            type="radio"
            name="paymentMode"
            value="gpay"
            checked={customerData.paymentMode === 'gpay'}
            onChange={handleInputChange}
            className="sr-only"
          />
          <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
            customerData.paymentMode === 'gpay' 
              ? 'border-blue-500 bg-blue-500' 
              : 'border-gray-400 group-hover:border-blue-400'
          }`}>
            {customerData.paymentMode === 'gpay' && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
        </div>
        <span className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
          📱 Gpay
        </span>
      </label>
    </div>
    
    {/* Selected payment mode display */}
    {customerData.paymentMode && (
      <div className="mt-2 p-2 bg-white rounded border border-gray-300">
        <span className="text-sm font-semibold text-gray-900">
          Selected: 
          <span className={`ml-2 ${
            customerData.paymentMode === 'cash' ? 'text-green-600' : 'text-blue-600'
          }`}>
            {customerData.paymentMode === 'cash' ? '💵 Cash Payment' : '📱 Google Pay'}
          </span>
        </span>
      </div>
    )}
  </div>
)}

          <div className="md:col-span-2 flex justify-end pt-2">
            <button
              onClick={handleAddCustomer}
              className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-2 rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-300 font-semibold text-sm shadow hover:shadow-md flex items-center gap-1"
            >
              <span>➕ Add Customer</span>
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Filter Section */}
    {activeTab === 'filter' && (
      <div className="bg-white rounded-lg p-4 shadow-md mb-4 border border-orange-100">
        <div className="flex items-center mb-4">
          <div className="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
          <h2 className="text-xl font-bold text-gray-800">
            Filter {shopType === 'service' ? 'Service' : 'Sales'} Records
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              👤 Customer Name
            </label>
            <input
              type="text"
              name="name"
              value={filterData.name}
              onChange={(e) => {
                const trimmedValue = e.target.value.replace(/^\s+/, '');
                setFilterData(prev => ({
                  ...prev,
                  name: trimmedValue
                }));
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyFilter()}
              className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
              placeholder="Search by name"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              📞 Phone Number
            </label>
            <input
              type="text"
              name="phone"
              maxLength={10}
              value={filterData.phone}
              onChange={(e) => {
                const numbersOnly = e.target.value.replace(/^\s+/, '').replace(/\D/g, '');
                setFilterData(prev => ({
                  ...prev,
                  phone: numbersOnly
                }));
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyFilter()}
              className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
              placeholder="Search by phone"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              🧾 Invoice Number
            </label>
            <input
              type="text"
              name="invoiceNumber"
              value={filterData.invoiceNumber}
              onChange={(e) => {
                const trimmedValue = e.target.value.replace(/^\s+/, '');
                setFilterData(prev => ({
                  ...prev,
                  invoiceNumber: trimmedValue
                }));
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyFilter()}
              className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
              placeholder="Search by invoice"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              📅 Date (DD/MM/YYYY)
            </label>
            <input
              type="text"
              name="date"
              value={filterData.date}
              onChange={(e) => {
                let input = e.target.value.replace(/^\s+/, '');
                
                if (input.length > 0) {
                  input = input.replace(/[\.\-\s]/g, '/');
                  input = input.replace(/[^\d\/]/g, '');
                  
                  const parts = input.split('/');
                  
                  if (parts.length >= 2 && parts[0].length === 1) {
                    const day = parseInt(parts[0]);
                    if (day >= 1 && day <= 9) {
                      parts[0] = '0' + parts[0];
                    }
                  }
                  
                  if (parts.length >= 3 && parts[1].length === 1) {
                    const month = parseInt(parts[1]);
                    if (month >= 1 && month <= 9) {
                      parts[1] = '0' + parts[1];
                    }
                  }
                  
                  input = parts.join('/');
                  
                  if (input.length > 10) {
                    input = input.substring(0, 10);
                  }
                }
                
                setFilterData(prev => ({
                  ...prev,
                  date: input
                }));
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyFilter()}
              className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
              placeholder="DD/MM/YYYY"
              maxLength={10}
            />
          </div>

          {shopType === 'service' ? (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                💰 Payment Status
              </label>
              <select
                name="status"
                value={filterData.status}
                onChange={handleFilterChange}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyFilter()}
                className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200 bg-white"
              >
                <option value="">All Status</option>
                <option value="paid">Paid Only</option>
                <option value="part paid">Part Paid Only</option>
                <option value="not paid">Not Paid Only</option>
              </select>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                💳 Payment Mode
              </label>
              <select
                name="paymentMode"
                value={filterData.paymentMode}
                onChange={handleFilterChange}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyFilter()}
                className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200 bg-white"
              >
                <option value="">All Modes</option>
                <option value="cash">Cash Only</option>
                <option value="gpay">Gpay Only</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-4 justify-end">
          <button
            onClick={handleApplyFilter}
            className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-300 font-semibold text-sm shadow hover:shadow-md flex items-center gap-1"
          >
            <span>🔍 Apply Filter</span>
          </button>
          <button
            onClick={handleResetFilter}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold text-sm shadow hover:shadow-md flex items-center gap-1"
          >
            <span>🔄 Reset</span>
          </button>
        </div>
      </div>
    )}

    {/* Items Tab Content */}
    {activeTab === 'items' && (
      <div className="space-y-4">
        {/* Stock Management Section */}
        <div className="bg-white rounded-lg p-4 shadow-md border border-orange-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
              <h2 className="text-lg font-bold text-gray-800">
                📦 {shopType === 'service' ? 'Stock Management' : 'Product Management'}
              </h2>
            </div>
            <button
              onClick={() => {
                  setActiveTab('addProduct');
                  localStorage.setItem('activeTab', 'addProduct');
                }}
              className="bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center gap-2 text-sm"
            >
              <span>➕ Add {shopType === 'service' ? 'Product' : 'Brand'}</span>
            </button>
          </div>

          {stockLoading ? (
            <div className="text-center py-6">
              <div className="text-xl mb-2">⏳</div>
              <p className="text-gray-600 text-sm">Loading {shopType === 'service' ? 'stock' : 'product'} data...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-3xl mb-2">📦</div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">No {shopType === 'service' ? 'Products' : 'Brands'} Found</h3>
              <p className="text-gray-600 text-sm">Start by adding your first {shopType === 'service' ? 'product' : 'brand'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                
                {/* Products List */}
                <div className="border-r border-orange-200 pr-4">
                  <h3 className="text-md font-bold text-orange-600 mb-3 text-center">
                    {shopType === 'service' ? 'BRANDS' : 'PRODUCTS'}
                  </h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {products.map((product) => {
                      const productVariants = variants.filter(v => 
                        v.productName === product.name || 
                        v.product?.name === product.name ||
                        v.product?._id === product._id
                      );
                      const totalQuantity = calculateTotalQuantity(product.name);
                      const hasLowStockVariant = productVariants.some(v => 
                        parseInt(v.quantity) <= (v.lowStockThreshold || 5)
                      );
                      const isLowStock = hasLowStockVariant;
                      
                      const outOfStockVariants = productVariants.filter(v => {
                        const quantity = parseInt(v.quantity);
                        const threshold = v.lowStockThreshold || 5;
                        return quantity <= threshold;
                      });     
                      return (
                        <div 
                          key={product._id}
                          className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 relative ${
                            selectedProduct && selectedProduct._id === product._id 
                              ? 'border-orange-500 bg-orange-50' 
                              : isLowStock 
                                ? 'bg-red-50' 
                                : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                          onClick={() => handleProductSelect(product)}
                        >
                          {isLowStock && !(selectedProduct && selectedProduct._id === product._id) && (
                            <div 
                              className="absolute inset-0 border-4 border-red-500 animate-pulse rounded-lg pointer-events-none"
                              style={{
                                animation: 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                              }}
                            ></div>
                          )}
                          
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-md flex-shrink-0">
                                {product.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                {editingProduct === product._id ? (
                                  <input
                                    type="text"
                                    value={editProductName}
                                    onChange={(e) => setEditProductName(e.target.value.toUpperCase())}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSaveProductClick(product._id, e)}
                                    className="w-full text-md font-semibold text-gray-800 mb-1 border border-orange-500 rounded px-2 py-1 focus:outline-none text-sm"
                                    autoFocus
                                    style={{ textTransform: 'uppercase' }}
                                  />
                                ) : (
                                  <h4 className="text-md font-semibold text-gray-800 mb-1 text-center">
                                    {product.name}
                                  </h4>
                                )}
                                
                                <div className="flex justify-center items-center gap-50 my-3">
                                  <span className="text-green-800 text-sm font-semibold">
                                    {productVariants.length} {shopType === 'service' ? 'variants' : 'models'}
                                  </span>
                                  <span className={`text-xs font-bold ${
                                    isLowStock ? 'text-red-600' : 'text-blue-800'
                                  }`}>
                                    Total: {totalQuantity} items
                                    {hasLowStockVariant && !isLowStock && ' ⚠️'}
                                  </span>
                                </div>
                                
                                <div className="text-center">
                                  <span className="text-xs font-semibold text-gray-600">
                                    Low Stock: 
                                  </span>
                                  {outOfStockVariants.length === 0 ? (
                                    <span className="text-xs text-green-600 font-semibold ml-1">nil</span>
                                  ) : (
                                    <span className="text-xs text-red-600 font-semibold ml-1">
                                      ({outOfStockVariants.map(v => v.variantName).join(', ')})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-center gap-1 bg-transparent">
                              <button
                                onClick={(e) => handleDeleteProduct(product._id, product.name)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                title="Delete Product"
                              >
                                🗑️
                              </button>

                              {editingProduct === product._id ? (
                                <button
                                  onClick={(e) => handleSaveProductClick(product._id, e)}
                                  className="text-green-500 hover:text-green-700 transition-colors"
                                  title="Save Changes"
                                >
                                  💾
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => handleEditProductClick(product, e)}
                                  className="text-blue-500 hover:text-blue-700 transition-colors"
                                  title="Edit Product Name"
                                >
                                  📝
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Variants List */}
                <div className="pl-4">
                  <h3 className="text-md font-bold text-orange-600 mb-3 text-center">
                    {selectedProduct ? `${selectedProduct.name} - ${shopType === 'service' ? 'STOCKS' : 'MODELS'}` : (shopType === 'service' ? 'STOCKS' : 'MODELS')}
                  </h3>
                  
                  {!selectedProduct ? (
                    <div className="flex items-center justify-center h-full min-h-[200px]">
                      <div className="text-center">
                        <div className="text-3xl mb-2">🔍</div>
                        <p className="text-gray-600 text-sm">Select a {shopType === 'service' ? 'product' : 'brand'} to view its {shopType === 'service' ? 'variants' : 'models'}</p>
                      </div>
                    </div>
                  ) : getSelectedProductVariants().length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[200px]">
                      <div className="text-center">
                        <div className="text-3xl mb-2">📝</div>
                        <p className="text-gray-600 text-sm">No {shopType === 'service' ? 'stocks' : 'models'} found for this {shopType === 'service' ? 'product' : 'brand'}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {getSelectedProductVariants().map((variant) => {
                          const threshold = variant.lowStockThreshold || 5;
                          const isVariantLowStock = parseInt(variant.quantity) <= threshold;
                        
                          return (
                            <div 
                              key={variant._id} 
                              className={`border-2 rounded-lg p-3 relative ${
                                isVariantLowStock 
                                  ? ' bg-red-50' 
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              {isVariantLowStock && (
                                <div 
                                  className="absolute inset-0 border-5 border-red-500 animate-pulse rounded-lg pointer-events-none"
                                  style={{
                                    animation: 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                  }}
                                ></div>
                              )}
                              
                              <div className="flex justify-between items-start">
                                {/* Left Section - Price & Quantity */}
                                <div className="flex flex-col gap-3 w-1/4">
                                  <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 mb-1">Price</span>
                                    {editingVariant === variant._id ? (
                                      <input
                                        type="number"
                                        value={variant.price}
                                        onChange={(e) => handlePriceChange(variant._id, parseFloat(e.target.value) || 0)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleVariantSaveClick(variant._id, e)}
                                        className="text-black w-24 px-2 py-1 border border-orange-500 rounded text-sm focus:outline-none focus:border-orange-500"
                                        min="0"
                                        step="0.01"
                                        placeholder="Price"
                                      />
                                    ) : (
                                      <span className="w-24  py-1 text-sm font-bold text-gray-800">
                                        ₹ {variant.price}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex flex-col ">
                                    <span className="text-xs text-gray-500 mb-1">Quantity</span>
                                    {editingVariant === variant._id ? (
                                      <input
                                        type="number"
                                        value={variant.quantity}
                                        onChange={(e) => handleQuantityChange(variant._id, parseInt(e.target.value) || 0)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleVariantSaveClick(variant._id, e)}
                                        className="text-black w-24 px-2 py-1 border border-orange-500 rounded text-sm focus:outline-none focus:border-orange-500"
                                        min="0"
                                        placeholder="Quantity"
                                      />
                                    ) : (
                                      <span className={`w-24 px-1 py-1 text-sm font-bold ${
                                        isVariantLowStock ? 'text-red-600' : 'text-gray-800'
                                      }`}>
                                        {variant.quantity}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Center Section - Variant Name, Description & Value */}
                                <div className="flex flex-col items-center text-center gap-2 w-2/4 px-4">
                                  <div className="flex flex-col w-full">
                                    {editingVariant === variant._id ? (
                                      <input
                                        type="text"
                                        value={editVariantName}
                                        onChange={(e) => setEditVariantName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleVariantSaveClick(variant._id, e)}
                                        className="text-black w-full px-2 py-1 border border-orange-500 rounded text-sm focus:outline-none focus:border-orange-500 mb-2 mt-1 text-center"
                                        placeholder={`Enter ${shopType === 'service' ? 'variant' : 'model'} name`}
                                      />
                                    ) : (
                                      <span className="text-lg font-semibold text-gray-800">{variant.variantName}</span>
                                    )}
                                  </div>
                                  <div className="flex flex-col w-full">
                                    {editingVariant === variant._id ? (
                                      <textarea
                                        value={editVariantDescription}
                                        onChange={(e) => setEditVariantDescription(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleVariantSaveClick(variant._id, e)}
                                        className="text-black w-full px-2 py-1 border border-orange-500 rounded text-sm focus:outline-none focus:border-orange-500 resize-none text-center"
                                        placeholder="Enter description"
                                        rows="1"
                                      />
                                    ) : (
                                      <span className="text-sm text-gray-600">
                                        {variant.description || "No description"}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex flex-col w-full ">
                                    <span className="text-sm font-semibold text-gray-700">
                                      {shopType === 'service' ? 'Stock' : 'Model'} Value: ₹{(parseFloat(variant.price) * parseInt(variant.quantity)).toFixed(2)}
                                    </span>
                                    <span className="text-xs text-gray-500 ">
                                      Low {shopType === 'service' ? 'stock' : 'model'} alert at: {threshold} items
                                    </span>
                                  </div>
                                </div>

                                {/* Right Section - Action Buttons */}
                                <div className="flex flex-col items-end gap-4 w-1/4 mr-2">
                                  <button
                                    onClick={(e) => handleDeleteVariant(variant._id, variant.variantName)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                    title={`Delete ${shopType === 'service' ? 'Variant' : 'Model'}`}
                                  >
                                    🗑️
                                  </button>
                                  {editingVariant === variant._id ? (
                                    <button
                                      onClick={(e) => handleVariantSaveClick(variant._id, e)}
                                      className="text-green-500 hover:text-green-700 transition-colors"
                                      title="Save Changes"
                                    >
                                      💾
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => handleVariantEditClick(variant, e)}
                                      className="text-blue-500 hover:text-blue-700 transition-colors"
                                      title={`Edit ${shopType === 'service' ? 'Variant' : 'Model'}`}
                                    >
                                      📝
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Variants Summary */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 shadow-sm">
                        <h5 className="font-semibold text-blue-800 mb-3 text-center text-md">
                          {shopType === 'service' ? 'Variants' : 'Models'} Summary
                        </h5>
                        <div className="flex justify-between items-center">
                          <div className="text-center flex-1">
                            <div className="text-gray-600 text-xs">Total {shopType === 'service' ? 'Variants' : 'Models'}</div>
                            <div className="text-black font-semibold text-md">{getSelectedProductVariants().length}</div>
                          </div>
                          <div className="text-center flex-1">
                            <div className="text-gray-600 text-xs">Total Quantity</div>
                            <div className="text-black font-semibold text-md">
                              {getSelectedProductVariants().reduce((sum, variant) => sum + (parseInt(variant.quantity) || 0), 0)}
                            </div>
                          </div>
                          <div className="text-center flex-1">
                            <div className="text-gray-600 text-xs">Total Value</div>
                            <div className="text-black font-semibold text-md">
                              ₹{getSelectedProductVariants().reduce((sum, variant) => sum + (parseFloat(variant.price) * parseInt(variant.quantity) || 0), 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Inventory Summary */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg p-3 text-white shadow-lg">
                  <h3 className="text-lg font-bold mb-3 text-center">
                    TOTAL {shopType === 'service' ? 'INVENTORY' : 'PRODUCT'} SUMMARY
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-xl font-bold mb-2 text-black">
                        {calculateTotalQuantityAllProducts()}
                      </div>
                      <div className="text-md font-semibold text-black">Total Quantity</div>
                      <div className="text-xs opacity-90 text-black">Across all {shopType === 'service' ? 'products and variants' : 'brands and models'}</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-xl font-bold mb-2 text-black">
                        ₹{calculateTotalInvestment().toFixed(2)}
                      </div>
                      <div className="text-md font-semibold text-black">Total Investment</div>
                      <div className="text-xs opacity-90 text-black">Current {shopType === 'service' ? 'stock' : 'product'} value</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Add Product Tab Content */}
    {activeTab === 'addProduct' && (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-md border border-orange-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
              <h2 className="text-xl font-bold text-gray-800">
                ➕ Add New {shopType === 'service' ? 'Brand' : 'Product'}
              </h2>
            </div>
            <button
              onClick={() => {
                setActiveTab('items');
                localStorage.setItem('activeTab', 'items');
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            >
              ← Back to {shopType === 'service' ? 'Stock' : 'Products'}
            </button>
          </div>

          <form onSubmit={handleSaveProductForm}>
            <div className="mb-6">
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🏷️ {shopType === 'service' ? 'Brand' : 'Product'} Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value.toUpperCase()})}
                  placeholder={shopType === 'service' ? "e.g., OPPO, VIVO, ONEPLUS ..." : "e.g., OPPO, VIVO, ONEPLUS ..."}
                  className="text-black w-full border-2 border-gray-300 rounded-lg px-3 py-3 text-lg focus:outline-none focus:border-orange-500 uppercase font-semibold"
                />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Enter {shopType === 'service' ? 'Device brand' : 'Product category'}
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-12 py-4 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border-2 border-orange-400"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">💾</span>
                  Save {shopType === 'service' ? 'Brand' : 'Brand'}
                </span>
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border border-orange-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Add {shopType === 'service' ? 'Stocks' : 'Models'}
            </h3>
            <button
              onClick={addVariant}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center gap-2"
              disabled={products.length === 0}
            >
              <span>+ Add {shopType === 'service' ? 'Stock' : 'Model'}</span>
            </button>
          </div>

          {products.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-700 text-sm">Please save a {shopType === 'service' ? 'product' : 'brand'} first to add {shopType === 'service' ? 'variants' : 'models'}.</p>
            </div>
          )}

          <form onSubmit={handleSaveProductVariants}>
            <div className="space-y-4">
              {productVariants.map((variant, index) => (
                <div key={variant.id} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-800">{shopType === 'service' ? 'Stock' : 'Model'} {index + 1}</h4>
                    {productVariants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {shopType === 'service' ? 'Brand' : 'Product'} *
                      </label>
                      <select
                        value={variant.productName}
                        onChange={(e) => updateProductVariant(variant.id, 'productName', e.target.value)}
                        className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                        required
                      >
                        <option value="">Select {shopType === 'service' ? 'Brand' : 'Product'}</option>
                        {products.map((product) => (
                          <option key={product._id} value={product.name}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {shopType === 'service' ? 'Stock' : 'Model'} Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={variant.variantName}
                        onChange={(e) => updateProductVariant(variant.id, 'variantName', e.target.value)}
                        placeholder={shopType === 'service' ? "e.g., Display, Mike" : "e.g., Y400 Pro 5G, T4x 5G, Reno13 5g"}
                        className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={variant.price}
                        onChange={(e) => updateProductVariant(variant.id, 'price', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        value={variant.quantity}
                        onChange={(e) => updateProductVariant(variant.id, 'quantity', e.target.value)}
                        placeholder="0"
                        min="0"
                        className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        🔴 Low {shopType === 'service' ? 'Stock' : 'Model'} Alert At *
                      </label>
                      <input
                        type="number"
                        required
                        value={variant.lowStockThreshold}
                        onChange={(e) => updateProductVariant(variant.id, 'lowStockThreshold', e.target.value)}
                        placeholder="5"
                        min="0"
                        className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Show warning when {shopType === 'service' ? 'stock' : 'inventory'} reaches this level
                      </p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={variant.description}
                        onChange={(e) => updateProductVariant(variant.id, 'description', e.target.value)}
                        placeholder="Short description"
                        className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:bg-gray-400"
                disabled={products.length === 0 || savingVariants}
              >
                {savingVariants ? 'Saving...' : `Save ${shopType === 'service' ? 'Variants' : 'Models'}`}
              </button>
            </div>
          </form>
        </div>

{/* Offer Message Section */}
<div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
  <div className="flex items-center justify-between mb-2">
    <label className="block text-sm font-semibold text-gray-700">
      📢 Add {shopType === 'service' ? 'Service' : 'Sales'} Offer Message (Optional)
    </label>

    <button
      type="button"
      onClick={() => {
        if (shopType === 'service') {
          setServiceOfferMessage(currentOffer.trim());
        } else {
          setSalesOfferMessage(currentOffer.trim());
        }
        setCurrentOffer(''); // Clear the textarea after adding offer
      }}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
    >
      Add {shopType === 'service' ? 'Service' : 'Sales'} Offer
    </button>
  </div>
  
  <div className="space-y-3">
    <div className="flex flex-col gap-2">
      <textarea
        value={currentOffer}
        onChange={(e) => setCurrentOffer(e.target.value)}
        placeholder={
          shopType === 'service' 
            ? `Enter service offer message here...
            
Example:
🔧 Service Special! 🔧

🎁 20% OFF on next service
📱 Free diagnostic check
⏰ 3 months warranty extension

Trust us with your device! 💙`
            : `Enter sales offer message here...
            
Example:
🛒 Sales Special! 🛒

🎁 Buy 1 Get 10% OFF on accessories  
📱 Free tempered glass with purchase
⏰ 1 year extended warranty

Thank you for shopping with us! 🎉`
        }
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (shopType === 'service') {
              setServiceOfferMessage(currentOffer.trim());
            } else {
              setSalesOfferMessage(currentOffer.trim());
            }
            setCurrentOffer(''); // Clear the textarea after Enter key press
          }
        }}
        rows="4"
        className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:border-blue-500 text-black resize-vertical"
      />
    </div>
    
    {/* Preview Section - Shows current shop type offer */}
    {(shopType === 'service' ? serviceOfferMessage : salesOfferMessage) && (
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-blue-800 text-sm">
            Current {shopType === 'service' ? 'Service' : 'Sales'} Offer:
          </h4>
          <button
            type="button"
            onClick={() => {
              if (shopType === 'service') {
                setServiceOfferMessage('');
              } else {
                setSalesOfferMessage('');
              }
              setCurrentOffer('');
            }}
            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
          >
            🗑️ Remove Offer
          </button>
        </div>
        <div className="bg-white p-3 rounded border border-blue-300 font-mono text-black text-sm whitespace-pre-wrap">
          {shopType === 'service' ? serviceOfferMessage : salesOfferMessage}
        </div>
        <p className="text-xs text-blue-600 mt-2">
          ✅ This exact text will be sent with {shopType === 'service' ? 'service' : 'sales'} bills
        </p>
      </div>
    )}
    
    {/* No Offer State */}
    {!(shopType === 'service' ? serviceOfferMessage : salesOfferMessage) && (
      <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <p className="text-gray-500 text-sm">
          No {shopType === 'service' ? 'service' : 'sales'} offer message added
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {shopType === 'service' ? 'Service' : 'Sales'} bills will be sent without any offer message
        </p>
      </div>
    )}

    {/* Show other shop type offer status */}
    {shopType === 'service' && salesOfferMessage && (
      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-700 text-xs">
          💡 <strong>Sales Offer Available:</strong> A separate sales offer is saved and will be used for sales bills
        </p>
      </div>
    )}
    
    {shopType === 'sales' && serviceOfferMessage && (
      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-700 text-xs">
          💡 <strong>Service Offer Available:</strong> A separate service offer is saved and will be used for service bills
        </p>
      </div>
    )}
  </div>
</div>

      </div>
    )}

    {/* Customers Table */}
    {activeTab !== 'items' && activeTab !== 'addProduct' && (
      <>
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-orange-100">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
                <h2 className="text-xl font-bold text-gray-800">
                  {shopType === 'service' ? 'Service' : 'Sales'} Customer Records
                </h2>
              </div>
              <div className="text-xs text-gray-500 bg-orange-50 px-2 py-1 rounded-full">
                Total: {customers.length} records
              </div>
            </div>
            
            {customers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-base font-semibold mb-1">No {shopType} records found</p>
                <p className="text-xs">Add your first customer or adjust your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-500 to-amber-500">
                      <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Date & Time</th>
                      <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Invoice No.</th>
                      <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Customer Name</th>
                      <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Phone</th>
                      <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Brand</th>
                      
                      {/* Conditionally render columns based on shop type */}
                      {shopType === 'service' ? (
                        <>
                          <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Stock Item</th>
                          <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Password</th>
                          <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider">Issue</th>
                          <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Expected Delivery</th>
                          <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider w-30">Warranty Days</th> {/* ADD THIS */}
                          <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider">Status</th>
                          <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Cost (₹)</th>
                          <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Paid (₹)</th>
                          <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Balance (₹)</th>
                        </>
                      ) : (
                        <>
                          <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Model Item</th>
                          <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider w-35">Warranty Days</th>
                          <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider">Payment Mode</th>
                          <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider">Cost (₹)</th>
                        </>
                      )}
                      
                      <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCustomersWithDailyTotals().map((item) => {
                      if (item.type === 'dailyTotal') {
                        const dailyData = item.data;
                        return (
                          <tr key={item.id} className="bg-blue-50 border-t-2 border-blue-200">
                            <td className="border border-gray-300 px-3 py-3 font-bold text-blue-800 whitespace-nowrap text-sm">
                              {new Date(dailyData.date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </td>
                            <td colSpan={shopType === 'service' ? "10" : "6"} className="border border-gray-300 px-4 py-3 font-bold text-blue-800 text-center text-sm">
                              📊 Daily Total ({dailyData.count} {dailyData.count === 1 ? 'bill' : 'bills'})
                            </td>
                            <td colSpan={shopType === 'service' ? "3" : "2"} className="border border-gray-300 px-3 py-3 font-bold text-green-700 whitespace-nowrap text-center">
                              Daily Income : ₹{dailyData.totalCost.toFixed(2)}
                            </td>
                            <td colSpan="3" className="border border-gray-300"></td>
                          </tr>
                        );
                      } else {
                        const customer = item.data;
                        return (
                          <tr key={item.id} className="hover:bg-orange-50 transition-colors duration-200 border-b border-gray-200">
                            <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                              {formatDateTime(customer.date)}
                            </td>
                            <td className="border border-gray-200 px-3 py-2 font-mono whitespace-nowrap text-blue-600 bg-blue-50 text-xs">
                              {customer.invoiceNumber}
                            </td>
                            <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-800 font-medium text-sm">
                              {customer.customerName}
                            </td>
                            <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                              {customer.phone}
                            </td>
                            <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                              {customer.brand || 'N/A'}
                            </td>
                            
                            {/* Service-specific columns */}
                            {shopType === 'service' ? (
                              <>
                                <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                                  {customer.stock || 'N/A'}
                                </td>
                                <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                                  {customer.password ? (
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono">
                                        {customer.showPassword ? customer.password : '••••••'}
                                      </span>
                                      <span
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const updatedCustomers = customers.map(c => 
                                            c._id === customer._id 
                                              ? { ...c, showPassword: !c.showPassword }
                                              : c
                                          );
                                          setCustomers(updatedCustomers);
                                          
                                          const updatedAllCustomers = allCustomers.map(c => 
                                            c._id === customer._id 
                                              ? { ...c, showPassword: !c.showPassword }
                                              : c
                                          );
                                          setAllCustomers(updatedAllCustomers);
                                        }}
                                        className="text-gray-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xl"
                                        title={customer.showPassword ? 'Hide password' : 'Show password'}
                                      >
                                        {customer.showPassword ? '👁️' : '👁'}
                                      </span>
                                    </div>
                                  ) : 'N/A'}
                                </td>
                                <td 
                                  className={`border border-gray-200 px-3 py-2 cursor-pointer transition-all duration-200 ${
                                    customer.showIssue ? 'bg-orange-50' : ''
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const updatedCustomers = customers.map(c => 
                                      c._id === customer._id 
                                        ? { ...c, showIssue: !c.showIssue }
                                        : c
                                    );
                                    setCustomers(updatedCustomers);
                                    
                                    const updatedAllCustomers = allCustomers.map(c => 
                                      c._id === customer._id 
                                        ? { ...c, showIssue: !c.showIssue }
                                        : c
                                    );
                                    setAllCustomers(updatedAllCustomers);
                                  }}
                                  title="Click to expand/collapse issue"
                                >
                                  {customer.showIssue ? (
                                    <div className="text-gray-700 text-sm whitespace-normal break-words max-w-xs">
                                      {customer.issue || 'No issue description'}
                                    </div>
                                  ) : (
                                    <div className="text-gray-600 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                                      {customer.issue ? (
                                        <>
                                          📝 {customer.issue.length > 10 ? `${customer.issue.substring(0, 10)}...` : customer.issue}
                                        </>
                                      ) : (
                                        'N/A'
                                      )}
                                    </div>
                                  )}
                                </td>
<td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-center">
  <input
    type="text"
    value={customer.expectedDelivery || ''}
    onChange={(e) => handleExpectedDeliveryChange(customer._id, e.target.value)}
    onBlur={(e) => handleExpectedDeliverySave(customer._id, e.target.value)}
    onKeyPress={(e) => e.key === 'Enter' && e.target.blur()}
    className="w-24 text-purple-600 text-center font-medium border border-gray-300 rounded px-1 py-1 focus:outline-none focus:border-purple-500 text-sm mx-auto block"
    placeholder="DD/MM/YYYY"
    maxLength="10"
  />
</td>
<td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-center">
  <input
    type="number"
    value={customer.warrantyDays || ''}
    onChange={(e) => handleWarrantyDaysChange(customer._id, e.target.value)}
    onBlur={(e) => handleWarrantyDaysSave(customer._id, e.target.value)}
    onKeyPress={(e) => e.key === 'Enter' && e.target.blur()}
    className="w-16 text-purple-600 text-center font-medium border border-gray-300 rounded px-1 py-1 focus:outline-none focus:border-purple-500 text-sm mx-auto block [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    placeholder="0"
    min="0"
  />
</td>
                                <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">
                                  <select
                                    value={customer.status}
                                    onChange={(e) => handleStatusChange(customer._id, e.target.value)}
                                    className={`px-2 py-1 rounded-lg text-xs font-semibold border-0 focus:ring-1 focus:ring-orange-300 cursor-pointer transition-all duration-200 ${
                                      customer.status === 'paid' 
                                        ? 'bg-green-500 text-white hover:bg-green-600 shadow' 
                                        : customer.status === 'part paid'
                                        ? 'bg-yellow-500 text-white hover:bg-yellow-600 shadow'
                                        : 'bg-red-500 text-white hover:bg-red-600 shadow'
                                    }`}
                                  >
                                    <option value="not paid" className="bg-red-500 text-white">Not Paid</option>
                                    <option value="part paid" className="bg-yellow-500 text-white">Part Paid</option>
                                    <option value="paid" className="bg-green-500 text-white">Paid</option>
                                  </select>
                                </td>
                                <td className="border border-gray-200 px-3 py-2 font-semibold whitespace-nowrap text-green-600 text-base">
                                  ₹{customer.cost.toFixed(2)}
                                </td>
                                <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">
                                  <input
                                    type="number"
                                    value={customer.paidAmount || ' '}
                                    onChange={(e) => handlePaidAmountChange(customer._id, e.target.value)}
                                    onBlur={(e) => handlePaidAmountSave(customer._id, e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && e.target.blur()}
                                    className="w-20 text-blue-600 font-semibold text-center border border-gray-300 rounded px-1 py-1 focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    min="0"
                                    step="0.01"
                                    placeholder='0'
                                  />
                                </td>
                                <td className="border border-gray-200 px-3 py-2 font-semibold whitespace-nowrap text-red-600 text-base">
                                  ₹{(customer.balance || customer.cost || 0).toFixed(2)}
                                </td>
                              </>
                            ) : (
                              /* Sales-specific columns */
                              <>
                                <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                                  {customer.model || 'N/A'}
                                </td>
<td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-center">
  <input
    type="number"
    value={customer.warrantyDays || ''}
    onChange={(e) => handleWarrantyDaysChange(customer._id, e.target.value)}
    onBlur={(e) => handleWarrantyDaysSave(customer._id, e.target.value)}
    onKeyPress={(e) => e.key === 'Enter' && e.target.blur()}
    className="w-16 text-purple-600 text-center font-medium border border-gray-300 rounded px-1 py-1 focus:outline-none focus:border-purple-500 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none mx-auto block"
    placeholder="0"
    min="0"
  />
</td>
<td className="border border-gray-200 px-3 py-2 whitespace-nowrap w-40">
  <div className="flex justify-center items-center">
    <div className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
      customer.paymentMode === 'cash' 
        ? 'bg-green-50 text-green-700 border-l-4 border-green-500' 
        : 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
    }`}>
      <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
        customer.paymentMode === 'cash' ? 'bg-green-500' : 'bg-blue-500'
      }`}></div>
      {customer.paymentMode === 'cash' ? 'Cash' : 'Gpay'}
    </div>
  </div>
</td>
                                <td className="border border-gray-200 px-3 py-2 font-semibold whitespace-nowrap text-green-600 text-base">
                                  ₹{customer.cost.toFixed(2)}
                                </td>
                              </>
                            )}
                            
<td className="border border-gray-200 px-3 py-2 whitespace-nowrap">
  <div className="flex items-center gap-2">
    <div className="flex gap-1">
      {/* Print Button */}
      <button
        onClick={() => handleAction(customer._id, 'print')}
        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-all duration-200 font-semibold shadow hover:shadow-sm flex items-center gap-1"
        title={`Print ${customer.shopType === 'service' ? '4 Inch' : 'A4'} Bill`}
      >
        🖨️
      </button>
      
      {/* Download Button */}
      <button
        onClick={() => handleAction(customer._id, 'download')}
        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-all duration-200 font-semibold shadow hover:shadow-sm flex items-center gap-1"
        title="Download A4 PDF"
      >
        ⬇️
      </button>
      
      {/* WhatsApp Button */}
      <button
        onClick={() => handleWhatsAppPDF(customer._id)}
        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-all duration-200 font-semibold shadow hover:shadow-sm flex items-center gap-1"
        title="Send via WhatsApp"
      >
        ✅
      </button>
    </div>
    {actionStatus[customer._id] && (
      <span className="text-xs text-gray-600 ml-1 bg-gray-100 px-2 py-1 rounded-full">
        {actionStatus[customer._id]}
      </span>
    )}
  </div>
</td>

                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Income Summary */}
        <div className="bg-white rounded-xl p-4 shadow-lg mt-4 border border-orange-200">
          <h3 className="text-lg font-bold mb-4 text-center text-gray-800">
            💰 {shopType === 'service' ? 'SERVICE' : 'SALES'} INCOME SUMMARY
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 transform hover:scale-105 transition-transform duration-300">
              <div className="text-2xl font-bold mb-2 text-gray-800">
                ₹{summary.todayIncome.toFixed(2)}
              </div>
              <div className="text-sm font-semibold mb-1 text-gray-700">Today's Income</div>
              <div className="text-xs text-gray-600">Paid amounts received today</div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 transform hover:scale-105 transition-transform duration-300">
              <div className="text-2xl font-bold mb-2 text-gray-800">
                ₹{summary.pendingBalance.toFixed(2)}
              </div>
              <div className="text-sm font-semibold mb-1 text-gray-700">Pending Balance</div>
              <div className="text-xs text-gray-600">Awaiting payment clearance</div>
            </div>

            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 transform hover:scale-105 transition-transform duration-300">
              <div className="text-2xl font-bold mb-2 text-gray-800">
                ₹{summary.totalIncome.toFixed(2)}
              </div>
              <div className="text-sm font-semibold mb-1 text-gray-700">Total Revenue</div>
              <div className="text-xs text-gray-600">All-time business earnings</div>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
);

};