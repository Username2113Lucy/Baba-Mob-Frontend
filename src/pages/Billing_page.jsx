import React, { useState, useEffect } from 'react';

// ✅ Works in both environments
const API_BASE = import.meta.env.VITE_API_BASE_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://baba-mob-backend.onrender.com');
    
// ✅ CORRECT: Use separate endpoints matching your backend routes
const CUSTOMER_API = `${API_BASE}/customer_log/customers`;
const PRODUCT_API = `${API_BASE}/products`;
const VARIANT_API = `${API_BASE}/variants`;
const WHATSAPP_API = `${API_BASE}/whatsapp`;
const ACCESSORY_API = `${API_BASE}/accessories`;
const STOCK_API = `${API_BASE}/stock-items`;
const DEALERS_API = `${API_BASE}/dealers`;

export const Billing_page = () => {
const [activeTab, setActiveTab] = useState(() => {
  return localStorage.getItem('activeTab') || 'addCustomer';
});

// ✅ UPDATED: Save to localStorage whenever activeTab changes
useEffect(() => {
  localStorage.setItem('activeTab', activeTab);
}, [activeTab]);

  const [shopType, setShopType] = useState(() => {
    return localStorage.getItem('shopType') || 'service';
  });

  const [customers, setCustomers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  
  // Update customerData
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    address: '', 
    issue: '',
    cost: '',
    brand: '',
    stock: '',
    model: '',
    password: '',
    paymentMode: '',
    financeCompany: '', // ✅ ADDED
    warrantyDays: '',
    imei: '',
    cashier: '',
    gstNumber: ''
  });

  const [actionStatus, setActionStatus] = useState({});

  // Add these to your component state - SEPARATE FOR SALES AND SERVICE
  const [salesOfferMessage, setSalesOfferMessage] = useState('');
  const [serviceOfferMessage, setServiceOfferMessage] = useState('');
  const [currentOffer, setCurrentOffer] = useState('');

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
  // In your productVariants state, ensure no undefined values
const [productVariants, setProductVariants] = useState([
  { 
    id: 1, 
    productName: '', 
    variantName: '', 
    description: '', 
    price: '', // Empty string instead of undefined
    quantity: '', // Empty string instead of undefined
    lowStockThreshold: '5'
  }
]);
  const [savingVariants, setSavingVariants] = useState(false);

  const [accessoryData, setAccessoryData] = useState({
    transactions: [],
    dailyTotals: []
  });

  // Add these state variables
  const [salesFilterTab, setSalesFilterTab] = useState('customer');
  const [stockFilterData, setStockFilterData] = useState({
    imei: '',
    brand: '',
    model: '',
    status: '',
    dealer: '',
    hsn: '',
    fromDate: '',
    toDate: ''
  });

  const [filteredStockItems, setFilteredStockItems] = useState([]);

// Update your stockFormData state to include error messages
const [stockFormData, setStockFormData] = useState([{
  product: '',
  model: '',
  imei: '',
  hsn: '',
  dealer: '',
  cost: '',
  copyFromPrevious: false,
  error: '' // ✅ Add error field for each row
}]);
const [applyToAll, setApplyToAll] = useState(false);
const [duplicateIMEIs, setDuplicateIMEIs] = useState(new Set());
const [existingIMEIs, setExistingIMEIs] = useState(new Set());


  // Add this useEffect to fetch data when component loads
  useEffect(() => {
    if (shopType === 'accessories') {
      fetchAccessories();
    }
  }, [shopType]);

  // Add these to your component state
const [multiBrandCustomers, setMultiBrandCustomers] = useState([]);
const [multiBrandData, setMultiBrandData] = useState({
  name: '',
  phone: '',
  address: '',
  cost: '',
  brand: '',
  model: '',
  paymentMode: '',
  financeCompany: '', // ✅ ADDED
  warrantyDays: '',
  imei: '',
  cashier: '',
  gstNumber: '' 
});

// Add this state for multi-brand action status
const [multiBrandActionStatus, setMultiBrandActionStatus] = useState({});

  // Also fetch when component first mounts
  useEffect(() => {
    fetchAllCustomers();
    fetchStockData();
    fetchDealers();
    
    const savedShopType = localStorage.getItem('shopType');
    if (savedShopType === 'accessories') {
      fetchAccessories();
    }
  }, []);

  const [accessoryForm, setAccessoryForm] = useState({
    type: 'investment',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Add these state variables
  const [accessoryFilterDate, setAccessoryFilterDate] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Add this useEffect to initialize filtered transactions
  useEffect(() => {
    setFilteredTransactions(accessoryData.transactions);
  }, [accessoryData.transactions]);

  // Add these state variables
  const [stockItems, setStockItems] = useState([]);
  const [bulkStockForm, setBulkStockForm] = useState([
    { imei: '', dealer: '', cost: '', hsn: '' }
  ]);
  const [selectedVariantForStock, setSelectedVariantForStock] = useState(null);

  // Add this to your state variables
const [expandedDealer, setExpandedDealer] = useState(null);
  // Add to your component state
  const [dealers, setDealers] = useState([]);
  const [dealerForm, setDealerForm] = useState({
    name: '',
    contact: '',
    address: '',
    gstNumber: '',
  });
  const [editingDealer, setEditingDealer] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showImeiDropdown, setShowImeiDropdown] = useState(false);
const [showMultiBrandImeiDropdown, setShowMultiBrandImeiDropdown] = useState(false);


// Add to your component state
const [selectedDealerForDetails, setSelectedDealerForDetails] = useState(null);
const [dealerPaymentDetails, setDealerPaymentDetails] = useState([]);
const [showPaymentDetails, setShowPaymentDetails] = useState(false);
// ✅ SIMPLIFIED PAYMENT FORM
const [dealerPaymentForm, setDealerPaymentForm] = useState({
  dealer: '',
  amount: '',
  totalAmount: '', // This will be calculated from stock items
  date: new Date().toLocaleDateString('en-IN') // This gives "DD/MM/YYYY"

});


  // 🧾 Cashier State (Separate for Service and Sales)
  const [serviceCashiers, setServiceCashiers] = useState([]);
  const [salesCashiers, setSalesCashiers] = useState([]);
  const [cashierName, setCashierName] = useState('');
  const [editingCashier, setEditingCashier] = useState(null);
  const [editCashierName, setEditCashierName] = useState('');

  // ✅ Load cashiers from localStorage on component mount
  useEffect(() => {
    const savedCashiers = loadCashiersFromLocalStorage();
    setServiceCashiers(savedCashiers?.service || []);
    setSalesCashiers(savedCashiers?.sales || []);
  }, []);

  // ✅ Save cashiers to localStorage whenever cashiers change
  useEffect(() => {
    if (serviceCashiers.length > 0 || salesCashiers.length > 0) {
      saveCashiersToLocalStorage({
        service: serviceCashiers,
        sales: salesCashiers
      });
    }
  }, [serviceCashiers, salesCashiers]);

  // Add these to your component state
const [editVariantPrice, setEditVariantPrice] = useState('');
const [editVariantQuantity, setEditVariantQuantity] = useState('');

// Add this state to track HSN dropdown and dealer HSN codes
const [showHsnDropdown, setShowHsnDropdown] = useState(false);
const [dealerHsnCodes, setDealerHsnCodes] = useState({}); // {dealerId: [hsn1, hsn2, ...]}

// In your DealersList component, add this state and function
const [clickedElement, setClickedElement] = useState(null);

const handleRowClick = (dealer, e) => {
  // If the click came from a button or no-expand element, don't expand
  if (e.target.closest('button') || e.target.closest('.no-expand') || e.target.tagName === 'BUTTON') {
    return;
  }
  
  setExpandedDealer(expandedDealer === dealer._id ? null : dealer._id);
};


  // localStorage utility functions for cashiers
  const CASHIERS_STORAGE_KEY = 'billing_cashiers';

  const saveCashiersToLocalStorage = (cashiers) => {
    try {
      localStorage.setItem(CASHIERS_STORAGE_KEY, JSON.stringify(cashiers));
      console.log('💰 Saved cashiers to localStorage:', cashiers);
    } catch (error) {
      console.error('Error saving cashiers to localStorage:', error);
    }
  };

  const loadCashiersFromLocalStorage = () => {
    try {
      const item = localStorage.getItem(CASHIERS_STORAGE_KEY);
      const cashiers = item ? JSON.parse(item) : { service: [], sales: [] };
      console.log('💰 Loaded cashiers from localStorage:', cashiers);
      return cashiers;
    } catch (error) {
      console.error('Error loading cashiers from localStorage:', error);
      return { service: [], sales: [] };
    }
  };

  // Filter functions
  const handleApplyAccessoryFilter = () => {
    if (!accessoryFilterDate) {
      setFilteredTransactions(accessoryData.transactions);
      return;
    }

    const filtered = accessoryData.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const filterDate = new Date(accessoryFilterDate.split('/').reverse().join('-'));
      
      return transactionDate.toDateString() === filterDate.toDateString();
    });

    setFilteredTransactions(filtered);
  };

  const handleResetAccessoryFilter = () => {
    setAccessoryFilterDate('');
    setFilteredTransactions(accessoryData.transactions);
  };

  // Update the fetchStockData function
  const fetchStockData = async () => {
    try {
      setStockLoading(true);
      
      const productsResponse = await fetch(`${PRODUCT_API}?shopType=${shopType}`);
      if (!productsResponse.ok) {
        throw new Error(`Products fetch error: ${productsResponse.status}`);
      }
      const productsResult = await productsResponse.json();
      
      if (productsResult.success) {
        setProducts(productsResult.data);
      }

      const variantsResponse = await fetch(`${VARIANT_API}?shopType=${shopType}`);
      if (!variantsResponse.ok) {
        throw new Error(`Variants fetch error: ${variantsResponse.status}`);
      }
      const variantsResult = await variantsResponse.json();
      
      if (variantsResult.success) {
        setVariants(variantsResult.data);
      }

      // Fetch stock items for sales - FIXED URL
      if (shopType === 'sales') {
        const stockResponse = await fetch(`${STOCK_API}?shopType=sales`);
        if (stockResponse.ok) {
          const stockResult = await stockResponse.json();
          if (stockResult.success) {
            setStockItems(stockResult.data);
            setFilteredStockItems(stockResult.data); // Initialize filtered stock items
          }
        } else {
          console.log('No stock items found or endpoint not ready');
        }
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      alert('Error fetching stock data: ' + error.message);
    } finally {
      setStockLoading(false);
    }
  };

  // Update all these functions to use API_BASE instead of API_BASE_URL
  const saveProduct = async (productData) => {
    try {
      const response = await fetch(`${PRODUCT_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: productData.name.toUpperCase(),
          shopType: shopType
        })
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Product save result:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error saving product:', error);
      throw error;
    }
  };

const saveVariants = async (variantsData) => {
  try {
    console.log('📤 Starting to save variants...');
    console.log('🏪 Shop type:', shopType);
    console.log('📋 Variants data:', variantsData);

    const variantsToSave = variantsData.map(variant => {
      const baseVariant = {
        productName: variant.productName.trim(),
        variantName: variant.variantName.trim(),
        description: (variant.description || '').trim(),
        lowStockThreshold: parseInt(variant.lowStockThreshold) || 5,
        shopType: shopType,
      };

      // Only add sellingPrice and quantity for service
      if (shopType === 'service') {
        baseVariant.sellingPrice = parseFloat(variant.price) || 0; // Send as sellingPrice
        baseVariant.quantity = parseInt(variant.quantity) || 0;
      } else {
        // For sales, still send sellingPrice as 0
        baseVariant.sellingPrice = 0;
        baseVariant.quantity = 0;
      }

      return baseVariant;
    });

    console.log('📤 Sending variants to backend:', JSON.stringify(variantsToSave, null, 2));

    const response = await fetch(`${VARIANT_API}/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ variants: variantsToSave }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('📥 Backend response:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Error saving variants:', error);
    throw error;
  }
};

  const updateProduct = async (productId, productData) => {
    try {
      const response = await fetch(`${PRODUCT_API}/${productId}`, {
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
      const response = await fetch(`${PRODUCT_API}/${productId}`, {
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
      const response = await fetch(`${VARIANT_API}/${variantId}`, {
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
      const response = await fetch(`${VARIANT_API}/${variantId}`, {
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

// Update the updateProductVariant function to handle empty values
const updateProductVariant = (id, field, value) => {
  setProductVariants(productVariants.map(variant => 
    variant.id === id ? { ...variant, [field]: value || '' } : variant
  ));
};

// For sales shop type, initialize without price and quantity
useEffect(() => {
  if (shopType === 'sales') {
    setProductVariants([{ 
      id: 1, 
      productName: '', 
      variantName: '', 
      description: '', 
      lowStockThreshold: '5'
      // No price or quantity for sales
    }]);
  } else {
    setProductVariants([{ 
      id: 1, 
      productName: '', 
      variantName: '', 
      description: '', 
      price: '', 
      quantity: '',
      lowStockThreshold: '5'
    }]);
  }
}, [shopType]);

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
    console.log('🔄 Starting variant save process...');
    console.log('🏪 Shop type:', shopType);
    console.log('📋 Variants to save:', productVariants);
    
    // ✅ DIFFERENT VALIDATION FOR SERVICE VS SALES
    let hasEmptyFields = false;
    let validationErrors = [];
    
    if (shopType === 'service') {
      // Service validation: needs productName, variantName, price, quantity
      productVariants.forEach((variant, index) => {
        if (!variant.productName?.trim() || !variant.variantName?.trim() || !variant.price || !variant.quantity) {
          hasEmptyFields = true;
          validationErrors.push(`Variant ${index + 1} is missing required fields`);
        }
      });
    } else {
      // Sales validation: only needs productName, variantName (NO price/quantity)
      productVariants.forEach((variant, index) => {
        if (!variant.productName?.trim() || !variant.variantName?.trim()) {
          hasEmptyFields = true;
          validationErrors.push(`Model ${index + 1} is missing required fields`);
        }
      });
    }
    
    console.log('📊 Validation result - hasEmptyFields:', hasEmptyFields);
    console.log('📊 Validation errors:', validationErrors);
    
    if (hasEmptyFields) {
      if (shopType === 'service') {
        alert('Please fill all required fields in all variants (Product, Variant Name, Price, Quantity)');
      } else {
        alert('Please fill all required fields in all models (Product, Model Name)');
      }
      setSavingVariants(false);
      return;
    }
    
    if (products.length === 0) {
      alert('Please save a product first before adding variants');
      setSavingVariants(false);
      return;
    }

    console.log('✅ All validations passed, saving variants...');
    const result = await saveVariants(productVariants);

    if (result.success) {
      const savedCount = result.data ? result.data.length : 0;
      alert(`Successfully saved ${savedCount} ${shopType === 'service' ? 'variants' : 'models'}!`);
      
      // ✅ RESET FORM BASED ON SHOP TYPE
      if (shopType === 'service') {
        setProductVariants([{ 
          id: 1, 
          productName: '', 
          variantName: '', 
          description: '', 
          price: '', 
          quantity: '',
          lowStockThreshold: '5'
        }]);
      } else {
        setProductVariants([{ 
          id: 1, 
          productName: '', 
          variantName: '', 
          description: '', 
          lowStockThreshold: '5'
          // No price or quantity for sales
        }]);
      }
      
      await fetchStockData();
    } else {
      const errorMessage = result.message || `Failed to save ${shopType === 'service' ? 'variants' : 'models'}`;
      const errors = result.errors ? `\nErrors: ${result.errors.join(', ')}` : '';
      alert(`${errorMessage}${errors}`);
    }
  } catch (error) {
    console.error('Error saving variants:', error);
    alert(`Error saving ${shopType === 'service' ? 'variants' : 'models'}: ` + error.message);
  } finally {
    setSavingVariants(false);
  }
};

// Add this temporary debug function
const debugVariants = () => {
  console.log('=== DEBUG VARIANT VALIDATION ===');
  console.log('Shop Type:', shopType);
  console.log('Current Variants:', productVariants);
  
  productVariants.forEach((variant, index) => {
    console.log(`Variant ${index + 1}:`, {
      productName: variant.productName,
      variantName: variant.variantName,
      price: variant.price,
      quantity: variant.quantity,
      isValid: !variant.productName?.trim() || !variant.variantName?.trim() ? 'INVALID' : 'VALID'
    });
  });
};

// Add a temporary debug button in your JSX
<button 
  onClick={debugVariants}
  className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
>
  🐛 Debug Validation
</button>

  const calculateTotalQuantityAllProducts = () => {
    if (!variants || variants.length === 0) return 0;
    
    return variants.reduce((total, variant) => {
      const quantity = parseInt(variant.quantity) || 0;
      return total + quantity;
    }, 0);
  };

  // Update the calculateTotalInvestment function
  const calculateTotalInvestment = () => {
    if (!variants || variants.length === 0) return 0;
    
    return variants.reduce((total, variant) => {
      const price = parseFloat(variant.sellingPrice) || 0;
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

// Fetch all customers (EXCLUDING multi-brand)
const fetchAllCustomers = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...filters,
      shopType: shopType,
      billType: 'regular' // ✅ EXCLUDE multi-brand by default
    }).toString();
    
    const response = await fetch(`${CUSTOMER_API}?${queryParams}`);
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
      const response = await fetch(`${CUSTOMER_API}?${queryParams}`);
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
      const response = await fetch(`${CUSTOMER_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...customerData,
          shopType: shopType
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
      const response = await fetch(`${CUSTOMER_API}/${customerId}/status`, {
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

// ✅ SIMPLE: Invoice number generation without reset
const generateInvoiceNumber = () => {
  const prefix = shopType === 'sales' ? 'B' : 'SV';
  
  // Filter customers for current shop type (excluding multi-brand)
  const shopCustomers = allCustomers.filter(customer => 
    customer.shopType === shopType && 
    customer.billType !== 'multi-brand'
  );
  
  // If no customers, start from 001
  if (shopCustomers.length === 0) {
    return shopType === 'sales' ? 'B001' : 'SV001';
  }
  
  // Extract numbers from existing invoice numbers
  const numbers = shopCustomers.map(customer => {
    if (!customer.invoiceNumber) return 0;
    
    // Remove prefix and convert to number
    const numberStr = customer.invoiceNumber.replace(prefix, '');
    return parseInt(numberStr) || 0;
  });
  
  // Find the highest number and increment
  const maxNumber = Math.max(...numbers);
  const nextNumber = maxNumber + 1;
  
  return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
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

// ✅ UPDATED: Get ALL available IMEIs (independent of model)
const getAvailableIMEIs = (formType = 'regular') => {
  try {
    // Ensure stockItems is loaded and has data
    if (!stockItems || stockItems.length === 0) {
      return [];
    }
    
    // Return ALL in-stock IMEIs, not filtered by model
    return stockItems.filter(item => item.status === 'in_stock');
  } catch (error) {
    console.error('Error getting available IMEIs:', error);
    return [];
  }
};

// Add a function to refresh stock data when multi-brand tab is opened
useEffect(() => {
  if (activeTab === 'multibrand' && shopType === 'sales') {
    // Refresh stock data to ensure IMEI list is current
    fetchStockData();
  }
}, [activeTab, shopType]);

  const availableIMEIs = getAvailableIMEIs();

const handleAddCustomer = async () => {
  // Enhanced validation for sales
  if (shopType === 'sales') {
    if (!customerData.name || !customerData.phone || !customerData.cost || 
        !customerData.brand || !customerData.model || !customerData.paymentMode || 
        !customerData.imei || !customerData.cashier) {
      alert('Please fill all required fields for sales customer');
      return;
    }
    
    // ✅ ADDED: Special validation for EMI
    if (customerData.paymentMode === 'emi' && !customerData.financeCompany) {
      alert('Please select a finance company for EMI payment');
      return;
    }
  } else {
    // Service validation
    if (!customerData.name || !customerData.phone || !customerData.cost || 
        !customerData.brand || !customerData.stock || !customerData.cashier) {
      alert('Please fill all required fields for service customer');
      return;
    }
  }

  try {
    const invoiceNumber = generateInvoiceNumber();

    // Prepare customer data
    const newCustomer = {
      invoiceNumber: invoiceNumber,
      customerName: customerData.name,
      phone: customerData.phone,
      address: customerData.address, // ✅ ADDED: Mandatory address
      cost: parseFloat(customerData.cost),
      brand: customerData.brand,
      stock: customerData.stock || '',
      model: customerData.model || '',
      password: customerData.password || '',
      paymentMode: customerData.paymentMode || '',
      financeCompany: customerData.paymentMode === 'emi' ? customerData.financeCompany : '', // ✅ ADDED
      warrantyDays: parseInt(customerData.warrantyDays) || 0,
      imei: customerData.imei || '',
      cashier: customerData.cashier,
      shopType: shopType,
      issue: customerData.issue || '',
      status: 'not paid',
      balance: parseFloat(customerData.cost),
      gstNumber: shopType === 'sales' ? customerData.gstNumber || '' : '' // ✅ ADDED: GST number only for sales
    };

    console.log('📤 Creating customer:', newCustomer);

    // ✅ FIXED: Use the correct API endpoint
    const response = await fetch(`${CUSTOMER_API}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCustomer)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    if (result.success) {
      const savedCustomer = result.data;
      
      // ✅ For sales: Mark stock item as sold
      if (shopType === 'sales' && customerData.imei) {
        try {
          const stockItem = stockItems.find(item => item.imei === customerData.imei);
          if (stockItem) {
            await fetch(`${STOCK_API}/${stockItem._id}/sold`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ customerId: savedCustomer._id })
            });
            console.log('✅ Stock item marked as sold');
          }
        } catch (stockError) {
          console.error('⚠️ Error updating stock item:', stockError);
          // Continue even if stock update fails
        }
      }

      // Update local state
      const updatedCustomers = [savedCustomer, ...customers];
      const updatedAllCustomers = [savedCustomer, ...allCustomers];
      
      setCustomers(updatedCustomers);
      setAllCustomers(updatedAllCustomers);
      
// Reset form
setCustomerData({ 
  name: '', phone: '', address: '', issue: '', cost: '', brand: '', stock: '', model: '',
  password: '', paymentMode: '', financeCompany: '', warrantyDays: '', imei: '', cashier: '', 
  gstNumber: '' // ✅ Add this
});
      
      alert(`✅ Customer added successfully! Invoice: ${invoiceNumber}`);
      
      // Refresh data
      await fetchAllCustomers();
      if (shopType === 'sales') {
        await fetchStockData();
      }
      
    } else {
      throw new Error(result.message || 'Failed to create customer');
    }
  } catch (error) {
    console.error('❌ Error creating customer:', error);
    alert('Error creating customer: ' + error.message);
  }
};

// Handle status change - FIXED VERSION with proper payment handling
const handleStatusChange = async (customerId, newStatus) => {
  try {
    const customer = customers.find(c => c._id === customerId);
    const oldStatus = customer.status;
    
    console.log('🔄 Status Change:', { 
      customerId, 
      oldStatus, 
      newStatus, 
      paidAmount: customer.paidAmount, 
      cost: customer.cost,
      stock: customer.stock,
      shopType: customer.shopType
    });
    
    // 🎯 AUTO-CORRECTION: If fully paid, always set to 'paid'
    if (customer.paidAmount >= customer.cost && newStatus === 'part paid') {
      console.log('🎯 Auto-correcting: part paid → paid (fully paid)');
      newStatus = 'paid';
    }

    // 🎯 PAYMENT AMOUNT LOGIC BASED ON STATUS TRANSITIONS
    let updatedPaidAmount = customer.paidAmount;
    let updatedBalance = customer.balance;

    if (newStatus === 'returned') {
      console.log('🔄 Processing return...');
      await handleReturnStatus(customerId);
      return; // Return early since handleReturnStatus handles the update
    } 
    else if (newStatus === 'paid') {
      // When changing to paid, set paidAmount = cost and balance = 0
      updatedPaidAmount = customer.cost;
      updatedBalance = 0;
      console.log('💰 Setting to fully paid:', { paidAmount: updatedPaidAmount, balance: updatedBalance });
    } 
    else if (newStatus === 'not paid') {
      // When changing to not paid, set paidAmount = 0 and balance = cost
      updatedPaidAmount = 0;
      updatedBalance = customer.cost;
      console.log('💰 Setting to not paid:', { paidAmount: updatedPaidAmount, balance: updatedBalance });
    }
    else if (newStatus === 'part paid') {
      // For part paid, keep current paidAmount but ensure balance is calculated correctly
      updatedBalance = Math.max(0, customer.cost - customer.paidAmount);
      console.log('💰 Keeping part paid:', { paidAmount: updatedPaidAmount, balance: updatedBalance });
      
      // If somehow paidAmount >= cost but status is part paid, correct it
      if (customer.paidAmount >= customer.cost) {
        updatedPaidAmount = customer.cost;
        updatedBalance = 0;
        newStatus = 'paid';
        console.log('🎯 Auto-correcting part paid to paid due to full payment');
      }
    }

    console.log('🔄 Updating status to:', newStatus, 'with payment:', {
      paidAmount: updatedPaidAmount,
      balance: updatedBalance
    });
    
    // Send status update to backend (backend handles stock management)
    const response = await fetch(`${CUSTOMER_API}/${customerId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        status: newStatus,
        paidAmount: updatedPaidAmount,
        balance: updatedBalance
      })
    });

    const result = await response.json();
    console.log('✅ Status update result:', result);
    
    if (result.success) {
      const updatedCustomers = customers.map(cust =>
        cust._id === customerId ? result.data : cust
      );
      const updatedAllCustomers = allCustomers.map(cust =>
        cust._id === customerId ? result.data : cust
      );
      setCustomers(updatedCustomers);
      setAllCustomers(updatedAllCustomers);
      
      // Refresh stock data to show updated quantities
      if (customer.shopType === 'service') {
        await fetchStockData();
        console.log('🔄 Stock data refreshed after status change');
      }
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('❌ Error updating status:', error);
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
        const response = await fetch(`${CUSTOMER_API}/${customerId}/download`);
        
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
        iframe.src = `${CUSTOMER_API}/${customerId}/print`;
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
            window.open(`${CUSTOMER_API}/${customerId}/print`, '_blank');
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
              window.open(`${CUSTOMER_API}/${customerId}/print`, '_blank');
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

const calculateSummary = () => {
  const today = new Date().toLocaleDateString();
  
  // Today's customers for current shop type
  const todayCustomers = allCustomers.filter(customer => 
    new Date(customer.date).toLocaleDateString() === today
  );
  
  // For service: use paidAmount, for sales: use cost (since sales are paid immediately)
  const todayIncome = todayCustomers.reduce((sum, customer) => {
    if (shopType === 'service') {
      // For returned items, don't count the income
      return customer.status === 'returned' ? sum : sum + (customer.paidAmount || 0);
    } else {
      // For sales, all costs are considered as income since payment is immediate
      // For returned items, don't count the income
      return customer.status === 'returned' ? sum : sum + (customer.cost || 0);
    }
  }, 0);
  
  // Pending balance only applies to service (sales are paid immediately)
  const pendingBalance = allCustomers.reduce((sum, customer) => {
    if (shopType === 'service') {
      // For returned items, balance should be 0
      return customer.status === 'returned' ? sum : sum + (customer.balance || 0);
    } else {
      return 0; // Sales have no pending balance
    }
  }, 0);
  
  // Total income calculation
  const totalIncome = allCustomers.reduce((sum, customer) => {
    if (shopType === 'service') {
      // For returned items, don't count the income
      return customer.status === 'returned' ? sum : sum + (customer.paidAmount || 0);
    } else {
      // For sales, all costs are income (except returned items)
      return customer.status === 'returned' ? sum : sum + (customer.cost || 0);
    }
  }, 0);

  return {
    todayIncome: todayIncome,
    pendingBalance: pendingBalance,
    totalIncome: totalIncome
  };
};

  const summary = calculateSummary();

  // Handle paid amount change - UPDATED with proper balance calculation
  const handlePaidAmountChange = (customerId, value) => {
    const customer = customers.find(c => c._id === customerId);
    
    // Prevent changes for returned items
    if (customer.status === 'returned') {
      alert('Cannot modify paid amount for returned items');
      return;
    }
    
    const paidAmount = parseFloat(value) || 0;
    const cost = customer.cost || 0;
    
    // Calculate balance correctly
    const balance = Math.max(0, cost - paidAmount);
    
    let status = customer.status;
    // Auto-update status based on payment
    if (paidAmount === 0) {
      status = 'not paid';
    } else if (paidAmount >= cost) {
      status = 'paid';
    } else if (paidAmount > 0 && paidAmount < cost) {
      status = 'part paid';
    }
    
    const updatedCustomers = customers.map(cust => {
      if (cust._id === customerId) {
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

const handlePaidAmountSave = async (customerId, value) => {
  try {
    const paidAmount = parseFloat(value) || 0;
    
    console.log('💰 Sending paid amount to backend:', paidAmount);

    // ✅ FIXED: Use the correct endpoint
    const response = await fetch(`${CUSTOMER_API}/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paidAmount: paidAmount
      })
    });

    const result = await response.json();
    console.log('✅ Backend response:', result);
    
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
      
      console.log('✅ Payment updated in frontend');
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('❌ Error updating paid amount:', error);
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
      const response = await fetch(`${CUSTOMER_API}/${customerId}`, {        
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

  

// Handle shop type change - UPDATED WITH TAB SYNC
const handleShopTypeChange = (newShopType) => {
  const currentShopType = shopType;
  
  // ✅ TAB SYNC LOGIC: Determine which tab to show in the new shop type
  let newActiveTab = activeTab;
  
  if (newShopType === 'service') {
    // When switching to service
    if (currentShopType === 'sales') {
      if (activeTab === 'multibrand' || activeTab === 'dealers') {
        newActiveTab = 'addCustomer'; // Multibrand/Dealers in sales → Add Customer in service
      }
      // For addCustomer, filter, items - keep the same tab
      else if (['addCustomer', 'filter', 'items'].includes(activeTab)) {
        newActiveTab = activeTab; // Keep same tab
      }
      else {
        newActiveTab = 'addCustomer'; // Default fallback
      }
    }
    // If coming from accessories or other types, default to addCustomer
    else {
      newActiveTab = 'addCustomer';
    }
  } 
  else if (newShopType === 'sales') {
    // When switching to sales
    if (currentShopType === 'service') {
      if (['addCustomer', 'filter', 'items'].includes(activeTab)) {
        newActiveTab = activeTab; // Keep same tab if it exists in sales
      } else {
        newActiveTab = 'addCustomer'; // Default to addCustomer
      }
    }
    // If coming from accessories or other types, default to addCustomer
    else {
      newActiveTab = 'addCustomer';
    }
  }
  else if (newShopType === 'accessories') {
    // Accessories has its own tab logic, you might want to set a default tab for accessories
    newActiveTab = 'addCustomer'; // or whatever default tab you want for accessories
  }
  
  // Update states
  setShopType(newShopType);
  setActiveTab(newActiveTab);
  localStorage.setItem('shopType', newShopType);
  
  // Reset customer data when switching shop types (only for sales/service)
  if (newShopType === 'sales' || newShopType === 'service') {
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
  }
  
  // Fetch accessories data when accessories tab is selected
  if (newShopType === 'accessories') {
    fetchAccessories();
  }
  
  console.log(`🔄 Shop type changed: ${currentShopType} → ${newShopType}, Tab: ${activeTab} → ${newActiveTab}`);
};

// ✅ Also update your individual tab click handler to save to localStorage
const handleTabClick = (tabName) => {
  setActiveTab(tabName); // This automatically saves to localStorage via useEffect
};

{/* Variant editing functions - UPDATED */}
const handleVariantEditClick = (variant, e) => {
  e.stopPropagation();
  setEditingVariant(variant._id);
  setEditVariantName(variant.variantName);
  setEditVariantDescription(variant.description || '');
  setEditVariantPrice(variant.sellingPrice || '');
  setEditVariantQuantity(variant.quantity || '');
  setEditLowStockThreshold(variant.lowStockThreshold?.toString() || '5');
};

// Update the handleVariantSaveClick function
const handleVariantSaveClick = async (variantId, e) => {
  e.stopPropagation();
  
  if (!editVariantName.trim()) {
    alert('Variant name cannot be empty');
    return;
  }

  try {
    const variantData = {
      variantName: editVariantName.trim(),
      description: editVariantDescription.trim(),
      lowStockThreshold: parseInt(editLowStockThreshold) || 5
    };

    // Only include price for service
    if (shopType === 'service') {
      variantData.price = parseFloat(editVariantPrice) || 0; // Use 'price' for backend
      variantData.quantity = parseInt(editVariantQuantity) || 0;
    }

    const response = await fetch(`${VARIANT_API}/${variantId}`, {        
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(variantData)
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
                sellingPrice: editVariantPrice, // Keep as sellingPrice locally
                quantity: editVariantQuantity,
                lowStockThreshold: parseInt(editLowStockThreshold) || 5
              }
            : variant
        )
      );
      setEditingVariant(null);
      // Clear edit states
      setEditVariantName('');
      setEditVariantDescription('');
      setEditVariantPrice('');
      setEditVariantQuantity('');
      setEditLowStockThreshold('5');
    } else {
      alert(`Failed to update variant: ${result.message}`);
    }
  } catch (error) {
    console.error('Error updating variant:', error);
    alert('Error updating variant');
  }
};

// Update the handlePriceChange function
const handlePriceChange = async (variantId, newPrice) => {
  if (newPrice < 0) return;
  
  try {
    const response = await fetch(`${VARIANT_API}/${variantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price: newPrice // Use 'price' not 'sellingPrice'
      })
    });

    const result = await response.json();

    if (result.success) {
      setVariants(prevVariants => 
        prevVariants.map(variant => 
          variant._id === variantId 
            ? { ...variant, sellingPrice: newPrice.toString() } // Keep local state as sellingPrice
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
      const response = await fetch(`${VARIANT_API}/${variantId}`, { 
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

      const response = await fetch(`${CUSTOMER_API}/${customerId}`, { 
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

// Handle return status - SIMPLIFIED
const handleReturnStatus = async (customerId) => {
  try {
    console.log('🔄 Processing return for customer:', customerId);
    
    const response = await fetch(`${CUSTOMER_API}/${customerId}/return`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    console.log('📨 Return response:', result);
    
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
      
      // Refresh stock data to show updated quantities
      await fetchStockData();
      console.log('🔄 Stock data refreshed after return');
      
      alert('✅ Customer marked as returned and stock restocked!');
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error marking as returned:', error);
    alert('Error marking as returned: ' + error.message);
  }
};


  const fetchAccessories = async () => {
    try {
      const response = await fetch(`${ACCESSORY_API}`);
      const result = await response.json();
      
      if (result.success) {
        // Convert dates to DD/MM/YYYY format for display
        const formattedData = {
          transactions: result.data.transactions.map(transaction => ({
            ...transaction,
            displayDate: new Date(transaction.date).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          })),
          dailyTotals: result.data.dailyTotals.map(day => ({
            ...day,
            displayDate: new Date(day.date).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          }))
        };
        setAccessoryData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching accessories:', error);
    }
  };

  // Add transaction
  const addAccessoryTransaction = async () => {
    if (!accessoryForm.amount) return;
    
    try {
      await fetch(`${ACCESSORY_API}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accessoryForm)
      });
      await fetchAccessories();
      setAccessoryForm({ type: 'investment', amount: '', date: new Date().toISOString().split('T')[0] });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Update the fetchStockItems function
  const fetchStockItems = async (variantId) => {
    try {
      console.log('Fetching stock items for variant:', variantId);
      const response = await fetch(`${STOCK_API}/variant/${variantId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        console.log('Stock items fetched:', result.data);
        setStockItems(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error fetching stock items:', error);
      alert('Error fetching stock items: ' + error.message);
    }
  };

  // Update the bulk stock form to use dealer IDs properly
  const handleAddBulkStock = async (variantId) => {
    try {
      // Validate that we have selected dealers
      const invalidItems = bulkStockForm.filter(item => !item.dealer || item.dealer === '');
      if (invalidItems.length > 0) {
        alert('Please select a dealer for all stock items');
        return;
      }

      const stockItemsToSave = bulkStockForm
        .map(item => ({
          imei: item.imei.trim(),
          dealerId: item.dealer,
          cost: parseFloat(item.cost) || 0,
          hsn: item.hsn.trim(),
          variantId: variantId,
          productId: selectedProduct._id,
          shopType: shopType
        }))
        .filter(item => item.imei && item.dealerId && item.cost > 0);

      if (stockItemsToSave.length === 0) {
        alert('Please fill at least one complete stock item (IMEI, Dealer, and Cost)');
        return;
      }

      console.log('Saving stock items:', stockItemsToSave);

      const response = await fetch(`${STOCK_API}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockItems: stockItemsToSave })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Successfully added ${result.data.length} stock items!`);
        setBulkStockForm([{ imei: '', dealer: '', cost: '', hsn: '' }]);
        await fetchStockItems(variantId);
        
        if (result.errors && result.errors.length > 0) {
          alert(`⚠️ Some items had issues:\n${result.errors.join('\n')}`);
        }
      } else {
        alert('❌ Error adding stock items: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding bulk stock:', error);
      alert('❌ Error adding stock items: ' + error.message);
    }
  };

  // Fetch dealers with financial data
  const fetchDealers = async () => {
    try {
      const response = await fetch(`${DEALERS_API}`);
      const result = await response.json();
      if (result.success) {
        setDealers(result.data);
      }
    } catch (error) {
      console.error('Error fetching dealers:', error);
    }
  };

  // Create or update dealer
  const saveDealer = async (e) => {
    e.preventDefault();
    
    if (!dealerForm.name || !dealerForm.contact || !dealerForm.address) {
      alert('Please fill all required fields (Name, Contact, Address)');
      return;
    }

    try {
      const url = editingDealer 
        ? `${DEALERS_API}/${editingDealer._id}`
        : DEALERS_API;
      
      const method = editingDealer ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealerForm)
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Dealer ${editingDealer ? 'updated' : 'created'} successfully!`);
        setDealerForm({
          name: '',
          contact: '',
          address: '',
          gstNumber: '',
        });
        setEditingDealer(null);
        fetchDealers();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving dealer:', error);
      alert('Error saving dealer');
    }
  };

  // Edit dealer
  const editDealer = (dealer) => {
    setDealerForm({
      name: dealer.name,
      contact: dealer.contact,
      address: dealer.address,
      gstNumber: dealer.gstNumber || '',
    });
    setEditingDealer(dealer);
  };

  // Delete dealer
  const deleteDealer = async (dealerId, dealerName) => {
    if (!window.confirm(`Are you sure you want to delete dealer "${dealerName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${DEALERS_API}/${dealerId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Dealer deleted successfully!');
        fetchDealers();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting dealer:', error);
      alert('Error deleting dealer');
    }
  };

// ✅ UPDATED: Add dealer payment with error handling
const addDealerPayment = async (e) => {
  e.preventDefault();
  
  if (!dealerPaymentForm.dealer || !dealerPaymentForm.amount || !dealerPaymentForm.totalAmount) {
    alert('Please select dealer, enter amount and verify total amount');
    return;
  }

  if (parseFloat(dealerPaymentForm.amount) > parseFloat(dealerPaymentForm.totalAmount)) {
    alert('Payment amount cannot be greater than total amount');
    return;
  }

  try {
    setLoading(true);
    
    const response = await fetch(`${DEALERS_API}/${dealerPaymentForm.dealer}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: parseFloat(dealerPaymentForm.amount),
        totalAmount: parseFloat(dealerPaymentForm.totalAmount),
        date: dealerPaymentForm.date
      })
    });

    const result = await response.json();
    
    if (result.success) {
      alert('Payment added successfully!');
      setDealerPaymentForm({
        dealer: '',
        amount: '',
        totalAmount: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchDealers(); // Refresh dealers list
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error('Error adding dealer payment:', error);
    alert('Error adding payment: ' + error.message);
  } finally {
    setLoading(false);
  }
};

// ✅ UPDATED: FETCH PAYMENT DETAILS with better error handling
const fetchDealerPaymentDetails = async (dealerId) => {
  try {
    setLoading(true);
    
    const response = await fetch(`${DEALERS_API}/${dealerId}/payment-details`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Payment details endpoint not found. Please check backend routes.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      setDealerPaymentDetails(result.data);
      setShowPaymentDetails(true);
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error fetching payment details:', error);
    alert('Error fetching payment details: ' + error.message);
    
    // Fallback: Show empty payment details
    setDealerPaymentDetails([]);
    setShowPaymentDetails(true);
  } finally {
    setLoading(false);
  }
};

// ✅ AUTO-FILL TOTAL AMOUNT WHEN DEALER IS SELECTED
const handleDealerSelectForPayment = (dealerId) => {
  const dealer = dealers.find(d => d._id === dealerId);
  if (dealer) {
    const balanceInfo = getDealerBalanceInfo(dealer);
    setDealerPaymentForm(prev => ({
      ...prev,
      dealer: dealerId,
      totalAmount: balanceInfo.totalWithGST.toFixed(2)
    }));
  }
};

  // Fetch dealer transactions
  const fetchDealerTransactions = async (dealerId) => {
    try {
      const response = await fetch(`${DEALERS_API}/${dealerId}/transactions`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching dealer transactions:', error);
      return [];
    }
  };

// ✅ CALCULATE DEALER BALANCE INFO (Frontend only)
const getDealerBalanceInfo = (dealer) => {
  const dealerStockItems = stockItems.filter(item => item.dealer?._id === dealer._id);
  
  // Calculate total stock cost
  const totalStockCost = dealerStockItems.reduce((sum, item) => sum + (item.cost || 0), 0);
  const gstAmount = totalStockCost * 0.18;
  const totalWithGST = totalStockCost + gstAmount;
  
  // Calculate total payments from payment details
  const totalPayments = dealer.paymentDetails?.reduce((sum, payment) => sum + (payment.paymentMade || 0), 0) || 0;
  
  // Simple balance calculation: (total + GST) - paid
  const balance = totalWithGST - totalPayments;
  
  return {
    totalStockCost,
    gstAmount,
    totalWithGST,
    totalPayments,
    balance
  };
};


  // Auto-create dealer transactions from existing stock items
  const autoCreateDealerTransactions = async (dealerId) => {
    try {
      const response = await fetch(`${DEALERS_API}/${dealerId}/auto-create-transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Auto-created transactions for ${result.data.stockItemsCount} stock items!`);
        alert(`💰 Total stock value with GST: ₹${result.data.totalAmount.toFixed(2)}`);
        fetchDealers();
      } else {
        alert(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error auto-creating dealer transactions:', error);
      alert('❌ Error auto-creating transactions');
    }
  };

  // Update the useEffect for dealers tab
  useEffect(() => {
    if (activeTab === 'dealers' && shopType === 'sales') {
      fetchDealers();
    }
  }, [activeTab, shopType]);

  // ➕ Add new cashier to appropriate list
  const addCashier = () => {
    if (!cashierName.trim()) {
      alert('Please enter a cashier name');
      return;
    }
    
    const trimmedName = cashierName.trim();
    const currentCashiers = shopType === 'service' ? serviceCashiers : salesCashiers;
    
    if (currentCashiers.includes(trimmedName)) {
      alert('Cashier name already exists');
      return;
    }
    
    if (shopType === 'service') {
      setServiceCashiers([...serviceCashiers, trimmedName]);
    } else {
      setSalesCashiers([...salesCashiers, trimmedName]);
    }
    
    setCashierName('');
  };

  // 🗑️ Delete cashier from appropriate list
  const deleteCashier = (name) => {
    if (shopType === 'service') {
      const newCashiers = serviceCashiers.filter(c => c !== name);
      setServiceCashiers(newCashiers);
    } else {
      const newCashiers = salesCashiers.filter(c => c !== name);
      setSalesCashiers(newCashiers);
    }
  };

  // ✏️ Edit cashier (inline editing)
  const startEditing = (name) => {
    setEditingCashier(name);
    setEditCashierName(name);
  };

  const saveEditing = () => {
    if (!editCashierName.trim()) {
      alert('Cashier name cannot be empty');
      return;
    }
    
    const trimmedName = editCashierName.trim();
    const currentCashiers = shopType === 'service' ? serviceCashiers : salesCashiers;
    
    if (trimmedName !== editingCashier && currentCashiers.includes(trimmedName)) {
      alert('Cashier name already exists');
      return;
    }

    if (shopType === 'service') {
      const newCashiers = serviceCashiers.map(c => (c === editingCashier ? trimmedName : c));
      setServiceCashiers(newCashiers);
    } else {
      const newCashiers = salesCashiers.map(c => (c === editingCashier ? trimmedName : c));
      setSalesCashiers(newCashiers);
    }
    
    setEditingCashier(null);
    setEditCashierName('');
  };

  const cancelEditing = () => {
    setEditingCashier(null);
    setEditCashierName('');
  };

  // Add these filter handlers
  const handleStockFilterChange = (e) => {
    const { name, value } = e.target;
    setStockFilterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // In your handleApplyStockFilter function, update the filtered stock items:
  const handleApplyStockFilter = () => {
    const filtered = stockItems.filter(item => {
      // IMEI filter
      if (stockFilterData.imei && !item.imei?.includes(stockFilterData.imei)) {
        return false;
      }
      
      // Brand filter
      if (stockFilterData.brand) {
        const itemBrand = item.variant?.product?.name || item.variant?.productName;
        if (itemBrand !== stockFilterData.brand) {
          return false;
        }
      }
      
      // Model filter
      if (stockFilterData.model && item.variant?.variantName !== stockFilterData.model) {
        return false;
      }
      
      // Status filter
      if (stockFilterData.status && item.status !== stockFilterData.status) {
        return false;
      }
      
      // Dealer filter
      if (stockFilterData.dealer && item.dealer?._id !== stockFilterData.dealer) {
        return false;
      }
      
      // HSN filter
      if (stockFilterData.hsn && !item.hsn?.includes(stockFilterData.hsn)) {
        return false;
      }
      
      // Date range filter
      if (stockFilterData.fromDate || stockFilterData.toDate) {
        const itemDate = new Date(item.createdAt);
        
        if (stockFilterData.fromDate) {
          const fromDate = new Date(stockFilterData.fromDate);
          if (itemDate < fromDate) {
            return false;
          }
        }
        
        if (stockFilterData.toDate) {
          const toDate = new Date(stockFilterData.toDate);
          toDate.setDate(toDate.getDate() + 1); // Include the entire toDate
          if (itemDate >= toDate) {
            return false;
          }
        }
      }
      
      return true;
    });
    setFilteredStockItems(filtered);
  };

  // Initialize with all stock items when component mounts
  useEffect(() => {
    setFilteredStockItems(stockItems);
  }, [stockItems]);

  const handleResetStockFilter = () => {
    setStockFilterData({
      imei: '',
      brand: '',
      model: '',
      status: '',
      dealer: '',
      hsn: '',
      fromDate: '',
      toDate: ''
    });
    setFilteredStockItems(stockItems);
  };

const handleAddMultiBrandCustomer = async () => {
  // Enhanced validation
  if (!multiBrandData.name?.trim() || 
      !multiBrandData.phone || 
      !multiBrandData.address?.trim() || 
      !multiBrandData.cost || 
      !multiBrandData.cashier || 
      !multiBrandData.paymentMode) {
    alert('Please fill all required fields');
    return;
  }

  // Strict phone validation
  if (multiBrandData.phone.length !== 10) {
    alert('Please enter a valid 10-digit phone number');
    return;
  }

  // Additional validation for EMI
  if (multiBrandData.paymentMode === 'emi' && !multiBrandData.financeCompany) {
    alert('Please select a finance company for EMI payment');
    return;
  }

  // Cost validation
  const cost = parseFloat(multiBrandData.cost);
  if (isNaN(cost) || cost <= 0) {
    alert('Please enter a valid cost amount');
    return;
  }

  try {
    // Generate invoice number first
    const invoiceNumber = generateMultiBrandInvoiceNumber();
    console.log('📄 Generated Invoice Number:', invoiceNumber);
    
    // Prepare the data with correct billType
    const customerData = {
      invoiceNumber: invoiceNumber,
      customerName: multiBrandData.name.trim(),
      phone: multiBrandData.phone,
      address: multiBrandData.address.trim(),
      cost: cost,
      shopType: 'sales',
      cashier: multiBrandData.cashier,
      // Optional fields
      brand: multiBrandData.brand || '',
      model: multiBrandData.model || '',
      imei: multiBrandData.imei || '',
      paymentMode: multiBrandData.paymentMode,
      financeCompany: multiBrandData.financeCompany || '',
      gstNumber: multiBrandData.gstNumber || '',
      billType: 'multi-brand', // ✅ Correct value
      date: new Date().toISOString()
    };

    console.log('📤 Sending Customer Data:', customerData);
    
    const response = await fetch('http://localhost:5000/customer_log/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    console.log('📥 Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Server Error:', errorData);
      throw new Error(errorData.message || 'Server error while creating customer');
    }

    const result = await response.json();
    console.log('✅ Customer created successfully:', result);
    
    // Reset form after success
    setMultiBrandData({
      name: '',
      phone: '',
      address: '',
      cost: '',
      brand: '',
      model: '',
      imei: '',
      cashier: '',
      paymentMode: 'cash',
      financeCompany: '',
      gstNumber: ''
    });
    
    alert('Multi-brand customer added successfully!');
    
  } catch (error) {
    console.error('❌ Error creating multi-brand customer:', error);
    alert(`Error: ${error.message}`);
  }
};

// Handle multi-brand warranty days change
const handleMultiBrandWarrantyDaysChange = (index, value) => {
  const warrantyDays = parseInt(value) || 0;
  const updatedCustomers = [...multiBrandCustomers];
  updatedCustomers[index] = {
    ...updatedCustomers[index],
    warrantyDays
  };
  setMultiBrandCustomers(updatedCustomers);
};

// Handle multi-brand warranty days save
const handleMultiBrandWarrantyDaysSave = (index, value) => {
  const warrantyDays = parseInt(value) || 0;
  const updatedCustomers = [...multiBrandCustomers];
  updatedCustomers[index] = {
    ...updatedCustomers[index],
    warrantyDays
  };
  setMultiBrandCustomers(updatedCustomers);
  // You can add backend saving logic here if needed
};

// ✅ UPDATED: Multi-brand action handler with backend integration
const handleMultiBrandAction = async (customer, action) => {
  setMultiBrandActionStatus(prev => ({
    ...prev,
    [customer.invoiceNumber]: `${action === 'download' ? 'Downloading' : 'Printing'}...`
  }));

  try {
    if (action === 'print') {
      // ✅ FIXED: Use backend print route for multi-brand
      const printUrl = `${CUSTOMER_API}/${customer._id}/print`;
      
      // Create a hidden iframe and trigger print through backend
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = printUrl;
      document.body.appendChild(iframe);

      // Wait for iframe to load then print
      iframe.onload = function() {
        try {
          // Trigger print dialog immediately
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          
          setMultiBrandActionStatus(prev => ({
            ...prev,
            [customer.invoiceNumber]: '✅ Print dialog opened!'
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
          window.open(printUrl, '_blank');
          setMultiBrandActionStatus(prev => ({
            ...prev,
            [customer.invoiceNumber]: '🖨️ Opened for printing'
          }));
        }
      };

      // Fallback timeout
      setTimeout(() => {
        if (iframe.parentNode && iframe.contentWindow) {
          try {
            iframe.contentWindow.print();
          } catch (e) {
            window.open(printUrl, '_blank');
          }
        }
      }, 3000);

    } else if (action === 'download') {
      // ✅ FIXED: Use backend download route for multi-brand
      const response = await fetch(`${CUSTOMER_API}/${customer._id}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Bill_${customer.invoiceNumber}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMultiBrandActionStatus(prev => ({
        ...prev,
        [customer.invoiceNumber]: '✅ Downloaded!'
      }));
    }
  } catch (error) {
    console.error('Error processing multi-brand action:', error);
    setMultiBrandActionStatus(prev => ({
      ...prev,
      [customer.invoiceNumber]: '❌ ' + error.message
    }));
  }

  setTimeout(() => {
    setMultiBrandActionStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[customer.invoiceNumber];
      return newStatus;
    });
  }, 5000);
};

// Fetch multi-brand customers from backend
const fetchMultiBrandCustomers = async () => {
  try {
    const response = await fetch(`${CUSTOMER_API}/multi-brand/all`);
    const result = await response.json();
    
    if (result.success) {
      setMultiBrandCustomers(result.data);
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error fetching multi-brand customers:', error);
    // Fallback to localStorage if backend fails
    const savedMultiBrandCustomers = localStorage.getItem('multiBrandCustomers');
    if (savedMultiBrandCustomers) {
      try {
        setMultiBrandCustomers(JSON.parse(savedMultiBrandCustomers));
      } catch (parseError) {
        console.error('Error parsing saved multi-brand customers:', parseError);
      }
    }
  }
};

// Call this when multi-brand tab is activated
useEffect(() => {
  if (activeTab === 'multibrand' && shopType === 'sales') {
    fetchMultiBrandCustomers();
    fetchStockData();
  }
}, [activeTab, shopType]);

// ✅ UPDATED: Multi-brand WhatsApp with backend integration
const handleMultiBrandWhatsApp = async (customer) => {
  setMultiBrandActionStatus(prev => ({
    ...prev,
    [customer.invoiceNumber]: '📱 Preparing WhatsApp message...'
  }));

  try {
    // ✅ FIXED: Use backend WhatsApp API for multi-brand
    const statusResponse = await fetch(`${WHATSAPP_API}/status`);
    
    if (!statusResponse.ok) {
      throw new Error('WhatsApp status check failed');
    }
    
    const statusResult = await statusResponse.json();

    if (!statusResult.ready) {
      throw new Error('WhatsApp is not connected. Please wait a moment and try again.');
    }

    setMultiBrandActionStatus(prev => ({
      ...prev,
      [customer.invoiceNumber]: '📩 Sending PDF...'
    }));

    // Get the relevant offer message for sales
    const relevantOfferMessage = salesOfferMessage;

    const response = await fetch(`${WHATSAPP_API}/send-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        customerId: customer._id, 
        offerMessage: relevantOfferMessage
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      setMultiBrandActionStatus(prev => ({
        ...prev,
        [customer.invoiceNumber]: relevantOfferMessage ? '✅ PDF with Offer Sent!' : '✅ PDF Sent!'
      }));
    } else {
      throw new Error(result.message || 'Failed to send PDF');
    }

  } catch (error) {
    console.error('WhatsApp PDF Error:', error);
    setMultiBrandActionStatus(prev => ({
      ...prev,
      [customer.invoiceNumber]: '❌ ' + (error.message || 'Failed to send PDF')
    }));
  }

  setTimeout(() => {
    setMultiBrandActionStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[customer.invoiceNumber];
      return newStatus;
    });
  }, 5000);
};

const calculateMultiBrandSummary = () => {
  const today = new Date().toLocaleDateString();
  
  const todayCustomers = multiBrandCustomers.filter(customer => {
    const customerDate = customer.date ? new Date(customer.date).toLocaleDateString() : new Date().toLocaleDateString();
    return customerDate === today;
  });
  
  const todayIncome = todayCustomers.reduce((sum, customer) => sum + (customer.cost || 0), 0);
  const totalIncome = multiBrandCustomers.reduce((sum, customer) => sum + (customer.cost || 0), 0);
  
  return {
    todayIncome,
    totalIncome,
    todayCount: todayCustomers.length,
    totalCount: multiBrandCustomers.length
  };
};

const multiBrandSummary = calculateMultiBrandSummary();

const getNextMultiBrandInvoiceNumber = () => {
  if (multiBrandCustomers.length === 0) {
    return 1;
  }
  
  const invoiceNumbers = multiBrandCustomers.map(customer => {
    const invoiceStr = customer.invoiceNumber.replace('M', '');
    return parseInt(invoiceStr) || 0;
  });
  
  const maxInvoiceNumber = Math.max(...invoiceNumbers);
  return maxInvoiceNumber + 1;
};

// ✅ SIMPLE: Multi-brand invoice number
const generateMultiBrandInvoiceNumber = () => {
  if (multiBrandCustomers.length === 0) {
    return 'M001';
  }
  
  const invoiceNumbers = multiBrandCustomers.map(customer => {
    const invoiceStr = customer.invoiceNumber.replace('M', '');
    return parseInt(invoiceStr) || 0;
  });
  
  const maxInvoiceNumber = Math.max(...invoiceNumbers);
  const nextNumber = maxInvoiceNumber + 1;
  return `M${nextNumber.toString().padStart(3, '0')}`;
};



// Add this useEffect to persist multi-brand data
useEffect(() => {
  // Load multi-brand customers from localStorage on component mount
  const savedMultiBrandCustomers = localStorage.getItem('multiBrandCustomers');
  if (savedMultiBrandCustomers) {
    try {
      setMultiBrandCustomers(JSON.parse(savedMultiBrandCustomers));
    } catch (error) {
      console.error('Error loading multi-brand customers:', error);
    }
  }
}, []);

// Save multi-brand customers to localStorage whenever they change
useEffect(() => {
  if (multiBrandCustomers.length > 0) {
    localStorage.setItem('multiBrandCustomers', JSON.stringify(multiBrandCustomers));
  }
}, [multiBrandCustomers]);

// ✅ USE THE SIMPLE ENDPOINT
const fetchDealerHsnCodes = async (dealerId) => {
  if (!dealerId) {
    console.log('❌ No dealer ID provided for HSN fetch');
    return;
  }
  
  console.log('🔄 Fetching HSN codes for dealer:', dealerId);
  
  try {
    // Use the simple endpoint
    const response = await fetch(`${API_BASE}/stock-items/dealer/${dealerId}/hsn-simple`);
    console.log('📡 SIMPLE HSN API Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ SIMPLE HSN API Success:', result);
      
      if (result.success) {
        console.log('📋 SIMPLE HSN Codes received:', result.data);
        setDealerHsnCodes(prev => ({
          ...prev,
          [dealerId]: result.data || []
        }));
      } else {
        console.log('❌ SIMPLE HSN API returned success:false:', result.message);
      }
    } else {
      console.log('❌ SIMPLE HSN API HTTP Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ SIMPLE HSN API Fetch Error:', error);
  }
};

// ✅ FALLBACK: Alternative method to get HSN codes
const fetchHsnCodesAlternative = async (dealerId) => {
  try {
    console.log('🔄 Trying alternative HSN fetch for dealer:', dealerId);
    
    // Fetch all stock items for this dealer and extract HSN codes
    const response = await fetch(`${API_BASE}/stock-items?dealer=${dealerId}`);
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        const stockItems = result.data || [];
        const hsnCodes = [...new Set(stockItems
          .filter(item => item.hsn && item.hsn.trim() !== '')
          .map(item => item.hsn)
          .sort()
        )];
        
        console.log('✅ Alternative HSN fetch successful:', hsnCodes);
        setDealerHsnCodes(prev => ({
          ...prev,
          [dealerId]: hsnCodes
        }));
      }
    }
  } catch (error) {
    console.error('❌ Alternative HSN fetch failed:', error);
  }
};

const handleStockFormChange = (index, field, value) => {
  const newForm = [...stockFormData];
  
  // If this is the copyFromPrevious checkbox being checked
  if (field === 'copyFromPrevious' && value === true) {
    // Find the previous filled row (not the immediate previous, but the last one with data)
    let previousFilledIndex = -1;
    
    // Look backwards from current index to find the last filled row
    for (let i = index - 1; i >= 0; i--) {
      if (newForm[i].product && newForm[i].model && newForm[i].dealer && newForm[i].cost) {
        previousFilledIndex = i;
        break;
      }
    }
    
    // If found a previous filled row, copy all data except IMEI
    if (previousFilledIndex !== -1) {
      const previousRow = newForm[previousFilledIndex];
      newForm[index] = {
        ...previousRow, // Copy all fields from previous row
        imei: '', // ✅ Keep IMEI empty
        copyFromPrevious: true // Keep checkbox checked
      };
    } else {
      // No previous filled row found, just set the checkbox
      newForm[index] = { ...newForm[index], copyFromPrevious: true };
    }
  } else {
    // Normal field change
    newForm[index] = { ...newForm[index], [field]: value };
    
    // If changing any field other than IMEI, uncheck copyFromPrevious
    if (field !== 'imei' && field !== 'copyFromPrevious') {
      newForm[index] = { ...newForm[index], copyFromPrevious: false };
    }
  }
  
  // ✅ ADDED: When dealer changes, fetch their HSN codes
  if (field === 'dealer' && value) {
    fetchDealerHsnCodes(value);
  }
  
  // ✅ ADDED: When HSN is typed and doesn't match existing, allow new HSN
  if (field === 'hsn') {
    const dealerId = newForm[index].dealer;
    if (dealerId && value) {
      const existingHsns = dealerHsnCodes[dealerId] || [];
      if (!existingHsns.includes(value)) {
        // This is a new HSN for this dealer - it will be saved when stock is added
        console.log('➕ New HSN detected:', value, 'for dealer:', dealerId);
      }
    }
  }
  
  // If applyToAll is checked and changing product/model/dealer/hsn/cost, apply to all
  if (applyToAll && ['product', 'model', 'dealer', 'hsn', 'cost'].includes(field)) {
    newForm.forEach((item, i) => {
      if (i !== index) {
        newForm[i] = { ...newForm[i], [field]: value, copyFromPrevious: false };
      }
    });
  }
  
  setStockFormData(newForm);
  
  // Check for duplicate IMEIs
  if (field === 'imei') {
    checkDuplicateIMEIs(newForm);
  }
};

const addStockRow = () => {
  const lastItem = stockFormData[stockFormData.length - 1];
  const newItem = applyToAll ? {
    ...lastItem,
    imei: '', // Always clear IMEI for new rows
    copyFromPrevious: false // Don't copy by default for new rows
  } : {
    product: '',
    model: '',
    imei: '',
    hsn: '',
    dealer: '',
    cost: '',
    copyFromPrevious: false
  };
  
  setStockFormData([...stockFormData, newItem]);
};

const removeStockRow = (index) => {
  if (stockFormData.length > 1) {
    const newForm = stockFormData.filter((_, i) => i !== index);
    setStockFormData(newForm);
    checkDuplicateIMEIs(newForm);
  }
};

const checkDuplicateIMEIs = (formData) => {
  const imeiCount = {};
  const duplicates = new Set();
  
  formData.forEach(item => {
    if (item.imei) {
      imeiCount[item.imei] = (imeiCount[item.imei] || 0) + 1;
      if (imeiCount[item.imei] > 1) {
        duplicates.add(item.imei);
      }
    }
  });
  
  setDuplicateIMEIs(duplicates);
};

const handleSaveStockItems = async () => {
  // Validate form
  const invalidItems = stockFormData.some(item => 
    !item.product || !item.model || !item.imei || !item.dealer || !item.cost
  );
  
  if (invalidItems) {
    alert('Please fill all required fields in all stock items');
    return;
  }
  
  if (duplicateIMEIs.size > 0) {
    alert('Please fix duplicate IMEI numbers before saving');
    return;
  }
  
  try {
    // Clear previous errors
    const clearedErrorsForm = stockFormData.map(item => ({
      ...item,
      error: ''
    }));
    setStockFormData(clearedErrorsForm);
    
    // Find variant IDs and product IDs for each stock item
    const stockItemsToSave = stockFormData.map(item => {
      const variant = variants.find(v => 
        (v.productName === item.product || v.product?.name === item.product) &&
        v.variantName === item.model &&
        v.shopType === 'sales'
      );
      
      const product = products.find(p => 
        p.name === item.product && p.shopType === 'sales'
      );
      
      return {
        imei: item.imei.trim(),
        productName: item.product,
        variantName: item.model,
        variantId: variant?._id,
        productId: product?._id,
        dealerId: item.dealer,
        cost: parseFloat(item.cost) || 0,
        hsn: item.hsn.trim(),
        shopType: 'sales'
      };
    });
    
    console.log('📦 Sending stock items:', stockItemsToSave);
    
    const response = await fetch(`${STOCK_API}/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockItems: stockItemsToSave })
    });
    
    const result = await response.json();
    console.log('📊 Backend response:', result);
    
    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }
    
    if (result.success) {
      // ✅ Handle partial success - some items saved, some failed
      if (result.errors && result.errors.length > 0) {
        // Create a set of failed IMEIs for quick lookup
        const failedImeis = new Set();
        
        // Update form with error messages for failed items
        const updatedForm = [...stockFormData];
        
        result.errors.forEach(errorMsg => {
          // Extract IMEI from error message (assuming format: "Item X: IMEI "123" already exists")
          const imeiMatch = errorMsg.match(/IMEI\s+"([^"]+)"/) || errorMsg.match(/IMEI\s+([^\s]+)/);
          if (imeiMatch) {
            const failedImei = imeiMatch[1];
            failedImeis.add(failedImei);
            
            const failedIndex = updatedForm.findIndex(item => item.imei === failedImei);
            if (failedIndex !== -1) {
              updatedForm[failedIndex] = {
                ...updatedForm[failedIndex],
                error: errorMsg
              };
            }
          }
        });
        
        // ✅ FIX: Keep ONLY the failed items in the form, clear successful ones
        const failedItemsOnly = updatedForm.filter(item => failedImeis.has(item.imei));
        
        // If there are failed items, add one empty row for new entries
        if (failedItemsOnly.length > 0) {
          failedItemsOnly.push({
            product: '',
            model: '',
            imei: '',
            hsn: '',
            dealer: '',
            cost: '',
            copyFromPrevious: false,
            error: ''
          });
        }
        
        setStockFormData(failedItemsOnly);
        
        // Show success message for saved items and keep failed items in form
        const savedCount = result.data ? result.data.length : stockItemsToSave.length - result.errors.length;
        alert(`✅ ${savedCount} items saved successfully!\n❌ ${result.errors.length} items failed. Check the form for error details.`);
      } else {
        // All items saved successfully
        alert(`✅ Successfully added ${result.data.length} stock items!`);
        setStockFormData([{ product: '', model: '', imei: '', hsn: '', dealer: '', cost: '', copyFromPrevious: false, error: '' }]);
        setApplyToAll(false);
        setDuplicateIMEIs(new Set());
        setExistingIMEIs(new Set());
      }
      
      // Refresh stock data
      await fetchStockData();
    } else {
      throw new Error(result.message || 'Unknown error occurred');
    }
  } catch (error) {
    console.error('❌ Error saving stock items:', error);
    alert('❌ Error saving stock items: ' + error.message);
  }
};


// ✅ ENHANCED: Auto-fill with better data handling
const handleImeiSelect = (selectedImei, formType = 'regular') => {
  if (!selectedImei) return;
  
  console.log('🔄 Auto-filling for IMEI:', selectedImei);
  
  const stockItem = stockItems.find(item => item.imei === selectedImei);
  console.log('📦 Found stock item:', stockItem);
  
  if (stockItem) {
    let brand = '';
    let model = '';
    
    // Method 1: Check if variant data is populated in stockItem
    if (stockItem.variant) {
      console.log('✅ Using populated variant data');
      brand = stockItem.variant.productName || stockItem.variant.product?.name || '';
      model = stockItem.variant.variantName || '';
    }
    // Method 2: Find variant by variantId
    else if (stockItem.variantId) {
      console.log('🔍 Finding variant by ID:', stockItem.variantId);
      const variant = variants.find(v => v._id === stockItem.variantId);
      console.log('📱 Found variant:', variant);
      if (variant) {
        brand = variant.productName || variant.product?.name || '';
        model = variant.variantName || '';
      }
    }
    // Method 3: Find by productId and variantName (fallback)
    else if (stockItem.productId && stockItem.variantName) {
      console.log('🔄 Fallback: Using productId and variantName');
      const product = products.find(p => p._id === stockItem.productId);
      if (product) {
        brand = product.name;
        model = stockItem.variantName;
      }
    }
    
    console.log('🎯 Auto-fill result:', { brand, model });
    
    if (brand && model) {
      if (formType === 'multiBrand') {
        setMultiBrandData(prev => ({
          ...prev,
          brand,
          model
        }));
      } else {
        setCustomerData(prev => ({
          ...prev,
          brand,
          model
        }));
      }
      console.log('✅ Auto-fill successful!');
    } else {
      console.log('❌ Auto-fill failed - missing brand or model');
    }
  } else {
    console.log('❌ Stock item not found for IMEI:', selectedImei);
  }
};

// ✅ FIXED: DealerAlertSection with forced refresh
const DealerAlertSection = ({ dealer, onAlertSet, onAlertReset }) => {
  const [alertDate, setAlertDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [localRefresh, setLocalRefresh] = useState(0);

  // Simple calculation
  const isAlertRecentlySent = dealer.alertSettings?.lastAlertSent && 
    (new Date() - new Date(dealer.alertSettings.lastAlertSent)) < 30000;

  // ✅ ADD THIS: Force refresh when alert time is near or just passed
  useEffect(() => {
    if (!dealer.alertSettings?.isAlertActive || !dealer.alertSettings?.nextAlertDate) return;

    const alertTime = new Date(dealer.alertSettings.nextAlertDate);
    const now = new Date();
    const timeUntilAlert = alertTime - now;
    const timeSinceAlert = now - alertTime;

    // If alert is within 2 minutes OR was in last 30 seconds, start refreshing
    if ((timeUntilAlert > 0 && timeUntilAlert < 120000) || (timeSinceAlert > 0 && timeSinceAlert < 30000)) {
      console.log('🔄 Alert time active, starting auto-refresh...');
      
      const interval = setInterval(() => {
        setLocalRefresh(prev => prev + 1);
      }, 5000); // Refresh every 5 seconds

      return () => clearInterval(interval);
    }
  }, [dealer.alertSettings, localRefresh]);

  // ✅ ADD THIS: Trigger parent refresh when localRefresh changes
  useEffect(() => {
    if (localRefresh > 0) {
      // This will trigger parent component to refresh dealer data
      onAlertSet && onAlertSet(dealer._id);
    }
  }, [localRefresh, dealer._id, onAlertSet]);

  const handleSetAlert = async () => {
    if (!alertDate) {
      alert('Please enter a date in DD/MM/YYYY format');
      return;
    }

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(alertDate)) {
      alert('Please enter date in DD/MM/YYYY format (e.g., 25/12/2024)');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${DEALERS_API}/${dealer._id}/set-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertDate: alertDate })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Alert set successfully for 2:30 PM!');
        setAlertDate('');
        onAlertSet && onAlertSet(dealer._id);
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error setting alert: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAlert = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${DEALERS_API}/${dealer._id}/reset-alert`, {
        method: 'POST'
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Alert reset successfully!');
        setAlertDate('');
        onAlertReset && onAlertReset(dealer._id);
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error resetting alert: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle DD/MM/YYYY input
  const handleDateChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d/]/g, '');
    
    if (value.length === 2 && !value.includes('/')) {
      value = value + '/';
    } else if (value.length === 5 && value.split('/').length === 2) {
      value = value + '/';
    }
    
    if (value.length <= 10) {
      setAlertDate(value);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center no-expand">
      <input
        type="text"
        value={alertDate}
        onChange={handleDateChange}
        onFocus={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        placeholder="DD/MM/YYYY"
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-center no-expand"
        maxLength="10"
      />
      
      <div className="flex gap-1 w-full no-expand">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSetAlert();
          }}
          disabled={loading || !alertDate}
          className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed no-expand"
        >
          {loading ? '...' : 'Set'}
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleResetAlert();
          }}
          disabled={loading}
          className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed no-expand"
        >
          {loading ? '...' : 'Reset'}
        </button>
      </div>

      {/* ✅ Alert Status Display */}
      {isAlertRecentlySent ? (
        <div className="text-xs text-blue-600 mt-1 text-center no-expand font-semibold animate-pulse">
          ✅ Alert Sent
          <br />
          <span className="text-xs text-gray-500">(Auto-hides in 30s)</span>
        </div>
      ) : dealer.alertSettings?.isAlertActive && dealer.alertSettings?.nextAlertDate ? (
        <div className="text-xs text-orange-600 mt-1 text-center no-expand font-semibold">
          ⏰ Alert Set: {new Date(dealer.alertSettings.nextAlertDate).toLocaleDateString('en-IN')}
        </div>
      ) : null}
    </div>
  );
};

// ✅ ADD THESE HANDLERS TO YOUR MAIN COMPONENT
const handleAlertSet = (dealerId) => {
  // Refresh dealers list or update specific dealer
  fetchDealers();
};

const handleAlertReset = (dealerId) => {
  // Refresh dealers list or update specific dealer
  fetchDealers();
};


  const handleWhatsAppPDF = async (customerId) => {
    setActionStatus(prev => ({
      ...prev,
      [customerId]: '❗ Checking WhatsApp connection...'
    }));

    try {
      const statusResponse = await fetch(`${WHATSAPP_API}/status`);
      
      if (!statusResponse.ok) {
        throw new Error('WhatsApp status check failed');
      }
      
      const statusResult = await statusResponse.json();

      if (!statusResult.ready) {
        throw new Error('WhatsApp is not connected. Please wait a moment and try again.');
      }

      setActionStatus(prev => ({
        ...prev,
        [customerId]: '📡 Fetching customer data...'
      }));

      // Get customer data
      let customer = null;
      try {
        const customerResponse = await fetch(`${CUSTOMER_API}/${customerId}`);
        if (!customerResponse.ok) {
          throw new Error('Failed to fetch customer data');
        }
        const customerData = await customerResponse.json();
        
        if (customerData.success && customerData.data) {
          customer = customerData.data;
        } else {
          throw new Error('Customer not found');
        }
      } catch (fetchError) {
        console.error('Customer fetch error:', fetchError);
        throw new Error('Failed to load customer details');
      }

      // Select the correct offer message
      const customerShopType = customer.shopType || shopType;
      const relevantOfferMessage = customerShopType === 'service' ? serviceOfferMessage : salesOfferMessage;

      setActionStatus(prev => ({
        ...prev,
        [customerId]: relevantOfferMessage ? '📩 Sending PDF with offer...' : '📩 Sending PDF...'
      }));

      const response = await fetch(`${WHATSAPP_API}/send-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          customerId: customerId, 
          offerMessage: relevantOfferMessage
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setActionStatus(prev => ({
          ...prev,
          [customerId]: relevantOfferMessage ? '✅ PDF with Offer Sent!' : '✅ PDF Sent!'
        }));
      } else {
        throw new Error(result.message || 'Failed to send PDF');
      }

    } catch (error) {
      console.error('WhatsApp PDF Error:', error);
      setActionStatus(prev => ({
        ...prev,
        [customerId]: '❌ ' + (error.message || 'Failed to send PDF')
      }));
    }

    // ✅ Clear status after delay
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
        <button
          onClick={() => handleShopTypeChange('accessories')}
          className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 ${
            shopType === 'accessories' 
            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-inner' 
            : '!bg-white text-gray-800 hover:bg-orange-50 hover:text-orange-700'
          }`}
        >
          🎧 ACCESSORIES
        </button>
      </div>
      
      {/* ✅ HIDE these tabs when accessories is selected */}
      {shopType !== 'accessories' && (
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
          
          {/* Multibrand Tab - Only show for Sales */}
          {shopType === 'sales' && (
            <button
              onClick={() => {
                setActiveTab('multibrand');
                localStorage.setItem('activeTab', 'multibrand');
              }}
              className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 ${
                activeTab === 'multibrand' 
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-inner' 
                : '!bg-white text-gray-800 hover:bg-orange-50 hover:text-orange-700'
              }`}
            >
              🏪 Multibrand
            </button>
          )}
          
          {/* Dealers Tab - Only show for Sales */}
          {shopType === 'sales' && (
            <button
              onClick={() => {
                setActiveTab('dealers');
                localStorage.setItem('activeTab', 'dealers');
              }}
              className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 ${
                activeTab === 'dealers' 
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-inner' 
                : '!bg-white text-gray-800 hover:bg-orange-50 hover:text-orange-700'
              }`}
            >
              🤝 Supplier
            </button>
          )}
        </div>
      )}
    </div>

    {/* ✅ Add this condition to hide ALL customer-related sections when accessories is selected */}
    {shopType !== 'accessories' && (
      <>
        {/* Add Customer Form */}
        {activeTab === 'addCustomer' && (
          <div className="bg-white rounded-lg p-4 shadow-md mb-4 border border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Customer - {shopType === 'service' ? '🔧 SERVICE' : '🛒 SALES'}
                </h2>
              </div>
                {/* ✅ SIMPLE: Just show next bill number */}
            <div className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-semibold">
              Next Bill: {generateInvoiceNumber()}
            </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Name */}
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

              {/* Phone Number */}
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

              {/* Address Field - Mandatory for both service and sales */}
<div className="md:col-span-2 space-y-1">
  <label className="block text-xs font-semibold text-gray-700 mb-1">
    📍 Address *
  </label>
  <textarea
    name="address"
    value={customerData.address}
    onChange={handleInputChange}
    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomer()}
    rows={2}
    className="text-gray-800 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 resize-none"
    placeholder="Enter customer complete address"
    required
  />
</div>

              {/* Issue Description (Service Only) */}
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

              {/* Cost Field */}
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
                  onChange={(e) => setCustomerData(prev => ({...prev, brand: e.target.value, model: '', stock: '', imei: ''}))}
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
                          {variant.variantName} - ₹{variant.sellingPrice} (Stock: {variant.quantity})
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
                    onChange={(e) => setCustomerData(prev => ({...prev, model: e.target.value, imei: ''}))}
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
                        v.shopType === 'sales'
                      )
                      .map((variant) => (
                        <option key={variant._id} value={variant.variantName}>
                          {variant.variantName} 
                        </option>
                      ))
                    }
                  </select>
                </div>
              )}

{/* IMEI Field - Combined Input & Dropdown with Real-time Filtering */}
{shopType === 'sales' && (
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-gray-700 mb-1">
      📱 IMEI Number *
    </label>
    
    <div className="relative">
      {/* Input Field that also shows dropdown */}
      <input
        type="text"
        value={customerData.imei}
        onChange={(e) => {
          const inputValue = e.target.value;
          console.log('⌨️ IMEI Input:', inputValue);
          setCustomerData(prev => ({...prev, imei: inputValue}));
          setShowImeiDropdown(true); // Keep dropdown open when typing
          
          // Auto-fill if exact IMEI match is found
          if (inputValue) {
            const stockItem = stockItems.find(item => item.imei === inputValue);
            if (stockItem && stockItem.variant) {
              console.log('📦 Auto-fill triggered for:', inputValue);
              
              const brand = stockItem.variant.product?.name || 
                           stockItem.variant.productName || 
                           stockItem.product?.name ||
                           stockItem.productName || '';
              
              const model = stockItem.variant.variantName || 
                           stockItem.variantName || '';
              
              console.log('🎯 Extracted - Brand:', brand, 'Model:', model);
              
              if (brand && model) {
                setCustomerData(prev => ({
                  ...prev,
                  brand: brand,
                  model: model
                }));
                console.log('✅ Auto-fill successful!');
              }
            }
          }
        }}
        onFocus={() => setShowImeiDropdown(true)}
        onBlur={() => {
          // Use timeout to allow click to register first
          setTimeout(() => setShowImeiDropdown(false), 150);
        }}
        placeholder="Type IMEI or click to select from list"
        className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 pr-10 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200"
        required
      />
      
      
      {/* Dropdown List */}
      {showImeiDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {getAvailableIMEIs('regular')
            .filter(item => {
              if (!customerData.imei) return true;
              return item.imei.includes(customerData.imei) || 
                     item.variant?.variantName?.toLowerCase().includes(customerData.imei.toLowerCase());
            })
            .map((item) => (
              <div
                key={item._id}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent input blur
                  console.log('🔄 IMEI Selected from dropdown:', item.imei);
                  setCustomerData(prev => ({...prev, imei: item.imei}));
                  setShowImeiDropdown(false);
                  
                  // Auto-fill when selected
                  if (item.variant) {
                    const brand = item.variant.product?.name || 
                                 item.variant.productName || 
                                 item.product?.name ||
                                 item.productName || '';
                    
                    const model = item.variant.variantName || 
                                 item.variantName || '';
                    
                    console.log('🎯 Extracted - Brand:', brand, 'Model:', model);
                    
                    if (brand && model) {
                      setCustomerData(prev => ({
                        ...prev,
                        brand: brand,
                        model: model
                      }));
                      console.log('✅ Auto-fill successful!');
                    }
                  }
                }}
                className="px-3 py-2 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
              >
                <div className="font-medium text-gray-800">{item.imei}</div>
                <div className="text-sm text-gray-600">
                  {item.variant?.variantName || 'N/A'} - ₹{item.cost}
                  {item.variant?.product?.name && ` (${item.variant.product.name})`}
                </div>
              </div>
            ))
          }
          
          {/* No results message */}
          {getAvailableIMEIs('regular').filter(item => {
            if (!customerData.imei) return true;
            return item.imei.includes(customerData.imei) || 
                   item.variant?.variantName?.toLowerCase().includes(customerData.imei.toLowerCase());
          }).length === 0 && (
            <div className="px-3 py-2 text-gray-500 text-sm">
              No matching IMEIs found
            </div>
          )}
        </div>
      )}
    </div>
    
    {/* Filtering Status */}
    {customerData.imei && showImeiDropdown && (
      <div className="text-xs text-gray-600 mt-1">
        🔍 Showing {getAvailableIMEIs('regular').filter(item => 
          item.imei.includes(customerData.imei) || 
          item.variant?.variantName?.toLowerCase().includes(customerData.imei.toLowerCase())
        ).length} matching IMEIs
      </div>
    )}
    
    {getAvailableIMEIs('regular').length === 0 && (
      <p className="text-red-500 text-xs mt-1">No IMEIs available in stock</p>
    )}
    
{/* Selected IMEI Auto-fill Info */}
{customerData.imei && (() => {
  const stockItem = stockItems.find(item => item.imei === customerData.imei);
  return stockItem && stockItem.variant ? (
    <div className="text-xs text-green-600 mt-1">
      ✅ Auto-filled: {stockItem.variant.product?.name} - {stockItem.variant.variantName}
    </div>
  ) : customerData.imei ? (
    <div className="text-xs text-yellow-600 mt-1">
      ⚠️ IMEI not found in stock database - please select from dropdown
    </div>
  ) : null;
})()}
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

              {/* Cashier Dropdown */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  👨‍💼 Cashier *
                </label>
                <select
                  value={customerData.cashier}
                  onChange={(e) => setCustomerData(prev => ({...prev, cashier: e.target.value}))}
                  className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 bg-white"
                  required
                >
                  <option value="">Select Cashier</option>
                  {(shopType === 'service' ? serviceCashiers : salesCashiers).map((cashier, index) => (
                    <option key={index} value={cashier}>
                      {cashier}
                    </option>
                  ))}
                </select>
                {(shopType === 'service' ? serviceCashiers : salesCashiers).length === 0 && (
                  <p className="text-red-500 text-xs mt-1">
                    No {shopType} cashiers found. Add cashiers in the Add Product page.
                  </p>
                )}
              </div>

{/* GST Number Field - Regular Customer (Optional) */}
<div className="space-y-1">
  <label className="block text-xs font-semibold text-gray-700 mb-1">
    🏢 GST Number (Optional)
  </label>
  <input
    type="text"
    name="gstNumber"
    value={customerData.gstNumber}
    onChange={handleInputChange}
    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomer()}
    className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200"
    placeholder="Enter customer GST number"
  />
</div>

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

      {/* ✅ ADDED: EMI Option */}
      <label className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative">
          <input
            type="radio"
            name="paymentMode"
            value="emi"
            checked={customerData.paymentMode === 'emi'}
            onChange={handleInputChange}
            className="sr-only"
          />
          <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
            customerData.paymentMode === 'emi' 
              ? 'border-purple-500 bg-purple-500' 
              : 'border-gray-400 group-hover:border-purple-400'
          }`}>
            {customerData.paymentMode === 'emi' && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
        </div>
        <span className="text-gray-900 font-medium group-hover:text-purple-600 transition-colors">
          🏦 EMI
        </span>
      </label>
    </div>

    {/* ✅ ADDED: EMI Finance Company Selection */}
    {customerData.paymentMode === 'emi' && (
      <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <label className="block text-sm font-semibold text-purple-800 mb-2">
          🏢 Select Finance Company *
        </label>
        <select
          value={customerData.financeCompany || ''}
          onChange={(e) => setCustomerData(prev => ({...prev, financeCompany: e.target.value}))}
          className="text-gray-800 w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 bg-white"
          required
        >
          <option value="">Select Finance Company</option>
          <option value="bajaj">Bajaj Finance</option>
          <option value="hdfc">HDFC Bank</option>
          <option value="icici">ICICI Bank</option>
          <option value="kotak">Kotak Mahindra</option>
          <option value="homecredit">Home Credit</option>
          <option value="other">Other Finance</option>
        </select>
        <p className="text-xs text-purple-600 mt-2">
          Selected payment will show as: EMI-{customerData.financeCompany ? customerData.financeCompany.toUpperCase() : '[Company]'}
        </p>
      </div>
    )}
    
    {/* Selected payment mode display */}
    {customerData.paymentMode && (
      <div className="mt-2 p-2 bg-white rounded border border-gray-300">
        <span className="text-sm font-semibold text-gray-900">
          Selected: 
          <span className={`ml-2 ${
            customerData.paymentMode === 'cash' ? 'text-green-600' : 
            customerData.paymentMode === 'gpay' ? 'text-blue-600' : 
            'text-purple-600'
          }`}>
            {customerData.paymentMode === 'cash' ? '💵 Cash Payment' : 
             customerData.paymentMode === 'gpay' ? '📱 Google Pay' : 
             `🏦 EMI-${customerData.financeCompany ? customerData.financeCompany.toUpperCase() : '[Select Company]'}`}
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

            {/* IMEI Information Display (Sales Only) */}
            {shopType === 'sales' && customerData.imei && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📱 Selected IMEI Information</h4>
                {(() => {
                  const stockItem = stockItems.find(item => item.imei === customerData.imei);
                  return stockItem ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-black">
                      <div>
                        <div className="text-gray-600">IMEI:</div>
                        <div className="font-semibold">{stockItem.imei}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Supplier:</div>
                        <div className="font-semibold">{stockItem.dealer?.name || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">HSN Code:</div>
                        <div className="font-semibold">{stockItem.hsn || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Cost Price:</div>
                        <div className="font-semibold">₹{stockItem.cost}</div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-600 text-sm">No information found for this IMEI</p>
                  );
                })()}
              </div>
            )}
          </div>
        )}



            {/* Multi-brand Section */}
{activeTab === 'multibrand' && shopType === 'sales' && (
  <>

    {/* Multi-brand Form */}
    <div className="bg-white rounded-lg p-4 shadow-md mb-4 border border-orange-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
          <h2 className="text-xl font-bold text-gray-800">
            🏪 Multi-brand Sales (No GST)
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-semibold">
            Next Bill: {generateMultiBrandInvoiceNumber()}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Name */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            👤 Customer Name *
          </label>
          <input
            type="text"
            value={multiBrandData.name}
            onChange={(e) => {
              const value = e.target.value;
              const titleCaseValue = value.toLowerCase().split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              setMultiBrandData(prev => ({...prev, name: titleCaseValue}));
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleAddMultiBrandCustomer()}
            className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200"
            placeholder="Enter customer full name"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            📞 Phone Number *
          </label>
          <input
            type="tel"
            value={multiBrandData.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 10) {
                setMultiBrandData(prev => ({...prev, phone: value}));
              }
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleAddMultiBrandCustomer()}
            maxLength={10}
            className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200"
            placeholder="Enter 10-digit phone number"
          />
        </div>

        {/* Address Field - Multi-brand */}
        <div className="md:col-span-2 space-y-1">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            📍 Address *
          </label>
          <textarea
            value={multiBrandData.address}
            onChange={(e) => setMultiBrandData(prev => ({...prev, address: e.target.value}))}
            onKeyPress={(e) => e.key === 'Enter' && handleAddMultiBrandCustomer()}
            rows={2}
            className="text-gray-800 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 resize-none"
            placeholder="Enter customer complete address"
            required
          />
        </div>

        {/* Cost Field (No GST) */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            💰 Total Cost (₹) *
          </label>
          <input
            type="number"
            value={multiBrandData.cost}
            onChange={(e) => setMultiBrandData(prev => ({...prev, cost: e.target.value}))}
            onKeyPress={(e) => e.key === 'Enter' && handleAddMultiBrandCustomer()}
            className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200"
            placeholder="Enter total cost"
            min="0"
            step="0.01"
          />
          <div className="text-xs text-gray-600 mt-1">
            Multi-brand bills don't include GST
          </div>
        </div>

        {/* Brand Dropdown */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            🏷️ Brand
          </label>
          <select
            value={multiBrandData.brand}
            onChange={(e) => setMultiBrandData(prev => ({...prev, brand: e.target.value, model: '', imei: ''}))}
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

        {/* Model Item Dropdown */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            📱 Model Item
          </label>
          <select
            value={multiBrandData.model}
            onChange={(e) => setMultiBrandData(prev => ({...prev, model: e.target.value, imei: ''}))}
            disabled={!multiBrandData.brand}
            className={`text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 bg-white ${
              !multiBrandData.brand ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <option value="">Select Model Item</option>
            {variants
              .filter(v => 
                (v.productName === multiBrandData.brand || 
                 v.product?.name === multiBrandData.brand) &&
                v.shopType === 'sales'
              )
              .map((variant) => (
                <option key={variant._id} value={variant.variantName}>
                  {variant.variantName} 
                </option>
              ))
            }
          </select>
        </div>

<div className="space-y-1">
  <label className="block text-xs font-semibold text-gray-700 mb-1">
    📱 IMEI Number
  </label>
  
  <div className="relative">
    {/* Input Field that also shows dropdown */}
    <input
      type="text"
      value={multiBrandData.imei}
      onChange={(e) => {
        const inputValue = e.target.value;
        console.log('⌨️ IMEI Input:', inputValue);
        setMultiBrandData(prev => ({...prev, imei: inputValue}));
        setShowMultiBrandImeiDropdown(true); // Keep dropdown open when typing
        
        // Auto-fill if exact IMEI match is found
        if (inputValue) {
          const stockItem = stockItems.find(item => item.imei === inputValue);
          if (stockItem && stockItem.variant) {
            console.log('📦 Auto-fill triggered for:', inputValue);
            
            const brand = stockItem.variant.product?.name || 
                         stockItem.variant.productName || 
                         stockItem.product?.name ||
                         stockItem.productName || '';
            
            const model = stockItem.variant.variantName || 
                         stockItem.variantName || '';
            
            console.log('🎯 Extracted - Brand:', brand, 'Model:', model);
            
            if (brand && model) {
              setMultiBrandData(prev => ({
                ...prev,
                brand: brand,
                model: model
              }));
              console.log('✅ Auto-fill successful!');
            }
          }
        }
      }}
      onFocus={() => setShowMultiBrandImeiDropdown(true)}
      onBlur={() => {
        // Use timeout to allow click to register first
        setTimeout(() => setShowMultiBrandImeiDropdown(false), 150);
      }}
      placeholder="Type IMEI or click to select from list"
      className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 pr-10 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200"
    />
    
    {/* Dropdown arrow indicator */}
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
      ▼
    </div>
    
    {/* Dropdown List */}
    {showMultiBrandImeiDropdown && (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
        {getAvailableIMEIs('multiBrand')
          .filter(item => {
            if (!multiBrandData.imei) return true;
            return item.imei.includes(multiBrandData.imei) || 
                   item.variant?.variantName?.toLowerCase().includes(multiBrandData.imei.toLowerCase());
          })
          .map((item) => (
            <div
              key={item._id}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent input blur
                console.log('🔄 IMEI Selected from dropdown:', item.imei);
                setMultiBrandData(prev => ({...prev, imei: item.imei}));
                setShowMultiBrandImeiDropdown(false);
                
                // Auto-fill when selected
                if (item.variant) {
                  const brand = item.variant.product?.name || 
                               item.variant.productName || 
                               item.product?.name ||
                               item.productName || '';
                  
                  const model = item.variant.variantName || 
                               item.variantName || '';
                  
                  console.log('🎯 Extracted - Brand:', brand, 'Model:', model);
                  
                  if (brand && model) {
                    setMultiBrandData(prev => ({
                      ...prev,
                      brand: brand,
                      model: model
                    }));
                    console.log('✅ Auto-fill successful!');
                  }
                }
              }}
              className="px-3 py-2 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
            >
              <div className="font-medium text-gray-800">{item.imei}</div>
              <div className="text-sm text-gray-600">
                {item.variant?.variantName || 'N/A'} - ₹{item.cost}
                {item.variant?.product?.name && ` (${item.variant.product.name})`}
              </div>
            </div>
          ))
        }
        
        {/* No results message */}
        {getAvailableIMEIs('multiBrand').filter(item => {
          if (!multiBrandData.imei) return true;
          return item.imei.includes(multiBrandData.imei) || 
                 item.variant?.variantName?.toLowerCase().includes(multiBrandData.imei.toLowerCase());
        }).length === 0 && (
          <div className="px-3 py-2 text-gray-500 text-sm">
            No matching IMEIs found
          </div>
        )}
      </div>
    )}
  </div>
  
  {/* Filtering Status */}
  {multiBrandData.imei && showMultiBrandImeiDropdown && (
    <div className="text-xs text-gray-600 mt-1">
      🔍 Showing {getAvailableIMEIs('multiBrand').filter(item => 
        item.imei.includes(multiBrandData.imei) || 
        item.variant?.variantName?.toLowerCase().includes(multiBrandData.imei.toLowerCase())
      ).length} matching IMEIs
    </div>
  )}
  
  {getAvailableIMEIs('multiBrand').length === 0 && (
    <p className="text-red-500 text-xs mt-1">No IMEIs available in stock</p>
  )}
  
  {/* Selected IMEI Auto-fill Info */}
  {multiBrandData.imei && (() => {
    const stockItem = stockItems.find(item => item.imei === multiBrandData.imei);
    return stockItem && stockItem.variant ? (
      <div className="text-xs text-green-600 mt-1">
        ✅ Auto-filled: {stockItem.variant.product?.name} - {stockItem.variant.variantName}
      </div>
    ) : multiBrandData.imei ? (
      <div className="text-xs text-yellow-600 mt-1">
        ⚠️ IMEI not found in stock database - please select from dropdown
      </div>
    ) : null;
  })()}
</div>

        {/* Cashier Dropdown */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            👨‍💼 Cashier *
          </label>
          <select
            value={multiBrandData.cashier}
            onChange={(e) => setMultiBrandData(prev => ({...prev, cashier: e.target.value}))}
            className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 bg-white"
            required
          >
            <option value="">Select Cashier</option>
            {salesCashiers.map((cashier, index) => (
              <option key={index} value={cashier}>
                {cashier}
              </option>
            ))}
          </select>
          {salesCashiers.length === 0 && (
            <p className="text-red-500 text-xs mt-1">
              No sales cashiers found. Add cashiers in the Add Product page.
            </p>
          )}
        </div>

        {/* GST Number Field - Multi-brand (Optional) */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            🏢 GST Number (Optional)
          </label>
          <input
            type="text"
            value={multiBrandData.gstNumber}
            onChange={(e) => setMultiBrandData(prev => ({...prev, gstNumber: e.target.value}))}
            onKeyPress={(e) => e.key === 'Enter' && handleAddMultiBrandCustomer()}
            className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200"
            placeholder="Enter customer GST number"
          />
        </div>

        {/* Payment Mode */}
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
                  checked={multiBrandData.paymentMode === 'cash'}
                  onChange={(e) => setMultiBrandData(prev => ({...prev, paymentMode: e.target.value}))}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
                  multiBrandData.paymentMode === 'cash' 
                    ? 'border-green-500 bg-green-500' 
                    : 'border-gray-400 group-hover:border-green-400'
                }`}>
                  {multiBrandData.paymentMode === 'cash' && (
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
                  checked={multiBrandData.paymentMode === 'gpay'}
                  onChange={(e) => setMultiBrandData(prev => ({...prev, paymentMode: e.target.value}))}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
                  multiBrandData.paymentMode === 'gpay' 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-400 group-hover:border-blue-400'
                }`}>
                  {multiBrandData.paymentMode === 'gpay' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
              <span className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                📱 Gpay
              </span>
            </label>

            {/* ✅ ADDED: EMI Option for Multi-brand */}
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="radio"
                  name="paymentMode"
                  value="emi"
                  checked={multiBrandData.paymentMode === 'emi'}
                  onChange={(e) => setMultiBrandData(prev => ({...prev, paymentMode: e.target.value}))}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
                  multiBrandData.paymentMode === 'emi' 
                    ? 'border-purple-500 bg-purple-500' 
                    : 'border-gray-400 group-hover:border-purple-400'
                }`}>
                  {multiBrandData.paymentMode === 'emi' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
              <span className="text-gray-900 font-medium group-hover:text-purple-600 transition-colors">
                🏦 EMI
              </span>
            </label>
          </div>

          {/* ✅ ADDED: EMI Finance Company for Multi-brand */}
          {multiBrandData.paymentMode === 'emi' && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <label className="block text-sm font-semibold text-purple-800 mb-2">
                🏢 Select Finance Company *
              </label>
              <select
                value={multiBrandData.financeCompany || ''}
                onChange={(e) => setMultiBrandData(prev => ({...prev, financeCompany: e.target.value}))}
                className="text-gray-800 w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 bg-white"
                required
              >
                <option value="">Select Finance Company</option>
                <option value="bajaj">Bajaj Finance</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="kotak">Kotak Mahindra</option>
                <option value="homecredit">Home Credit</option>
                <option value="other">Other Finance</option>
              </select>
              <p className="text-xs text-purple-600 mt-2">
                Selected payment will show as: EMI-{multiBrandData.financeCompany ? multiBrandData.financeCompany.toUpperCase() : '[Company]'}
              </p>
            </div>
          )}
        </div>

        <div className="md:col-span-2 flex justify-end pt-2">
          <button
            onClick={handleAddMultiBrandCustomer}
            className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-2 rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-300 font-semibold text-sm shadow hover:shadow-md flex items-center gap-1"
          >
            <span>➕ Add Multi-brand Customer</span>
          </button>
        </div>
      </div>

      {/* IMEI Information Display */}
      {multiBrandData.imei && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">📱 Selected IMEI Information</h4>
          {(() => {
            const stockItem = stockItems.find(item => item.imei === multiBrandData.imei);
            return stockItem ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-black">
                <div>
                  <div className="text-gray-600">IMEI:</div>
                  <div className="font-semibold">{stockItem.imei}</div>
                </div>
                <div>
                  <div className="text-gray-600">Supplier:</div>
                  <div className="font-semibold">{stockItem.dealer?.name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-gray-600">HSN Code:</div>
                  <div className="font-semibold">{stockItem.hsn || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-gray-600">Cost Price:</div>
                  <div className="font-semibold">₹{stockItem.cost}</div>
                </div>
              </div>
            ) : (
              <p className="text-red-600 text-sm">No information found for this IMEI</p>
            );
          })()}
        </div>
      )}


        </div>

        {/* Multi-brand Customers Table */}
{multiBrandCustomers.length > 0 && (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-orange-100 mt-4">
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Multi-brand Records</h3>
        <div className="text-xs text-gray-500 bg-orange-50 px-2 py-1 rounded-full">
          Total: {multiBrandCustomers.length} records
        </div>
      </div>
      
      <div className="overflow-x-auto text-black">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-orange-500 to-amber-500">
              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Date & Time</th>
              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase">Cashier</th>
              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Invoice No.</th>
              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Customer Name</th>
              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Phone</th>
              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Brand</th>
              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Model Item</th>
              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase">IMEI</th>
              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase">HSN</th>
              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase">Supplier</th>
              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider w-35">Warranty Days</th>
              <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider">Payment Mode</th>
              <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider">Cost (₹)</th>
              <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {multiBrandCustomers.map((customer, index) => (
              <tr key={index} className="hover:bg-orange-50 transition-colors duration-200 border-b border-gray-200">
                <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                  {new Date().toLocaleString('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </td>
                <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                  {customer.cashier || 'N/A'}
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
                <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                  {customer.model || 'N/A'}
                </td>
                <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                  {customer.imei || 'N/A'}
                </td>
                <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                  {(() => {
                    const stockItem = stockItems.find(item => item.imei === customer.imei);
                    return stockItem?.hsn || 'N/A';
                  })()}
                </td>
                <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                  {(() => {
                    const stockItem = stockItems.find(item => item.imei === customer.imei);
                    return stockItem?.dealer?.name || 'N/A';
                  })()}
                </td>
                <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-center">
                  <input
                    type="number"
                    value={customer.warrantyDays || ''}
                    onChange={(e) => handleMultiBrandWarrantyDaysChange(index, e.target.value)}
                    onBlur={(e) => handleMultiBrandWarrantyDaysSave(index, e.target.value)}
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
        ? 'bg-green-50 text-green-700 border-l-4 border-green-500' :
      customer.paymentMode === 'gpay' 
        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' :
      'bg-purple-50 text-purple-700 border-l-4 border-purple-500'
    }`}>
      <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
        customer.paymentMode === 'cash' ? 'bg-green-500' : 
        customer.paymentMode === 'gpay' ? 'bg-blue-500' : 
        'bg-purple-500'
      }`}></div>
      {customer.paymentMode === 'cash' ? 'Cash' : 
       customer.paymentMode === 'gpay' ? 'Gpay' : 
       `EMI-${customer.financeCompany ? customer.financeCompany.toUpperCase() : 'N/A'}`}
    </div>
  </div>
</td>
                <td className="border border-gray-200 px-3 py-2 font-semibold whitespace-nowrap text-green-600 text-base">
                  ₹{customer.cost.toFixed(2)}
                </td>
                <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {/* Print Button */}
                      <button
                        onClick={() => handleMultiBrandAction(customer, 'print')}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-all duration-200 font-semibold shadow hover:shadow-sm flex items-center gap-1"
                        title="Print Multi-brand Bill"
                      >
                        🖨️
                      </button>
                      
                      {/* Download Button */}
                      <button
                        onClick={() => handleMultiBrandAction(customer, 'download')}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-all duration-200 font-semibold shadow hover:shadow-sm flex items-center gap-1"
                        title="Download PDF"
                      >
                        ⬇️
                      </button>
                      
                      {/* WhatsApp Button */}
                      <button
                        onClick={() => handleMultiBrandWhatsApp(customer)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-all duration-200 font-semibold shadow hover:shadow-sm flex items-center gap-1"
                        title="Send via WhatsApp"
                      >
                        ✅
                      </button>
                    </div>
                    {multiBrandActionStatus[customer.invoiceNumber] && (
                      <span className="text-xs text-gray-600 ml-1 bg-gray-100 px-2 py-1 rounded-full">
                        {multiBrandActionStatus[customer.invoiceNumber]}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

        {/* Multi-brand Income Summary */}
        <div className="bg-white rounded-xl p-4 shadow-lg mt-4 border border-orange-200">
          <h3 className="text-lg font-bold mb-4 text-center text-gray-800">
            💰 MULTI-BRAND INCOME SUMMARY
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-center">
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="text-2xl font-bold mb-2 text-gray-800">
                ₹{multiBrandSummary.todayIncome.toFixed(2)}
              </div>
              <div className="text-sm font-semibold mb-1 text-gray-700">Today's Income</div>
              <div className="text-xs text-gray-600">Paid amounts received today</div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="text-2xl font-bold mb-2 text-gray-800">
                ₹{multiBrandSummary.totalIncome.toFixed(2)}
              </div>
              <div className="text-sm font-semibold mb-1 text-gray-700">Total Revenue</div>
              <div className="text-xs text-gray-600">All-time business earnings</div>
            </div>
          </div>
        </div>
      </>
    )}

        {/* Filter Section */}
        {activeTab === 'filter' && (
          <div className="bg-white rounded-lg p-4 shadow-md mb-4 border border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
                <h2 className="text-xl font-bold text-gray-800">
                  Filter {shopType === 'service' ? 'Service' : 'Sales'} Records
                </h2>
              </div>
              
              {/* Tabs for Sales Shop Type */}
              {shopType === 'sales' && (
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setSalesFilterTab('customer')}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                      salesFilterTab === 'customer'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-gray-300 hover:text-orange-600'
                    }`}
                  >
                    👤 Customer Records
                  </button>
                  <button
                    onClick={() => setSalesFilterTab('stock')}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                      salesFilterTab === 'stock'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-gray-300 hover:text-orange-600'
                    }`}
                  >
                    📦 Stock Records
                  </button>
                </div>
              )}
            </div>
            
            {/* Customer Records Filter - Show for Service OR Sales when customer tab is selected */}
            {(shopType === 'service' || (shopType === 'sales' && salesFilterTab === 'customer')) && (
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
            )}

            {/* Stock Records Filter - Show only for Sales when stock tab is selected */}
            {shopType === 'sales' && salesFilterTab === 'stock' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* IMEI Field - Multi-brand (Independent of Model) */}
<div className="space-y-1">
  <label className="block text-xs font-semibold text-gray-700 mb-1">
    📱 IMEI Number
  </label>
  <select
    value={multiBrandData.imei}
    onChange={(e) => {
      const selectedImei = e.target.value;
      setMultiBrandData(prev => ({...prev, imei: selectedImei}));
      
      // ✅ OPTIONAL: Auto-fill brand and model based on selected IMEI
      if (selectedImei) {
        const stockItem = stockItems.find(item => item.imei === selectedImei);
        if (stockItem) {
          const variant = variants.find(v => v._id === stockItem.variantId);
          if (variant) {
            setMultiBrandData(prev => ({
              ...prev,
              brand: variant.productName || variant.product?.name || '',
              model: variant.variantName || ''
            }));
          }
        }
      }
    }}
    className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 bg-white"
  >
    <option value="">Select IMEI</option>
    {getAvailableIMEIs('multiBrand').map((item) => (
      <option key={item._id} value={item.imei}>
        {item.imei} - {item.variant?.variantName || 'N/A'} - ₹{item.cost}
      </option>
    ))}
  </select>
  {getAvailableIMEIs('multiBrand').length === 0 && (
    <p className="text-red-500 text-xs mt-1">No IMEIs available in stock</p>
  )}
</div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    🏷️ Brand
                  </label>
                  <select
                    name="brand"
                    value={stockFilterData.brand}
                    onChange={handleStockFilterChange}
                    className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200 bg-white"
                  >
                    <option value="">All Brands</option>
                    {products.map((product) => (
                      <option key={product._id} value={product.name}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    📱 Model
                  </label>
                  <select
                    name="model"
                    value={stockFilterData.model}
                    onChange={handleStockFilterChange}
                    className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200 bg-white"
                  >
                    <option value="">All Models</option>
                    {variants
                      .filter(v => v.shopType === 'sales')
                      .map((variant) => (
                        <option key={variant._id} value={variant.variantName}>
                          {variant.variantName}
                        </option>
                      ))
                    }
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    📊 Status
                  </label>
                  <select
                    name="status"
                    value={stockFilterData.status}
                    onChange={handleStockFilterChange}
                    className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200 bg-white"
                  >
                    <option value="">All Status</option>
                    <option value="in_stock">In Stock</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    🏢 Supplier
                  </label>
                  <select
                    name="dealer"
                    value={stockFilterData.dealer}
                    onChange={handleStockFilterChange}
                    className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200 bg-white"
                  >
                    <option value="">All Dealers</option>
                    {dealers.map((dealer) => (
                      <option key={dealer._id} value={dealer._id}>
                        {dealer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    🔢 HSN Code
                  </label>
                  <input
                    type="text"
                    name="hsn"
                    value={stockFilterData.hsn}
                    onChange={(e) => {
                      const trimmedValue = e.target.value.replace(/^\s+/, '');
                      setStockFilterData(prev => ({
                        ...prev,
                        hsn: trimmedValue
                      }));
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyStockFilter()}
                    className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
                    placeholder="Search by HSN"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    📅 From Date
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={stockFilterData.fromDate}
                    onChange={handleStockFilterChange}
                    className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    📅 To Date
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    value={stockFilterData.toDate}
                    onChange={handleStockFilterChange}
                    className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-4 justify-end">
              {shopType === 'sales' && salesFilterTab === 'stock' ? (
                <>
                  <button
                    onClick={handleApplyStockFilter}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-300 font-semibold text-sm shadow hover:shadow-md flex items-center gap-1"
                  >
                    <span>🔍 Apply Stock Filter</span>
                  </button>
                  <button
                    onClick={handleResetStockFilter}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold text-sm shadow hover:shadow-md flex items-center gap-1"
                  >
                    <span>🔄 Reset Stock Filter</span>
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}

        {/* Items Management Section */}
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
                          
                          // In the product mapping section, update the isLowStock calculation:
let isLowStock = false;
let displayData = {};

if (shopType === 'sales') {
  // Sales logic - NO low stock alerts
  let totalInStock = 0;
  let totalSold = 0;
  let totalInvestment = 0;
  
  productVariants.forEach(variant => {
    const variantStock = stockItems.filter(item => 
      item.variant?._id === variant._id
    );
    totalInStock += variantStock.filter(item => item.status === 'in_stock').length;
    totalSold += variantStock.filter(item => item.status === 'sold').length;
    totalInvestment += variantStock.reduce((sum, item) => sum + item.cost, 0);
  });
  
  // ✅ CHANGED: Never show low stock for sales
  isLowStock = false;
  displayData = {
    variantsCount: productVariants.length,
    inStock: totalInStock,
    sold: totalSold,
    investment: totalInvestment
  };
} else {
  // Service logic - use quantity from variants
  const totalQuantity = calculateTotalQuantity(product.name);
  const hasLowStockVariant = productVariants.some(v => 
    parseInt(v.quantity) <= (v.lowStockThreshold || 5)
  );
  isLowStock = hasLowStockVariant;
  const outOfStockVariants = productVariants.filter(v => {
    const quantity = parseInt(v.quantity);
    const threshold = v.lowStockThreshold || 5;
    return quantity <= threshold;
  });
  
  displayData = {
    variantsCount: productVariants.length,
    totalQuantity: totalQuantity,
    hasLowStockVariant: hasLowStockVariant,
    outOfStockVariants: outOfStockVariants
  };
}
                          
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
{isLowStock && !(selectedProduct && selectedProduct._id === product._id) && shopType === 'service' && (
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
                                        {displayData.variantsCount} {shopType === 'service' ? 'variants' : 'models'}
                                      </span>
                                      {shopType === 'sales' ? (
                                        <>
                                          <span className="text-blue-800 text-sm font-semibold">
                                            In Stock: {displayData.inStock}
                                          </span>
                                          <span className="text-red-800 text-sm font-semibold">
                                            Sold: {displayData.sold}
                                          </span>
                                        </>
                                      ) : (
                                        <span className={`text-xs font-bold ${
                                          displayData.hasLowStockVariant ? 'text-red-600' : 'text-blue-800'
                                        }`}>
                                          Total: {displayData.totalQuantity} items
                                          {displayData.hasLowStockVariant && !isLowStock && ' ⚠️'}
                                        </span>
                                      )}
                                    </div>
                                    
                                    {shopType === 'sales' ? (
                                      <div className="text-center">
                                        <span className="text-xs font-semibold text-gray-600">
                                          Investment: ₹{displayData.investment.toFixed(2)}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="text-center">
                                        <span className="text-xs font-semibold text-gray-600">
                                          Low Stock: 
                                        </span>
                                        {displayData.outOfStockVariants.length === 0 ? (
                                          <span className="text-xs text-green-600 font-semibold ml-1">nil</span>
                                        ) : (
                                          <span className="text-xs text-red-600 font-semibold ml-1">
                                            ({displayData.outOfStockVariants.map(v => v.variantName).join(', ')})
                                          </span>
                                        )}
                                      </div>
                                    )}
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

                    {/* Variants List with Stock Management */}
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
                              // Different logic for sales vs service
                              // In the variant mapping section:
let isVariantLowStock = false;
let variantData = {};

if (shopType === 'sales') {
  const variantStockItems = stockItems.filter(item => 
    item.variant?._id === variant._id
  );
  const inStockCount = variantStockItems.filter(item => item.status === 'in_stock').length;
  const soldCount = variantStockItems.filter(item => item.status === 'sold').length;
  const totalInvestment = variantStockItems.reduce((sum, item) => sum + item.cost, 0);
  
  // ✅ CHANGED: Never show low stock for sales
  isVariantLowStock = false;
  variantData = {
    inStockCount,
    soldCount,
    totalInvestment,
    variantStockItems
  };
} else {
  const threshold = variant.lowStockThreshold || 5;
  const quantity = parseInt(variant.quantity) || 0;
  const price = parseFloat(variant.sellingPrice) || 0;
  isVariantLowStock = quantity <= threshold;
  variantData = {
    quantity: quantity,
    price: price,
    threshold,
    value: (price * quantity).toFixed(2)
  };
}
                            
                              return (
                                <div 
                                  key={variant._id} 
                                  className={`border-2 rounded-lg p-3 relative ${
                                    isVariantLowStock 
                                      ? ' bg-red-50' 
                                      : 'border-gray-200 bg-gray-50'
                                  }`}
                                >
{isVariantLowStock && shopType === 'service' && (
  <div 
    className="absolute inset-0 border-5 border-red-500 animate-pulse rounded-lg pointer-events-none"
    style={{
      animation: 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }}
  ></div>
)}
                                  
                                  <div className="flex justify-between items-start">
{/* Left Section - Price & Stock Info */}
<div className="flex flex-col gap-3 w-1/4">
  <div className="flex flex-col">
    <span className="text-xs text-gray-500 mb-1">
      {shopType === 'service' ? 'Price' : 'Cost Price'}
    </span>
    {editingVariant === variant._id ? (
      shopType === 'service' ? (
        <input
          type="number"
          value={editVariantPrice}
          onChange={(e) => setEditVariantPrice(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleVariantSaveClick(variant._id, e)}
          className="text-black w-24 px-2 py-1 border border-orange-500 rounded text-sm focus:outline-none focus:border-orange-500"
          min="0"
          step="0.01"
          placeholder="Price"
        />
      ) : (
        <span className="w-24 py-1 text-sm font-bold text-gray-800">
          N/A
        </span>
      )
    ) : (
      <span className="w-24 py-1 text-sm font-bold text-gray-800">
        {shopType === 'service' ? `₹ ${variant.sellingPrice}` : 'N/A'}
      </span>
    )}
  </div>

  {shopType === 'sales' ? (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 mb-1">Stock Status</span>
      <div className="text-sm">
        <div className="text-green-600 font-semibold">In: {variantData.inStockCount}</div>
        <div className="text-red-600 font-semibold">Sold: {variantData.soldCount}</div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 mb-1">Quantity</span>
      {editingVariant === variant._id ? (
        <input
          type="number"
          value={editVariantQuantity}
          onChange={(e) => setEditVariantQuantity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleVariantSaveClick(variant._id, e)}
          className="text-black w-24 px-2 py-1 border border-orange-500 rounded text-sm focus:outline-none focus:border-orange-500"
          min="0"
          placeholder="Quantity"
        />
      ) : (
        <span className={`w-24 px-1 py-1 text-sm font-bold ${
          isVariantLowStock ? 'text-red-600' : 'text-gray-800'
        }`}>
          {variantData.quantity}
        </span>
      )}
    </div>
  )}
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

                                      <div className="flex flex-col w-full">
                                        <span className="text-sm font-semibold text-gray-700">
                                          {shopType === 'service' ? 'Stock Value' : 'Investment'}: ₹
                                          {shopType === 'service' ? variantData.value : variantData.totalInvestment?.toFixed(2)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          Low stock alert at: {variant.lowStockThreshold || 5} items
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
                              {shopType === 'sales' ? (
                                <>
                                  <div className="text-center flex-1">
                                    <div className="text-gray-600 text-xs">Total In Stock</div>
                                    <div className="text-black font-semibold text-md">
                                      {stockItems.filter(item => 
                                        getSelectedProductVariants().some(v => v._id === item.variant?._id) && 
                                        item.status === 'in_stock'
                                      ).length}
                                    </div>
                                  </div>
                                  <div className="text-center flex-1">
                                    <div className="text-gray-600 text-xs">Total Sold</div>
                                    <div className="text-black font-semibold text-md">
                                      {stockItems.filter(item => 
                                        getSelectedProductVariants().some(v => v._id === item.variant?._id) && 
                                        item.status === 'sold'
                                      ).length}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="text-center flex-1">
                                  <div className="text-gray-600 text-xs">Total Quantity</div>
                                  <div className="text-black font-semibold text-md">
                                    {getSelectedProductVariants().reduce((sum, variant) => sum + (parseInt(variant.quantity) || 0), 0)}
                                  </div>
                                </div>
                              )}
                              <div className="text-center flex-1">
                            <div className="text-black font-semibold text-md">
                              {shopType === 'sales' 
                                ? '₹' + stockItems
                                    .filter(item => getSelectedProductVariants().some(v => v._id === item.variant?._id))
                                    .reduce((sum, item) => sum + item.cost, 0).toFixed(2) 
                                : '₹' + getSelectedProductVariants()
                                    .reduce((sum, variant) => {
                                      const quantity = parseInt(variant.quantity) || 0;
                                      const price = parseFloat(variant.sellingPrice) || 0;
                                      return sum + (price * quantity);
                                    }, 0).toFixed(2)
                              }
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
                        {shopType === 'sales' ? (
                          <>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                              <div className="text-xl font-bold mb-2 text-black">
                                {stockItems.filter(item => item.status === 'in_stock').length}
                              </div>
                              <div className="text-md font-semibold text-black">Total In Stock</div>
                              <div className="text-xs opacity-90 text-black">Available items for sale</div>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                              <div className="text-xl font-bold mb-2 text-black">
                                ₹{stockItems.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
                              </div>
                              <div className="text-md font-semibold text-black">Total Investment</div>
                              <div className="text-xs opacity-90 text-black">Current inventory value</div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                              <div className="text-xl font-bold mb-2 text-black">
                                {calculateTotalQuantityAllProducts()}
                              </div>
                              <div className="text-md font-semibold text-black">Total Quantity</div>
                              <div className="text-xs opacity-90 text-black">Across all products and variants</div>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                              <div className="text-xl font-bold mb-2 text-black">
                                ₹{calculateTotalInvestment().toFixed(2)}
                              </div>
                              <div className="text-md font-semibold text-black">Total Investment</div>
                              <div className="text-xs opacity-90 text-black">Current stock value</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Product Section */}
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
                        

                        

{/* Price field - Only show for service */}
{shopType === 'service' && (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {shopType === 'service' ? 'Stock' : 'Model'} Price (₹) *
    </label>
    <input
      type="number"
      required={shopType === 'service'} // Only required for service
      value={variant.price}
      onChange={(e) => updateProductVariant(variant.id, 'price', e.target.value)}
      placeholder="0.00"
      min="0"
      step="0.01"
      className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
    />
  </div>
)}


{/* Quantity field - Only show for service */}
{shopType === 'service' && (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      Quantity *
    </label>
    <input
      type="number"
      required={shopType === 'service'} // Only required for service
      value={variant.quantity}
      onChange={(e) => updateProductVariant(variant.id, 'quantity', e.target.value)}
      placeholder="0"
      min="0"
      className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
    />
  </div>
)}

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
                  
                {/* 3. Add Stock Section (SEPARATE - Only for Sales) */}
    {shopType === 'sales' && (
      <div className="bg-white rounded-lg p-6 shadow-md border border-purple-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-2 h-6 bg-purple-500 rounded-full mr-2"></div>
            <h2 className="text-xl font-bold text-gray-800">
              📦 Add Stock Items
            </h2>
          </div>
          <button
            onClick={addStockRow}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors font-semibold flex items-center gap-2"
          >
            <span>+ Add Stock Row</span>
          </button>
        </div>

        {/* Stock Items Form */}
        <div className="space-y-4">
          {stockFormData.map((stockItem, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-800">Stock Item {index + 1}</h4>
                      <div className="flex items-center gap-4">
        {/* ✅ COPY FROM PREVIOUS CHECKBOX */}
        {index > 0 && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`copy-from-previous-${index}`}
              checked={stockItem.copyFromPrevious}
              onChange={(e) => handleStockFormChange(index, 'copyFromPrevious', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor={`copy-from-previous-${index}`} className="text-sm text-gray-700">
              Copy from previous
            </label>
          </div>
        )}
                {stockFormData.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStockRow(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
                  </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Product */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Product *
                  </label>
                  <select
                    value={stockItem.product}
                    onChange={(e) => handleStockFormChange(index, 'product', e.target.value)}
                    className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product.name}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

{/* Model Dropdown */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">
    Model *
  </label>
  <select
    value={stockItem.model}
    onChange={(e) => handleStockFormChange(index, 'model', e.target.value)}
    disabled={!stockItem.product}
    className={`text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 ${
      !stockItem.product ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    required
  >
    <option value="">Select Model</option>
    {stockItem.product && 
      variants
        .filter(v => 
          (v.productName === stockItem.product || v.product?.name === stockItem.product) &&
          v.shopType === 'sales'
        )
        .map((variant) => (
          <option key={variant._id} value={variant.variantName}>
            {variant.variantName}
          </option>
        ))
    }
  </select>
  {!stockItem.product && (
    <p className="text-red-500 text-xs mt-1">Please select a product first</p>
  )}
  {stockItem.product && variants.filter(v => 
    (v.productName === stockItem.product || v.product?.name === stockItem.product) &&
    v.shopType === 'sales'
  ).length === 0 && (
    <p className="text-yellow-500 text-xs mt-1">No models found for this product</p>
  )}
</div>

                {/* IMEI */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    IMEI *
                  </label>
                  <input
                    type="text"
                    value={stockItem.imei}
                    onChange={(e) => handleStockFormChange(index, 'imei', e.target.value)}
                    placeholder="IMEI number"
                    className={`text-black w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 ${
                      duplicateIMEIs.has(stockItem.imei) || existingIMEIs.has(stockItem.imei) 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {(duplicateIMEIs.has(stockItem.imei) || existingIMEIs.has(stockItem.imei)) && (
                    <p className="text-red-500 text-xs mt-1">
                      {existingIMEIs.has(stockItem.imei) ? 'IMEI exists in database' : 'Duplicate IMEI'}
                    </p>
                  )}
                </div>

                                {/* Dealer */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Supplier *
                  </label>
                  <select
                    value={stockItem.dealer}
                    onChange={(e) => handleStockFormChange(index, 'dealer', e.target.value)}
                    className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                    required
                  >
                    <option value="">Select Supplier</option>
                    {dealers.map(dealer => (
                      <option key={dealer._id} value={dealer._id}>
                        {dealer.name}
                      </option>
                    ))}
                  </select>
                </div>

{/* HSN - Combined Input & Dropdown */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">
    HSN
  </label>
  <div className="relative">
    <input
      type="text"
      value={stockItem.hsn}
      onChange={(e) => handleStockFormChange(index, 'hsn', e.target.value)}
      onFocus={() => {
        console.log('🎯 HSN field focused, dealer:', stockItem.dealer);
        console.log('📋 Available HSN codes:', dealerHsnCodes[stockItem.dealer]);
        if (stockItem.dealer) {
          setShowHsnDropdown(true);
        }
      }}
      onBlur={() => {
        setTimeout(() => setShowHsnDropdown(false), 150);
      }}
      placeholder="Type HSN or select from list"
      className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
    />
    
    {/* HSN Dropdown */}
    {showHsnDropdown && stockItem.dealer && dealerHsnCodes[stockItem.dealer] && (
      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
        {dealerHsnCodes[stockItem.dealer].length > 0 ? (
          <>
            {dealerHsnCodes[stockItem.dealer].filter(hsn => {
              if (!stockItem.hsn) return true;
              return hsn.toLowerCase().includes(stockItem.hsn.toLowerCase());
            }).map((hsn, hsnIndex) => (
              <div
                key={hsnIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  console.log('✅ HSN selected:', hsn);
                  handleStockFormChange(index, 'hsn', hsn);
                  setShowHsnDropdown(false);
                }}
                className="px-3 py-2 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
              >
                <div className="font-medium text-gray-800">{hsn}</div>
              </div>
            ))}
            
            {/* Show option to add new HSN when typing something different */}
            {stockItem.hsn && !dealerHsnCodes[stockItem.dealer].includes(stockItem.hsn) && (
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  console.log('➕ Keeping new HSN:', stockItem.hsn);
                  setShowHsnDropdown(false);
                }}
                className="px-3 py-2 bg-green-50 text-green-700 cursor-pointer border-t border-green-200"
              >
                <div className="font-medium">➕ Add new HSN: "{stockItem.hsn}"</div>
                <div className="text-xs">This will be saved for future use</div>
              </div>
            )}
          </>
        ) : (
          <div className="px-3 py-2 text-gray-500 text-sm">
            No HSN codes found for this supplier
          </div>
        )}
      </div>
    )}
  </div>
  
{/* HSN Status Info */}
{stockItem.dealer && (
  <div className="text-xs mt-1">
    {dealerHsnCodes[stockItem.dealer] === undefined ? (
      <span className="text-blue-600">🔄 Loading HSN codes...</span>
    ) : dealerHsnCodes[stockItem.dealer].length > 0 ? (
      <span className="text-green-600">
        ✅ HSN codes available
      </span>
    ) : (
      <span className="text-yellow-600">📝 No HSN codes found - you can add new ones</span>
    )}
  </div>
)}
</div>

                {/* Cost */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Cost (₹) *
                  </label>
                  <input
                    type="number"
                    value={stockItem.cost}
                    onChange={(e) => handleStockFormChange(index, 'cost', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

                  {/* ✅ ADD ERROR DISPLAY RIGHT HERE - After form fields, before closing div */}
    {stockItem.error && (
      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-red-500 text-lg mr-2">❌</span>
            <span className="text-red-700 text-sm font-medium">{stockItem.error}</span>
          </div>
          <button
            onClick={() => {
              const newForm = [...stockFormData];
              newForm[index] = { ...newForm[index], error: '' };
              setStockFormData(newForm);
            }}
            className="text-red-500 hover:text-red-700 text-sm"
            title="Clear error"
          >
            ✕
          </button>
        </div>
      </div>
    )}
            </div>
          ))}
        </div>
        

        {/* Save Stock Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveStockItems}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold"
          >
            💾 Save All Stock Items
          </button>
        </div>
      </div>
    )}

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
                    setCurrentOffer('');
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
                        setCurrentOffer('');
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

            {/* Cashier Management Section */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-purple-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-2 h-6 bg-purple-500 rounded-full mr-2"></div>
                  <h2 className="text-xl font-bold text-gray-800">
                    👨‍💼 Manage {shopType === 'service' ? 'Service' : 'Sales'} Cashiers
                  </h2>
                </div>
                <div className="text-sm text-gray-500 bg-purple-50 px-3 py-1 rounded-full">
                  Total: {(shopType === 'service' ? serviceCashiers : salesCashiers).length} cashiers
                </div>
              </div>

              {/* Add Cashier Input */}
              <div className="flex items-center gap-4 mb-6">
                <input
                  type="text"
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCashier()}
                  placeholder={`Enter ${shopType === 'service' ? 'service' : 'sales'} cashier name`}
                  className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:border-purple-500 text-black"
                />
                <button
                  type="button"
                  onClick={addCashier}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-semibold"
                >
                  ➕ Add Cashier
                </button>
              </div>

              {/* Cashier List */}
              {(() => {
                const currentCashiers = shopType === 'service' ? serviceCashiers : salesCashiers;
                
                return currentCashiers.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <div className="text-4xl mb-3">👨‍💼</div>
                    <p className="text-gray-500 text-lg">No {shopType === 'service' ? 'service' : 'sales'} cashiers added yet.</p>
                    <p className="text-gray-400 text-sm mt-2">Add cashiers to use them in {shopType === 'service' ? 'service' : 'sales'} billing</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentCashiers.map((name, index) => (
                      <div key={`${name}-${index}`} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          
                          {editingCashier === name ? (
                            <input
                              type="text"
                              value={editCashierName}
                              onChange={(e) => setEditCashierName(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && saveEditing()}
                              className="flex-1 border-2 border-purple-500 rounded-md px-3 py-1 focus:outline-none text-black"
                              autoFocus
                            />
                          ) : (
                            <span className="font-medium text-gray-800 flex-1">{name}</span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {editingCashier === name ? (
                            <>
                              <button
                                type="button"
                                onClick={saveEditing}
                                className="text-green-600 hover:text-green-800 font-semibold p-2 rounded hover:bg-green-50 transition-colors"
                                title="Save changes"
                              >
                                💾
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditing}
                                className="text-gray-600 hover:text-gray-800 font-semibold p-2 rounded hover:bg-gray-50 transition-colors"
                                title="Cancel editing"
                              >
                                ❌
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEditing(name)}
                                className="text-blue-600 hover:text-blue-800 font-semibold p-2 rounded hover:bg-blue-50 transition-colors"
                                title="Edit cashier"
                              >
                                ✏️
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteCashier(name)}
                                className="text-red-600 hover:text-red-800 font-semibold p-2 rounded hover:bg-red-50 transition-colors"
                                title="Delete cashier"
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        

            

{activeTab === 'dealers' && shopType === 'sales' && (
  <div className="space-y-6">
    {/* Add/Edit Dealer Form */}
    <div className="bg-white rounded-lg p-6 shadow-md border border-orange-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
          <h2 className="text-xl font-bold text-gray-800">
            {editingDealer ? '✏️ Edit Dealer' : '➕ Add New Dealer'}
          </h2>
        </div>
        {editingDealer && (
          <button
            onClick={() => {
              setDealerForm({
                name: '',
                contact: '',
                address: '',
                gstNumber: '',
              });
              setEditingDealer(null);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={saveDealer}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🏢 Supplier Name *
            </label>
            <input
              type="text"
              required
              value={dealerForm.name}
              onChange={(e) => setDealerForm(prev => ({...prev, name: e.target.value}))}
              placeholder="e.g., Mobile Distributors Inc, Phone World ..."
              className="text-black w-full border-2 border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:border-orange-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📞 Contact Number *
            </label>
            <input
              type="text"
              required
              value={dealerForm.contact}
              onChange={(e) => {
                const numbersOnly = e.target.value.replace(/\D/g, '');
                if (numbersOnly.length <= 10) {
                  setDealerForm(prev => ({...prev, contact: numbersOnly}));
                }
              }}
              placeholder="Enter 10-digit phone number"
              className="text-black w-full border-2 border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:border-orange-500 font-semibold"
              maxLength={10}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📍 Address *
            </label>
            <textarea
              required
              value={dealerForm.address}
              onChange={(e) => setDealerForm(prev => ({...prev, address: e.target.value}))}
              placeholder="Enter complete dealer address with city, state, and pincode"
              rows={2}
              className="text-black w-full border-2 border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:border-orange-500 font-semibold resize-vertical"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🏷️ GST Number
            </label>
            <input
              type="text"
              value={dealerForm.gstNumber}
              onChange={(e) => setDealerForm(prev => ({...prev, gstNumber: e.target.value.toUpperCase()}))}
              placeholder="e.g., 07AABCU9603R1ZM"
              className="text-black w-full border-2 border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:border-orange-500 font-semibold uppercase"
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-12 py-4 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border-2 border-orange-400"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">💾</span>
              {editingDealer ? 'Update Supplier' : 'Save Supplier'}
            </span>
          </button>
        </div>
      </form>
    </div>

        {/* Dealer Payments Section */}
<div className="bg-white rounded-lg p-6 shadow-md border border-green-100">
  <div className="flex items-center mb-6">
    <div className="w-2 h-6 bg-green-500 rounded-full mr-2"></div>
    <h2 className="text-xl font-bold text-gray-800">💳 Add Supplier Payment</h2>
  </div>

  <form onSubmit={addDealerPayment}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Supplier *</label>
        <select
          value={dealerPaymentForm.dealer}
          onChange={(e) => handleDealerSelectForPayment(e.target.value)}
          className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
          required
        >
          <option value="">Select Supplier</option>
          {dealers.map(dealer => (
            <option key={dealer._id} value={dealer._id}>{dealer.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Total Amount (₹) *</label>
        <input
          type="number"
          value={dealerPaymentForm.totalAmount}
          onChange={(e) => setDealerPaymentForm(prev => ({...prev, totalAmount: e.target.value}))}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 bg-gray-50"
          required
          readOnly
        />
        <p className="text-xs text-gray-500 mt-1">Calculated from stock items</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Amount (₹) *</label>
        <input
          type="number"
          value={dealerPaymentForm.amount}
          onChange={(e) => setDealerPaymentForm(prev => ({...prev, amount: e.target.value}))}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
          required
        />
      </div>

<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
  <input
    type="text"
    value={dealerPaymentForm.date}
    onChange={(e) => {
      let value = e.target.value;
      // Remove any non-digit characters except slash
      value = value.replace(/[^\d/]/g, '');
      
      // Auto-add slashes
      if (value.length === 2 && !value.includes('/')) {
        value = value + '/';
      } else if (value.length === 5 && value.split('/').length === 2) {
        value = value + '/';
      }
      
      // Limit to 10 characters (DD/MM/YYYY)
      if (value.length <= 10) {
        setDealerPaymentForm(prev => ({...prev, date: value}));
      }
    }}
    placeholder="DD/MM/YYYY"
    className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
  />
</div>
    </div>

    {/* Balance Preview */}
    {dealerPaymentForm.totalAmount && dealerPaymentForm.amount && (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-blue-800">Balance after payment:</span>
          <span className={`font-bold text-lg ${
            (parseFloat(dealerPaymentForm.totalAmount) - parseFloat(dealerPaymentForm.amount)) > 0 
              ? 'text-red-600' 
              : 'text-green-600'
          }`}>
            ₹{(parseFloat(dealerPaymentForm.totalAmount) - parseFloat(dealerPaymentForm.amount)).toFixed(2)}
          </span>
        </div>
      </div>
    )}

    <div className="flex justify-end">
      <button
        type="submit"
        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold"
      >
        💰 Add Payment
      </button>
    </div>
  </form>
</div>

 {/* Enhanced Dealers List with Expandable Stock */}
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-orange-100">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
            <h2 className="text-xl font-bold text-gray-800">
              🤝 Suppliers List
            </h2>
          </div>
          <div className="text-sm text-gray-500 bg-orange-50 px-3 py-1 rounded-full">
            Total: {dealers.length} Suppliers
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="text-xl">⏳</div>
            <p className="text-gray-600">Loading Suppliers...</p>
          </div>
        ) : dealers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🏢</div>
            <p className="text-base font-semibold mb-1">No Suppliers found</p>
            <p className="text-xs">Add your first Supplier to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-amber-500">
                  <th className="border border-orange-400 px-4 py-3 text-left font-bold text-white text-sm uppercase">Supplier Details</th>
                  <th className="border border-orange-400 px-4 py-3 text-center font-bold text-white text-sm uppercase">Total Stock Value</th>
                  <th className="border border-orange-400 px-4 py-3 text-center font-bold text-white text-sm uppercase">GST (18%)</th>
                  <th className="border border-orange-400 px-4 py-3 text-center font-bold text-white text-sm uppercase">Total + GST</th>
                  <th className="border border-orange-400 px-4 py-3 text-center font-bold text-white text-sm uppercase">Paid Amount</th>
                  <th className="border border-orange-400 px-4 py-3 text-center font-bold text-white text-sm uppercase">Balance</th>
                  <th className="border border-orange-400 px-4 py-3 text-center font-bold text-white text-sm uppercase">Details</th>
                  <th className="border border-orange-400 px-4 py-3 text-center font-bold text-white text-sm uppercase w-40">🔔 Send Alert</th>
                </tr>
              </thead>
              <tbody>
                {dealers.slice().reverse().map((dealer, index) => {
                  const balanceInfo = getDealerBalanceInfo(dealer);
                  const isExpanded = expandedDealer === dealer._id;
                  const dealerStockItems = stockItems.filter(item => item.dealer?._id === dealer._id);
                  
                  // ✅ FRONTEND GST CALCULATION
                  const totalStockCost = dealerStockItems.reduce((sum, item) => sum + (item.cost || 0), 0);
                  const gstAmount = totalStockCost * 0.18;
                  const totalWithGST = totalStockCost + gstAmount;
                  
                  return (
                    <>
                      <tr 
                        key={dealer._id} 
                        className={`border-b border-gray-200 hover:bg-orange-50 transition-colors duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                        onClick={(e) => {
                          // ✅ ONLY expand if clicking on the row itself, not on buttons/inputs
                          if (!e.target.closest('button') && !e.target.closest('input') && !e.target.closest('.no-expand')) {
                            setExpandedDealer(isExpanded ? null : dealer._id);
                          }
                        }}
                      >
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="font-semibold text-gray-800 text-lg">{dealer.name}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            <div>📞 {dealer.contact}</div>
                            <div>🏷️ {dealer.gstNumber || 'No GST'}</div>
                            <div className="mt-1 text-gray-500 max-w-md truncate">{dealer.address}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className="text-blue-600 font-bold text-sm">
                            ₹{totalStockCost.toFixed(2)}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className="text-purple-600 font-bold text-sm">
                            ₹{gstAmount.toFixed(2)}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className="text-green-600 font-bold text-lg">
                            ₹{totalWithGST.toFixed(2)}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className="text-green-600 font-bold text-lg">
                            ₹{balanceInfo.totalPayments.toFixed(2)}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className={`font-bold text-lg ${
                            balanceInfo.balance > 0 ? 'text-red-600' : 
                            balanceInfo.balance < 0 ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            ₹{Math.abs(balanceInfo.balance).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {balanceInfo.balance > 0 ? 'You Owe' : 
                             balanceInfo.balance < 0 ? 'You Get' : 'Settled'}
                          </div>
                        </td>
                        
                        {/* ✅ FIXED: Details Button */}
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row expansion
                              console.log('📊 Details clicked for:', dealer.name);
                              setSelectedDealerForDetails(dealer);
                              setShowPaymentDetails(true);
                              fetchDealerPaymentDetails(dealer._id);
                            }}
                            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors font-semibold"
                          >
                            📊 Details
                          </button>
                        </td>

                        {/* Alert Section */}
                        <td className="border border-gray-300 px-4 py-3 text-center text-black no-expand">
                          <DealerAlertSection 
                            dealer={dealer} 
                            onAlertSet={handleAlertSet}
                            onAlertReset={handleAlertReset}
                          />
                        </td>
                      </tr>
                      
                      {/* ✅ EXPANDED STOCK TABLE - Shows when row is expanded */}
                      {isExpanded && (
                        <tr className="bg-blue-50">
                          <td colSpan="8" className="border border-gray-300 px-4 py-4">
                            <div className="mb-4">
                              <h4 className="font-bold text-blue-800 text-lg mb-3">📦 Stock Items from {dealer.name}</h4>
                              
                              {dealerStockItems.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">
                                  <div className="text-2xl mb-2">📭</div>
                                  <p>No stock items found for this Supplier</p>
                                </div>
                              ) : (
                                <div className="overflow-x-auto h-100">
                                  <table className="w-full border-collapse">
                                    <thead>
                                      <tr className="bg-gradient-to-r from-blue-400 to-blue-500">
                                        <th className="border border-blue-300 px-3 py-2 text-left font-bold text-white text-xs uppercase">IMEI</th>
                                        <th className="border border-blue-300 px-3 py-2 text-left font-bold text-white text-xs uppercase">Brand</th>
                                        <th className="border border-blue-300 px-3 py-2 text-left font-bold text-white text-xs uppercase">Model</th>
                                        <th className="border border-blue-300 px-3 py-2 text-left font-bold text-white text-xs uppercase">HSN</th>
                                        <th className="border border-blue-300 px-3 py-2 text-center font-bold text-white text-xs uppercase">Cost (₹)</th>
                                        <th className="border border-blue-300 px-3 py-2 text-center font-bold text-white text-xs uppercase">GST (18%)</th>
                                        <th className="border border-blue-300 px-3 py-2 text-center font-bold text-white text-xs uppercase">Total (₹)</th>
                                        <th className="border border-blue-300 px-3 py-2 text-center font-bold text-white text-xs uppercase">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {dealerStockItems.map((stockItem, stockIndex) => {
                                        // ✅ INDIVIDUAL ITEM GST CALCULATION
                                        const itemGST = (stockItem.cost || 0) * 0.18;
                                        const itemTotal = (stockItem.cost || 0) + itemGST;
                                        
                                        return (
                                          <tr 
                                            key={stockItem._id} 
                                            className={`border-b border-gray-200 hover:bg-blue-100 transition-colors duration-150 ${
                                              stockIndex % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                                            }`}
                                          >
                                            <td className="border border-gray-300 px-3 py-2 font-mono text-blue-600 bg-blue-50 text-xs">
                                              {stockItem.imei || 'N/A'}
                                            </td>
                                            <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-800 font-medium text-sm">
                                              {stockItem.product?.name || 'N/A'}
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                                              {stockItem.variant?.variantName || 'N/A'}
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 font-mono whitespace-nowrap text-gray-700 text-sm">
                                              {stockItem.hsn || 'N/A'}
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 font-semibold whitespace-nowrap text-blue-600 text-sm text-center">
                                              ₹{(stockItem.cost || 0).toFixed(2)}
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 font-semibold whitespace-nowrap text-purple-600 text-sm text-center">
                                              ₹{itemGST.toFixed(2)}
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 font-semibold whitespace-nowrap text-green-600 text-base text-center">
                                              ₹{itemTotal.toFixed(2)}
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 whitespace-nowrap text-center">
                                              <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                stockItem.status === 'sold' 
                                                  ? 'bg-red-100 text-red-800 border border-red-200' 
                                                  : 'bg-green-100 text-green-800 border border-green-200'
                                              }`}>
                                                {stockItem.status === 'sold' ? '🔴 Sold' : '📦 In Stock'}
                                              </span>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                    <tfoot>
                                      <tr className="bg-blue-100">
                                        <td colSpan="4" className="border border-gray-300 px-3 py-2 text-right font-bold text-gray-800">
                                          Totals:
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-center font-bold text-blue-700">
                                          ₹{totalStockCost.toFixed(2)}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-center font-bold text-purple-700">
                                          ₹{gstAmount.toFixed(2)}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-center font-bold text-green-700">
                                          ₹{totalWithGST.toFixed(2)}
                                        </td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">
                                          <div className="text-xs text-gray-600">
                                            {dealerStockItems.filter(item => item.status === 'in_stock').length} in stock
                                          </div>
                                        </td>
                                      </tr>
                                    </tfoot>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

    {/* ✅ PAYMENT DETAILS MODAL - Shows when Details button is clicked */}
    {showPaymentDetails && selectedDealerForDetails && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                Payment Details - {selectedDealerForDetails.name}
              </h3>
              <button
                onClick={() => {
                  setShowPaymentDetails(false);
                  setSelectedDealerForDetails(null);
                  setDealerPaymentDetails([]);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {dealerPaymentDetails.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">💰</div>
                <p className="text-lg font-semibold">No Payment History</p>
                <p className="text-sm">No payments have been made to this supplier yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-500 to-purple-600">
                      <th className="border border-purple-400 px-4 py-3 text-left font-bold text-white text-sm uppercase">Date</th>
                      <th className="border border-purple-400 px-4 py-3 text-center font-bold text-white text-sm uppercase">Total Amount (₹)</th>
                      <th className="border border-purple-400 px-4 py-3 text-center font-bold text-white text-sm uppercase">Payment Made (₹)</th>
                      <th className="border border-purple-400 px-4 py-3 text-center font-bold text-white text-sm uppercase">Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealerPaymentDetails.map((payment, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-purple-50">
                        <td className="border border-gray-300 px-4 py-3 whitespace-nowrap text-black">
                          {new Date(payment.date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-blue-600">
                          ₹{payment.totalAmount.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">
                          ₹{payment.paymentMade.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                          <span className={payment.balance > 0 ? 'text-red-600' : 'text-green-600'}>
                            ₹{Math.abs(payment.balance).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowPaymentDetails(false);
                  setSelectedDealerForDetails(null);
                  setDealerPaymentDetails([]);
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)}


{/* Customers Table */}
{(activeTab === 'addCustomer' || (activeTab === 'filter' && (shopType === 'service' || (shopType === 'sales' && salesFilterTab === 'customer')))) && (          <>
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
                  <div className="overflow-x-auto h-100 rounded-lg border border-gray-200">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-orange-500 to-amber-500">
                          {/* Basic columns */}
                          <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Date & Time</th>
                          <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase">Cashier</th>
                          <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Invoice No.</th>
                          <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Customer Name</th>
                          <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Phone</th>
                          <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Brand</th>
                          
                          {/* Service-specific columns */}
                          {shopType === 'service' && (
                            <>
                              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Stock Item</th>
                              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Password</th>
                              <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider">Issue</th>
                              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Expected Delivery</th>
                              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider w-30">Warranty Days</th>
                              <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider">Status</th>
                              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Cost (₹)</th>
                              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Paid (₹)</th>
                              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Balance (₹)</th>
                            </>
                          )}
                          
                          {/* Sales-specific columns */}
                          {shopType === 'sales' && (
                            <>
                              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Model Item</th>
                              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase">IMEI</th>
                                                            <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase">HSN</th>
                              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase">Supplier</th>
                              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider w-35">Warranty Days</th>
                              <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider">Payment Mode</th>
                              <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider">Cost (₹)</th>

                            </>
                          )}
                          
                          {/* Actions column */}
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
                                <td colSpan={shopType === 'service' ? "11" : "10"} className="border border-gray-300 px-4 py-3 font-bold text-blue-800 text-center text-sm">
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
                                <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                                  {customer.cashier || 'N/A'}
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
                                            : customer.status === 'returned'
                                            ? 'bg-purple-500 text-white hover:bg-purple-600 shadow'
                                            : 'bg-red-500 text-white hover:bg-red-600 shadow'
                                        }`}
                                      >
                                        <option value="not paid" className="bg-red-500 text-white">Not Paid</option>
                                        <option value="part paid" className="bg-yellow-500 text-white">Part Paid</option>
                                        <option value="paid" className="bg-green-500 text-white">Paid</option>
                                        <option value="returned" className="bg-purple-500 text-white">Returned</option>
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
                                        className={`w-20 text-blue-600 font-semibold text-center border border-gray-300 rounded px-1 py-1 focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                          customer.status === 'returned' ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''
                                        }`}
                                        min="0"
                                        step="0.01"
                                        placeholder='0'
                                        disabled={customer.status === 'returned'}
                                      />
                                    </td>
                                    <td className="border border-gray-200 px-3 py-2 font-semibold whitespace-nowrap text-red-600 text-base">
                                      ₹{customer.status === 'returned' ? '0.00' : (customer.balance || 0).toFixed(2)}
                                    </td>
                                  </>
                                ) : (
                                  /* Sales-specific columns */
                                  <>
                                    <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                                      {customer.model || 'N/A'}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                                      {customer.imei || 'N/A'}
                                    </td>
                                                                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                                      {(() => {
                                        const stockItem = stockItems.find(item => item.imei === customer.imei);
                                        return stockItem?.hsn || 'N/A';
                                      })()}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                                      {(() => {
                                        const stockItem = stockItems.find(item => item.imei === customer.imei);
                                        return stockItem?.dealer?.name || 'N/A';
                                      })()}
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
        ? 'bg-green-50 text-green-700 border-l-4 border-green-500' :
      customer.paymentMode === 'gpay' 
        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' :
      'bg-purple-50 text-purple-700 border-l-4 border-purple-500'
    }`}>
      <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
        customer.paymentMode === 'cash' ? 'bg-green-500' : 
        customer.paymentMode === 'gpay' ? 'bg-blue-500' : 
        'bg-purple-500'
      }`}></div>
      {customer.paymentMode === 'cash' ? 'Cash' : 
       customer.paymentMode === 'gpay' ? 'Gpay' : 
       `EMI-${customer.financeCompany ? customer.financeCompany.toUpperCase() : 'N/A'}`}
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
      </>
    )}

{/* Stock Records Table - Show only for Sales when stock tab is selected */}
{activeTab === 'filter' && shopType === 'sales' && salesFilterTab === 'stock' && (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-orange-100">
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
          <h2 className="text-xl font-bold text-gray-800">
            📦 Stock Records
          </h2>
        </div>
        <div className="text-xs text-gray-500 bg-orange-50 px-2 py-1 rounded-full">
          Total: {filteredStockItems.length} items
        </div>
      </div>
      
      {filteredStockItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-base font-semibold mb-1">No stock records found</p>
          <p className="text-xs">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto h-100 rounded-lg border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-amber-500">
                <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Created Date & Time</th>
                <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider">Status</th>
                <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider">IMEI</th>
                <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Brand</th>
                <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Model</th>
                <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Supplier</th>
                <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">HSN</th>
                <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider">Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // Group stock items by date and create daily totals
                const groupedByDate = {};
                
                filteredStockItems.forEach(item => {
                  const date = new Date(item.createdAt).toLocaleDateString();
                  if (!groupedByDate[date]) {
                    groupedByDate[date] = {
                      date: item.createdAt,
                      items: [],
                      totalCost: 0,
                      inStockCount: 0,
                      soldCount: 0,
                      count: 0
                    };
                  }
                  groupedByDate[date].items.push(item);
                  groupedByDate[date].totalCost += item.cost || 0;
                  groupedByDate[date].count++;
                  if (item.status === 'in_stock') {
                    groupedByDate[date].inStockCount++;
                  } else {
                    groupedByDate[date].soldCount++;
                  }
                });
                
                // Convert to array and sort by date (newest first)
                const dateGroups = Object.values(groupedByDate)
                  .sort((a, b) => new Date(b.date) - new Date(a.date));
                
                // Create flattened array with items and daily totals
                const result = [];
                
                dateGroups.forEach((group, groupIndex) => {
                  // Add daily total row FIRST for each group
                  result.push({
                    type: 'dailyTotal',
                    data: group,
                    id: `stock-daily-total-${group.date}`
                  });
                  
                  // Then add all stock items for that date
                  group.items.forEach(item => {
                    result.push({
                      type: 'stockItem',
                      data: item,
                      id: item._id
                    });
                  });
                });
                
                return result.map((item) => {
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
                        <td colSpan="4" className="border border-gray-300 px-4 py-3 font-bold text-blue-800 text-center text-sm">
                          📊 Daily Stock Summary ({dailyData.count} {dailyData.count === 1 ? 'item' : 'items'})
                        </td>
                        <td className="border border-gray-300 px-3 py-3 font-bold text-green-700 whitespace-nowrap text-center text-sm">
                          In Stock: {dailyData.inStockCount}
                        </td>
                        <td className="border border-gray-300 px-3 py-3 font-bold text-red-700 whitespace-nowrap text-center text-sm">
                          Sold: {dailyData.soldCount}
                        </td>
                        <td className="border border-gray-300 px-3 py-3 font-bold text-purple-700 whitespace-nowrap text-center">
                          Value: ₹{dailyData.totalCost.toFixed(2)}
                        </td>
                      </tr>
                    );
                  } else {
                    const stockItem = item.data;
                    return (
                      <tr key={item.id} className="hover:bg-orange-50 transition-colors duration-200 border-b border-gray-200">
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                          {stockItem.createdAt ? formatDateTime(stockItem.createdAt) : 'N/A'}
                        </td>
<td className="w-35 border border-gray-200 px-3 py-2 whitespace-nowrap text-center">
  <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    stockItem.status === 'sold' 
      ? 'bg-red-100 text-red-800 border border-red-200' 
      : 'bg-green-100 text-green-800 border border-green-200'
  }`}>
    {stockItem.status === 'sold' ? '🔴 Sold' : '📦 In Stock'}
  </span>
</td>
                        <td className="border border-gray-200 px-3 py-2 font-mono whitespace-nowrap text-blue-600 bg-blue-50 text-xs">
                          {stockItem.imei || 'N/A'}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-800 font-medium text-sm">
                          {stockItem.product?.name ||
                          'N/A'}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                          {stockItem.variant?.variantName || 'N/A'}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                          {stockItem.dealer?.name || 'N/A'}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 font-mono whitespace-nowrap text-gray-700 text-sm">
                          {stockItem.hsn || 'N/A'}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 font-semibold whitespace-nowrap text-green-600 text-base text-center">
                          ₹{stockItem.cost?.toFixed(2) || '0.00'}
                        </td>
                      </tr>
                    );
                  }
                });
              })()}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* Stock Summary */}
    {filteredStockItems.length > 0 && (
      <div className="bg-white rounded-xl p-4 shadow-lg border border-orange-200">
        <h3 className="text-lg font-bold mb-4 text-center text-gray-800">
          💰 STOCK SUMMARY
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 transform hover:scale-105 transition-transform duration-300">
            <div className="text-2xl font-bold mb-2 text-gray-800">
              {filteredStockItems.length}
            </div>
            <div className="text-sm font-semibold mb-1 text-gray-700">Total Items</div>
            <div className="text-xs text-gray-600">All stock records</div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 transform hover:scale-105 transition-transform duration-300">
            <div className="text-2xl font-bold mb-2 text-green-600">
              {filteredStockItems.filter(item => item.status === 'in_stock').length}
            </div>
            <div className="text-sm font-semibold mb-1 text-gray-700">In Stock</div>
            <div className="text-xs text-gray-600">Available for sale</div>
          </div>

          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 transform hover:scale-105 transition-transform duration-300">
            <div className="text-2xl font-bold mb-2 text-red-600">
              {filteredStockItems.filter(item => item.status === 'sold').length}
            </div>
            <div className="text-sm font-semibold mb-1 text-gray-700">Sold Items</div>
            <div className="text-xs text-gray-600">Already purchased</div>
          </div>

          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 transform hover:scale-105 transition-transform duration-300">
            <div className="text-2xl font-bold mb-2 text-purple-600">
              ₹{filteredStockItems.reduce((sum, item) => sum + (item.cost || 0), 0).toFixed(2)}
            </div>
            <div className="text-sm font-semibold mb-1 text-gray-700">Total Value</div>
            <div className="text-xs text-gray-600">Current inventory worth</div>
          </div>
        </div>
      </div>
    )}
  </div>
)}


{/* ACCESSORIES TAB - Completely Separate */}
{shopType === 'accessories' && (
  <div className="bg-white rounded-lg p-4 shadow-md border border-orange-100">
    <div className="flex items-center mb-4">
      <div className="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
      <h2 className="text-xl font-bold text-gray-800">📱 Accessories Tracking</h2>
    </div>

    {/* Add Transaction */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
      <select
        value={accessoryForm.type}
        onChange={(e) => setAccessoryForm(prev => ({...prev, type: e.target.value}))}
        className="border text-black border-gray-300 rounded-lg px-3 py-2"
      >
        <option value="investment">💰 Investment</option>
        <option value="sale">🛒 Sale</option>
      </select>
      
      <input
        type="number"
        placeholder="Amount"
        value={accessoryForm.amount}
        onChange={(e) => setAccessoryForm(prev => ({...prev, amount: e.target.value}))}
        className="border text-black border-gray-300 rounded-lg px-3 py-2"
      />
      
<input
  type="text"
  value={accessoryForm.date}
  onChange={(e) => {
    let input = e.target.value.replace(/\D/g, ''); // Remove all non-digits
    
    // Apply mask: DD/MM/YYYY
    if (input.length > 2) {
      input = input.substring(0, 2) + '/' + input.substring(2);
    }
    if (input.length > 5) {
      input = input.substring(0, 5) + '/' + input.substring(5);
    }
    if (input.length > 10) {
      input = input.substring(0, 10);
    }
    
    setAccessoryForm(prev => ({...prev, date: input}));
  }}
  onBlur={(e) => {
    // Ensure the date is properly formatted before saving
    const dateValue = e.target.value;
    if (dateValue.length === 10) {
      const [day, month, year] = dateValue.split('/');
      // Ensure 4-digit year
      if (year.length === 2) {
        const fullYear = `20${year}`;
        const correctedDate = `${day}/${month}/${fullYear}`;
        setAccessoryForm(prev => ({...prev, date: correctedDate}));
      }
    }
  }}
  placeholder="DD/MM/YYYY"
  className="border text-black border-gray-300 rounded-lg px-3 py-2"
/>
      
      <button
        onClick={addAccessoryTransaction}
        className="bg-orange-500 text-white rounded-lg px-4 py-2 hover:bg-orange-600"
      >
        Add
      </button>
    </div>

   {/* Daily Totals Table - Show Only Today's Summary */}
<div className="mb-8">
  <h3 className="text-lg text-gray-800 font-semibold mb-4">📊 Today's Summary</h3>
  <div className="overflow-x-auto rounded-lg border border-gray-200">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gradient-to-r from-orange-400 to-orange-500">
          <th className="border border-orange-300 px-4 py-3 text-left font-bold text-white text-sm uppercase tracking-wider">Date</th>
          <th className="border border-orange-300 px-4 py-3 text-center font-bold text-white text-sm uppercase tracking-wider">Investment (₹)</th>
          <th className="border border-orange-300 px-4 py-3 text-center font-bold text-white text-sm uppercase tracking-wider">Sales (₹)</th>
          <th className="border border-orange-300 px-4 py-3 text-center font-bold text-white text-sm uppercase tracking-wider">Transactions</th>
        </tr>
      </thead>
      <tbody>
        {(() => {
          // Get today's date in YYYY-MM-DD format
          const today = new Date().toISOString().split('T')[0];
          // Find today's data from dailyTotals
          const todayData = accessoryData.dailyTotals.find(day => 
            day.date === today || new Date(day.date).toDateString() === new Date().toDateString()
          );
          
          return todayData ? (
            <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200 bg-white">
              <td className="border border-gray-300 px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                {new Date(todayData.date).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center text-purple-600 font-semibold">
                ₹{todayData.totalInvestment.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center text-teal-600 font-semibold">
                ₹{todayData.totalSales.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">
                <div className="flex flex-col space-y-1">
                  <div className="text-blue-600 font-semibold">{todayData.transactionCount}</div>
                  <div className="text-xs text-gray-500">
                    <span className="text-purple-600">Inv: {todayData.investmentCount || 0}</span>
                    <span className="mx-1">•</span>
                    <span className="text-teal-600">Sale: {todayData.salesCount || 0}</span>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="4" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-4xl mb-2">📅</div>
                  <div className="text-lg font-semibold mb-1">No transactions today</div>
                  <div className="text-sm">No records found for today's date</div>
                </div>
              </td>
            </tr>
          );
        })()}
      </tbody>
    </table>
  </div>
</div>

{/* Transactions List Table - Grouped by Date */}
<div>
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg text-gray-800 font-semibold">📋 All Transactions</h3>
    
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Filter</span>
      <input
        type="text"
        placeholder="DD/MM/YYYY"
        value={accessoryFilterDate}
        onChange={(e) => {
          let input = e.target.value.replace(/\D/g, ''); // Remove all non-digits
          
          // Apply mask: DD/MM/YYYY
          if (input.length > 2) {
            input = input.substring(0, 2) + '/' + input.substring(2);
          }
          if (input.length > 5) {
            input = input.substring(0, 5) + '/' + input.substring(5);
          }
          if (input.length > 10) {
            input = input.substring(0, 10);
          }
          
          setAccessoryFilterDate(input);
        }}
        onBlur={(e) => {
          // Ensure the date is properly formatted before filtering
          const dateValue = e.target.value;
          if (dateValue.length === 10) {
            const [day, month, year] = dateValue.split('/');
            // Ensure 4-digit year
            if (year.length === 2) {
              const fullYear = `20${year}`;
              const correctedDate = `${day}/${month}/${fullYear}`;
              setAccessoryFilterDate(correctedDate);
            }
          }
        }}
        onKeyPress={(e) => e.key === 'Enter' && handleApplyAccessoryFilter()}
        className="border text-black border-gray-300 rounded-lg px-3 py-2 w-32"
      />
      <button
        onClick={handleApplyAccessoryFilter}
        className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
      >
        Apply
      </button>
      <button
        onClick={handleResetAccessoryFilter}
        className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
      >
        Reset
      </button>
    </div>
  </div>

  <div className="overflow-x-auto rounded-lg border border-gray-200">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gradient-to-r from-orange-400 to-orange-500">
          <th className="border border-orange-300 px-4 py-3 text-center font-bold text-white text-sm uppercase tracking-wider">Date & Time</th>
          <th className="border border-orange-300 px-4 py-3 text-center font-bold text-white text-sm uppercase tracking-wider">Type</th>
          <th className="border border-orange-300 px-4 py-3 text-center font-bold text-white text-sm uppercase tracking-wider">Amount (₹)</th>
        </tr>
      </thead>
      
      <tbody>
        {filteredTransactions.length === 0 ? (
          <tr>
            <td colSpan="3" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl mb-2">📭</div>
                <div className="text-lg font-semibold mb-1">No transactions found</div>
                <div className="text-sm">No records match your filter criteria</div>
              </div>
            </td>
          </tr>
        ) : (
          // Group transactions by date and create separators
          (() => {
            const groupedTransactions = {};
            
            // Group transactions by date
            filteredTransactions.forEach(transaction => {
              const dateKey = new Date(transaction.date).toDateString();
              if (!groupedTransactions[dateKey]) {
                groupedTransactions[dateKey] = [];
              }
              groupedTransactions[dateKey].push(transaction);
            });
            
            const result = [];
            
            Object.keys(groupedTransactions).forEach((dateKey, groupIndex) => {
              const transactions = groupedTransactions[dateKey];
              const date = new Date(dateKey);
              
              // Add date separator row
              result.push(
                <tr key={`separator-${dateKey}`} className="bg-gradient-to-r from-blue-100 to-blue-100">
                  <td colSpan="3" className="border border-blue-300 px-4 py-3">
                    <div className="grid grid-cols-3 gap-4 text-black text-sm font-semibold">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <span>Date:</span>
                          <span className="text-md font-normal opacity-90">
                            {date.toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <span>Transactions:</span>
                          <span className="text-md text-purple-600 font-normal opacity-90">
                            Inv: {transactions.filter(t => t.type === 'investment').length} •
                            Sale: {transactions.filter(t => t.type === 'sale').length}
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <span className="text-purple-600">Inv:</span>
                            <span className="text-md font-normal opacity-90">
                              ₹{transactions
                                .filter(t => t.type === 'investment')
                                .reduce((sum, t) => sum + t.amount, 0)
                                .toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-teal-600">Sale:</span>
                            <span className="text-md font-normal opacity-90">
                              ₹{transactions
                                .filter(t => t.type === 'sale')
                                .reduce((sum, t) => sum + t.amount, 0)
                                .toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
              
              // Add individual transaction rows for this date
              transactions.forEach((transaction, index) => {
                result.push(
                  <tr 
                    key={transaction._id} 
                    className={`border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
<td className="border border-gray-300 px-4 py-3 text-gray-700 whitespace-nowrap">
  {new Date(transaction.createdAt).toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}
</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'investment' 
                          ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                          : 'bg-teal-100 text-teal-700 border border-teal-200'
                      }`}>
                        {transaction.type === 'investment' ? '💰 Investment' : '🛒 Sale'}
                      </span>
                    </td>
                    <td className={`border border-gray-300 px-4 py-3 text-center font-semibold ${
                      transaction.type === 'investment' ? 'text-purple-600' : 'text-teal-600'
                    }`}>
                      ₹{transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                );
              });
            });
            
            return result;
          })()
        )}
      </tbody>
      
      {/* Footer with Transaction Totals */}
      {filteredTransactions.length > 0 && (
        <tfoot>
          <tr className="bg-gradient-to-r from-gray-300 to-gray-400 text-white">
            <td className="border border-gray-400 px-4 py-3 font-bold text-lg text-black">Transaction Summary</td>
            <td className="border border-gray-400 px-4 py-3 text-center font-bold">
              <div className="flex flex-col space-y-2">
                <div className="text-teal-700">Sales: ₹{filteredTransactions
                  .filter(t => t.type === 'sale')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
                </div>
                <div className="text-purple-700">Investment: ₹{filteredTransactions
                  .filter(t => t.type === 'investment')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
                </div>
              </div>
            </td>
            <td className="border border-gray-400 px-4 py-3 text-center font-bold">
              <div className="flex flex-col space-y-2">
                <div className="text-blue-700">Net: ₹{(filteredTransactions
                  .filter(t => t.type === 'sale')
                  .reduce((sum, t) => sum + t.amount, 0) - 
                  filteredTransactions
                  .filter(t => t.type === 'investment')
                  .reduce((sum, t) => sum + t.amount, 0)).toFixed(2)}
                </div>
                <div className="text-white text-md">
                  Total: {filteredTransactions.length} transactions
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  </div>
</div>
  </div>
)}

  </div>
);

};