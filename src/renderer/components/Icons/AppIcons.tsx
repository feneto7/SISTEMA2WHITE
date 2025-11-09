//--------------------------------------------------------------------
// APP ICONS - Ícones padronizados usando apenas react-icons/fi (Feather Icons)
// Todos os ícones do sistema usam o mesmo pacote para manter consistência visual
//--------------------------------------------------------------------

import {
  // Feather Icons - Estilo moderno e minimalista
  FiHome,
  FiSearch,
  FiSettings,
  FiFolder,
  FiFileText,
  FiUser,
  FiMail,
  FiShoppingCart,
  FiClipboard,
  FiTruck,
  FiUsers,
  FiFile,
  FiArrowLeft,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSave,
  FiTool,
  FiLogOut,
  FiDollarSign,
  FiX,
  FiArrowRight,
  FiCheck,
  FiRefreshCw,
  FiPrinter,
  FiAlertCircle,
  FiAlertTriangle,
  FiInfo,
  FiCheckCircle,
  FiClock,
  FiGrid,
  FiMenu,
  FiRepeat,
  FiMaximize,
  FiMinimize2
} from 'react-icons/fi';
import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// Wrapper para padronizar os ícones
export const createIcon = (Icon: React.ComponentType<any>) => {
  return React.memo<IconProps>(({ size = 24, color = 'currentColor', className, ...props }) => (
    <Icon size={size} color={color} className={className} {...props} />
  ));
};

// Ícones de Navegação e Interface
export const HomeIcon = createIcon(FiHome);
export const SearchIcon = createIcon(FiSearch);
export const SettingsIcon = createIcon(FiSettings);
export const FolderIcon = createIcon(FiFolder);
export const ToolsIcon = createIcon(FiTool);
export const DocumentIcon = createIcon(FiFileText);
export const UsersIcon = createIcon(FiUser);
export const MailIcon = createIcon(FiMail);

// Ícones de Documentos
export const FileIcon = createIcon(FiFile);
export const InvoiceIcon = createIcon(FiFileText);
export const ClipboardIcon = createIcon(FiClipboard);

// Ícones Financeiros
export const DollarIcon = createIcon(FiDollarSign);

// Ícones Comerciais
export const ShoppingCartIcon = createIcon(FiShoppingCart);
export const ProductsIcon = createIcon(FiShoppingCart);

// Ícones de Transporte
export const TruckIcon = createIcon(FiTruck);

// Ícones Comerciais Adicionais
export const TableIcon = createIcon(FiGrid);

// Ícones de Ações
export const BackIcon = createIcon(FiArrowLeft);
export const ArrowRightIcon = createIcon(FiArrowRight);
export const AddIcon = createIcon(FiPlus);
export const EditIcon = createIcon(FiEdit);
export const DeleteIcon = createIcon(FiTrash2);
export const SaveIcon = createIcon(FiSave);
export const LogOutIcon = createIcon(FiLogOut);
export const CloseIcon = createIcon(FiX);
export const CheckIcon = createIcon(FiCheck);
export const RefreshIcon = createIcon(FiRefreshCw);
export const PrintIcon = createIcon(FiPrinter);
export const ChefHatIcon = createIcon(FiMenu);
export const TransferIcon = createIcon(FiRepeat);
export const MaximizeIcon = createIcon(FiMaximize);
export const MinimizeIcon = createIcon(FiMinimize2);
export const AlertIcon = createIcon(FiAlertCircle);
export const WarningIcon = createIcon(FiAlertTriangle);
export const InfoIcon = createIcon(FiInfo);
export const CheckCircleIcon = createIcon(FiCheckCircle);
export const ClockIcon = createIcon(FiClock);

// Ícones de Usuários
export const UserIcon = createIcon(FiUsers);
export const AccountIcon = createIcon(FiUser);

// Ícones de Configuração
export const ConfigIcon = createIcon(FiSettings);

// Exportar todos os ícones em um objeto para facilitar o acesso
export const AppIcons = {
  // Navegação
  Home: HomeIcon,
  Search: SearchIcon,
  Folder: FolderIcon,
  Tools: ToolsIcon,
  Mail: MailIcon,
  
  // Documentos
  Document: DocumentIcon,
  File: FileIcon,
  Invoice: InvoiceIcon,
  Clipboard: ClipboardIcon,
  
  // Comercial
  ShoppingCart: ShoppingCartIcon,
  Products: ProductsIcon,
  Table: TableIcon,
  
  // Financeiro
  Dollar: DollarIcon,
  
  // Transporte
  Truck: TruckIcon,
  
  // Usuários
  User: UserIcon,
  Users: UsersIcon,
  Account: AccountIcon,
  
  // Ações
  Back: BackIcon,
  ArrowRight: ArrowRightIcon,
  Add: AddIcon,
  Edit: EditIcon,
  Delete: DeleteIcon,
  Save: SaveIcon,
  Close: CloseIcon,
  Exit: LogOutIcon,
  Check: CheckIcon,
  Refresh: RefreshIcon,
  Print: PrintIcon,
  ChefHat: ChefHatIcon,
  Transfer: TransferIcon,
  Maximize: MaximizeIcon,
  Minimize: MinimizeIcon,
  
  // Alertas e Notificações
  Alert: AlertIcon,
  Warning: WarningIcon,
  Info: InfoIcon,
  CheckCircle: CheckCircleIcon,
  Clock: ClockIcon,
  
  // Configuração
  Settings: SettingsIcon,
  Config: ConfigIcon
};
