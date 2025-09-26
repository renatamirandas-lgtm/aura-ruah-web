# 🕯️ Loja Aura Ruah

Loja virtual especializada em incensos e sinergias, desenvolvida com tecnologias modernas.

## 🚀 Tecnologias

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **React 18** - Biblioteca de interface

### Backend
- **Spring Boot 3.2** - Framework Java
- **Java 17** - Linguagem de programação
- **Maven** - Gerenciador de dependências
- **JPA/Hibernate** - ORM

### Banco de Dados
- **MySQL 8.0** - Banco de dados relacional

## 📁 Estrutura do Projeto

```
loja-aura-ruah/
├── frontend/          # Aplicação Next.js
│   ├── src/
│   │   ├── app/       # Páginas e layouts
│   │   ├── components/ # Componentes React
│   │   ├── lib/       # Utilitários
│   │   └── types/     # Definições TypeScript
│   └── package.json
├── backend/           # Aplicação Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/  # Código Java
│   │   │   └── resources/ # Configurações
│   └── pom.xml
└── README.md
```

## 🛠️ Como Executar

### Pré-requisitos
- Node.js 18+
- Java 17+
- Maven 3.9+
- MySQL 8.0+

### 1. Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/loja-aura-ruah.git
cd loja-aura-ruah
```

### 2. Configurar Banco de Dados
```sql
CREATE DATABASE aura_ruah_db;
```

### 3. Executar Backend
```bash
cd backend
mvn spring-boot:run
```
Backend rodará em: http://localhost:8080

### 4. Executar Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend rodará em: http://localhost:3000

## 🎯 Funcionalidades

- ✅ Catálogo de produtos
- ✅ Carrinho de compras
- ✅ Filtros por categoria
- ✅ Detalhes do produto
- ✅ Formulário de contato
- ✅ Design responsivo
- ✅ API REST completa

## 📱 Acesso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/products
- **Banco**: MySQL local

## 👥 Desenvolvido por

**Renata Miranda** - Loja Aura Ruah

## 📄 Licença

MIT License



