//--------------------------------------------------------------------
// APP ICONS - Ícones elegantes usando react-icons
// Biblioteca de ícones variada com mais de 10.000 opções
//--------------------------------------------------------------------

import { 
  // Heroicons (estilo moderno do Tailwind)
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineCog,
  HiOutlineFolder,
  HiOutlineDocumentText,
  HiOutlineUser
} from 'react-icons/hi';
import {
  // Feather/Lucide Icons (estilo moderno e minimalista)
  FiShoppingCart,
  FiFileText,
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
  FiLogOut
} from 'react-icons/fi';
import {
  // Material Design Icons (estilo clean e moderno)
  MdShoppingCart,
  MdDescription,
  MdAssignment,
  MdSettings,
  MdAccountCircle,
  MdReceipt
} from 'react-icons/md';
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
export const HomeIcon = createIcon(HiOutlineHome);
export const SearchIcon = createIcon(HiOutlineSearch);
export const SettingsIcon = createIcon(HiOutlineCog);
export const FolderIcon = createIcon(HiOutlineFolder);
export const ToolsIcon = createIcon(FiTool);
export const DocumentIcon = createIcon(HiOutlineDocumentText);
export const UsersIcon = createIcon(HiOutlineUser);

// Ícones de Documentos
export const FileIcon = createIcon(HiOutlineDocumentText);
export const InvoiceIcon = createIcon(MdReceipt);
export const ClipboardIcon = createIcon(FiClipboard);

// Ícones Comerciais
export const ShoppingCartIcon = createIcon(FiShoppingCart);
export const ProductsIcon = createIcon(MdShoppingCart);

// Ícones de Transporte
export const TruckIcon = createIcon(FiTruck);

// Ícones de Ações
export const BackIcon = createIcon(FiArrowLeft);
export const AddIcon = createIcon(FiPlus);
export const EditIcon = createIcon(FiEdit);
export const DeleteIcon = createIcon(FiTrash2);
export const SaveIcon = createIcon(FiSave);
export const LogOutIcon = createIcon(FiLogOut);

// Ícones de Usuários
export const UserIcon = createIcon(FiUsers);
export const AccountIcon = createIcon(MdAccountCircle);

// Ícones de Configuração
export const ConfigIcon = createIcon(MdSettings);

// Exportar todos os ícones em um objeto para facilitar o acesso
export const AppIcons = {
  // Navegação
  Home: HomeIcon,
  Search: SearchIcon,
  Folder: FolderIcon,
  Tools: ToolsIcon,
  
  // Documentos
  Document: DocumentIcon,
  File: FileIcon,
  Invoice: InvoiceIcon,
  Clipboard: ClipboardIcon,
  
  // Comercial
  ShoppingCart: ShoppingCartIcon,
  Products: ProductsIcon,
  
  // Transporte
  Truck: TruckIcon,
  
  // Usuários
  User: UserIcon,
  Users: UsersIcon,
  Account: AccountIcon,
  
  // Ações
  Back: BackIcon,
  Add: AddIcon,
  Edit: EditIcon,
  Delete: DeleteIcon,
  Save: SaveIcon,
  Exit: LogOutIcon,
  
  // Configuração
  Settings: SettingsIcon,
  Config: ConfigIcon
};
