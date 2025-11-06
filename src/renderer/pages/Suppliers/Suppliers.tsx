import React, { useState, lazy, Suspense } from 'react';
import { useTheme } from '../../styles/ThemeProvider';
import { SupplierSearchBox, SupplierList } from './components';
import { useNavigation } from '../../router/Navigation';
import { useClickSound } from '../../hooks/useClickSound';
import { BackButton } from '../../components/BackButton';
import { PlusIcon } from '../../components/Icons/Icons';

// Lazy loading do modal para melhor performance
// Carrega apenas quando necessário
const NewSupplierModal = lazy(() => import('../../components/NewSupplierModal').then(module => ({ default: module.NewSupplierModal })));

// Página de Fornecedores do sistema
// Permite buscar, visualizar e gerenciar fornecedores cadastrados
// Estilos importados de @styles/style.ts e componentes modularizados
interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: 'individual' | 'company';
  status: 'active' | 'inactive';
  registrationDate: string;
}

export function Suppliers(): JSX.Element {
  const { navigate } = useNavigation();
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Distribuidora ABC Ltda',
      email: 'contato@distribuidoraabc.com',
      phone: '(11) 99999-9999',
      document: '12.345.678/0001-90',
      type: 'company',
      status: 'active',
      registrationDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Fornecedor XYZ S.A.',
      email: 'vendas@fornecedorxyz.com',
      phone: '(11) 88888-8888',
      document: '98.765.432/0001-10',
      type: 'company',
      status: 'active',
      registrationDate: '2024-01-20'
    },
    {
      id: '3',
      name: 'João Fornecedor Silva',
      email: 'joao.fornecedor@email.com',
      phone: '(11) 77777-7777',
      document: '123.456.789-00',
      type: 'individual',
      status: 'active',
      registrationDate: '2024-02-01'
    },
    {
      id: '4',
      name: 'Empresa de Suprimentos S.A.',
      email: 'compras@suprimentos.com',
      phone: '(11) 66666-6666',
      document: '11.222.333/0001-44',
      type: 'company',
      status: 'inactive',
      registrationDate: '2024-02-10'
    },
    {
      id: '5',
      name: 'Maria Fornecedora Costa',
      email: 'maria.fornecedora@email.com',
      phone: '(11) 55555-5555',
      document: '987.654.321-00',
      type: 'individual',
      status: 'active',
      registrationDate: '2024-02-15'
    }
  ]);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm) ||
    supplier.document.includes(searchTerm)
  );

  // Funções de callback para ações dos fornecedores
  const handleEditSupplier = (supplier: Supplier) => {
    console.log('Editar fornecedor:', supplier);
    // Aqui você pode abrir um modal de edição ou navegar para uma página de edição
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    console.log('Excluir fornecedor:', supplier);
    // Aqui você pode mostrar uma confirmação e excluir o fornecedor
  };

  // Função para salvar novo fornecedor
  const handleSaveSupplier = (newSupplierData: Omit<Supplier, 'id' | 'registrationDate'>) => {
    const newSupplier: Supplier = {
      ...newSupplierData,
      id: Date.now().toString(), // ID simples baseado em timestamp
      registrationDate: new Date().toISOString().split('T')[0] // Data atual
    };
    
    setSuppliers(prev => [...prev, newSupplier]);
    console.log('Novo fornecedor salvo:', newSupplier);
  };

  const [nameColumnWidth, setNameColumnWidth] = useState<number>(300);
  const [isNewSupplierHovered, setIsNewSupplierHovered] = useState(false);
  const minWidth = 200;
  const maxWidth = 500;

  return (
    <div style={{
      ...systemStyles.page.container,
      padding: '20px',
      gap: '20px',
      overflow: 'hidden'
    }}>
      {/* Header com botão voltar */}
      <div style={systemStyles.page.header}>
        <BackButton 
          onClick={() => navigate('home')} 
          label="Voltar para Home" 
        />
        <h1 style={systemStyles.page.title}>Fornecedores</h1>
        <div style={{ width: '80px' }} />
      </div>
      {/* Barra de pesquisa */}
      <SupplierSearchBox
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar fornecedores por nome, email, telefone ou documento..."
        resultsCount={filteredSuppliers.length}
        additionalButton={
          <button
            style={{
              ...systemStyles.button.primary,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              ...(isNewSupplierHovered ? systemStyles.button.primaryHover : {})
            }}
            onMouseEnter={() => setIsNewSupplierHovered(true)}
            onMouseLeave={() => setIsNewSupplierHovered(false)}
            onClick={() => {
              playClickSound();
              setIsModalOpen(true);
            }}
          >
            <PlusIcon size={14} />
            Novo Fornecedor
          </button>
        }
      />

      {/* Lista de fornecedores */}
      <div style={{
        ...systemStyles.list.container,
        flexDirection: 'column' as const
      }}>
        <div style={{
          ...systemStyles.list.header,
          gridTemplateColumns: `${nameColumnWidth}px 1fr 1fr 1fr 0.8fr 80px`,
          display: 'grid'
        }}>
          <div style={{ 
            ...systemStyles.list.headerCell, 
            width: nameColumnWidth, 
            cursor: 'col-resize' 
          }}
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startWidth = nameColumnWidth;
              const onMove = (ev: MouseEvent) => {
                const delta = ev.clientX - startX;
                const next = Math.min(maxWidth, Math.max(minWidth, startWidth + delta));
                setNameColumnWidth(next);
              };
              const onUp = () => {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
              };
              window.addEventListener('mousemove', onMove);
              window.removeEventListener('mouseup', onUp);
            }}
          >
            Nome/Razão Social
          </div>
          <div style={systemStyles.list.headerCell}>Email</div>
          <div style={systemStyles.list.headerCell}>Telefone</div>
          <div style={systemStyles.list.headerCell}>Documento</div>
          <div style={systemStyles.list.headerCell}>Tipo</div>
          <div style={systemStyles.list.headerCell}>Ações</div>
        </div>

        <SupplierList 
          suppliers={filteredSuppliers} 
          nameColumnWidth={nameColumnWidth}
          onEditSupplier={handleEditSupplier}
          onDeleteSupplier={handleDeleteSupplier}
        />
      </div>

      {/* Modal de novo fornecedor com lazy loading */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <NewSupplierModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveSupplier}
          />
        </Suspense>
      )}
    </div>
  );
}

