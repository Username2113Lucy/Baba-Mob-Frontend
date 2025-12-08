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
const CASHIER_API = `${API_BASE}/cashiers`;

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

  // ✅ UPDATE: Finance company mapping (short code → full name)
  const FINANCE_COMPANIES = {
    'bajaj': 'BAJAJ FINANCE',
    'tvs': 'TVS CREDIT',
    'hdb': 'HDB FINANCIAL SERVICES LTD',
    'idfc': 'IDFC FIRST BANK',
    'chola': 'CHOLA FINANCE',
    'dmi-oppo': 'DMI - OPPO',
    'dmi-vivo': 'DMI - VIVO',
    'dmi-samsung': 'DMI - SAMSUNG',
    'homecredit': 'HOME CREDIT',
    'd-super': 'D-SUPER',
    'other': 'OTHER FINANCE'
  };

  // Add these to your component state - SEPARATE FOR SALES AND SERVICE
  const [salesOfferMessage, setSalesOfferMessage] = useState('');
  const [serviceOfferMessage, setServiceOfferMessage] = useState('');
  const [currentOffer, setCurrentOffer] = useState('');

  // Replace your current filterData state with this:
  const [filterData, setFilterData] = useState({
    name: '',
    phone: '',
    invoiceNumber: '',
    date: '',
    status: '',
    paymentMode: '',
    billType: '',
    fromDate: '', // ✅ ADD for date range
    toDate: ''    // ✅ ADD for date range
  });

  const [filteredMultiBrandCustomers, setFilteredMultiBrandCustomers] = useState([]);


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

  const [filterInputData, setFilterInputData] = useState({
    name: '',
    phone: '',
    invoiceNumber: '',
    date: '',
    status: '',
    paymentMode: '',
    billType: '',
    fromDate: '',
    toDate: '',
    imei: '' // ✅ ADD THIS
  });

  const [appliedFilters, setAppliedFilters] = useState({
    name: '',
    phone: '',
    invoiceNumber: '',
    date: '',
    status: '',
    paymentMode: '',
    billType: '',
    fromDate: '',
    toDate: '',
    imei: '' // ✅ ADD THIS
  });

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

  // ✅ ADD: Profit calculation states
  const [profitData, setProfitData] = useState({
    sales: {
      dailyProfit: 0,
      monthlyProfit: 0,
      totalRevenue: 0
    },
    service: {
      dailyProfit: 0,
      monthlyProfit: 0,
      totalRevenue: 0,
      todayIncome: 0,
      pendingBalance: 0
    },
    multibrand: {
      dailyProfit: 0,
      monthlyProfit: 0,
      totalRevenue: 0
    }
  });

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


  // Add with your other state variables
  const [dealersPassword, setDealersPassword] = useState('');
  const [isDealersUnlocked, setIsDealersUnlocked] = useState(false);
  const [dealersPasswordError, setDealersPasswordError] = useState('');

  // Add with your other constants at the top of the file
  const DEALERS_PASSWORD = 'Dealers@123'; // Change this to your desired password

  // Add this with your other useEffect hooks
  useEffect(() => {
    // Auto-lock dealers when switching tabs
    if (activeTab !== 'dealers') {
      setIsDealersUnlocked(false);
      setDealersPassword('');
    }
  }, [activeTab]);

  // Add these new states for passwords
  const [passwords, setPasswords] = useState({
    salesSupplier: '',
    salesItemPage: '',
    salesStockTable: '',
    serviceItemPage: ''
  });

  const [unlockedSections, setUnlockedSections] = useState({
    salesSupplier: false,
    salesItemPage: false,
    salesStockTable: false,
    serviceItemPage: false
  });

  const [passwordErrors, setPasswordErrors] = useState({
    salesSupplier: '',
    salesItemPage: '',
    salesStockTable: '',
    serviceItemPage: ''
  });

  // Define your passwords (you might want to make these configurable)
  const SECTION_PASSWORDS = {
    salesItemPage: 'Baaba#3',
    salesStockTable: 'Baaba@2',
    serviceItemPage: 'Baaba^6'
  };

  // Password handler
  const handlePasswordSubmit = (section) => {
    if (passwords[section] === SECTION_PASSWORDS[section]) {
      setUnlockedSections(prev => ({ ...prev, [section]: true }));
      setPasswordErrors(prev => ({ ...prev, [section]: '' }));
    } else {
      setPasswordErrors(prev => ({ ...prev, [section]: '❌ Incorrect password' }));
    }
  };

  const handlePasswordChange = (section, value) => {
    setPasswords(prev => ({ ...prev, [section]: value }));
    setPasswordErrors(prev => ({ ...prev, [section]: '' }));
  };

  const lockSection = (section) => {
    setUnlockedSections(prev => ({ ...prev, [section]: false }));
    setPasswords(prev => ({ ...prev, [section]: '' }));
  };

  // Add these with your other state variables
const [summaryPasswords, setSummaryPasswords] = useState({
  sales: '',
  service: '',
  multibrand: ''
});

const [unlockedSummaries, setUnlockedSummaries] = useState({
  sales: false,
  service: false,
  multibrand: false
});

const [summaryPasswordErrors, setSummaryPasswordErrors] = useState({
  sales: '',
  service: '',
  multibrand: ''
});

// Password constants
const SUMMARY_PASSWORDS = {
  sales: 'Baaba!1',      // Sales Income Summary password
  service: 'Baaba%5',    // Service Income Summary password  
  multibrand: 'Baaba$4'  // Multibrand Income Summary password
};

// Password handler for summaries
const handleSummaryPasswordSubmit = (summaryType) => {
  if (summaryPasswords[summaryType] === SUMMARY_PASSWORDS[summaryType]) {
    setUnlockedSummaries(prev => ({ ...prev, [summaryType]: true }));
    setSummaryPasswordErrors(prev => ({ ...prev, [summaryType]: '' }));
  } else {
    // Clear the password field and show lock screen message
    setSummaryPasswords(prev => ({ ...prev, [summaryType]: '' }));
    setSummaryPasswordErrors(prev => ({ 
      ...prev, 
      [summaryType]: 'incorrect' 
    }));
  }
};

const handleSummaryPasswordChange = (summaryType, value) => {
  setSummaryPasswords(prev => ({ ...prev, [summaryType]: value }));
  setSummaryPasswordErrors(prev => ({ ...prev, [summaryType]: '' }));
};

const lockSummary = (summaryType) => {
  setUnlockedSummaries(prev => ({ ...prev, [summaryType]: false }));
  setSummaryPasswords(prev => ({ ...prev, [summaryType]: '' }));
};

  // You can add this state for better error handling
  const [cashierLoading, setCashierLoading] = useState(false);
  // ✅ ADD THESE STATE DECLARATIONS FOR CASHIERS
  const [serviceCashiers, setServiceCashiers] = useState([]);
  const [salesCashiers, setSalesCashiers] = useState([]);
  const [cashierName, setCashierName] = useState('');
  const [editingCashier, setEditingCashier] = useState(null);
  const [editCashierName, setEditCashierName] = useState('');

  // ✅ REPLACE: Load cashiers from API instead of localStorage
  useEffect(() => {
    fetchCashiers();
  }, [shopType]); // Fetch when shopType changes

  // ✅ NEW: Fetch cashiers from backend API
  const fetchCashiers = async () => {
    try {
      const response = await fetch(`${CASHIER_API}?type=${shopType}`);
      const result = await response.json();

      if (result.success) {
        const cashiers = result.data.map(cashier => cashier.name);
        if (shopType === 'service') {
          setServiceCashiers(cashiers);
        } else {
          setSalesCashiers(cashiers);
        }
      } else {
        console.error('Error fetching cashiers:', result.message);
        // Fallback to empty arrays
        setServiceCashiers([]);
        setSalesCashiers([]);
      }
    } catch (error) {
      console.error('Error fetching cashiers:', error);
      // Fallback to empty arrays
      setServiceCashiers([]);
      setSalesCashiers([]);
    }
  };

  // Then update your addCashier function:
  const addCashier = async () => {
    if (!cashierName.trim()) {
      alert('Please enter a cashier name');
      return;
    }

    const trimmedName = cashierName.trim();
    setCashierLoading(true);

    try {
      const response = await fetch(CASHIER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          type: shopType
        })
      });

      const result = await response.json();

      if (result.success) {
        await fetchCashiers();
        setCashierName('');
        alert('Cashier added successfully!');
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding cashier:', error);
      alert('Error adding cashier. Please try again.');
    } finally {
      setCashierLoading(false);
    }
  };


  // ✅ REPLACE: Delete cashier with API call
  const deleteCashier = async (name) => {
    try {
      // First, get the cashier ID by name and type
      const response = await fetch(`${CASHIER_API}?type=${shopType}`);
      const result = await response.json();

      if (result.success) {
        const cashier = result.data.find(c => c.name === name);
        if (cashier) {
          const deleteResponse = await fetch(`${CASHIER_API}/${cashier._id}`, {
            method: 'DELETE'
          });

          const deleteResult = await deleteResponse.json();

          if (deleteResult.success) {
            // Refresh cashiers list
            await fetchCashiers();
            alert('Cashier deleted successfully!');
          } else {
            alert(`Error: ${deleteResult.message}`);
          }
        } else {
          alert('Cashier not found');
        }
      }
    } catch (error) {
      console.error('Error deleting cashier:', error);
      alert('Error deleting cashier. Please try again.');
    }
  };

  // ✅ REPLACE: Edit cashier with API call
  const startEditing = (name) => {
    setEditingCashier(name);
    setEditCashierName(name);
  };

  const saveEditing = async () => {
    if (!editCashierName.trim()) {
      alert('Cashier name cannot be empty');
      return;
    }

    const trimmedName = editCashierName.trim();

    try {
      // First, get the cashier ID by name and type
      const response = await fetch(`${CASHIER_API}?type=${shopType}`);
      const result = await response.json();

      if (result.success) {
        const cashier = result.data.find(c => c.name === editingCashier);
        if (cashier) {
          const updateResponse = await fetch(`${CASHIER_API}/${cashier._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: trimmedName,
              type: shopType
            })
          });

          const updateResult = await updateResponse.json();

          if (updateResult.success) {
            // Refresh cashiers list
            await fetchCashiers();
            setEditingCashier(null);
            setEditCashierName('');
            alert('Cashier updated successfully!');
          } else {
            alert(`Error: ${updateResult.message}`);
          }
        } else {
          alert('Cashier not found');
        }
      }
    } catch (error) {
      console.error('Error updating cashier:', error);
      alert('Error updating cashier. Please try again.');
    }
  };

  const cancelEditing = () => {
    setEditingCashier(null);
    setEditCashierName('');
  };

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

  // ✅ ADD: Calculate total quantity for all products (Service only)
  const calculateTotalQuantityAllProducts = () => {
    if (shopType !== 'service') return 0;

    return variants.reduce((total, variant) => {
      return total + (parseInt(variant.quantity) || 0);
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

  // ✅ UPDATED: Fetch all customers with proper separation
  const fetchAllCustomers = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        shopType: shopType,
      }).toString();

      const response = await fetch(`${CUSTOMER_API}?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        const allFetchedCustomers = result.data;

        // ✅ SEPARATE: Regular customers (non multi-brand)
        const regularCustomers = allFetchedCustomers.filter(customer =>
          customer.billType !== 'multi-brand'
        );

        // ✅ SEPARATE: Multi-brand customers
        const multiBrandCustomersData = allFetchedCustomers.filter(customer =>
          customer.billType === 'multi-brand'
        );

        // Set regular customers for sales/service tables
        setCustomers(regularCustomers);
        setAllCustomers(regularCustomers);

        // Set multi-brand customers separately
        setMultiBrandCustomers(multiBrandCustomersData);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Error fetching customers: ' + error.message);
    }
  };

  // ✅ FIXED: Reset multi-brand filter function
  const handleResetMultiBrandFilter = () => {
    setFilterInputData({
      name: '',
      phone: '',
      invoiceNumber: '',
      date: '',
      status: '',
      paymentMode: '',
      billType: '',
      fromDate: '',
      toDate: '',
      imei: '' // ✅ ADDED
    });
    setAppliedFilters({
      name: '',
      phone: '',
      invoiceNumber: '',
      date: '',
      status: '',
      paymentMode: '',
      billType: '',
      fromDate: '',
      toDate: '',
      imei: '' // ✅ ADDED
    });
    setFilteredMultiBrandCustomers([]);
  };

  // ✅ FIXED: Invoice number generation with proper parsing
  const generateInvoiceNumber = () => {
    const prefix = shopType === 'sales' ? 'B' : 'SV';

    // Filter customers for current shop type (excluding multi-brand)
    const shopCustomers = allCustomers.filter(customer =>
      customer.shopType === shopType &&
      customer.billType !== 'multi-brand'
    );

    // If no customers, start from 001
    if (shopCustomers.length === 0) {
      return shopType === 'sales' ? 'B25-26-837' : 'SV25-26-001';
    }

    // Extract numbers from existing invoice numbers and find the latest
    let latestNumber = 0;
    let latestInvoice = '';

    shopCustomers.forEach(customer => {
      if (!customer.invoiceNumber) return;

      console.log('🔍 Processing invoice:', customer.invoiceNumber);

      // ✅ FIXED: Extract only the sequential number part (after last dash)
      const parts = customer.invoiceNumber.split('-');
      const sequentialPart = parts[parts.length - 1]; // Get the last part "001"

      // Remove any non-numeric characters from the sequential part
      const numberStr = sequentialPart.replace(/\D/g, '');
      const currentNumber = parseInt(numberStr) || 0;

      console.log('📊 Parsed:', {
        invoice: customer.invoiceNumber,
        parts: parts,
        sequentialPart: sequentialPart,
        numberStr: numberStr,
        currentNumber: currentNumber
      });

      if (currentNumber > latestNumber) {
        latestNumber = currentNumber;
        latestInvoice = customer.invoiceNumber;
      }
    });

    console.log('📈 Latest found:', {
      latestInvoice,
      latestNumber
    });

    // ✅ CUSTOM JUMP CONDITION
    let nextNumber;

    if (shopType === 'sales') {
      // For sales: if condition matches, start from the given number (1001)
      if (latestInvoice.includes('B22-001')) {
        nextNumber = 1;
      } else {
        nextNumber = latestNumber + 1;
      }
    } else {
      // For service: if condition matches, start from the given number (1001)
      if (latestInvoice.includes('S705')) {
        nextNumber = 1001;
      } else {
        nextNumber = latestNumber + 1;
      }
    }

    // ✅ FIXED: Reconstruct the full invoice number with prefix and year
    const nextInvoice = shopType === 'sales'
      ? `B25-26-${nextNumber.toString().padStart(3, '0')}`
      : `SV25-26-${nextNumber.toString().padStart(3, '0')}`;

    console.log('🧾 Invoice Generation Result:', {
      shopType,
      latestInvoice,
      latestNumber,
      nextNumber,
      nextInvoice
    });

    return nextInvoice;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ UPDATE: Only update input data, don't trigger filtering
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterInputData(prev => ({
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

// Format name to ALL CAPS
const handleNameChange = (e) => {
  const value = e.target.value;
  const upperCaseValue = value.toUpperCase(); // Change to ALL CAPS
  setCustomerData(prev => ({
    ...prev,
    name: upperCaseValue
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

      // ✅ ADDED: Phone number validation
      if (customerData.phone.length !== 10) {
        alert('Please enter a valid 10-digit phone number');
        return;
      }

      // ✅ ADDED: Special validation for EMI
      if (customerData.paymentMode === 'emi' && !customerData.financeCompany) {
        alert('Please select a finance company for EMI payment');
        return;
      }
    } else {
      // ✅ UPDATED: Service validation - ADDED MODEL FIELD
      if (!customerData.name || !customerData.phone || !customerData.cost ||
        !customerData.brand || !customerData.stock || !customerData.model || !customerData.cashier) {
        alert('Please fill all required fields for service customer');
        return;
      }

      // ✅ ADDED: Phone number validation for service too
      if (customerData.phone.length !== 10) {
        alert('Please enter a valid 10-digit phone number');
        return;
      }
    }

    try {
      const invoiceNumber = generateInvoiceNumber();

      // ✅ FIX: Handle paymentMode properly for both service and sales
      let validPaymentMode = customerData.paymentMode;

      // For service customers, paymentMode can be empty, but backend expects a valid enum
      if (shopType === 'service' && (!validPaymentMode || validPaymentMode === '')) {
        validPaymentMode = 'cash'; // Set default for service
      }

      // For sales, it should already be validated above
      if (shopType === 'sales' && (!validPaymentMode || validPaymentMode === '')) {
        alert('Please select a payment mode for sales customer');
        return;
      }

      // ✅ FIXED: Store full finance company name in database
      let financeCompanyFullName = '';
      if (customerData.paymentMode === 'emi' && customerData.financeCompany) {
        financeCompanyFullName = FINANCE_COMPANIES[customerData.financeCompany] || customerData.financeCompany;
      }

      // Prepare customer data
      const newCustomer = {
        invoiceNumber: invoiceNumber,
        customerName: customerData.name.trim(),
        phone: customerData.phone,
        address: customerData.address,
        cost: parseFloat(customerData.cost),
        brand: customerData.brand,
        stock: customerData.stock || '',
        model: customerData.model || '', // ✅ Now model is used for both service and sales
        password: customerData.password || '',
        paymentMode: validPaymentMode, // ✅ Now this will never be empty
        financeCompany: financeCompanyFullName, // ✅ Store full name in database
        warrantyDays: parseInt(customerData.warrantyDays) || 0,
        imei: customerData.imei || '',
        cashier: customerData.cashier,
        shopType: shopType,
        issue: customerData.issue || '',
        status: 'not paid',
        balance: parseFloat(customerData.cost),
        gstNumber: shopType === 'sales' ? customerData.gstNumber || '' : '',
        billType: 'regular' // ✅ EXPLICITLY SET AS REGULAR
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

        // ✅ CRITICAL FIX: Mark stock item as sold for SALES customers
        if (shopType === 'sales' && customerData.imei) {
          try {
            console.log('🔄 Looking for stock item with IMEI:', customerData.imei);

            // Find the stock item by IMEI
            const stockItem = stockItems.find(item => item.imei === customerData.imei);
            console.log('📦 Found stock item:', stockItem);

            if (stockItem) {
              console.log('🎯 Marking stock item as sold:', stockItem._id);

              // Update stock item status to 'sold'
              const stockResponse = await fetch(`${STOCK_API}/${stockItem._id}/sold`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerId: savedCustomer._id })
              });

              if (stockResponse.ok) {
                const stockResult = await stockResponse.json();
                console.log('✅ Stock item marked as sold:', stockResult);

                // Refresh stock data to show updated status
                await fetchStockData();
                console.log('🔄 Stock data refreshed after sales');
              } else {
                console.error('❌ Failed to mark stock item as sold');
              }
            } else {
              console.warn('⚠️ Stock item not found for IMEI:', customerData.imei);
            }
          } catch (stockError) {
            console.error('❌ Error updating stock item:', stockError);
            // Continue even if stock update fails, but log the error
          }
        }

        // ✅ ADD THIS: Refresh stock data after creating service customer
        if (shopType === 'service') {
          await fetchStockData(); // This will update the stock quantities in frontend
          console.log('🔄 Stock data refreshed after customer creation');
        }

        // Update local state
        const updatedCustomers = [savedCustomer, ...customers];
        const updatedAllCustomers = [savedCustomer, ...allCustomers];

        setCustomers(updatedCustomers);
        setAllCustomers(updatedAllCustomers);

        // Reset form
        setCustomerData({
          name: '', phone: '', address: '', issue: '', cost: '', brand: '', stock: '', model: '',
          password: '', paymentMode: 'cash', financeCompany: '', warrantyDays: '', imei: '', cashier: '',
          gstNumber: ''
        });

        alert(`✅ Customer added successfully! Invoice: ${invoiceNumber}`);

        // Refresh data
        await fetchAllCustomers();

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

        // ✅ ADD THIS: Refresh stock data for service status changes
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

  // UNIVERSAL PRINT FUNCTION FOR ALL DEVICES
const printUniversal = async (customer, isMultiBrand = false) => {
  try {
    // Determine the correct URL
    const printUrl = isMultiBrand 
      ? `${CUSTOMER_API}/${customer._id}/print`
      : `${CUSTOMER_API}/${customer._id}/print`;
    
    // Detect device type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch)))/i.test(navigator.userAgent);
    
    if (isMobile || isTablet) {
      // Mobile/Tablet device
      if (isIOS) {
        // iOS - show instructions
        if (window.confirm(
          `Print on ${isTablet ? 'Tablet' : 'Phone'}:\n\n` +
          '1. PDF will open in new tab\n' +
          '2. Tap Share button (⎋)\n' +
          '3. Scroll and tap "Print"\n' +
          '4. Select printer\n\n' +
          'Click OK to continue'
        )) {
          window.open(printUrl, '_blank');
        }
      } else {
        // Android/other mobile devices
        const newWindow = window.open(printUrl, '_blank');
        
        if (newWindow) {
          // Try auto-print after 1 second
          setTimeout(() => {
            try {
              // Check if print is available
              if (newWindow.print && typeof newWindow.print === 'function') {
                newWindow.print();
                
                // Update status
                if (isMultiBrand) {
                  setMultiBrandActionStatus(prev => ({
                    ...prev,
                    [customer.invoiceNumber]: '✅ Printing...'
                  }));
                } else {
                  setActionStatus(prev => ({
                    ...prev,
                    [customer._id]: '✅ Printing...'
                  }));
                }
              } else {
                // If print() not available, show download option
                if (confirm(
                  'Direct print not available.\n\n' +
                  'Would you like to download the PDF first?\n' +
                  '(Download then print from Files app)'
                )) {
                  // Trigger download
                  const downloadLink = document.createElement('a');
                  downloadLink.href = printUrl;
                  downloadLink.download = `Bill_${customer.invoiceNumber}.pdf`;
                  document.body.appendChild(downloadLink);
                  downloadLink.click();
                  document.body.removeChild(downloadLink);
                }
              }
            } catch (error) {
              console.log('Auto-print failed, manual print required');
            }
          }, 1000);
        }
      }
    } else {
      // Desktop/Laptop - direct print with iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = printUrl;
      document.body.appendChild(iframe);
      
      iframe.onload = function () {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          
          // Clean up
          setTimeout(() => {
            if (iframe.parentNode) {
              document.body.removeChild(iframe);
            }
          }, 3000);
          
        } catch (error) {
          // Fallback to new window
          window.open(printUrl, '_blank');
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
    }
    
  } catch (error) {
    console.error('Print error:', error);
    
    // Show error message
    const errorMsg = 'Failed to print. Please try downloading first.';
    if (isMultiBrand) {
      setMultiBrandActionStatus(prev => ({
        ...prev,
        [customer.invoiceNumber]: '❌ ' + error.message
      }));
    } else {
      setActionStatus(prev => ({
        ...prev,
        [customer._id]: '❌ ' + error.message
      }));
    }
    
    // Fallback: Open in new tab
    window.open(printUrl, '_blank');
  }
};

// Handle actions (Print/Download) - Universal device support
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
      const customer = customers.find(c => c._id === customerId);
      // Universal print function for all devices
      await printUniversal(customer, false); // false = regular bill
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

  // ✅ FIXED: Service filter function - IMEI only for Sales
  const handleApplyFilter = () => {
    console.log('🔍 Applying customer filter. Shop Type:', shopType, 'IMEI:', filterData.imei);

    // If no filters are applied, show all customers for current shop type
    const isAnyFilterApplied = filterData.name || filterData.phone || filterData.invoiceNumber ||
      filterData.status || filterData.fromDate || filterData.toDate ||
      filterData.paymentMode || (shopType === 'sales' && filterData.imei);

    if (!isAnyFilterApplied) {
      console.log('No filters applied, showing all customers');
      // Filter out multi-brand customers for regular view
      const regularCustomers = allCustomers.filter(customer => customer.billType !== 'multi-brand');
      setCustomers(regularCustomers);
      return;
    }

    // Filter customers on frontend
    const filteredCustomers = allCustomers.filter(customer => {
      // Filter out multi-brand customers first
      if (customer.billType === 'multi-brand') {
        return false;
      }

      // Name filter
      if (filterData.name && !customer.customerName?.toLowerCase().includes(filterData.name.toLowerCase())) {
        return false;
      }

      // Phone filter
      if (filterData.phone && !customer.phone?.includes(filterData.phone)) {
        return false;
      }

      // Invoice filter
      if (filterData.invoiceNumber && !customer.invoiceNumber?.toLowerCase().includes(filterData.invoiceNumber.toLowerCase())) {
        return false;
      }

      // ✅ FIXED: IMEI filter - ONLY for Sales customers
      if (shopType === 'sales' && filterData.imei) {
        const customerImei = customer.imei || '';
        if (!customerImei.toLowerCase().includes(filterData.imei.toLowerCase())) {
          console.log('IMEI filter failed:', customerImei, 'does not contain', filterData.imei);
          return false;
        }
        console.log('IMEI filter passed:', customerImei, 'contains', filterData.imei);
      }

      // Status filter for service
      if (shopType === 'service' && filterData.status && customer.status !== filterData.status) {
        return false;
      }

      // Payment mode filter for sales
      if (shopType === 'sales' && filterData.paymentMode && customer.paymentMode !== filterData.paymentMode) {
        return false;
      }

      // Date range filter
      if (filterData.fromDate || filterData.toDate) {
        const customerDate = new Date(customer.date);
        customerDate.setHours(0, 0, 0, 0);

        if (filterData.fromDate && isValidDDMMYYYY(filterData.fromDate)) {
          const fromDate = parseDDMMYYYY(filterData.fromDate);
          if (fromDate) {
            fromDate.setHours(0, 0, 0, 0);
            if (customerDate < fromDate) {
              return false;
            }
          }
        }

        if (filterData.toDate && isValidDDMMYYYY(filterData.toDate)) {
          const toDate = parseDDMMYYYY(filterData.toDate);
          if (toDate) {
            toDate.setHours(0, 0, 0, 0);
            if (customerDate > toDate) {
              return false;
            }
          }
        }
      }

      return true;
    });

    console.log('Filtered customers:', filteredCustomers.length);
    setCustomers(filteredCustomers);
  };

  // ✅ Helper function to convert DD/MM/YYYY to Date object
  const parseDDMMYYYY = (dateString) => {
    if (!dateString) return null;

    const [day, month, year] = dateString.split('/');
    if (!day || !month || !year) return null;

    return new Date(`${year}-${month}-${day}`);
  };

  // ✅ Helper function to validate DD/MM/YYYY format
  const isValidDDMMYYYY = (dateString) => {
    if (!dateString || dateString.length !== 10) return false;

    const [day, month, year] = dateString.split('/');
    if (!day || !month || !year) return false;

    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (dayNum < 1 || dayNum > 31) return false;
    if (monthNum < 1 || monthNum > 12) return false;
    if (yearNum < 1900 || yearNum > 2100) return false;

    return true;
  };

  // ✅ FIXED: Reset filter function
  const handleResetFilter = () => {
    setFilterData({
      name: '',
      phone: '',
      invoiceNumber: '',
      date: '',
      status: '',
      paymentMode: '',
      billType: '',
      fromDate: '',
      toDate: '',
      imei: '' // ✅ ADDED
    });

    // Reset based on current view
    if (shopType === 'sales') {
      if (salesFilterTab === 'multibrand') {
        setFilteredMultiBrandCustomers(multiBrandCustomers);
      } else if (salesFilterTab === 'stock') {
        setFilteredStockItems(stockItems);
      } else {
        setCustomers(allCustomers.filter(customer => customer.billType !== 'multi-brand'));
      }
    } else {
      setCustomers(allCustomers);
    }
  };



  // ✅ FIXED: Service profit calculation
  const calculateProfit = () => {
    const today = new Date().toLocaleDateString();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    console.log('🔍 ========== STARTING PROFIT CALCULATION ==========');
    console.log('📅 Today:', today);
    console.log('📅 Current Month:', currentMonth + 1, 'Year:', currentYear);

    // Initialize profit data
    const newProfitData = {
      sales: { dailyProfit: 0, monthlyProfit: 0, totalRevenue: 0 },
      service: { dailyProfit: 0, monthlyProfit: 0, totalRevenue: 0, todayIncome: 0, pendingBalance: 0 },
      multibrand: { dailyProfit: 0, monthlyProfit: 0, totalRevenue: 0 }
    };

    // ==================== SERVICE CUSTOMERS ====================
    const serviceCustomers = allCustomers.filter(customer =>
      customer.shopType === 'service'
    );

    console.log('👥 Total Service Customers:', serviceCustomers.length);

    let todayServiceCount = 0;
    let monthlyServiceCount = 0;

    serviceCustomers.forEach((customer, index) => {
      const customerDate = new Date(customer.date);
      const customerDateStr = customerDate.toLocaleDateString();
      const isToday = customerDateStr === today;
      const isThisMonth = customerDate.getMonth() === currentMonth && customerDate.getFullYear() === currentYear;

      const serviceIncome = customer.cost || 0;
      const paidAmount = customer.paidAmount || 0;
      const balance = customer.balance || 0;

      if (isToday) todayServiceCount++;
      if (isThisMonth) monthlyServiceCount++;

      console.log(`\n🔍 SERVICE CUSTOMER ${index + 1}:`);
      console.log('   Name:', customer.customerName);
      console.log('   Date:', customerDateStr, '- Today?', isToday, '- This Month?', isThisMonth);
      console.log('   Brand:', customer.brand);
      console.log('   Stock:', customer.stock);
      console.log('   Service Income:', serviceIncome);
      console.log('   Paid Amount:', paidAmount);
      console.log('   Balance:', balance);

      // Calculate stock cost for service
      let stockCost = 0;

      if (customer.brand && customer.stock) {
        console.log('   🔍 Looking for variant...');

        // Get all variants for debugging
        const allVariants = variants.map(v => ({
          productName: v.productName,
          product: v.product?.name,
          variantName: v.variantName,
          sellingPrice: v.sellingPrice
        }));
        console.log('   All variants:', allVariants);

        const variant = variants.find(v => {
          const productMatch = v.productName === customer.brand || v.product?.name === customer.brand;
          const variantMatch = v.variantName === customer.stock;
          console.log('   Variant check:', {
            lookingFor: { brand: customer.brand, stock: customer.stock },
            currentVariant: { productName: v.productName, product: v.product?.name, variantName: v.variantName },
            productMatch,
            variantMatch,
            matches: productMatch && variantMatch
          });
          return productMatch && variantMatch;
        });

        if (variant) {
          stockCost = parseFloat(variant.sellingPrice) || 0;
          console.log('   ✅ Found variant! Cost:', stockCost);
        } else {
          console.log('   ❌ Variant NOT found!');
          // Show available variants for this brand
          const brandVariants = variants.filter(v =>
            v.productName === customer.brand || v.product?.name === customer.brand
          );
          console.log('   Available variants for brand:', brandVariants.map(v => ({
            variantName: v.variantName,
            sellingPrice: v.sellingPrice
          })));
        }
      } else {
        console.log('   ⚠️ No brand/stock specified');
      }

      // ✅ FIXED: Calculate profit correctly
      const profit = serviceIncome - stockCost;

      console.log('   💰 FINAL CALCULATION:');
      console.log('      Service Income:', serviceIncome);
      console.log('      Stock Cost:', stockCost);
      console.log('      Profit:', profit);

      // Update service data
      newProfitData.service.totalRevenue += serviceIncome;

      if (isToday) {
        newProfitData.service.todayIncome += paidAmount;
        newProfitData.service.dailyProfit += profit; // ✅ Use profit, not serviceIncome
        console.log('      📈 ADDED to Today - Paid:', paidAmount, 'Profit:', profit);
      }

      if (isThisMonth) {
        newProfitData.service.monthlyProfit += profit; // ✅ Use profit, not serviceIncome
        console.log('      📈 ADDED to Monthly Profit:', profit);
      }

      newProfitData.service.pendingBalance += balance;

      console.log('   📊 CURRENT TOTALS:');
      console.log('      Today Income:', newProfitData.service.todayIncome);
      console.log('      Daily Profit:', newProfitData.service.dailyProfit);
      console.log('      Monthly Profit:', newProfitData.service.monthlyProfit);
    });

    console.log('\n📊 SERVICE SUMMARY:');
    console.log('   Today Customers:', todayServiceCount);
    console.log('   Monthly Customers:', monthlyServiceCount);
    console.log('   Final Service Data:', newProfitData.service);

    // ==================== SALES & MULTIBRAND (Keep existing) ====================
    const salesCustomers = allCustomers.filter(customer =>
      customer.shopType === 'sales' && customer.billType !== 'multi-brand'
    );

    salesCustomers.forEach(customer => {
      const customerDate = new Date(customer.date);
      const isToday = customerDate.toLocaleDateString() === today;
      const isThisMonth = customerDate.getMonth() === currentMonth && customerDate.getFullYear() === currentYear;

      const sellingPrice = customer.cost || 0;
      const stockItem = stockItems.find(item => item.imei === customer.imei);
      const costPrice = stockItem?.cost || 0;
      const profit = sellingPrice - costPrice;

      newProfitData.sales.totalRevenue += sellingPrice;
      if (isToday) newProfitData.sales.dailyProfit += profit;
      if (isThisMonth) newProfitData.sales.monthlyProfit += profit;
    });

    multiBrandCustomers.forEach(customer => {
      const customerDate = new Date(customer.date);
      const isToday = customerDate.toLocaleDateString() === today;
      const isThisMonth = customerDate.getMonth() === currentMonth && customerDate.getFullYear() === currentYear;

      const sellingPrice = customer.cost || 0;
      const stockItem = stockItems.find(item => item.imei === customer.imei);
      const costPrice = stockItem?.cost || 0;
      const profit = sellingPrice - costPrice;

      newProfitData.multibrand.totalRevenue += sellingPrice;
      if (isToday) newProfitData.multibrand.dailyProfit += profit;
      if (isThisMonth) newProfitData.multibrand.monthlyProfit += profit;
    });

    console.log('\n🎯 FINAL PROFIT DATA:');
    console.log('   Service:', newProfitData.service);
    console.log('   Sales:', newProfitData.sales);
    console.log('   Multibrand:', newProfitData.multibrand);
    console.log('========== END PROFIT CALCULATION ==========\n');

    setProfitData(newProfitData);
  };

  // ✅ ADD: Call this function when data changes
  useEffect(() => {
    calculateProfit();
  }, [allCustomers, multiBrandCustomers, stockItems]);

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

      // ✅ FIXED: Use the correct endpoint (remove the duplicate /customers)
      const response = await fetch(`${CUSTOMER_API}/${customerId}`, {
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

  {/* Variant editing functions - UPDATED */ }
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

  // ✅ UPDATED: Group only regular customers by date
  const getCustomersWithDailyTotals = () => {
    // Filter out multi-brand customers first
    const regularCustomers = customers.filter(customer => customer.billType !== 'multi-brand');

    if (regularCustomers.length === 0) return [];

    const groupedByDate = {};

    // Group only regular customers by date
    regularCustomers.forEach(customer => {
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

  // ✅ ADD: Function to group multi-brand customers by date with daily totals
  const getMultiBrandCustomersWithDailyTotals = () => {
    // Use filtered data if available, otherwise use all multi-brand customers
    const customersToDisplay = filteredMultiBrandCustomers.length > 0
      ? filteredMultiBrandCustomers
      : multiBrandCustomers;

    if (customersToDisplay.length === 0) return [];

    const groupedByDate = {};

    // Group multi-brand customers by date
    customersToDisplay.forEach(customer => {
      const date = new Date(customer.date).toLocaleDateString();

      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date: customer.date,
          customers: [],
          totalCost: 0,
          count: 0
        };
      }

      groupedByDate[date].customers.push(customer);
      groupedByDate[date].totalCost += customer.cost || 0;
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
        id: `multi-brand-daily-total-${group.date}`
      });

      // Then add all customers for that date
      group.customers.forEach(customer => {
        result.push({
          type: 'customer',
          data: customer,
          id: customer._id || `multi-brand-${customer.invoiceNumber}`
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

  // Update the useEffect for dealers tab
  useEffect(() => {
    if (activeTab === 'dealers' && shopType === 'sales') {
      fetchDealers();
    }
  }, [activeTab, shopType]);



  // ✅ UPDATE: Stock filter change handler to handle IMEI field
  const handleStockFilterChange = (e) => {
    const { name, value } = e.target;
    setStockFilterData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // ✅ FIXED: Stock filter function with proper IMEI, brand, and model filtering
  const handleApplyStockFilter = () => {
    const filtered = stockItems.filter(item => {
      // ✅ FIXED: IMEI filter - search within IMEI numbers
      if (stockFilterData.imei && !item.imei?.toLowerCase().includes(stockFilterData.imei.toLowerCase())) {
        return false;
      }

      // ✅ FIXED: Brand filter - show ALL brands (including sold items)
      if (stockFilterData.brand) {
        const itemBrand = item.variant?.product?.name || item.variant?.productName || item.product?.name || item.productName;
        if (itemBrand?.toLowerCase() !== stockFilterData.brand.toLowerCase()) {
          return false;
        }
      }

      // ✅ FIXED: Model filter - show ALL models (including sold items)
      if (stockFilterData.model) {
        const itemModel = item.variant?.variantName || item.variantName;
        if (itemModel?.toLowerCase() !== stockFilterData.model.toLowerCase()) {
          return false;
        }
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

      // ✅ FIXED: Date range filter
      if (stockFilterData.fromDate || stockFilterData.toDate) {
        const itemDate = new Date(item.createdAt);
        itemDate.setHours(0, 0, 0, 0);

        if (stockFilterData.fromDate && isValidDDMMYYYY(stockFilterData.fromDate)) {
          const fromDate = parseDDMMYYYY(stockFilterData.fromDate);
          if (fromDate) {
            fromDate.setHours(0, 0, 0, 0);
            if (itemDate < fromDate) {
              return false;
            }
          }
        }

        if (stockFilterData.toDate && isValidDDMMYYYY(stockFilterData.toDate)) {
          const toDate = parseDDMMYYYY(stockFilterData.toDate);
          if (toDate) {
            toDate.setHours(0, 0, 0, 0);
            if (itemDate > toDate) {
              return false;
            }
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

  // ✅ FIXED: Reset stock filter function
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
      const invoiceNumber = generateMultiBrandInvoiceNumber();

      // ✅ FIX: Ensure paymentMode has a valid value
      const validPaymentMode = multiBrandData.paymentMode || 'cash';

      // ✅ FIXED: Store full finance company name in database
      let financeCompanyFullName = '';
      if (multiBrandData.paymentMode === 'emi' && multiBrandData.financeCompany) {
        financeCompanyFullName = FINANCE_COMPANIES[multiBrandData.financeCompany] || multiBrandData.financeCompany;
      }

      const customerData = {
        invoiceNumber: invoiceNumber,
        customerName: multiBrandData.name.trim(),
        phone: multiBrandData.phone,
        address: multiBrandData.address.trim(),
        cost: cost,
        shopType: 'sales',
        cashier: multiBrandData.cashier,
        brand: multiBrandData.brand || '',
        model: multiBrandData.model || '',
        imei: multiBrandData.imei || '',
        paymentMode: validPaymentMode,
        financeCompany: financeCompanyFullName, // ✅ Store full name in database
        gstNumber: multiBrandData.gstNumber || '',
        billType: 'multi-brand',
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Server error while creating customer');
      }

      const result = await response.json();
      console.log('✅ Customer created successfully:', result);

      // ✅ ADD THIS: Mark stock item as sold for multi-brand
      if (multiBrandData.imei) {
        try {
          const stockItem = stockItems.find(item => item.imei === multiBrandData.imei);
          if (stockItem) {
            await fetch(`${STOCK_API}/${stockItem._id}/sold`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ customerId: result.data._id }) // Use the created customer ID
            });
            console.log('✅ Multi-brand stock item marked as sold');

            // ✅ UPDATE: Refresh both regular and multi-brand data
            await fetchAllCustomers(); // This will now properly separate the records
            await fetchMultiBrandCustomers(); // Refresh multi-brand specific data
          }
        } catch (stockError) {
          console.error('⚠️ Error updating multi-brand stock item:', stockError);
          // Continue even if stock update fails
        }
      }

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

      // Refresh multi-brand customers list
      await fetchMultiBrandCustomers();

    } catch (error) {
      console.error('❌ Error creating multi-brand customer:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // ✅ ADD THIS: Helper function to get short code from full name
  const getFinanceCompanyShortCode = (fullName) => {
    if (!fullName) return '';

    // Find the short code from the full name
    const entry = Object.entries(FINANCE_COMPANIES).find(([code, name]) => name === fullName);
    return entry ? entry[0].toUpperCase() : fullName.substring(0, 4).toUpperCase();
  };

  // ✅ UPDATE: Multi-brand warranty handlers to work with grouped data
  const handleMultiBrandWarrantyDaysChange = (index, value) => {
    const customersData = getMultiBrandCustomersWithDailyTotals();
    const customerItem = customersData.find((item, i) => i === index && item.type === 'customer');

    if (customerItem) {
      const customer = customerItem.data;
      const warrantyDays = parseInt(value) || 0;

      // Find the original index in multiBrandCustomers array
      const originalIndex = multiBrandCustomers.findIndex(c =>
        c._id === customer._id || c.invoiceNumber === customer.invoiceNumber
      );

      if (originalIndex !== -1) {
        const updatedCustomers = [...multiBrandCustomers];
        updatedCustomers[originalIndex] = {
          ...updatedCustomers[originalIndex],
          warrantyDays
        };
        setMultiBrandCustomers(updatedCustomers);
      }
    }
  };

  const handleMultiBrandWarrantyDaysSave = (index, value) => {
    const customersData = getMultiBrandCustomersWithDailyTotals();
    const customerItem = customersData.find((item, i) => i === index && item.type === 'customer');

    if (customerItem) {
      const customer = customerItem.data;
      const warrantyDays = parseInt(value) || 0;

      // Find the original index in multiBrandCustomers array
      const originalIndex = multiBrandCustomers.findIndex(c =>
        c._id === customer._id || c.invoiceNumber === customer.invoiceNumber
      );

      if (originalIndex !== -1) {
        const updatedCustomers = [...multiBrandCustomers];
        updatedCustomers[originalIndex] = {
          ...updatedCustomers[originalIndex],
          warrantyDays
        };
        setMultiBrandCustomers(updatedCustomers);

        // You can add backend saving logic here if needed
        console.log('Saving warranty days for:', customer.invoiceNumber, warrantyDays);
      }
    }
  };

// ✅ UPDATED: Multi-brand action handler with universal device support
const handleMultiBrandAction = async (customer, action) => {
  setMultiBrandActionStatus(prev => ({
    ...prev,
    [customer.invoiceNumber]: `${action === 'download' ? 'Downloading' : 'Printing'}...`
  }));

  try {
    if (action === 'print') {
      // Universal print function for all devices
      await printUniversal(customer, true); // true = multi-brand
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

  // ✅ SIMPLE: Multi-brand invoice number with single jump condition
  const generateMultiBrandInvoiceNumber = () => {
    if (multiBrandCustomers.length === 0) {
      return 'M25-26-001';
    }

    // Find the latest multi-brand invoice number
    let latestNumber = 0;
    let latestInvoice = '';

    multiBrandCustomers.forEach(customer => {
      if (!customer.invoiceNumber) return;

      // Extract only the sequential number part (after last dash)
      const parts = customer.invoiceNumber.split('-');
      const sequentialPart = parts[parts.length - 1]; // Get the last part "001"

      // Remove any non-numeric characters
      const numberStr = sequentialPart.replace(/\D/g, '');
      const currentNumber = parseInt(numberStr) || 0;

      if (currentNumber > latestNumber) {
        latestNumber = currentNumber;
        latestInvoice = customer.invoiceNumber;
      }
    });

    console.log('📈 Multi-brand latest found:', {
      latestInvoice,
      latestNumber
    });

    // ✅ SINGLE JUMP CONDITION
    let nextNumber;

    // If last bill was M25-26-001, next should be M25-26-010
    if (latestInvoice === 'M25001') {
      nextNumber = 10; // Jump from 001 to 010
    }
    // Otherwise normal increment
    else {
      nextNumber = latestNumber + 1;
    }

    const nextInvoice = `M25-26-${nextNumber.toString().padStart(3, '0')}`;

    console.log('🧾 Multi-brand Invoice Generation:', {
      latestInvoice,
      latestNumber,
      nextNumber,
      nextInvoice
    });

    return nextInvoice;
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
          <span
            onClick={(e) => {
              e.stopPropagation();
              handleSetAlert();
            }}
            className={`flex-1 h-10 bg-black hover:bg-gray-700 border border-black hover:border-green-500 text-white flex items-center justify-center px-2 py-1 rounded-lg text-lg transition-all duration-200 cursor-pointer font-medium no-expand ${loading || !alertDate ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            style={loading || !alertDate ? { pointerEvents: 'none' } : {}}
          >
            {loading ? '...' : 'Set'}
          </span>

          <span
            onClick={(e) => {
              e.stopPropagation();
              handleResetAlert();
            }}
            className={`flex-1 h-10 bg-black hover:bg-gray-700 border border-black hover:border-red-500 text-white flex items-center justify-center px-2 py-1 rounded-lg text-lg transition-all duration-200 cursor-pointer font-medium no-expand ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            style={loading ? { pointerEvents: 'none' } : {}}
          >
            {loading ? '...' : 'Reset'}
          </span>
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


  // ✅ FIXED: Apply multi-brand filter function
  const handleApplyMultiBrandFilter = () => {
    console.log('🔍 Applying multibrand filters:', filterInputData);
    console.log('Total multibrand customers:', multiBrandCustomers.length);

    // Copy input data to applied filters
    setAppliedFilters({ ...filterInputData });

    // If no filters are applied, show all records
    const isFilterApplied = filterInputData.name || filterInputData.phone ||
      filterInputData.invoiceNumber || filterInputData.paymentMode ||
      filterInputData.fromDate || filterInputData.toDate || filterInputData.imei;

    if (!isFilterApplied) {
      console.log('No filters applied, showing empty list');
      setFilteredMultiBrandCustomers([]);
      return;
    }

    // Apply the actual filtering
    const filtered = multiBrandCustomers.filter(customer => {
      console.log('Checking customer:', customer.customerName, 'IMEI:', customer.imei);

      // Name filter
      if (filterInputData.name && !customer.customerName?.toLowerCase().includes(filterInputData.name.toLowerCase())) {
        return false;
      }

      // Phone filter
      if (filterInputData.phone && !customer.phone?.includes(filterInputData.phone)) {
        return false;
      }

      // Invoice filter
      if (filterInputData.invoiceNumber && !customer.invoiceNumber?.toLowerCase().includes(filterInputData.invoiceNumber.toLowerCase())) {
        return false;
      }

      // ✅ FIXED: IMEI filter - handle empty/null IMEI
      if (filterInputData.imei) {
        const customerImei = customer.imei || '';
        if (!customerImei.toLowerCase().includes(filterInputData.imei.toLowerCase())) {
          console.log('Multibrand IMEI filter failed:', customerImei, 'does not contain', filterInputData.imei);
          return false;
        }
        console.log('Multibrand IMEI filter passed:', customerImei, 'contains', filterInputData.imei);
      }

      // Payment mode filter
      if (filterInputData.paymentMode && customer.paymentMode !== filterInputData.paymentMode) {
        return false;
      }

      // Date range filter
      if (filterInputData.fromDate || filterInputData.toDate) {
        const customerDate = new Date(customer.date);
        customerDate.setHours(0, 0, 0, 0);

        if (filterInputData.fromDate && isValidDDMMYYYY(filterInputData.fromDate)) {
          const fromDate = parseDDMMYYYY(filterInputData.fromDate);
          if (fromDate) {
            fromDate.setHours(0, 0, 0, 0);
            if (customerDate < fromDate) return false;
          }
        }

        if (filterInputData.toDate && isValidDDMMYYYY(filterInputData.toDate)) {
          const toDate = parseDDMMYYYY(filterInputData.toDate);
          if (toDate) {
            toDate.setHours(0, 0, 0, 0);
            if (customerDate > toDate) return false;
          }
        }
      }

      return true;
    });

    console.log('Filtered multibrand customers:', filtered.length);
    setFilteredMultiBrandCustomers(filtered);
  };

// ✅ MODIFIED: Remove auto date from file name
const exportToExcel = (data, fileName) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Create CSV content
  let csvContent = 'SNo,Name of Buyer,Buyer GTIN,Commodity Code,Invoiceno,Invoice Date,Sales Value,Taxable,CGST,CGSTAMOUNT,SGST,SGSTAMOUNT,IGST,IGSTAMOUNT\n';

  // Add data rows
  data.forEach((item, index) => {
// In your exportToExcel function, update the row creation:
const row = [
  index + 1, // SNo
  `"${item.customerName || ''}"`, // Name of Buyer
  `"${item.gstNumber || ''}"`, // Buyer GTIN
  '', // Commodity Code (empty)
  `"${item.invoiceNumber || ''}"`, // Invoiceno
  `"${formatDateForExcel(item.date)}"`, // Invoice Date
  item.cost || '0', // Sales Value
  calculateTaxableValue(item.cost), // Taxable ✅ CORRECT
  '9', // CGST rate (9%)
  calculateCGSTAmount(item.cost), // CGSTAMOUNT ✅ CORRECT
  '9', // SGST rate (9%)
  calculateSGSTAmount(item.cost), // SGSTAMOUNT ✅ CORRECT
  '0', // IGST rate
  '0'  // IGSTAMOUNT
].join(',');
    
    csvContent += row + '\n';
  });

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // ✅ MODIFIED: Just use the provided fileName without adding extra date
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  // ✅ ADD: Helper function to format date for Excel
  const formatDateForExcel = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

// ✅ CORRECT: Calculate taxable value (Total ÷ 1.18)
const calculateTaxableValue = (total) => {
  const amount = parseFloat(total) || 0;
  return (amount / 1.18).toFixed(2);
};

// ✅ CORRECT: Calculate total GST amount (Total - Taxable)
const calculateGSTAmount = (total) => {
  const amount = parseFloat(total) || 0;
  const taxable = amount / 1.18;
  return (amount - taxable).toFixed(2);
};

// ✅ CORRECT: Calculate CGST amount (9% of taxable OR totalGST ÷ 2)
const calculateCGSTAmount = (total) => {
  const amount = parseFloat(total) || 0;
  const taxable = amount / 1.18;
  const totalGST = amount - taxable;
  return (totalGST / 2).toFixed(2);
};

// ✅ CORRECT: Calculate SGST amount (9% of taxable OR totalGST ÷ 2)
const calculateSGSTAmount = (total) => {
  const amount = parseFloat(total) || 0;
  const taxable = amount / 1.18;
  const totalGST = amount - taxable;
  return (totalGST / 2).toFixed(2);
};

// ✅ FIXED: Date range inclusion issue
const getFilteredDataForExport = () => {
  if (shopType === 'sales' && salesFilterTab === 'multibrand') {
    // For multibrand records
    const customersToExport = filteredMultiBrandCustomers.length > 0 
      ? filteredMultiBrandCustomers 
      : (appliedFilters.name || appliedFilters.phone || appliedFilters.invoiceNumber || 
         appliedFilters.paymentMode || appliedFilters.fromDate || appliedFilters.toDate || 
         appliedFilters.imei ? [] : multiBrandCustomers);
    
    // Apply date filter if provided
    let filteredData = customersToExport;
    
    if (filterInputData.fromDate || filterInputData.toDate) {
      filteredData = customersToExport.filter(customer => {
        const customerDate = new Date(customer.date);
        customerDate.setHours(0, 0, 0, 0);
        
        if (filterInputData.fromDate && isValidDDMMYYYY(filterInputData.fromDate)) {
          const fromDate = parseDDMMYYYY(filterInputData.fromDate);
          if (fromDate) {
            fromDate.setHours(0, 0, 0, 0);
            // ✅ FIX: Use <= instead of < to include fromDate
            if (customerDate < fromDate) return false;
          }
        }
        
        if (filterInputData.toDate && isValidDDMMYYYY(filterInputData.toDate)) {
          const toDate = parseDDMMYYYY(filterInputData.toDate);
          if (toDate) {
            toDate.setHours(23, 59, 59, 999); // Include entire toDate
            // ✅ FIX: Use <= instead of < to include toDate
            if (customerDate > toDate) return false;
          }
        }
        
        return true;
      });
    }
    
    return filteredData;
  } else {
    // For regular customer records
    const customersToExport = customers;
    
    // Apply date filter if provided
    let filteredData = customersToExport;
    
    if (filterData.fromDate || filterData.toDate) {
      filteredData = customersToExport.filter(customer => {
        const customerDate = new Date(customer.date);
        customerDate.setHours(0, 0, 0, 0);
        
        if (filterData.fromDate && isValidDDMMYYYY(filterData.fromDate)) {
          const fromDate = parseDDMMYYYY(filterData.fromDate);
          if (fromDate) {
            fromDate.setHours(0, 0, 0, 0);
            // ✅ FIX: Use <= instead of < to include fromDate
            if (customerDate < fromDate) return false;
          }
        }
        
        if (filterData.toDate && isValidDDMMYYYY(filterData.toDate)) {
          const toDate = parseDDMMYYYY(filterData.toDate);
          if (toDate) {
            toDate.setHours(23, 59, 59, 999); // Include entire toDate
            // ✅ FIX: Use <= instead of < to include toDate
            if (customerDate > toDate) return false;
          }
        }
        
        return true;
      });
    }
    
    return filteredData;
  }
};

// ✅ MODIFIED: File naming with date of downloading
const handleExportToExcel = () => {
  const data = getFilteredDataForExport();
  
  if (data.length === 0) {
    alert('No records to export. Please apply filters or check if there are records available.');
    return;
  }
  
  // Get current date in format: 10 Nov 2025
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = today.toLocaleDateString('en-US', { month: 'short' });
  const year = today.getFullYear();
  const currentDate = `${day} ${month} ${year}`;
  
  // Determine file name based on tab
  let fileName;
  if (shopType === 'sales' && salesFilterTab === 'multibrand') {
    fileName = `${currentDate} GST Bill - Multibrandbill`;
  } else if (shopType === 'sales') {
    fileName = `${currentDate} GST Bill - Customer bill`;
  }

  // ✅ ADD: Reset date filters after export
  if (shopType === 'sales' && salesFilterTab === 'multibrand') {
    setFilterInputData(prev => ({
      ...prev,
      fromDate: '',
      toDate: ''
    }));
    setAppliedFilters(prev => ({
      ...prev,
      fromDate: '',
      toDate: ''
    }));
  } else {
    setFilterData(prev => ({
      ...prev,
      fromDate: '',
      toDate: ''
    }));
  }
  
  exportToExcel(data, fileName);
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
            className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 rounded-tr-lg ${shopType === 'sales'
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-inner'
              : '!bg-white text-gray-800 hover:bg-orange-50 hover:text-orange-700'
              }`}
          >
            🛒 SALES
          </button>
          <button
            onClick={() => handleShopTypeChange('service')}
            className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 rounded-tl-lg ${shopType === 'service'
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-inner'
              : '!bg-white text-gray-800 hover:bg-orange-50 hover:text-orange-700'
              }`}
          >
            🔧 SERVICE
          </button>
          <button
            onClick={() => handleShopTypeChange('accessories')}
            className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 ${shopType === 'accessories'
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
              className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 ${activeTab === 'addCustomer'
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
              className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 ${activeTab === 'filter'
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
              className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 ${activeTab === 'items' || activeTab === 'addProduct'
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
                className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 ${activeTab === 'multibrand'
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
                className={`flex-1 py-3 px-4 font-bold text-base transition-all duration-300 ${activeTab === 'dealers'
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
                      📋 Issue Description *
                    </label>

                    {/* Custom Dropdown Container */}
                    <div className="relative">
                      <select
                        name="issue"
                        value={customerData.showOtherIssue ? 'other' : customerData.issue}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          if (selectedValue === 'other') {
                            setCustomerData(prev => ({ ...prev, issue: prev.issue || '', showOtherIssue: true }));
                          } else {
                            setCustomerData(prev => ({ ...prev, issue: selectedValue, showOtherIssue: false }));
                          }
                        }}
                        className="w-full text-gray-800 h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 bg-white appearance-none"
                        required
                      >
                        <option value="">Select Issue Type</option>
                        <option value="CC (V8)">CC (V8)</option>
                        <option value="CC (TC)">CC (TC)</option>
                        <option value="CC BOARD">CC BOARD</option>
                        <option value="COMBO">COMBO</option>
                        <option value="OLED COMBO">OLED COMBO</option>
                        <option value="BATTERY">BATTERY</option>
                        <option value="WATER LOCK">WATER LOCK</option>
                        <option value="SPEAKER">SPEAKER 🔊</option>
                        <option value="EARPICES">EARPICES</option>
                        <option value="MIC">MIC 🎙</option>
                        <option value="FLASH BOOT">FLASH BOOT</option>
                        <option value="REBOOT ISSUE">REBOOT ISSUE</option>
                        <option value="STRIP">STRIP</option>
                        <option value="other">➕ Other Issue</option>
                      </select>

                      {/* Dropdown arrow */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>

                    {/* Other Issue Input Field - Stays visible when "Other" is selected */}
                    {customerData.showOtherIssue && (
                      <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex gap-2 items-center">
                          <span className="text-xs font-medium text-orange-800 whitespace-nowrap">✍️ Custom Issue:</span>
                          <input
                            type="text"
                            value={customerData.issue}
                            onChange={(e) => setCustomerData(prev => ({ ...prev, issue: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomer()}
                            className="flex-1 text-gray-800 border border-orange-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 bg-white"
                            placeholder="Type your custom issue here..."
                            required
                            autoFocus
                          />
                        </div>

                      </div>
                    )}


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
                          setCustomerData(prev => ({ ...prev, imei: inputValue }));
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
                                  setCustomerData(prev => ({ ...prev, imei: item.imei }));
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
                                  {item.variant?.variantName || 'N/A'} 
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

                {/* Brand Dropdown */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    🏷️ Brand *
                  </label>
                  <select
                    name="brand"
                    value={customerData.brand}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, brand: e.target.value, model: '', stock: '', imei: '' }))}
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
                  <>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        📦 Stock Item *
                      </label>
                      <select
                        name="stock"
                        value={customerData.stock}
                        onChange={handleInputChange}
                        disabled={!customerData.brand}
                        className={`text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 bg-white ${!customerData.brand ? 'opacity-50 cursor-not-allowed' : ''
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
                              {variant.variantName} - (Stock: {variant.quantity})
                            </option>
                          ))
                        }
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        📱 Model *
                      </label>
                      <input
                        type="text"
                        name="model"
                        value={customerData.model}
                        onChange={handleInputChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustomer()}
                        className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200"
                        placeholder="Enter device model (e.g., A57, F21, Note 12)"
                        required
                      />
                    </div>
                  </>
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
                      onChange={(e) => setCustomerData(prev => ({ ...prev, model: e.target.value, imei: '' }))}
                      disabled={!customerData.brand}
                      className={`text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 bg-white ${!customerData.brand ? 'opacity-50 cursor-not-allowed' : ''
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



                {/* Service: Password Field */}
                {shopType === 'service' && (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      🔒 Password
                    </label>
                    <input
                      type="text"
                      name="password"
                      value={customerData.password}
                      onChange={handleInputChange}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomer()}
                      className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200"
                      placeholder="Enter device password"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    👨‍💼 Cashier *
                  </label>
                  <select
                    value={customerData.cashier}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, cashier: e.target.value }))}
                    className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 bg-white"
                    required
                    disabled={stockLoading} // Optional: disable while loading
                  >
                    <option value="">Select Cashier</option>
                    {(shopType === 'service' ? serviceCashiers : salesCashiers).map((cashier, index) => (
                      <option key={index} value={cashier}>
                        {cashier}
                      </option>
                    ))}
                  </select>

                  {/* Show loading or empty state messages */}
                  {stockLoading ? (
                    <p className="text-blue-500 text-xs mt-1">Loading cashiers...</p>
                  ) : (shopType === 'service' ? serviceCashiers : salesCashiers).length === 0 ? (
                    <p className="text-red-500 text-xs mt-1">
                      No {shopType} cashiers found. Add cashiers in the Add Product page.
                    </p>
                  ) : null}
                </div>


                {/* Sales: Payment Mode */}
                {shopType === 'sales' && (
                  <>

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
                            <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${customerData.paymentMode === 'cash'
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
                            <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${customerData.paymentMode === 'gpay'
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
                            <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${customerData.paymentMode === 'emi'
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

                      {/* ✅ UPDATED: EMI Finance Company Selection */}
                      {customerData.paymentMode === 'emi' && (
                        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <label className="block text-sm font-semibold text-purple-800 mb-2">
                            🏢 Select Finance Company *
                          </label>
                          <select
                            value={customerData.financeCompany || ''}
                            onChange={(e) => setCustomerData(prev => ({ ...prev, financeCompany: e.target.value }))}
                            className="text-gray-800 w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 bg-white"
                            required
                          >
                            <option value="">Select Finance Company</option>
                            <option value="bajaj">● BAJAJ FINANCE</option>
                            <option value="tvs">● TVS CREDIT</option>
                            <option value="hdb">● HDB FINANCIAL SERVICES LTD</option>
                            <option value="idfc">● IDFC FIRST BANK</option>
                            <option value="chola">● CHOLA FINANCE</option>
                            <option value="dmi-oppo">● DMI - OPPO</option>
                            <option value="dmi-vivo">● DMI - VIVO</option>
                            <option value="dmi-samsung">● DMI - SAMSUNG</option>
                            <option value="homecredit">● HOME CREDIT</option>
                            <option value="d-super">● D-SUPER</option>
                            <option value="other">● OTHER FINANCE</option>
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
                            <span className={`ml-2 ${customerData.paymentMode === 'cash' ? 'text-green-600' :
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

                  </>
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
  {/* Customer Name - ALL CAPS */}
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-gray-700 mb-1">
      👤 Customer Name *
    </label>
    <input
      type="text"
      value={multiBrandData.name}
      onChange={(e) => {
        const value = e.target.value;
        const upperCaseValue = value.toUpperCase();
        setMultiBrandData(prev => ({ ...prev, name: upperCaseValue }));
      }}
      className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 uppercase placeholder:normal-case"
      style={{ textTransform: 'uppercase' }}
      placeholder="Enter customer full name"
    />
    <p className="text-xs text-gray-500 mt-1">
      Name will be in ALL CAPS
    </p>
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
                          setMultiBrandData(prev => ({ ...prev, phone: value }));
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
                      onChange={(e) => setMultiBrandData(prev => ({ ...prev, address: e.target.value }))}
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
                      onChange={(e) => setMultiBrandData(prev => ({ ...prev, cost: e.target.value }))}
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
                          setMultiBrandData(prev => ({ ...prev, imei: inputValue }));
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
                                  setMultiBrandData(prev => ({ ...prev, imei: item.imei }));
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
                                  {item.variant?.variantName || 'N/A'} 
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

                  {/* Brand Dropdown */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      🏷️ Brand
                    </label>
                    <select
                      value={multiBrandData.brand}
                      onChange={(e) => setMultiBrandData(prev => ({ ...prev, brand: e.target.value, model: '', imei: '' }))}
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
                      onChange={(e) => setMultiBrandData(prev => ({ ...prev, model: e.target.value, imei: '' }))}
                      disabled={!multiBrandData.brand}
                      className={`text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 bg-white ${!multiBrandData.brand ? 'opacity-50 cursor-not-allowed' : ''
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
                      👨‍💼 Cashier *
                    </label>
                    <select
                      value={multiBrandData.cashier}  // ✅ CORRECT - use multiBrandData
                      onChange={(e) => setMultiBrandData(prev => ({ ...prev, cashier: e.target.value }))}  // ✅ CORRECT - update multiBrandData
                      className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 bg-white"
                      required
                      disabled={stockLoading}
                    >
                      <option value="">Select Cashier</option>
                      {salesCashiers.map((cashier, index) => (  // ✅ Use salesCashiers for both
                        <option key={index} value={cashier}>
                          {cashier}
                        </option>
                      ))}
                    </select>

                    {/* Show loading or empty state messages */}
                    {stockLoading ? (
                      <p className="text-blue-500 text-xs mt-1">Loading cashiers...</p>
                    ) : salesCashiers.length === 0 ? (
                      <p className="text-red-500 text-xs mt-1">
                        No sales cashiers found. Add cashiers in the Add Product page.
                      </p>
                    ) : null}
                  </div>

                  {/* GST Number Field - Multi-brand (Optional) */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      🏢 GST Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={multiBrandData.gstNumber}
                      onChange={(e) => setMultiBrandData(prev => ({ ...prev, gstNumber: e.target.value }))}
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
                            onChange={(e) => setMultiBrandData(prev => ({ ...prev, paymentMode: e.target.value, financeCompany: '' }))}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${multiBrandData.paymentMode === 'cash'
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
                            onChange={(e) => setMultiBrandData(prev => ({ ...prev, paymentMode: e.target.value, financeCompany: '' }))}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${multiBrandData.paymentMode === 'gpay'
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

                      {/* EMI Option for Multi-brand */}
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="radio"
                            name="paymentMode"
                            value="emi"
                            checked={multiBrandData.paymentMode === 'emi'}
                            onChange={(e) => setMultiBrandData(prev => ({ ...prev, paymentMode: e.target.value }))}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${multiBrandData.paymentMode === 'emi'
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

                    {/* EMI Finance Company Selection - Only show when EMI is selected */}
                    {multiBrandData.paymentMode === 'emi' && (
                      <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <label className="block text-sm font-semibold text-purple-800 mb-2">
                          🏢 Select Finance Company *
                        </label>
                        <select
                          value={multiBrandData.financeCompany || ''}
                          onChange={(e) => setMultiBrandData(prev => ({ ...prev, financeCompany: e.target.value }))}
                          className="text-gray-800 w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 bg-white"
                          required
                        >
                          <option value="">Select Finance Company</option>
                          <option value="bajaj">● BAJAJ FINANCE</option>
                          <option value="tvs">● TVS CREDIT</option>
                          <option value="hdb">● HDB FINANCIAL SERVICES LTD</option>
                          <option value="idfc">● IDFC FIRST BANK</option>
                          <option value="chola">● CHOLA FINANCE</option>
                          <option value="dmi-oppo">● DMI - OPPO</option>
                          <option value="dmi-vivo">● DMI - VIVO</option>
                          <option value="dmi-samsung">● DMI - SAMSUNG</option>
                          <option value="homecredit">● HOME CREDIT</option>
                          <option value="d-super">● D-SUPER</option>
                          <option value="other">● OTHER FINANCE</option>
                        </select>
                      </div>
                    )}

                    {/* Selected payment mode display */}
                    {multiBrandData.paymentMode && (
                      <div className="mt-2 p-2 bg-white rounded border border-gray-300">
                        <span className="text-sm font-semibold text-gray-900">
                          Selected:
                          <span className={`ml-2 ${multiBrandData.paymentMode === 'cash' ? 'text-green-600' :
                            multiBrandData.paymentMode === 'gpay' ? 'text-blue-600' :
                              'text-purple-600'
                            }`}>
                            {multiBrandData.paymentMode === 'cash' ? '💵 Cash Payment' :
                              multiBrandData.paymentMode === 'gpay' ? '📱 Google Pay' :
                                `🏦 EMI-${multiBrandData.financeCompany ? multiBrandData.financeCompany.toUpperCase() : '[Select Company]'}`}
                          </span>
                        </span>
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
            </>
          )}



          {/* Filter Section */}
          {activeTab === 'filter' && (
            <div className="bg-white rounded-lg p-4 shadow-md mb-4 border border-orange-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {/* ✅ DYNAMIC HEADING BASED ON CURRENT TAB */}
                    {shopType === 'service' ? 'Filter Service Records' :
                      shopType === 'sales' && salesFilterTab === 'customer' ? 'Filter Sales Customer Records' :
                        shopType === 'sales' && salesFilterTab === 'stock' ? 'Filter Stock Records' :
                          shopType === 'sales' && salesFilterTab === 'multibrand' ? 'Filter Multibrand Records' :
                            'Filter Records'}
                  </h2>
                </div>

                {/* Tabs for Sales Shop Type */}
                {shopType === 'sales' && (
                  <div className="flex bg-gray-100 rounded-lg p-1 gap-0.5">
                    <span
                      onClick={() => setSalesFilterTab('customer')}
                      className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer ${salesFilterTab === 'customer'
                        ? 'bg-black text-white shadow-sm'
                        : 'text-black bg-black/10 hover:text-orange-600'
                        }`}
                    >
                      👤 Customer Records
                    </span>
                    <span
                      onClick={() => setSalesFilterTab('stock')}
                      className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer ${salesFilterTab === 'stock'
                        ? 'bg-black text-white shadow-sm'
                        : 'text-black bg-black/10 hover:text-orange-600'
                        }`}
                    >
                      📦 Stock Records
                    </span>
                    <span
                      onClick={() => setSalesFilterTab('multibrand')}
                      className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer ${salesFilterTab === 'multibrand'
                        ? 'bg-black text-white shadow-sm'
                        : 'text-black bg-black/10 hover:text-orange-600'
                        }`}
                    >
                      🏪 Multibrand Records
                    </span>
                  </div>
                )}
              </div>

              {/* Customer Records Filter - Show for Service OR Sales when customer tab is selected */}
              {(shopType === 'service' || (shopType === 'sales' && salesFilterTab === 'customer')) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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

                  {/* ✅ ADDED: Payment Mode/Status based on shop type */}
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
                        <option value="emi">EMI Only</option>
                      </select>
                    </div>
                  )}

                  {/* ✅ ADDED: Date Range Filters with DD/MM/YYYY format */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      📅 From Date
                    </label>
                    <input
                      type="text"
                      name="fromDate"
                      value={filterData.fromDate}
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
                          fromDate: input
                        }));
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyFilter()}
                      className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
                      placeholder="DD/MM/YYYY"
                      maxLength="10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      📅 To Date
                    </label>
                    <input
                      type="text"
                      name="toDate"
                      value={filterData.toDate}
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
                          toDate: input
                        }));
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyFilter()}
                      className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
                      placeholder="DD/MM/YYYY"
                      maxLength="10"
                    />
                  </div>

                  {shopType === 'sales' && salesFilterTab === 'customer' && (
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        📱 IMEI Number
                      </label>
                      <input
                        type="text"
                        name="imei"
                        value={filterData.imei}
                        onChange={(e) => {
                          const trimmedValue = e.target.value.replace(/^\s+/, '');
                          setFilterData(prev => ({
                            ...prev,
                            imei: trimmedValue
                          }));
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyFilter()}
                        className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
                        placeholder="Search by IMEI"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Stock Records Filter - Show only for Sales when stock tab is selected */}
              {shopType === 'sales' && salesFilterTab === 'stock' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* ✅ ADDED: IMEI Search Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      📱 IMEI Number
                    </label>
                    <input
                      type="text"
                      name="imei"
                      value={stockFilterData.imei}
                      onChange={handleStockFilterChange}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyStockFilter()}
                      className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
                      placeholder="Search by IMEI"
                    />
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
                      type="text"
                      name="fromDate"
                      value={stockFilterData.fromDate}
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

                        setStockFilterData(prev => ({
                          ...prev,
                          fromDate: input
                        }));
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyStockFilter()}
                      className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
                      placeholder="DD/MM/YYYY"
                      maxLength="10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      📅 To Date
                    </label>
                    <input
                      type="text"
                      name="toDate"
                      value={stockFilterData.toDate}
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

                        setStockFilterData(prev => ({
                          ...prev,
                          toDate: input
                        }));
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyStockFilter()}
                      className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
                      placeholder="DD/MM/YYYY"
                      maxLength="10"
                    />
                  </div>
                </div>
              )}

              {/* Multibrand Records Filter - Show for Sales when multibrand tab is selected */}
              {shopType === 'sales' && salesFilterTab === 'multibrand' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      👤 Customer Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={filterInputData.name}
                      onChange={(e) => {
                        const trimmedValue = e.target.value.replace(/^\s+/, '');
                        setFilterInputData(prev => ({
                          ...prev,
                          name: trimmedValue
                        }));
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyMultiBrandFilter()}
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
                      value={filterInputData.phone}
                      onChange={(e) => {
                        const numbersOnly = e.target.value.replace(/^\s+/, '').replace(/\D/g, '');
                        setFilterInputData(prev => ({
                          ...prev,
                          phone: numbersOnly
                        }));
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyMultiBrandFilter()}
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
                      value={filterInputData.invoiceNumber}
                      onChange={(e) => {
                        const trimmedValue = e.target.value.replace(/^\s+/, '');
                        setFilterInputData(prev => ({
                          ...prev,
                          invoiceNumber: trimmedValue
                        }));
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyMultiBrandFilter()}
                      className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
                      placeholder="Search by invoice"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      💳 Payment Mode
                    </label>
                    <select
                      name="paymentMode"
                      value={filterInputData.paymentMode}
                      onChange={(e) => {
                        setFilterInputData(prev => ({
                          ...prev,
                          paymentMode: e.target.value
                        }));
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyMultiBrandFilter()}
                      className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200 bg-white"
                    >
                      <option value="">All Modes</option>
                      <option value="cash">Cash Only</option>
                      <option value="gpay">Gpay Only</option>
                      <option value="emi">EMI Only</option>
                    </select>
                  </div>

                  {/* ✅ ADDED: Date Range for Multibrand with DD/MM/YYYY format */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      📅 From Date
                    </label>
                    <input
                      type="text"
                      name="fromDate"
                      value={filterInputData.fromDate}
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

                        setFilterInputData(prev => ({
                          ...prev,
                          fromDate: input
                        }));
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyMultiBrandFilter()}
                      className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
                      placeholder="DD/MM/YYYY"
                      maxLength="10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      📅 To Date
                    </label>
                    <input
                      type="text"
                      name="toDate"
                      value={filterInputData.toDate}
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

                        setFilterInputData(prev => ({
                          ...prev,
                          toDate: input
                        }));
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyMultiBrandFilter()}
                      className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
                      placeholder="DD/MM/YYYY"
                      maxLength="10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      📱 IMEI Number
                    </label>
                    <input
                      type="text"
                      name="imei"
                      value={filterInputData.imei}
                      onChange={(e) => {
                        const trimmedValue = e.target.value.replace(/^\s+/, '');
                        setFilterInputData(prev => ({
                          ...prev,
                          imei: trimmedValue
                        }));
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyMultiBrandFilter()}
                      className="text-gray-800 w-full h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-orange-500 transition-all duration-200"
                      placeholder="Search by IMEI"
                    />
                  </div>
                </div>
              )}

{/* ✅ REARRANGED: Export on left, Apply/Reset on right */}
<div className="flex justify-between items-center mt-4">
  {/* Left side: Export button */}
  <div>
    {(shopType === 'sales' && salesFilterTab !== 'stock')  ? (
      <span
        onClick={handleExportToExcel}
        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold text-md shadow hover:shadow-md flex items-center gap-1 cursor-pointer"
      >
        <span>📊 Export to Excel</span>
      </span>
    ) : null}
  </div>

  {/* Right side: Apply and Reset buttons */}
  <div className="flex gap-3">
    {shopType === 'sales' && salesFilterTab === 'stock' ? (
      <>
        <span
          onClick={handleApplyStockFilter}
          className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-300 font-semibold text-md shadow hover:shadow-md flex items-center gap-1 cursor-pointer"
        >
          <span>🔍 Apply Stock Filter</span>
        </span>
        <span
          onClick={handleResetStockFilter}
          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold text-md shadow hover:shadow-md flex items-center gap-1 cursor-pointer"
        >
          <span>🔄 Reset Stock Filter</span>
        </span>
      </>
    ) : shopType === 'sales' && salesFilterTab === 'multibrand' ? (
      <>
        <span
          onClick={handleApplyMultiBrandFilter}
          className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-300 font-semibold text-md shadow hover:shadow-md flex items-center gap-1 cursor-pointer"
        >
          <span>🔍 Apply Multibrand Filter</span>
        </span>
        <span
          onClick={handleResetMultiBrandFilter}
          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold text-md shadow hover:shadow-md flex items-center gap-1 cursor-pointer"
        >
          <span>🔄 Reset Multibrand Filter</span>
        </span>
      </>
    ) : (
      <>
        <span
          onClick={handleApplyFilter}
          className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-300 font-semibold text-md shadow hover:shadow-md flex items-center gap-1 cursor-pointer"
        >
          <span>🔍 Apply Filter</span>
        </span>
        <span
          onClick={handleResetFilter}
          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold text-md shadow hover:shadow-md flex items-center gap-1 cursor-pointer"
        >
          <span>🔄 Reset</span>
        </span>
      </>
    )}
  </div>
</div>
            </div>
          )}

          {/* Multi-brand Table - Show in both dedicated multibrand tab AND filter multibrand tab */}
          {(activeTab === 'multibrand' && shopType === 'sales') ||
            (activeTab === 'filter' && shopType === 'sales' && salesFilterTab === 'multibrand') ? (
            <>
              {/* Multi-brand Customers Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-orange-100 mt-4">
                <div className="p-4">
                  {/* ✅ FIX 2: Added proper header styling like regular customer records */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Multi-brand Records
                      </h2>
                    </div>
                    <div className="text-xs text-gray-500 bg-orange-50 px-2 py-1 rounded-full">
                      Total: {multiBrandCustomers.length} records
                    </div>
                  </div>

                  {/* ✅ FIXED: Use appliedFilters to check if filters are active */}
                  {filteredMultiBrandCustomers.length === 0 && (appliedFilters.name || appliedFilters.phone || appliedFilters.invoiceNumber || appliedFilters.paymentMode || appliedFilters.fromDate || appliedFilters.toDate || appliedFilters.imei) ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🔍</div>
                      <p className="text-base font-semibold mb-1">No matching records found</p>
                      <p className="text-xs">Try different search terms or clear filters</p>
                    </div>
                  ) : (multiBrandCustomers.length === 0) ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📋</div>
                      <p className="text-base font-semibold mb-1">No multi-brand records found</p>
                      <p className="text-xs">Add your first multi-brand customer to get started</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      {/* ✅ ADDED: Fixed height container with vertical scroll */}
                      <div className="h-100 overflow-y-auto">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gradient-to-r from-orange-500 to-amber-500 sticky top-0 z-10">
                                <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider rounded-tl-lg">Date & Time</th>
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
                                <th className="border border-orange-400 px-3 py-2 text-center font-bold text-white text-xs uppercase tracking-wider rounded-tr-lg">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* ✅ FIX: Use the new grouping function for multi-brand customers */}
                              {getMultiBrandCustomersWithDailyTotals().map((item) => {
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
                                      <td colSpan="10" className="border border-gray-300 px-4 py-3 font-bold text-blue-800 text-center text-sm">
                                        📊 Daily Total ({dailyData.count} {dailyData.count === 1 ? 'bill' : 'bills'})
                                      </td>
                                      <td colSpan="2" className="border border-gray-300 px-3 py-3 font-bold text-green-700 whitespace-nowrap text-center">
                                        Daily Income : ₹{dailyData.totalCost.toFixed(2)}
                                      </td>
                                      <td colSpan="2" className="border border-gray-300"></td>
                                    </tr>
                                  );
                                } else {
                                  const customer = item.data;
                                  return (
                                    <tr key={item.id} className="hover:bg-orange-50 transition-colors duration-200 border-b border-gray-200">
                                      <td className="border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-700 text-sm">
                                        {customer.date ? formatDateTime(customer.date) : new Date().toLocaleString('en-IN', {
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
                                          onChange={(e) => handleMultiBrandWarrantyDaysChange(
                                            getMultiBrandCustomersWithDailyTotals().findIndex(i => i.type === 'customer' && i.data === customer),
                                            e.target.value
                                          )}
                                          onBlur={(e) => handleMultiBrandWarrantyDaysSave(
                                            getMultiBrandCustomersWithDailyTotals().findIndex(i => i.type === 'customer' && i.data === customer),
                                            e.target.value
                                          )}
                                          onKeyPress={(e) => e.key === 'Enter' && e.target.blur()}
                                          className="w-16 text-purple-600 text-center font-medium border border-gray-300 rounded px-1 py-1 focus:outline-none focus:border-purple-500 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none mx-auto block"
                                          placeholder="0"
                                          min="0"
                                        />
                                      </td>
                                      <td className="border border-gray-200 px-3 py-2 whitespace-nowrap w-40">
                                        <div className="flex justify-center items-center">
                                          <div className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${customer.paymentMode === 'cash'
                                            ? 'bg-green-50 text-green-700 border-l-4 border-green-500' :
                                            customer.paymentMode === 'gpay'
                                              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' :
                                              'bg-purple-50 text-purple-700 border-l-4 border-purple-500'
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${customer.paymentMode === 'cash' ? 'bg-green-500' :
                                              customer.paymentMode === 'gpay' ? 'bg-blue-500' :
                                                'bg-purple-500'
                                              }`}></div>
                                            {customer.paymentMode === 'cash' ? 'Cash' :
                                              customer.paymentMode === 'gpay' ? 'Gpay' :
                                                `EMI-${getFinanceCompanyShortCode(customer.financeCompany)}`}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="border border-gray-200 px-3 py-2 font-semibold whitespace-nowrap text-green-600 text-base">
                                        ₹{customer.cost.toFixed(2)}
                                      </td>
                                      <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                          <div className="flex gap-1">
                                            <span
                                              onClick={() => handleMultiBrandAction(customer, 'print')}
                                              className="w-15 h-10 bg-black hover:bg-black border border-black justify-center rounded-lg text-xl hover:border-blue-500 text-white px-2 py-1 transition-all duration-200 font-semibold shadow hover:shadow-sm flex items-center gap-1"
                                              title="Print Multi-brand Bill"
                                            >
                                              🖨️
                                            </span>
                                            <span
                                              onClick={() => handleMultiBrandAction(customer, 'download')}
                                              className="w-15 h-10 bg-black hover:bg-black border border-black justify-center rounded-lg text-xl  text-white px-2 py-1   transition-all duration-200 font-semibold shadow hover:shadow-sm flex items-center gap-1"
                                              title="Download PDF"
                                            >
                                              ⬇️
                                            </span>
                                            <span
                                              onClick={() => handleMultiBrandWhatsApp(customer)}
                                              className="w-15 h-10 bg-black hover:bg-black border border-black justify-center rounded-lg text-xl  text-white px-2 py-1  transition-all duration-200 font-semibold shadow hover:shadow-sm flex items-center gap-1"
                                              title="Send via WhatsApp"
                                            >
                                              ✅
                                            </span>
                                          </div>
                                          {multiBrandActionStatus[customer.invoiceNumber] && (
                                            <span className="text-xs text-gray-600 ml-1 bg-gray-100 px-2 py-1 rounded-full">
                                              {multiBrandActionStatus[customer.invoiceNumber]}
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
                      </div>
                    </div>
                  )}
                </div>
              </div>

{/* Multibrand Income Summary */}
{(activeTab === 'multibrand' && shopType === 'sales') ||
  (activeTab === 'filter' && shopType === 'sales' && salesFilterTab === 'multibrand') ? (
  <div className="bg-white rounded-xl p-4 shadow-lg mt-4 border border-orange-200">
    {/* Header - Title centered */}
    <div className="relative mb-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">💰</span>
          <h3 className="text-lg font-bold text-gray-800">
            MULTI-BRAND INCOME SUMMARY
          </h3>
        </div>
      </div>
      
      {/* Password section - Right side */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
        {!unlockedSummaries.multibrand ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="password"
                value={summaryPasswords.multibrand}
                onChange={(e) => handleSummaryPasswordChange('multibrand', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSummaryPasswordSubmit('multibrand')}
                placeholder="Enter password"
                className={`w-40 h-10 border text-black rounded-lg px-3 py-2 focus:outline-none ${
                  summaryPasswordErrors.multibrand === 'incorrect'
                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-gray-300 focus:border-[#8b1108]'
                }`}
              />
            </div>
<span
  onClick={() => handleSummaryPasswordSubmit('multibrand')}
  className="h-10 bg-[#8b1108] text-white px-4 py-2 rounded-lg hover:bg-[#a8322a] transition-colors font-medium cursor-pointer flex items-center justify-center"
>
  Apply
</span>
          </div>
        ) : (
<span
  onClick={() => lockSummary('multibrand')}
  className="h-10 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2 cursor-pointer justify-center"
>
  🔒 Lock
</span>
        )}
      </div>
    </div>
    
    {/* Summary Content - Only show when unlocked */}
    {unlockedSummaries.multibrand ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="text-2xl font-bold mb-2 text-green-600">
            ₹{profitData.multibrand.totalRevenue.toFixed(2)}
          </div>
          <div className="text-sm font-semibold mb-1 text-gray-700">Multibrand Income</div>
          <div className="text-xs text-gray-600">Total multibrand revenue</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className={`text-2xl font-bold mb-2 ${profitData.multibrand.dailyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{profitData.multibrand.dailyProfit.toFixed(2)}
          </div>
          <div className="text-sm font-semibold mb-1 text-gray-700">Daily Profit</div>
          <div className="text-xs text-gray-600">Today's profit margin</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className={`text-2xl font-bold mb-2 ${profitData.multibrand.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{profitData.multibrand.monthlyProfit.toFixed(2)}
          </div>
          <div className="text-sm font-semibold mb-1 text-gray-700">Monthly Profit</div>
          <div className="text-xs text-gray-600">This month's profit</div>
        </div>
      </div>
    ) : (
      <div className="text-center py-6">
        <div className="text-4xl mb-2">🔒</div>
        {summaryPasswordErrors.multibrand ? (
          <p className="text-red-500 font-medium">Incorrect password! Enter correct password to view multibrand income summary</p>
        ) : (
          <p className="text-gray-500">Enter password to view multibrand income summary</p>
        )}
        <p className="text-sm text-gray-400 mt-1">Password: Baaba#3</p>
      </div>
    )}
  </div>
) : null}
            </>
          ) : null}

          {/* Items Management Section */}
          {activeTab === 'items' && (
            <div className="space-y-4">
              {/* Password Protection for Items Page */}
              {!unlockedSections[`${shopType}ItemPage`] ? (
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto mt-8">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-3xl text-white">🔒</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {shopType === 'service' ? 'Service Items' : 'Sales Items'} Access
                    </h2>
                    <p className="text-gray-400 text-sm">Enter password to manage items</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        🔑 Access Password
                      </label>
                      <input
                        type="password"
                        value={passwords[`${shopType}ItemPage`]}
                        onChange={(e) => handlePasswordChange(`${shopType}ItemPage`, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handlePasswordSubmit(`${shopType}ItemPage`);
                          }
                        }}
                        placeholder="Enter access password"
                        className="w-full bg-gray-800 border-2 border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors duration-300 text-center font-semibold"
                        autoFocus
                      />
                    </div>

                    {passwordErrors[`${shopType}ItemPage`] && (
                      <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-3 text-center">
                        <span className="text-red-300 text-sm">{passwordErrors[`${shopType}ItemPage`]}</span>
                      </div>
                    )}

                    <button
                      onClick={() => handlePasswordSubmit(`${shopType}ItemPage`)}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      🚀 Unlock Items
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Lock Button */}
                  <div className="flex justify-end">
                    <span
                      onClick={() => lockSection(`${shopType}ItemPage`)}
                      className="bg-black h-12 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center gap-2 shadow-lg"
                    >
                      🔒 Lock Items
                    </span>
                  </div>

                  {/* Stock Management Section */}
                  <div className="bg-white rounded-lg p-4 shadow-md border border-orange-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
                        <h2 className="text-lg font-bold text-gray-800">
                          📦 {shopType === 'service' ? 'Stock Management' : 'Product Management'}
                        </h2>
                      </div>
                      <span
                        onClick={() => {
                          setActiveTab('addProduct');
                          localStorage.setItem('activeTab', 'addProduct');
                        }}
                        className="bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center gap-2 text-lg"
                      >
                        <span>➕ Add {shopType === 'service' ? 'Product' : 'Brand'}</span>
                      </span>
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
                                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 relative ${selectedProduct && selectedProduct._id === product._id
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
                                              <span className={`text-xs font-bold ${displayData.hasLowStockVariant ? 'text-red-600' : 'text-blue-800'
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
                                        <span
                                          onClick={(e) => handleDeleteProduct(product._id, product.name)}
                                          className="h-12 w-15 bg-black hover:bg-gray-700 border border-black hover:border-red-500 text-white flex items-center justify-center rounded-lg text-xl transition-all duration-200 cursor-pointer"
                                          title="Delete Product"
                                        >
                                          🗑️
                                        </span>

                                        {editingProduct === product._id ? (
                                          <span
                                            onClick={(e) => handleSaveProductClick(product._id, e)}
                                            className="h-12 w-15 bg-black hover:bg-gray-700 border border-black hover:border-green-500 text-white flex items-center justify-center rounded-lg text-xl transition-all duration-200 cursor-pointer"
                                            title="Save Changes"
                                          >
                                            💾
                                          </span>
                                        ) : (
                                          <span
                                            onClick={(e) => handleEditProductClick(product, e)}
                                            className="h-12 w-15 bg-black hover:bg-gray-700 border border-black hover:border-blue-500 text-white flex items-center justify-center rounded-lg text-xl transition-all duration-200 cursor-pointer"
                                            title="Edit Product Name"
                                          >
                                            📝
                                          </span>
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
                                        className={`border-2 rounded-lg p-3 relative ${isVariantLowStock
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
                                                  <span className={`w-24 px-1 py-1 text-sm font-bold ${isVariantLowStock ? 'text-red-600' : 'text-gray-800'
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
                                            <span
                                              onClick={(e) => handleDeleteVariant(variant._id, variant.variantName)}
                                              className="h-12 w-15 bg-black hover:bg-gray-700 border border-black hover:border-red-500 text-white flex items-center justify-center rounded-lg text-xl transition-all duration-200 cursor-pointer"
                                              title={`Delete ${shopType === 'service' ? 'Variant' : 'Model'}`}
                                            >
                                              🗑️
                                            </span>

                                            {editingVariant === variant._id ? (
                                              <span
                                                onClick={(e) => handleVariantSaveClick(variant._id, e)}
                                                className="h-12 w-15 bg-black hover:bg-gray-700 border border-black hover:border-green-500 text-white flex items-center justify-center rounded-lg text-xl transition-all duration-200 cursor-pointer"
                                                title="Save Changes"
                                              >
                                                💾
                                              </span>
                                            ) : (
                                              <span
                                                onClick={(e) => handleVariantEditClick(variant, e)}
                                                className="h-12 w-15 bg-black hover:bg-gray-700 border border-black hover:border-blue-500 text-white flex items-center justify-center rounded-lg text-xl transition-all duration-200 cursor-pointer"
                                                title={`Edit ${shopType === 'service' ? 'Variant' : 'Model'}`}
                                              >
                                                📝
                                              </span>
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
                </>
              )}
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
                  <span
                    onClick={() => {
                      setActiveTab('items');
                      localStorage.setItem('activeTab', 'items');
                    }}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                  >
                    ← Back to {shopType === 'service' ? 'Stock' : 'Products'}
                  </span>
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
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value.toUpperCase() })}
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
                  <span
                    onClick={addVariant}
                    className="bg-black h-12 text-white px-4 py-2 rounded-lg hover:bg-gray-700  transition-colors font-semibold flex items-center gap-2"
                    disabled={products.length === 0}
                  >
                    <span>+ Add {shopType === 'service' ? 'Stock' : 'Model'}</span>
                  </span>
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
                            <span
                              onClick={() => removeVariant(variant.id)}
                              className="h-12 w-25 bg-black hover:bg-gray-700 border border-black hover:border-red-500 text-red-500 flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer text-md font-medium"
                            >
                              Remove
                            </span>
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
                    <span
                      onClick={handleSaveProductVariants}
                      className={`bg-black text-white px-6 py-2 rounded-lg transition-colors font-semibold cursor-pointer ${products.length === 0 || savingVariants
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-700'
                        }`}
                      style={{
                        pointerEvents: products.length === 0 || savingVariants ? 'none' : 'auto'
                      }}
                    >
                      {savingVariants ? 'Saving...' : `Save ${shopType === 'service' ? 'Variants' : 'Models'}`}
                    </span>
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


                    <span
                      onClick={addStockRow}
                      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center gap-2"
                    >
                      <span>+ Add Stock Row</span>
                    </span>
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
                              <span
                                onClick={() => removeStockRow(index)}
                                className="h-12 w-25 bg-black hover:bg-gray-700 border border-black hover:border-red-500 text-red-500 flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer text-md font-medium"
                              >
                                Remove
                              </span>
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
                              className={`text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 ${!stockItem.product ? 'opacity-50 cursor-not-allowed' : ''
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
                              className={`text-black w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 ${duplicateIMEIs.has(stockItem.imei) || existingIMEIs.has(stockItem.imei)
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
                              <span
                                onClick={() => {
                                  const newForm = [...stockFormData];
                                  newForm[index] = { ...newForm[index], error: '' };
                                  setStockFormData(newForm);
                                }}
                                className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                                title="Clear error"
                              >
                                ✕
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>


                  {/* Save Stock Button */}
                  <div className="flex justify-end mt-6">

                    <span
                      onClick={handleSaveStockItems}
                      className="h-12 bg-black hover:bg-gray-700 border border-black hover:border-green-500 text-white flex items-center justify-center px-6 py-2 rounded-lg transition-all duration-200 cursor-pointer font-semibold text-lg"
                    >
                      💾 Save All Stock Items
                    </span>

                  </div>
                </div>
              )}

              {/* Offer Message Section */}
              <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    📢 Add {shopType === 'service' ? 'Service' : 'Sales'} Offer Message (Optional)
                  </label>

                  <span
                    onClick={() => {
                      if (shopType === 'service') {
                        setServiceOfferMessage(currentOffer.trim());
                      } else {
                        setSalesOfferMessage(currentOffer.trim());
                      }
                      setCurrentOffer('');
                    }}
                    className="h-12 bg-black hover:bg-gray-700 border border-black hover:border-blue-500 text-white flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer font-semibold text-lg"
                  >
                    Add {shopType === 'service' ? 'Service' : 'Sales'} Offer
                  </span>
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
                        <span
                          onClick={() => {
                            if (shopType === 'service') {
                              setServiceOfferMessage('');
                            } else {
                              setSalesOfferMessage('');
                            }
                            setCurrentOffer('');
                          }}
                          className="h-12 bg-black hover:bg-gray-700 border border-black hover:border-red-500 text-red-500 flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer font-semibold text-lg gap-2"
                        >
                          🗑️ Remove Offer
                        </span>
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
                  <span
                    onClick={addCashier}
                    className={`h-12 bg-black hover:bg-gray-700 border border-black hover:border-purple-500 text-white flex items-center justify-center px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer font-semibold text-lg ${cashierLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    style={cashierLoading ? { pointerEvents: 'none' } : {}}
                  >
                    {cashierLoading ? 'Adding...' : '➕ Add Cashier'}
                  </span>
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
                                <span
                                  onClick={saveEditing}
                                  className="h-12 w-15 bg-black hover:bg-gray-700 border border-black hover:border-green-500 text-white flex items-center justify-center rounded-lg text-xl transition-all duration-200 cursor-pointer"
                                  title="Save changes"
                                >
                                  💾
                                </span>
                                <span
                                  onClick={cancelEditing}
                                  className="h-12 w-15 bg-black hover:bg-gray-700 border border-black hover:border-gray-500 text-white flex items-center justify-center rounded-lg text-xl transition-all duration-200 cursor-pointer"
                                  title="Cancel editing"
                                >
                                  ❌
                                </span>
                              </>
                            ) : (
                              <>
                                <span
                                  onClick={() => startEditing(name)}
                                  className="h-12 w-15 bg-black hover:bg-gray-700 border border-black hover:border-blue-500 text-white flex items-center justify-center rounded-lg text-xl transition-all duration-200 cursor-pointer"
                                  title="Edit cashier"
                                >
                                  ✏️
                                </span>
                                <span
                                  onClick={() => deleteCashier(name)}
                                  className="h-12 w-15 bg-black hover:bg-gray-700 border border-black hover:border-red-500 text-white flex items-center justify-center rounded-lg text-xl transition-all duration-200 cursor-pointer"
                                  title="Delete cashier"
                                >
                                  🗑️
                                </span>
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
              {/* LOCK SCREEN - Show when locked */}
              {!isDealersUnlocked && (
                <div className="bg-gradient-to-br  from-gray-900 to-black border-2 border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto mt-20">
                  {/* Lock Icon */}
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-3xl text-white">🔒</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Supplier Access</h2>
                    <p className="text-gray-400 text-sm">Enter password to manage suppliers</p>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        🔑 Access Password
                      </label>
                      <input
                        type="password"
                        value={dealersPassword}
                        onChange={(e) => {
                          setDealersPassword(e.target.value);
                          setDealersPasswordError('');
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            if (dealersPassword === DEALERS_PASSWORD) {
                              setIsDealersUnlocked(true);
                              setDealersPassword('');
                            } else {
                              setDealersPasswordError('❌ Incorrect password');
                            }
                          }
                        }}
                        placeholder="Enter access password"
                        className="w-full bg-gray-800 border-2 border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors duration-300 text-center font-semibold"
                        autoFocus
                      />
                    </div>

                    {/* Error Message */}
                    {dealersPasswordError && (
                      <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-3 text-center">
                        <span className="text-red-300 text-sm">{dealersPasswordError}</span>
                      </div>
                    )}

                    {/* Unlock Button */}
                    <button
                      onClick={() => {
                        if (dealersPassword === DEALERS_PASSWORD) {
                          setIsDealersUnlocked(true);
                          setDealersPassword('');
                        } else {
                          setDealersPasswordError('❌ Incorrect password');
                        }
                      }}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      🚀 Unlock Supplier Portal
                    </button>

                    {/* Security Note */}
                    <div className="text-center pt-4 border-t border-gray-700">
                      <p className="text-xs text-gray-500">
                        🔐 Secure supplier management area
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* DEALERS CONTENT - Show when unlocked */}
              {isDealersUnlocked && (
                <>
                  {/* Lock Button */}
                  <div className="flex justify-end">
                    <span
                      onClick={() => {
                        setIsDealersUnlocked(false);
                        setDealersPassword('');
                      }}
                      className="h-12 bg-black hover:bg-gray-700 border border-black hover:border-gray-500 text-white flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer font-semibold text-lg gap-2 shadow-lg"
                    >
                      🔒 Lock Suppliers
                    </span>
                  </div>

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
                        <span
                          onClick={() => {
                            setDealerForm({
                              name: '',
                              contact: '',
                              address: '',
                              gstNumber: '',
                            });
                            setEditingDealer(null);
                          }}
                          className="h-12 bg-black hover:bg-gray-700 border border-black hover:border-gray-500 text-white flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer font-semibold text-lg"
                        >
                          Cancel Edit
                        </span>
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
                            onChange={(e) => setDealerForm(prev => ({ ...prev, name: e.target.value }))}
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
                                setDealerForm(prev => ({ ...prev, contact: numbersOnly }));
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
                            onChange={(e) => setDealerForm(prev => ({ ...prev, address: e.target.value }))}
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
                            onChange={(e) => setDealerForm(prev => ({ ...prev, gstNumber: e.target.value.toUpperCase() }))}
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
                            onChange={(e) => setDealerPaymentForm(prev => ({ ...prev, totalAmount: e.target.value }))}
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
                            onChange={(e) => setDealerPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
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
                              value = value.replace(/[^\d/]/g, '');

                              if (value.length === 2 && !value.includes('/')) {
                                value = value + '/';
                              } else if (value.length === 5 && value.split('/').length === 2) {
                                value = value + '/';
                              }

                              if (value.length <= 10) {
                                setDealerPaymentForm(prev => ({ ...prev, date: value }));
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
                            <span className={`font-bold text-lg ${(parseFloat(dealerPaymentForm.totalAmount) - parseFloat(dealerPaymentForm.amount)) > 0
                              ? 'text-red-600'
                              : 'text-green-600'
                              }`}>
                              ₹{(parseFloat(dealerPaymentForm.totalAmount) - parseFloat(dealerPaymentForm.amount)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <span
                          onClick={addDealerPayment}
                          className="h-12 bg-black hover:bg-gray-700 border border-black hover:border-green-500 text-white flex items-center justify-center px-6 py-2 rounded-lg transition-all duration-200 cursor-pointer font-semibold text-lg gap-2"
                        >
                          💰 Add Payment
                        </span>
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
                                <th className="border border-orange-400 px-4 py-3 text-center font-bold text-white text-sm uppercase w-50">Details</th>
                                <th className="border border-orange-400 px-4 py-3 text-center font-bold text-white text-sm uppercase w-40">🔔 Send Alert</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dealers.slice().reverse().map((dealer, index) => {
                                const balanceInfo = getDealerBalanceInfo(dealer);
                                const isExpanded = expandedDealer === dealer._id;
                                const dealerStockItems = stockItems.filter(item => item.dealer?._id === dealer._id);

                                const totalStockCost = dealerStockItems.reduce((sum, item) => sum + (item.cost || 0), 0);
                                const gstAmount = totalStockCost * 0.18;
                                const totalWithGST = totalStockCost + gstAmount;

                                return (
                                  <>
                                    <tr
                                      key={dealer._id}
                                      className={`border-b border-gray-200 hover:bg-orange-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                        }`}
                                      onClick={(e) => {
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
                                        <div className={`font-bold text-lg ${balanceInfo.balance > 0 ? 'text-red-600' :
                                          balanceInfo.balance < 0 ? 'text-blue-600' : 'text-gray-600'
                                          }`}>
                                          ₹{Math.abs(balanceInfo.balance).toFixed(2)}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                          {balanceInfo.balance > 0 ? 'You Owe' :
                                            balanceInfo.balance < 0 ? 'You Get' : 'Settled'}
                                        </div>
                                      </td>

                                      <td className="border border-gray-300 px-4 py-3 text-center">
                                        <span
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedDealerForDetails(dealer);
                                            setShowPaymentDetails(true);
                                            fetchDealerPaymentDetails(dealer._id);
                                          }}
                                          className="h-12 w-30 bg-black hover:bg-gray-700 border border-black hover:border-purple-500 text-white flex items-center justify-center px-3 py-1 rounded-lg transition-all duration-200 cursor-pointer font-semibold text-base gap-2 mx-auto"
                                        >
                                          📊 Details
                                        </span>
                                      </td>

                                      <td className="border border-gray-300 px-4 py-3 text-center text-black no-expand">
                                        <DealerAlertSection
                                          dealer={dealer}
                                          onAlertSet={handleAlertSet}
                                          onAlertReset={handleAlertReset}
                                        />
                                      </td>
                                    </tr>

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
                                                      const itemGST = (stockItem.cost || 0) * 0.18;
                                                      const itemTotal = (stockItem.cost || 0) + itemGST;

                                                      return (
                                                        <tr
                                                          key={stockItem._id}
                                                          className={`border-b border-gray-200 hover:bg-blue-100 transition-colors duration-150 ${stockIndex % 2 === 0 ? 'bg-white' : 'bg-blue-50'
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
                                                            <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockItem.status === 'sold'
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

                  {/* Payment Details Modal */}
                  {showPaymentDetails && selectedDealerForDetails && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">
                              Payment Details - {selectedDealerForDetails.name}
                            </h3>
                            <span
                              onClick={() => {
                                setShowPaymentDetails(false);
                                setSelectedDealerForDetails(null);
                                setDealerPaymentDetails([]);
                              }}
                              className="h-10 w-10 bg-black hover:bg-gray-700 border border-black hover:border-gray-500 text-white flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer font-semibold text-2xl"
                            >
                              ×
                            </span>
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
                            <span
                              onClick={() => {
                                setShowPaymentDetails(false);
                                setSelectedDealerForDetails(null);
                                setDealerPaymentDetails([]);
                              }}
                              className="h-12 bg-black hover:bg-gray-700 border border-black hover:border-gray-500 text-white flex items-center justify-center px-6 py-2 rounded-lg transition-all duration-200 cursor-pointer font-semibold text-lg"
                            >
                              Close
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}


          {/* Customers Table */}
          {(activeTab === 'addCustomer' || (activeTab === 'filter' && (shopType === 'service' || (shopType === 'sales' && salesFilterTab === 'customer')))) && (<>
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
                    Total: {customers.filter(c => c.billType !== 'multi-brand').length} records
                  </div>
                </div>

                {customers.filter(c => c.billType !== 'multi-brand').length === 0 ? (
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
                              <th className="border border-orange-400 px-3 py-2 text-left font-bold text-white text-xs uppercase tracking-wider">Model</th> {/* ✅ ADDED MODEL COLUMN */}
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
                        {getCustomersWithDailyTotals()
                          .filter(item => {
                            if (item.type === 'dailyTotal') return true;
                            return item.data.billType !== 'multi-brand';
                          })
                          .map((item) => {
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
                                  <td colSpan={shopType === 'service' ? "12" : "10"} className="border border-gray-300 px-4 py-3 font-bold text-blue-800 text-center text-sm">
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
                                        {customer.model || 'N/A'} {/* ✅ ADDED MODEL DATA */}
                                      </td>
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
                                        className={`border border-gray-200 px-3 py-2 cursor-pointer transition-all duration-200 ${customer.showIssue ? 'bg-orange-50' : ''
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
                                          className={`px-2 py-1 rounded-lg text-xs font-semibold border-0 focus:ring-1 focus:ring-orange-300 cursor-pointer transition-all duration-200 ${customer.status === 'paid'
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
                                          className={`w-20 text-blue-600 font-semibold text-center border border-gray-300 rounded px-1 py-1 focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${customer.status === 'returned' ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''
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
                                          <div className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${customer.paymentMode === 'cash'
                                            ? 'bg-green-50 text-green-700 border-l-4 border-green-500' :
                                            customer.paymentMode === 'gpay'
                                              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' :
                                              'bg-purple-50 text-purple-700 border-l-4 border-purple-500'
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${customer.paymentMode === 'cash' ? 'bg-green-500' :
                                              customer.paymentMode === 'gpay' ? 'bg-blue-500' :
                                                'bg-purple-500'
                                              }`}></div>
                                            {customer.paymentMode === 'cash' ? 'Cash' :
                                              customer.paymentMode === 'gpay' ? 'Gpay' :
                                                `EMI-${getFinanceCompanyShortCode(customer.financeCompany)}`} {/* ✅ Use short code here */}
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
                                        <span
                                          onClick={() => handleAction(customer._id, 'print')}
                                          className="w-15 h-10 bg-black hover:bg-black border border-black hover:border-blue-500 justify-center rounded-lg text-xl text-white px-2 py-1 transition-all duration-200 font-semibold shadow hover:shadow-sm flex items-center gap-1"
                                          title={`Print ${customer.shopType === 'service' ? '4 Inch' : 'A4'} Bill`}
                                        >
                                          🖨️
                                        </span>

                                        {/* Download Button */}
                                        <span
                                          onClick={() => handleAction(customer._id, 'download')}
                                          className="w-15 h-10 bg-black hover:bg-black border border-black hover:border-green-500 justify-center rounded-lg text-xl text-white px-2 py-1 transition-all duration-200 font-semibold shadow hover:shadow-sm flex items-center gap-1"
                                          title="Download A4 PDF"
                                        >
                                          ⬇️
                                        </span>

                                        {/* WhatsApp Button */}
                                        <span
                                          onClick={() => handleWhatsAppPDF(customer._id)}
                                          className="w-15 h-10 bg-black hover:bg-black border border-black hover:border-green-500 justify-center rounded-lg text-xl text-white px-2 py-1 transition-all duration-200 font-semibold shadow hover:shadow-sm flex items-center gap-1"
                                          title="Send via WhatsApp"
                                        >
                                          ✅
                                        </span>
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

{/* Service Income Summary */}
{shopType === 'service' && (
  <div className="bg-white rounded-xl p-4 shadow-lg mt-4 border border-orange-200">
    {/* Header - Title centered */}
    <div className="relative mb-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">💰</span>
          <h3 className="text-lg font-bold text-gray-800">
            SERVICE INCOME SUMMARY
          </h3>
        </div>
      </div>
      
      {/* Password section - Right side */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
        {!unlockedSummaries.service ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="password"
                value={summaryPasswords.service}
                onChange={(e) => handleSummaryPasswordChange('service', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSummaryPasswordSubmit('service')}
                placeholder="Enter password"
                className={`w-40 h-10 border text-black rounded-lg px-3 py-2 focus:outline-none ${
                  summaryPasswordErrors.service === 'incorrect'
                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-gray-300 focus:border-[#8b1108]'
                }`}
              />
            </div>
<span
  onClick={() => handleSummaryPasswordSubmit('service')}
  className="h-10 bg-[#8b1108] text-white px-4 py-2 rounded-lg hover:bg-[#a8322a] transition-colors font-medium cursor-pointer flex items-center justify-center"
>
  Apply
</span>
          </div>
        ) : (
<span
  onClick={() => lockSummary('service')}
  className="h-10 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2 cursor-pointer justify-center"
>
  🔒 Lock
</span>
        )}
      </div>
    </div>
    
    {/* Summary Content - Only show when unlocked */}
    {unlockedSummaries.service ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 transform hover:scale-105 transition-transform duration-300">
          <div className="text-xl font-bold mb-2 text-gray-800">
            ₹{profitData.service.todayIncome.toFixed(2)}
          </div>
          <div className="text-sm font-semibold mb-1 text-gray-700">Today's Income</div>
          <div className="text-xs text-gray-600">Paid amounts today</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 transform hover:scale-105 transition-transform duration-300">
          <div className="text-xl font-bold mb-2 text-red-600">
            ₹{profitData.service.pendingBalance.toFixed(2)}
          </div>
          <div className="text-sm font-semibold mb-1 text-gray-700">Pending Balance</div>
          <div className="text-xs text-gray-600">Awaiting payment</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 transform hover:scale-105 transition-transform duration-300">
          <div className="text-xl font-bold mb-2 text-green-600">
            ₹{profitData.service.totalRevenue.toFixed(2)}
          </div>
          <div className="text-sm font-semibold mb-1 text-gray-700">Service Income</div>
          <div className="text-xs text-gray-600">Total service revenue</div>
        </div>
      </div>
    ) : (
      <div className="text-center py-6">
        <div className="text-4xl mb-2">🔒</div>
        {summaryPasswordErrors.service ? (
          <p className="text-red-500 font-medium">Incorrect password! Enter correct password to view service income summary</p>
        ) : (
          <p className="text-gray-500">Enter password to view service income summary</p>
        )}
        <p className="text-sm text-gray-400 mt-1">Password: Baaba@2</p>
      </div>
    )}
  </div>
)}

{/* Sales Income Summary */}
{shopType === 'sales' && activeTab !== 'multibrand' && (
  <div className="bg-white rounded-xl p-4 shadow-lg mt-4 border border-orange-200">
    {/* Header - Title centered */}
    <div className="relative mb-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">💰</span>
          <h3 className="text-lg font-bold text-gray-800">
            SALES INCOME SUMMARY
          </h3>
        </div>
      </div>
      
      {/* Password section - Right side */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
        {!unlockedSummaries.sales ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="password"
                value={summaryPasswords.sales}
                onChange={(e) => handleSummaryPasswordChange('sales', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSummaryPasswordSubmit('sales')}
                placeholder="Enter password"
                className={`w-40 h-10 border text-black rounded-lg px-3 py-2 focus:outline-none ${
                  summaryPasswordErrors.sales === 'incorrect'
                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-gray-300 focus:border-[#8b1108]'
                }`}
              />
            </div>
<span
  onClick={() => handleSummaryPasswordSubmit('sales')}
  className="h-10 bg-[#8b1108] text-white px-4 py-2 rounded-lg hover:bg-[#a8322a] transition-colors font-medium cursor-pointer flex items-center justify-center"
>
  Apply
</span>
          </div>
        ) : (
<span
  onClick={() => lockSummary('sales')}
  className="h-10 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2 cursor-pointer justify-center"
>
  🔒 Lock
</span>
        )}
      </div>
    </div>
    
    {/* Summary Content - Only show when unlocked */}
    {unlockedSummaries.sales ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 transform hover:scale-105 transition-transform duration-300">
          <div className="text-2xl font-bold mb-2 text-green-600">
            ₹{profitData.sales.totalRevenue.toFixed(2)}
          </div>
          <div className="text-sm font-semibold mb-1 text-gray-700">Sales Income</div>
          <div className="text-xs text-gray-600">Total sales revenue</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 transform hover:scale-105 transition-transform duration-300">
          <div className={`text-2xl font-bold mb-2 ${profitData.sales.dailyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{profitData.sales.dailyProfit.toFixed(2)}
          </div>
          <div className="text-sm font-semibold mb-1 text-gray-700">Daily Profit</div>
          <div className="text-xs text-gray-600">Today's profit margin</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 transform hover:scale-105 transition-transform duration-300">
          <div className={`text-2xl font-bold mb-2 ${profitData.sales.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{profitData.sales.monthlyProfit.toFixed(2)}
          </div>
          <div className="text-sm font-semibold mb-1 text-gray-700">Monthly Profit</div>
          <div className="text-xs text-gray-600">This month's profit</div>
        </div>
      </div>
    ) : (
      <div className="text-center py-6">
        <div className="text-4xl mb-2">🔒</div>
        {summaryPasswordErrors.sales ? (
          <p className="text-red-500 font-medium">Incorrect password! Enter correct password to view sales income summary</p>
        ) : (
          <p className="text-gray-500">Enter password to view sales income summary</p>
        )}
        <p className="text-sm text-gray-400 mt-1">Password: Baaba!1</p>
      </div>
    )}
  </div>
)}

          </>
          )}
        </>
      )}

      {/* Stock Records Table with Password Protection */}
      {activeTab === 'filter' && shopType === 'sales' && salesFilterTab === 'stock' && (
        <>
          {!unlockedSections.salesStockTable ? (
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto mt-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl text-white">🔒</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Stock Records Access</h2>
                <p className="text-gray-400 text-sm">Enter password to view stock records</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    🔑 Access Password
                  </label>
                  <input
                    type="password"
                    value={passwords.salesStockTable}
                    onChange={(e) => handlePasswordChange('salesStockTable', e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handlePasswordSubmit('salesStockTable');
                      }
                    }}
                    placeholder="Enter access password"
                    className="w-full bg-gray-800 border-2 border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors duration-300 text-center font-semibold"
                    autoFocus
                  />
                </div>

                {passwordErrors.salesStockTable && (
                  <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-3 text-center">
                    <span className="text-red-300 text-sm">{passwordErrors.salesStockTable}</span>
                  </div>
                )}

                <button
                  onClick={() => handlePasswordSubmit('salesStockTable')}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  🚀 Unlock Stock Records
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Lock Button */}
              <div className="flex justify-end mb-4">
                <span
                  onClick={() => lockSection('salesStockTable')}
                  className="h-12 bg-black hover:bg-gray-700 border border-black hover:border-gray-500 text-white flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer font-semibold text-lg gap-2 shadow-lg"
                >
                  🔒 Lock Stock Records
                </span>
              </div>

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
                                      <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockItem.status === 'sold'
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
            </>
          )}
        </>
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
              onChange={(e) => setAccessoryForm(prev => ({ ...prev, type: e.target.value }))}
              className="border text-black border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="investment">💰 Investment</option>
              <option value="sale">🛒 Sale</option>
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={accessoryForm.amount}
              onChange={(e) => setAccessoryForm(prev => ({ ...prev, amount: e.target.value }))}
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

                setAccessoryForm(prev => ({ ...prev, date: input }));
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
                    setAccessoryForm(prev => ({ ...prev, date: correctedDate }));
                  }
                }
              }}
              placeholder="DD/MM/YYYY"
              className="border text-black border-gray-300 rounded-lg px-3 py-2"
            />

            <span
              onClick={addAccessoryTransaction}
              className="h-12 bg-black hover:bg-gray-700 border border-black hover:border-orange-500 text-white flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer font-semibold text-lg"
            >
              Add
            </span>
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

              <div className="flex items-center gap-1">
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
                <span
                  onClick={handleApplyAccessoryFilter}
                  className="h-10 bg-black hover:bg-gray-700 border border-black hover:border-green-500 text-white flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer font-medium text-lg"
                >
                  Apply
                </span>
                <span
                  onClick={handleResetAccessoryFilter}
                  className="h-10 bg-black hover:bg-gray-700 border border-black hover:border-gray-500 text-white flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer font-medium text-lg"
                >
                  Reset
                </span>
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
                              className={`border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
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
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${transaction.type === 'investment'
                                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                  : 'bg-teal-100 text-teal-700 border border-teal-200'
                                  }`}>
                                  {transaction.type === 'investment' ? '💰 Investment' : '🛒 Sale'}
                                </span>
                              </td>
                              <td className={`border border-gray-300 px-4 py-3 text-center font-semibold ${transaction.type === 'investment' ? 'text-purple-600' : 'text-teal-600'
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