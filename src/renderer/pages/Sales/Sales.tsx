//--------------------------------------------------------------------
// PÁGINA DE VENDAS (PDV)
// Sistema de vendas com suporte a atalhos de teclado
// Usa estilos do sistema atual (macStyles)
//--------------------------------------------------------------------
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch,
  FaPlus,
  FaTrash,
  FaCheck,
  FaTimes,
  FaKeyboard,
  FaUser,
  FaEdit,
  FaCalculator
} from 'react-icons/fa';

// Importação dos estilos do sistema atual
// Nota: Este arquivo usa styled-components e CSS variables do sistema

// Importação das formatações de moeda e quantidade
import { 
  convertReaisToCents, 
  convertCentsToReais, 
  formatMoneyInput 
} from '../../utils/money';
import { formatCurrency } from '../../styles/formatters';
import {
  formatFractionalQuantity,
  formatQuantityByUnitType,
  getInitialQuantityByUnitType,
  convertQuantityToNumber,
  normalizeUnitType,
  getQuantityPlaceholderByUnitType
} from '../../utils/quantityFormater';

// Importação do contexto de alerta customizado do sistema
import { useAlert, showAlert as showCustomAlert } from '../../components';
import CustomerSearchDropdown from '../../components/Customer/CustomerSearchDropdown';
import ProductSearchInput, { Product as ProductSearchInputProduct } from '../../components/Product/ProductSearchInput';
import ProductSearchModal from '../../components/Product/ProductSearchModal';
import EditSaleItemModal from '../../components/Sale/EditSaleItemModal';
import CustomerCPFModal from '../../components/Customer/CustomerCPFModal';
import DiscountModal, { DiscountData } from '../../components/Sale/DiscountModal';
import SalePaymentModal, { PaymentItem } from '../../components/Sale/SalePaymentModal';
import QuickPaymentModal from './components/QuickPaymentModal';
import OtherPaymentMethodsModal from './components/OtherPaymentMethodsModal';
import SaleFinalizationModal from './components/SaleFinalizationModal';
import CustomerSearchModal from '../../components/Customer/CustomerSearchModal';
import SalesSidebar from './components/SalesSidebar';
import SalesProductForm from './components/SalesProductForm';
import RemoveEditProductModal from './components/RemoveEditProductModal';

//--------------------------------------------------------------------
// INTERFACES
// Interfaces para o sistema de vendas
//--------------------------------------------------------------------

// Interface de Cliente (simplificada para o PDV)
interface Customer {
  id: number;
  code?: number;
  name: string;
  nickname?: string;
  entityType?: number;
  entityRegistryNumber?: string;
  generalRegistration?: string;
  info?: string;
  street?: string;
  number?: number;
  complement?: string;
  district?: string;
  zip?: string;
  stateId?: any;
  cityId?: any;
  email?: string;
  mobile?: string;
  phone?: string;
}

interface Product {
  id: string;
  name: string;
  code: string;
  price: number; // em centavos
  stock: number;
  unitType: '0' | '1'; // 0 = fracionado, 1 = inteiro
  barcode: string;
  reference: string;
  stockPV?: number;
  stockLJ?: number;
  estoquePV?: number;
  estoqueLJ?: number;
  wholesalePrices?: any[];
  parentId?: string;
  isVariation: boolean;
  parentName?: string;
  variationDescription?: string;
  originalProduct: any;
}

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number; // em centavos
  subtotal: number; // em centavos
}

//--------------------------------------------------------------------
// ANIMAÇÕES
// Definição de animações para melhorar a experiência do usuário
//--------------------------------------------------------------------

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Container global para animações
const GlobalScrollbarHide = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--primary-bg);
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

//--------------------------------------------------------------------
// ESTILOS DOS COMPONENTES
// Estilos
//--------------------------------------------------------------------

// Container principal da página
const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${fadeInUp} 0.6s ease-out;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`;

// Header da página com título, botão de cliente e botão de voltar
const PageHeader = styled.div`
  height: 44px;
  background: var(--panel);
  border-bottom: 1px solid var(--panel-stroke);
  backdrop-filter: blur(22px) saturate(160%);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  box-shadow: var(--shadow-light);
  margin-bottom: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  animation: ${slideInFromLeft} 0.8s ease-out;
  position: relative;
  z-index: 10;
  display: flex;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

// Título da página
const PageTitle = styled.h1`
  color: var(--text-primary);
  font-size: 2.2rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-transform: uppercase;
`;

// Botão de cliente
const CustomerButton = styled.button<{ $hasCustomer: boolean }>`
  background: ${(props: { $hasCustomer: boolean }) => props.$hasCustomer ? 'var(--accent)' : 'linear-gradient(to bottom, #f5f5f5, #e8e8e8)'};
  color: ${(props: { $hasCustomer: boolean }) => props.$hasCustomer ? 'white' : 'rgba(0, 0, 0, 0.7)'};
  border: 1px solid ${(props: { $hasCustomer: boolean }) => props.$hasCustomer ? 'var(--accent)' : 'rgba(0, 0, 0, 0.2)'};
  border-radius: var(--border-radius-medium);
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition-fast);
  font-weight: 500;
  font-size: 13px;
  height: 38px;
  animation: ${slideInFromLeft} 0.6s ease-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-transform: uppercase;
  
  &:hover {
    background: ${(props: { $hasCustomer: boolean }) => props.$hasCustomer ? 'linear-gradient(to bottom, #0056b3, #004494)' : 'linear-gradient(to bottom, #f8f8f8, #e0e0e0)'};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.2);
  }
`;

const BackButton = styled.button`
  background: linear-gradient(to bottom, #f5f5f5, #e8e8e8);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: var(--border-radius-medium);
  color: rgba(0, 0, 0, 0.7);
  font-size: 13px;
  font-weight: 500;
  padding: 8px 16px;
  cursor: pointer;
  transition: var(--transition-fast);
  animation: ${slideInFromLeft} 0.6s ease-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-transform: uppercase;
  
  &:hover {
    background: linear-gradient(to bottom, #f8f8f8, #e0e0e0);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.2);
  }
`;

// Container principal do conteúdo com layout de duas colunas
const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: 0 24px;
  gap: 20px;
  overflow: visible;
  animation: ${fadeInUp} 1s ease-out 0.2s both;
  min-height: 0;
  height: 100%;
  
  /* Responsividade para telas menores */
  @media (max-width: 1200px) {
    padding: 0 16px;
    gap: 16px;
  }
  
  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 0 12px;
    gap: 12px;
  }
`;

// Estilos da sidebar e formulário movidos para componentes separados

// Coluna direita com conteúdo atual
const RightContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  min-height: 0;
  height: 100%;
  min-width: 0;
  
  @media (max-width: 1200px) {
    gap: 16px;
  }
  
  @media (max-width: 1024px) {
    gap: 12px;
  }
`;


// Lista de produtos no carrinho - IGUAL AO PDV
const CartContainer = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: var(--border-radius-large);
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  animation: ${fadeInUp} 1.4s ease-out 0.6s both;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
`;

// Tabela de produtos - IGUAL AO PDV
const ProductTable = styled.div`
  flex: 1;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: var(--border-radius-medium);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  max-height: 100%;
`;

const TableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  height: 100%;
  
  &::-webkit-scrollbar {
    width: 6px;
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 0.8fr 1fr;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 2.1rem; 
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-transform: uppercase;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  /* Responsividade para tabela */
  @media (max-width: 1200px) {
    font-size: 2rem;
    gap: 8px;
    padding: 8px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
    grid-template-columns: 2fr 1fr 0.6fr 1fr;
    gap: 4px;
    padding: 4px;
  }
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 0.8fr 1fr;
  gap: 16px;
  padding: 16px;
  background: rgba(246, 246, 246, 0.95);
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-transform: uppercase;
  
  /* Responsividade para cabeçalho da tabela */
  @media (max-width: 1200px) {
    font-size: 12px;
    gap: 8px;
    padding: 8px;
  }
  
  @media (max-width: 768px) {
    font-size: 11px;
    grid-template-columns: 2fr 1fr 0.6fr 1fr;
    gap: 4px;
    padding: 4px;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: var(--border-radius-medium);
  transition: var(--transition-fast);
  
  &:hover {
    color: #FF3B30;
    background: rgba(220, 53, 69, 0.1);
    transform: scale(1.1);
  }
`;

// Footer com total e botões de ação
const Footer = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: var(--border-radius-large);
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  animation: ${fadeInUp} 1.6s ease-out 0.8s both;
  margin: 0 24px 16px 24px;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;



// Botões de formas de pagamento
const PaymentButtonsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 1400px) {
    gap: 16px;
  }
  
  @media (max-width: 1200px) {
    gap: 12px;
  }
  
  @media (max-width: 1024px) {
    gap: 8px;
  }
`;

// Dicas de atalho (apenas texto, sem borda/ícone), maiores que as de baixo
const PaymentHint = styled.span`
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  user-select: none;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-transform: uppercase;
  
  @media (max-width: 1400px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 1200px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 1024px) {
    font-size: 0.8rem;
  }
`;

const ShortcutHint = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-transform: uppercase;
  
  @media (max-width: 1200px) {
    font-size: 0.7rem;
  }
  
  @media (max-width: 1024px) {
    font-size: 0.65rem;
  }
`;

//--------------------------------------------------------------------
// FUNÇÕES AUXILIARES
// Funções para carregar e processar produtos da API
//--------------------------------------------------------------------

// Converte Product para ProductSearchInput
const convertToSearchInputProduct = (product: Product): ProductSearchInputProduct => ({
  id: Number(product.id),
  name: product.name,
  price: product.price,
  stock: product.stock,
  unit: product.unitType === '0' ? 'UN' : 'KG', // Adaptar conforme necessário
  unitType: product.unitType,
  barcode: product.barcode,
  reference: product.reference,
  stockPV: product.stockPV,
  stockLJ: product.stockLJ,
  estoquePV: product.estoquePV,
  estoqueLJ: product.estoqueLJ,
  wholesalePrices: product.wholesalePrices?.map(wp => ({
    id: wp.id || '',
    quantity: wp.quantity || 0,
    price: wp.price || 0
  })) || [],
  parentId: product.parentId ? Number(product.parentId) : undefined
});

// Converte ProductSearchInput para Product
const convertFromSearchInputProduct = (product: ProductSearchInputProduct): Product => ({
  id: String(product.id),
  name: product.name,
  code: String(product.id),
  price: product.price,
  stock: product.stock,
  unitType: product.unitType,
  barcode: product.barcode,
  reference: product.reference,
  stockPV: product.stockPV,
  stockLJ: product.stockLJ,
  estoquePV: product.estoquePV,
  estoqueLJ: product.estoqueLJ,
  wholesalePrices: product.wholesalePrices,
  parentId: product.parentId ? String(product.parentId) : undefined,
  isVariation: false, // Será definido pela lógica de busca
  parentName: undefined,
  variationDescription: undefined,
  originalProduct: product
});

// Obtém produtos da API (comentado - usar dados mockados ou implementar serviço)
const getProductsFromAPI = async (): Promise<Product[]> => {
  try {
    // TODO: Implementar carregamento de produtos da API
    // Quando os serviços estiverem disponíveis, descomentar e implementar
    console.log('getProductsFromAPI: Serviços de API não implementados');
    return [];
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    return [];
  }
};

//--------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// Página de vendas
//--------------------------------------------------------------------
const Sales: React.FC = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Ref do campo de quantidade para controle de foco pós-seleção de produto
  const quantityInputRef = useRef<HTMLInputElement>(null);
  
  // Estados da aplicação
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState(convertCentsToReais(0));
  const [subtotal, setSubtotal] = useState(convertCentsToReais(0));
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerSearchModalOpen, setIsCustomerSearchModalOpen] = useState(false);
  
  // Estados para busca de produtos (IGUAL AO PDV)
  const [products, setProducts] = useState<Product[]>([]);
  const [searchInputProducts, setSearchInputProducts] = useState<ProductSearchInputProduct[]>([]);
  const [isProductSearchModalOpen, setIsProductSearchModalOpen] = useState(false);
  const [initialSearchTerm, setInitialSearchTerm] = useState('');

  // Estados para os novos modais
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [isCPFModalOpen, setIsCPFModalOpen] = useState(false);
  const [customerCPF, setCustomerCPF] = useState('');
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState<DiscountData | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isQuickPaymentOpen, setIsQuickPaymentOpen] = useState(false);
  const [quickPaymentName, setQuickPaymentName] = useState('');
  const [quickPaymentMethodId, setQuickPaymentMethodId] = useState<string | null>(null);
  const [isOtherPaymentsOpen, setIsOtherPaymentsOpen] = useState(false);
  const [quickPayments, setQuickPayments] = useState<PaymentItem[]>([]);
  const [isFinalizationModalOpen, setIsFinalizationModalOpen] = useState(false);
  const [paymentMethodsCache, setPaymentMethodsCache] = useState<any[]>([]);
  const [isRemoveEditModalOpen, setIsRemoveEditModalOpen] = useState(false);

  // Foco automático no campo de pesquisa ao abrir a página
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Carregar produtos da API quando o componente montar (IGUAL AO PDV)
  useEffect(() => {
    const loadProducts = async () => {
      
      const loadedProducts = await getProductsFromAPI();
      
      setProducts(loadedProducts);
      
      // Converter para formato do ProductSearchInput
      const convertedProducts = loadedProducts.map(convertToSearchInputProduct);
      setSearchInputProducts(convertedProducts);
    };
    loadProducts();
  }, []);

  // Carregar formas de pagamento ao montar o componente (comentado - API não disponível)
  useEffect(() => {
    // TODO: Implementar carregamento de formas de pagamento quando API estiver disponível
    // const loadPaymentMethods = async () => {
    //   try {
    //     const methods = await PaymentMethodService.getActive();
    //     setPaymentMethodsCache(methods);
    //   } catch (error) {
    //     console.error('Erro ao carregar formas de pagamento:', error);
    //   }
    // };
    // loadPaymentMethods();
    console.log('Formas de pagamento: API não implementada');
  }, []);

  // Ajusta a quantidade padrão sempre que a unidade do produto selecionado mudar
  useEffect(() => {
    if (selectedProduct) {
      setQuantity(getInitialQuantityByUnitType(selectedProduct.unitType));
    }
  }, [selectedProduct?.unitType]);

  // Atualiza o subtotal quando quantidade ou preço unitário mudam
  useEffect(() => {
    const quantityNum = convertQuantityToNumber(quantity, selectedProduct?.unitType ?? '1') || 0;
    const priceInCents = convertReaisToCents(unitPrice);
    const subtotalInCents = Math.round(quantityNum * priceInCents);
    setSubtotal(convertCentsToReais(subtotalInCents));
  }, [quantity, unitPrice, selectedProduct]);

  // Calcula o total do carrinho
  const cartSubtotal = cartItems.reduce((total, item) => total + item.subtotal, 0);
  const cartTotal = currentDiscount ? currentDiscount.finalTotal : cartSubtotal;
  const quickPaidTotal = quickPayments.reduce((t, p) => t + p.amount, 0);
  const remainingToPay = Math.max(0, cartTotal - quickPaidTotal);
  const quickChange = quickPaidTotal > cartTotal ? (quickPaidTotal - cartTotal) : 0;
  // Abre modal rápido por método
  const openQuickPayment = (name: string, methodId?: string) => {
    if (cartItems.length === 0) {
      showAlert('⚠️ Adicione produtos ao carrinho antes de finalizar', 'warning');
      return;
    }
    setQuickPaymentName(name);
    setQuickPaymentMethodId(methodId ?? null);
    setIsQuickPaymentOpen(true);
  };

  // Confirmação do modal rápido adiciona um pagamento e abre o modal completo para concluir/confirmar
  const handleQuickPaymentConfirm = async (amountInCents: number) => {
    setIsQuickPaymentOpen(false);
    if (amountInCents <= 0) {
      showAlert('Informe um valor maior que zero', 'warning');
      return;
    }

    try {
      let methodIdStr: string | null = quickPaymentMethodId;
      if (!methodIdStr) {
        // Usar cache se disponível, senão buscar da API (comentado - API não disponível)
        let methods = paymentMethodsCache;
        // TODO: Implementar busca de formas de pagamento quando API estiver disponível
        // if (methods.length === 0) {
        //   methods = await PaymentMethodService.getActive();
        //   setPaymentMethodsCache(methods);
        // }
        
        // Normalizar nome para busca (remover acentos, espaços extras, etc)
        const normalizeName = (name: string) => 
          name.trim()
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
            .replace(/\s+/g, '') // remove todos os espaços
            .replace(/[^a-z0-9]/g, ''); // remove caracteres especiais
        
        const searchName = normalizeName(quickPaymentName);
        const found = methods.find((m: any) => {
          const methodName = normalizeName(String(m.name));
          return methodName === searchName || methodName.includes(searchName) || searchName.includes(methodName);
        });
        
        if (!found) {
          console.error('Métodos disponíveis:', methods.map((m: any) => m.name));
          console.error('Buscando por:', quickPaymentName, '(normalizado:', searchName, ')');
          showAlert(`Forma de pagamento não encontrada: "${quickPaymentName}". Verifique o cadastro de formas de pagamento.`, 'error');
          return;
        }
        console.log(`Forma de pagamento encontrada: "${found.name}" (ID: ${found.id})`);
        methodIdStr = String(found.id);
      }

      const newPayment: PaymentItem = {
        paymentMethodId: methodIdStr as string,
        paymentMethodName: quickPaymentName,
        amount: amountInCents
      };

      const newPayments = [...quickPayments, newPayment];
      const newTotalPaid = newPayments.reduce((t, p) => t + p.amount, 0);
      const newRemaining = Math.max(0, cartTotal - newTotalPaid);
      const newChange = newTotalPaid > cartTotal ? (newTotalPaid - cartTotal) : 0;

      setQuickPayments(newPayments);

      // Se cobriu o total, abrir modal de finalização
      if (newTotalPaid >= cartTotal) {
        setIsFinalizationModalOpen(true);
      } else {
        // Se ainda falta, mostrar restante e voltar para tela
        showAlert(
          `Pagamento registrado em ${quickPaymentName}: ${convertCentsToReais(amountInCents)}. Restante: ${convertCentsToReais(newRemaining)}`,
          'info'
        );
      }
    } catch (err) {
      showAlert('Erro ao registrar pagamento', 'error');
    }
  };
  
  // Variáveis para exibição na sidebar
  const discountPercentage = currentDiscount && currentDiscount.isDiscount ? 
    Math.round((currentDiscount.discountAmount / cartSubtotal) * 100) : 0;
  const discountValue = currentDiscount && currentDiscount.isDiscount ? 
    Math.abs(currentDiscount.discountAmount) : 0;
  const discountAmount = currentDiscount && currentDiscount.isDiscount ? 
    Math.abs(currentDiscount.discountAmount) : 0;
  const finalTotal = cartTotal;

  // Seleciona produto
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setIsProductSearchModalOpen(false);
    
    // Definir quantidade padrão baseada no tipo da unidade (utilitário central)
    setQuantity(getInitialQuantityByUnitType(product.unitType));
    
    // Definir preço unitário e subtotal
    // Todos os preços agora estão em reais, converter para centavos
    const priceCents = Math.round((product.price || 0) * 100);
    setUnitPrice(convertCentsToReais(priceCents));
    setSubtotal(convertCentsToReais(priceCents));
    
    // Focar automaticamente no campo de quantidade (fluxo ideal do PDV)
    // Uso de ref direta evita disputas de foco com outros inputs (ex.: cliente)
    setTimeout(() => {
      if (quantityInputRef.current) {
        quantityInputRef.current.focus();
        quantityInputRef.current.select();
      }
    }, 50);
  };

  // Seleciona produto do ProductSearchInput
  const handleProductSearchSelect = (product: ProductSearchInputProduct) => {
    const convertedProduct = convertFromSearchInputProduct(product);
    handleSelectProduct(convertedProduct);
  };

  // Abre modal de pesquisa do ProductSearchInput
  const handleProductSearch = () => {
      setInitialSearchTerm(searchTerm);
        setIsProductSearchModalOpen(true);
  };

  // Limpa seleção do ProductSearchInput
  const handleClearProductSelection = () => {
          setSelectedProduct(null);
    setSearchTerm('');
  };


  // Funções antigas removidas - agora usando ProductSearchInput

  // Eventos de teclado - quantidade
  const handleQuantityInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Focar no campo de preço unitário
      const priceField = document.querySelector('input[placeholder="' + convertCentsToReais(0) + '"]') as HTMLInputElement;
      if (priceField) {
        priceField.focus();
        priceField.select();
      }
    }
  };

  // Eventos de teclado - preço
  const handlePriceInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddProduct();
    }
  };

  // Eventos de teclado - subtotal
  const handleSubtotalInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddProduct();
    }
  };

  // Formata quantidade do item do carrinho
  const formatCartItemQuantity = (item: CartItem): string => {
    if (item.product.unitType === '0') {
      // Formatar como fracionado
      return item.quantity.toFixed(3).replace('.', ',');
    } else {
      // Formatar como inteiro
      return item.quantity.toString();
    }
  };

  // Calcula subtotal
  const calculateSubtotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  // Handlers de eventos

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const unitType = selectedProduct?.unitType ?? '1';
    value = formatQuantityByUnitType(value, unitType);
    setQuantity(value);
  };

  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Aplicar formatação monetária em tempo real usando formatMoneyInput
    const formattedValue = formatMoneyInput(rawValue);
    setUnitPrice(formattedValue);
  };

  const handleSubtotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Aplicar formatação monetária em tempo real usando formatMoneyInput
    const formattedValue = formatMoneyInput(rawValue);
    setSubtotal(formattedValue);
    
    // Recalcula o preço unitário baseado no subtotal e quantidade
    const quantityNum = convertQuantityToNumber(quantity, selectedProduct?.unitType ?? '1') || 1;
    const subtotalInCents = convertReaisToCents(formattedValue);
    const newUnitPrice = subtotalInCents / quantityNum;
    setUnitPrice(convertCentsToReais(newUnitPrice));
  };


  const handleAddProduct = () => {
    if (!selectedProduct) {
      showAlert('Selecione um produto primeiro', 'warning');
      return;
    }

    const quantityNum = parseFloat(quantity.replace(',', '.')) || 0;
    if (quantityNum <= 0) {
      showAlert('Quantidade deve ser maior que zero', 'warning');
      return;
    }

    const priceInCents = convertReaisToCents(unitPrice);
    if (priceInCents <= 0) {
      showAlert('Preço deve ser maior que zero', 'warning');
      return;
    }

    const subtotalInCents = Math.round(quantityNum * priceInCents);

    const newItem: CartItem = {
      id: `${selectedProduct.id}-${Date.now()}`,
      product: selectedProduct,
      quantity: quantityNum,
      unitPrice: priceInCents,
      subtotal: subtotalInCents
    };

    setCartItems(prev => [...prev, newItem]);
    
    // Limpa os campos para próxima entrada
    setSearchTerm('');
    setQuantity('1');
    setUnitPrice(convertCentsToReais(0));
    setSubtotal(convertCentsToReais(0));
    setSelectedProduct(null);
    
    // Foca no campo de pesquisa
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    showAlert('Produto removido do carrinho', 'info');
    
    // Focar no campo de pesquisa após remover
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  // Handler para editar item (quantidade e/ou preço) do modal de remover/editar
  const handleEditItemQuantity = (itemId: string, newQuantity: number, newUnitPrice: number, newSubtotal: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: newQuantity,
          unitPrice: newUnitPrice,
          subtotal: newSubtotal
        };
      }
      return item;
    }));
    showAlert('Produto atualizado com sucesso', 'success');
  };

  const handleFinishSale = () => {
    if (cartItems.length === 0) {
      showAlert('⚠️ Adicione produtos ao carrinho antes de finalizar', 'warning');
      return;
    }
    
    // Abre modal de pagamento
    setIsPaymentModalOpen(true);
  };

  const handleCancelSale = async () => {
    if (cartItems.length > 0 || selectedCustomer) {
      // Confirmar cancelamento quando houver itens/cliente
      const confirmed = await showCustomAlert({
        title: 'Confirmação',
        message: 'Tem certeza que deseja cancelar esta venda? Todos os itens serão removidos.',
        type: 'warning',
        confirmButtonText: 'SIM',
        cancelButtonText: 'NÃO'
      });

      if (!confirmed) return;

      // Cancelar venda após confirmação
      setCartItems([]);
      setSelectedCustomer(null); // Limpar cliente também
      setCustomerCPF('');
      setCurrentDiscount(null);
      setQuickPayments([]);
      showAlert('🗑️ Venda cancelada! Pronto para nova venda.', 'info');
      // NÃO navega - permanece na tela para nova venda
    } else {
      navigate('/operacoes');
    }
  };

  // Handlers de teclas de atalho
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Não processar atalhos se houver algum modal aberto
      const hasModalOpen = isProductSearchModalOpen || isEditItemModalOpen || isCPFModalOpen || 
                           isDiscountModalOpen || isPaymentModalOpen || isQuickPaymentOpen || 
                           isOtherPaymentsOpen || isFinalizationModalOpen || isCustomerSearchModalOpen ||
                           isRemoveEditModalOpen;
      
      if (hasModalOpen) {
        return; // Ignora atalhos quando há modal aberto
      }
      
      if (e.key === 'Escape') {
        e.preventDefault();
        // Captura ESC mesmo com foco em inputs e evita que outros handlers cancelem o evento
        if (typeof (e as any).stopImmediatePropagation === 'function') {
          (e as any).stopImmediatePropagation();
        }
        e.stopPropagation();
        handleCancelSale();
      } else if (e.ctrlKey && e.key === 'F2') {
        e.preventDefault();
        setIsDiscountModalOpen(true);
      } else if (e.key === 'F11') {
        e.preventDefault();
        setIsCustomerSearchModalOpen(true);
      } else if (e.ctrlKey && e.key === 'F3') {
        e.preventDefault();
        setInitialSearchTerm('');
        setIsProductSearchModalOpen(true);
      } else if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        setIsCPFModalOpen(true);
      } else if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        setIsRemoveEditModalOpen(true);
      } else if (e.key === 'F2') {
        e.preventDefault();
        openQuickPayment('Dinheiro');
      } else if (e.key === 'F3' && !e.ctrlKey) {
        e.preventDefault();
        openQuickPayment('Cartão de Crédito');
      } else if (e.key === 'F4') {
        e.preventDefault();
        openQuickPayment('Cartão de Débito');
      } else if (e.key === 'F5') {
        e.preventDefault();
        openQuickPayment('PIX');
      } else if (e.key === 'F6') {
        e.preventDefault();
        openQuickPayment('Carnê');
      } else if (e.key === 'F7') {
        e.preventDefault();
        setIsOtherPaymentsOpen(true);
      } else if (e.key === 'Delete' || e.key === 'Del') {
        e.preventDefault();
        if (quickPayments.length > 0) {
          setQuickPayments([]);
          showAlert('Pagamentos limpos', 'info');
        }
      }
    };

    // Usar window e fase de captura para garantir que recebemos o evento antes de componentes internos
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true } as any);
  }, [cartItems, quickPayments, handleCancelSale, isProductSearchModalOpen, isEditItemModalOpen, isCPFModalOpen, 
      isDiscountModalOpen, isPaymentModalOpen, isQuickPaymentOpen, isOtherPaymentsOpen, 
      isFinalizationModalOpen, isCustomerSearchModalOpen, isRemoveEditModalOpen]);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    showAlert(`Cliente selecionado: ${customer.name}`, 'success');
  };

  const handleBackClick = () => {
    // Verificar se há venda iniciada (produtos no carrinho OU cliente selecionado)
    if (cartItems.length > 0 || selectedCustomer) {
      // Mostrar alerta usando o AlertContext - NÃO PERMITE SAIR
      // O usuário deve cancelar ou finalizar a venda antes de poder sair
      showAlert('VENDA INICIADA! Use "Cancelar Venda" ou "Finalizar Venda" antes de sair.', 'warning');
      
      // NÃO navega - usuário deve cancelar ou finalizar primeiro
      return;
    } else {
      // Se não há venda iniciada, voltar para Operations
      navigate('/operacoes');
    }
  };

  // Funções para os novos modais
  const handleEditItem = (item: CartItem) => {
    setEditingItem(item);
    setIsEditItemModalOpen(true);
  };

  const handleSaveEditedItem = (updatedItem: CartItem) => {
    setCartItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setEditingItem(null);
  };

  const handleCPFConfirm = (cpf: string) => {
    setCustomerCPF(cpf);
    if (cpf) {
      showAlert(`CPF adicionado: ${cpf}`, 'success');
    } else {
      showAlert('CPF removido', 'info');
    }
  };

  const handleDiscountApply = (discountData: DiscountData) => {
    setCurrentDiscount(discountData);
    if (discountData.discountAmount !== 0) {
      const type = discountData.isDiscount ? 'Desconto' : 'Acréscimo';
      const amount = Math.abs(discountData.discountAmount);
      showAlert(`${type} aplicado: ${convertCentsToReais(amount)}`, 'success');
    } else {
      showAlert('Desconto/Acréscimo removido', 'info');
    }
  };

  const handlePaymentConfirm = async (payments: PaymentItem[]) => {
    if (!cartItems.length) {
      showAlert('⚠️ Nenhum produto no carrinho', 'warning');
      return;
    }

    // TODO: Implementar autenticação quando disponível
    // if (!currentUser?.id) {
    //   showAlert('⚠️ Usuário não autenticado', 'error');
    //   return;
    // }

    try {
      // Verificar se há caixa aberto
      const currentCashRegisterLS = typeof window !== 'undefined' ? localStorage.getItem('current_cash_register') : null;
      if (!currentCashRegisterLS) {
        showAlert('⚠️ Nenhum caixa aberto. Abra um caixa antes de realizar vendas.', 'warning');
        return;
      }

      // Verificar se formas de pagamento a prazo têm cliente obrigatório (comentado - API não disponível)
      let hasPaymentTerm = false;
      // TODO: Implementar verificação de forma de pagamento quando API estiver disponível
      // for (const payment of payments) {
      //   try {
      //     const paymentMethods = await PaymentMethodService.getActive();
      //     const paymentMethod = paymentMethods.find(pm => pm.id === payment.paymentMethodId);
      //     
      //     if (paymentMethod && paymentMethod.saleType === 'A PRAZO') {
      //       hasPaymentTerm = true;
      //       break;
      //     }
      //   } catch (error) {
      //     console.error('Erro ao verificar forma de pagamento:', error);
      //   }
      // }

      // Se há pagamento a prazo, cliente é obrigatório
      if (hasPaymentTerm && !selectedCustomer) {
        showAlert('⚠️ Cliente é obrigatório para vendas com pagamento a prazo', 'warning');
        return;
      }

      // Preparar dados da venda (garantir productCode numérico, inclusive para serviços)
      const itemsForSale = cartItems.map(item => {
        const rawCode = (item.product.code as any) ?? (item.product.id as any);
        const codeNum = Number(rawCode);
        return {
          productCode: codeNum,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal
        };
      });
      // Se houver algum código inválido, bloquear e avisar
      if (itemsForSale.some(it => !Number.isFinite(it.productCode))) {
        showAlert('Produto com código inválido na venda. Reabra o item e tente novamente.', 'error');
        return;
      }

      // TODO: Implementar criação de venda quando API estiver disponível
      // const salePayload: CreateSalePayload = {
      //   customerId: selectedCustomer?.id || null,
      //   saleDate: new Date().toISOString(),
      //   totalValue: cartSubtotal,
      //   discount: currentDiscount && currentDiscount.isDiscount ? Math.abs(currentDiscount.discountAmount) : 0,
      //   surcharge: currentDiscount && !currentDiscount.isDiscount ? Math.abs(currentDiscount.discountAmount) : 0,
      //   totalToPay: cartTotal,
      //   valueReceived: payments.reduce((total, payment) => total + payment.amount, 0),
      //   changeValue: Math.max(0, payments.reduce((total, payment) => total + payment.amount, 0) - cartTotal),
      //   employeeId: currentUser.id,
      //   status: 'completed',
      //   items: itemsForSale,
      //   payments: payments.map(payment => ({
      //     paymentMethodId: payment.paymentMethodId,
      //     amount: payment.amount
      //   }))
      // };
      
      // const sale = await SaleService.create(salePayload);

      // Limpar dados da venda após finalizar
      setCartItems([]);
      setSelectedCustomer(null);
      setCustomerCPF('');
      setCurrentDiscount(null);
      setIsPaymentModalOpen(false);
      
      showAlert(`✅ Venda finalizada com sucesso! Pronto para nova venda.`, 'success');
      
      // Focar no campo de pesquisa para nova venda
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
      
    } catch (error: any) {
      
      showAlert(`❌ Erro ao finalizar venda: ${error?.message || 'Erro desconhecido'}`, 'error');
    }
  };

  return (
    <GlobalScrollbarHide>
      <PageContainer>
        {/* Header da página */}
        <PageHeader>
        <HeaderLeft>
          <PageTitle>PDV</PageTitle>
        </HeaderLeft>
        <HeaderRight>
          {customerCPF && (
            <div style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '12px',
              marginRight: '16px',
              padding: '8px 16px',
              background: 'rgba(246, 246, 246, 0.95)',
              borderRadius: 'var(--border-radius-medium)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              textTransform: 'uppercase'
            }}>
              CPF: {customerCPF}
            </div>
          )}
          {/* Pesquisa de Cliente: substitui o botão/modal por dropdown reutilizável */}
          <div style={{ minWidth: 360 }}>
            <CustomerSearchDropdown
              label="PESQUISAR CLIENTE:"
              inlineLabel
              placeholder="Pesquisar cliente (F11)"
              selectedCustomer={selectedCustomer}
              onSelect={handleCustomerSelect}
              onClear={() => setSelectedCustomer(null)}
              showSearchIcon
              onOpenSearchModal={() => setIsCustomerSearchModalOpen(true)}
            />
          </div>
          <BackButton onClick={handleBackClick}>
            ← Voltar
          </BackButton>
        </HeaderRight>
      </PageHeader>

      {/* Container principal do conteúdo */}
      <ContentContainer>
        {/* Sidebar lateral esquerda - componente separado */}
        <SalesSidebar
          cartSubtotal={cartSubtotal}
          cartTotal={cartTotal}
          discountPercentage={discountPercentage}
          discountValue={discountValue}
          discountAmount={discountAmount}
          quickPayments={quickPayments}
          remainingToPay={remainingToPay}
        />

        {/* Coluna direita com conteúdo atual */}
        <RightContent>
          {/* Formulário de adição de produtos - componente separado */}
          <SalesProductForm
            searchTerm={searchTerm}
            quantity={quantity}
            unitPrice={unitPrice}
            subtotal={subtotal}
            selectedProduct={selectedProduct}
            searchInputProducts={searchInputProducts}
            searchInputRef={searchInputRef}
            quantityInputRef={quantityInputRef}
            onSearchTermChange={setSearchTerm}
            onQuantityChange={handleQuantityChange}
            onUnitPriceChange={handleUnitPriceChange}
            onSubtotalChange={handleSubtotalChange}
            onProductSearchSelect={handleProductSearchSelect}
            onProductSearch={handleProductSearch}
            onClearProductSelection={handleClearProductSelection}
            onQuantityKeyDown={handleQuantityInputKeyDown}
            onPriceKeyDown={handlePriceInputKeyDown}
            onSubtotalKeyDown={handleSubtotalInputKeyDown}
            onAddProduct={handleAddProduct}
            convertToSearchInputProduct={convertToSearchInputProduct}
          />

        {/* Lista de produtos no carrinho - IGUAL AO PDV */}
        <CartContainer>
          <ProductTable>
            <TableHeader>
              <div>DESCRIÇÃO</div>
              <div>VALOR UN</div>
              <div>QTD</div>
              <div>SUBTOTAL</div>
            </TableHeader>
            <TableContent>
              {cartItems.length === 0 ? (
                <div style={{ 
                  padding: '24px', 
                  textAlign: 'center', 
                  color: 'var(--text-secondary)',
                  fontStyle: 'italic',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                  textTransform: 'uppercase'
                }}>
                  Nenhum produto adicionado ao carrinho
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.product.name}
                    </div>
                    <div>{convertCentsToReais(item.unitPrice)}</div>
                    <div>{formatCartItemQuantity(item)}</div>
                    <div>{convertCentsToReais(item.subtotal)}</div>
                  </TableRow>
                ))
              )}
            </TableContent>
          </ProductTable>
        </CartContainer>
        </RightContent>
      </ContentContainer>

      {/* Footer com botões de pagamento e dicas de atalho */}
      <Footer>
        <FooterContent>
          <PaymentButtonsContainer>
            <PaymentHint>Dinheiro (F2)</PaymentHint>
            <PaymentHint>Cartão de Crédito (F3)</PaymentHint>
            <PaymentHint>Cartão de Débito (F4)</PaymentHint>
            <PaymentHint>PIX (F5)</PaymentHint>
            <PaymentHint>Carnê (F6)</PaymentHint>
            <PaymentHint>Outros (F7)</PaymentHint>
          </PaymentButtonsContainer>
          
          <ShortcutHint>
            {FaKeyboard({size:14})}
            <span>F11: Pesquisar Cliente | Ctrl+F3: Pesquisar Produto | Ctrl+R: Remover/Editar | Ctrl+F2: Desconto/Acréscimo | Ctrl+N: CPF | F2..F7: Pagamentos | Del: Limpar Pagamentos | ESC: Cancelar</span>
          </ShortcutHint>
        </FooterContent>
      </Footer>

      {/* Dropdown já cobre a pesquisa/seleção de cliente */}

      {/* Modal de pesquisa de produtos (IGUAL AO PDV) */}
      <ProductSearchModal
        isOpen={isProductSearchModalOpen}
        onClose={() => {
          
          setIsProductSearchModalOpen(false);
          setInitialSearchTerm('');
        }}
        onSelect={(product: Product) => {
          
          handleSelectProduct(product);
        }}
        initialSearchTerm={initialSearchTerm}
      />

      {/* Modal de edição de item do carrinho */}
      <EditSaleItemModal
        isOpen={isEditItemModalOpen}
        onClose={() => {
          setIsEditItemModalOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onSave={handleSaveEditedItem}
      />

      {/* Modal de CPF do cliente */}
      <CustomerCPFModal
        isOpen={isCPFModalOpen}
        onClose={() => setIsCPFModalOpen(false)}
        onConfirm={handleCPFConfirm}
        currentCPF={customerCPF}
      />

      {/* Modal de desconto/acréscimo */}
      <DiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        onApply={handleDiscountApply}
        originalTotal={cartSubtotal}
        currentDiscount={currentDiscount ?? undefined}
      />

      {/* Modal de pagamento da venda */}
      <SalePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handlePaymentConfirm}
        totalAmount={cartTotal}
        subtotal={cartSubtotal}
        discount={currentDiscount ? (currentDiscount.isDiscount ? -currentDiscount.discountAmount : currentDiscount.discountAmount) : 0}
      />

      {/* Modal rápido de pagamento (F2..F6) */}
      <QuickPaymentModal
        isOpen={isQuickPaymentOpen}
        paymentMethodName={quickPaymentName}
        defaultAmount={remainingToPay || cartTotal}
        remainingAmount={remainingToPay || cartTotal}
        onClose={() => setIsQuickPaymentOpen(false)}
        onConfirm={handleQuickPaymentConfirm}
      />

      {/* Modal de Outros métodos (F7) */}
      <OtherPaymentMethodsModal
        isOpen={isOtherPaymentsOpen}
        excludedMethodNames={[ 'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'PIX', 'Carnê' ]}
        onClose={() => setIsOtherPaymentsOpen(false)}
        onSelect={(method) => {
          setIsOtherPaymentsOpen(false);
          openQuickPayment(method.name, String(method.id));
        }}
      />

      {/* Modal de finalização de venda */}
      <SaleFinalizationModal
        isOpen={isFinalizationModalOpen}
        payments={quickPayments}
        totalAmount={cartTotal}
        change={quickChange}
        onClose={() => setIsFinalizationModalOpen(false)}
        onConfirm={async () => {
          setIsFinalizationModalOpen(false);
          await handlePaymentConfirm(quickPayments);
        }}
      />

      {/* Modal de pesquisa de clientes */}
      <CustomerSearchModal
        isOpen={isCustomerSearchModalOpen}
        onClose={() => setIsCustomerSearchModalOpen(false)}
        onSelectCustomer={(c:any) => {
          // mapear para tipo da API exigido pelo dropdown/fluxo
          const mapped: Customer = {
            id: c.id,
            code: c.code ?? 0,
            name: c.name,
            nickname: c.nickname ?? '',
            entityType: c.entityType ?? 0,
            entityRegistryNumber: c.document ?? '',
            generalRegistration: '',
            info: '',
            street: '', number: 0, complement: '', district: '',
            zip: '', stateId: 0 as any, cityId: 0 as any,
            email: c.email ?? '', mobile: c.phone ?? '', phone: c.phone ?? '',
          } as Customer;
          setSelectedCustomer(mapped);
          setIsCustomerSearchModalOpen(false);
        }}
        selectedCustomer={selectedCustomer as any}
      />

      {/* Modal de remover/editar produto da lista */}
      <RemoveEditProductModal
        isOpen={isRemoveEditModalOpen}
        cartItems={cartItems}
        onClose={() => setIsRemoveEditModalOpen(false)}
        onRemove={handleRemoveItem}
        onEdit={handleEditItemQuantity}
      />
      </PageContainer>
    </GlobalScrollbarHide>
  );
};

export default Sales; 
