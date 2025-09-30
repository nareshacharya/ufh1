# Melody - Perfumery Platform

![Melody Logo](https://img.shields.io/badge/Melody-Perfumery%20Platform-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-38B2AC?style=flat&logo=tailwind-css)

A comprehensive perfumery management platform built with Next.js 14, designed to streamline ingredient management, formula development, project tracking, and regulatory compliance in the fragrance industry.

## 🌟 Features

### Core Functionality

- **📊 Interactive Dashboard** - Real-time analytics, performance metrics, and activity monitoring
- **🧪 Advanced Ingredient Management** - Comprehensive 200+ field ingredient database with multi-stage workflows
- **🧬 Formula Calculator** - Percentage normalization, batch calculations, yield adjustments, and version control
- **📁 Project Management** - Lifecycle tracking, milestone management, and team collaboration
- **🛡️ Compliance Center** - Regulatory tracking (IFRA, REACH, EU/US compliance) and safety assessments

### Advanced Features

- **🔐 Role-Based Access Control (RBAC)** - Granular permissions for Perfumers, Palette Managers, Compliance Officers, Project Managers, and Admins
- **📋 Case Flow Management** - Template-driven workflows with conditional logic and dynamic form rendering
- **🎨 Modern UI/UX** - Floating sidebar, theme switching (light/dark), responsive design
- **♿ Accessibility** - WCAG 2.1 AA compliance, keyboard navigation, screen reader optimization
- **🚀 Performance Monitoring** - Event logging, error boundaries, and observability features

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Validation**: Zod schemas for type-safe validation
- **Data Visualization**: Recharts for analytics and performance charts
- **Tables**: TanStack React Table for advanced data grids
- **State Management**: React hooks with custom state management patterns

### Key Architectural Patterns

- **Component-Driven Architecture** - Reusable UI components with consistent design system
- **Feature Flag System** - Controlled feature rollouts and A/B testing capabilities
- **Template-Based Forms** - Dynamic form generation with JSON configuration
- **Event-Driven Logging** - Comprehensive user action and system event tracking
- **Modular Design** - Clean separation of concerns with domain-specific modules

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nareshacharya/ufh1.git
   cd ufh1
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Demo Credentials

- **Email**: `admin@perfumery.com`
- **Password**: `password123`

## 📁 Project Structure

```text
ufh1/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Authentication routes
│   ├── case/                     # Case management workflows
│   ├── features/                 # Feature-specific components
│   └── globals.css               # Global styles and theme variables
├── components/                   # Reusable UI components
│   └── ui/                       # Base UI components (Button, Tabs, etc.)
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts               # Authentication hook
│   ├── useRBAC.ts               # Role-based access control
│   └── useTheme.ts              # Theme management
├── lib/                         # Utility libraries and configurations
│   ├── auth/                    # Authentication and RBAC logic
│   ├── caseflow/               # Case flow management system
│   ├── config/                 # Application configuration
│   └── observability/          # Logging and monitoring
└── README.md                    # Project documentation
```

## 👥 User Roles & Permissions

### Role Hierarchy

- **🔬 Perfumer** - Create and manage formulas, work with ingredients
- **🎨 Palette Manager** - Manage ingredient catalogs and sourcing
- **🛡️ Compliance Officer** - Handle regulatory compliance and safety
- **📊 Project Manager** - Oversee projects and resource allocation
- **⚙️ Admin** - Full system access and user management

### Permission System

- Granular permissions (e.g., `ingredients:read`, `formulas:write`, `compliance:approve`)
- Route-level protection with role-based access
- Dynamic UI rendering based on user capabilities
- Action-level authorization for sensitive operations

## 🧪 Ingredient Management Workflow

### Multi-Stage Process

1. **Basic Information** - Name, code, category, regulatory identifiers
2. **Chemical Composition** - Molecular data, purity, thermal properties
3. **Supplier & Sourcing** - Primary/alternative suppliers, pricing, lead times
4. **Regulatory & Compliance** - EU/US status, IFRA restrictions, safety data
5. **Review & Approval** - Comprehensive validation and final approval

### Key Features

- 200+ structured fields for comprehensive ingredient data
- Conditional field rendering based on ingredient type
- Cross-field validation and business rule enforcement
- Automated code generation and duplicate detection
- Integration with supplier databases and regulatory systems

## 🧬 Formula Calculator

### Advanced Calculations

- **Percentage Normalization** - Automatically adjust formulas to total 100%
- **Batch Size Scaling** - Proportional ingredient weight calculations
- **Yield Factor Application** - Account for manufacturing losses
- **Cost Analysis** - Real-time cost calculations based on supplier pricing
- **Version Management** - Track formula changes with detailed comparison

### Formula Development Tools

- Drag-and-drop ingredient selection
- Real-time validation and compliance checking
- Olfactory profile visualization
- Stability and compatibility assessments
- Export capabilities for production systems

## 🛡️ Compliance & Regulatory

### Supported Standards

- **IFRA** (International Fragrance Association) guidelines
- **REACH** (Registration, Evaluation, Authorization of Chemicals)
- **EU Cosmetics Regulation** compliance tracking
- **US FDA** requirements for cosmetic ingredients
- **Custom regulatory frameworks** for specific markets

### Compliance Features

- Automated restriction checking during formula development
- Real-time compliance status monitoring
- Regulatory change notifications and impact analysis
- Audit trail maintenance for regulatory submissions
- Integration with external regulatory databases

## 🎨 Theming & Customization

### Theme System

- **Light/Dark Mode** with system preference detection
- **Custom CSS Variables** for consistent theming
- **Responsive Design** with mobile-first approach
- **Accessibility** features including high contrast support
- **Brand Customization** capabilities for white-label deployments

## 📊 Performance & Monitoring

### Observability Features

- **Real-time Performance Dashboard** with key metrics
- **User Action Tracking** for analytics and optimization
- **Error Monitoring** with detailed error boundaries
- **System Health Monitoring** with uptime tracking
- **Custom Event Logging** for business intelligence

## 🔧 Configuration

### Feature Flags

Configure features through `lib/config/appConfig.ts`:

- Formula normalization and calculations
- Version comparison and tracking
- Compliance automation
- Advanced UI features
- Performance monitoring levels

### Environment Setup

- Development, staging, and production configurations
- Feature flag management per environment
- Database and external service connections
- Authentication and security settings

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:

- Code style and standards
- Testing requirements
- Pull request process
- Issue reporting
- Feature requests

## 📜 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support and questions:

- **Documentation**: Internal wiki and API docs
- **Issues**: GitHub Issues for bug reports and feature requests
- **Contact**: Development team via internal channels

## 🚦 Development Status

- **Current Version**: 1.0.0
- **Build Status**: ✅ Stable
- **Test Coverage**: In Development
- **Documentation**: Comprehensive
- **Deployment**: Production Ready

---

Built with ❤️ for the perfumery industry by the Melody development team.
