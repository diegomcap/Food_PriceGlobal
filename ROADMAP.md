# 🗺️ Roadmap de Desenvolvimento - New Export Platform v2

Este documento detalha o plano de implementação para transformar o protótipo em um produto de produção (MVP).

## 🏗️ Core & Infraestrutura
- [x] Setup inicial Next.js + TypeScript + Tailwind
- [x] Estrutura de rotas base (Global, Brasil, LATAM, Military)
- [ ] **Autenticação Centralizada**: Implementar NextAuth.js (Auth0 ou Credentials)
- [ ] **Banco de Dados**: Configurar PostgreSQL (via Prisma ORM)
- [ ] **CI/CD**: Configurar GitHub Actions e Vercel Deployments

---

## 🌍 Módulo 1: Global Food Transport
> Foco: Rastreabilidade Internacional e Logística

### Frontend
- [ ] Migrar Dashboard Principal (Gráficos de commodities)
- [ ] Implementar Mapa Interativo (Mapbox GL JS)
- [ ] Criar formulário de Registro de Exportação
- [ ] Tradução (i18n) - Inglês, Mandarim, Árabe

### Backend
- [ ] API de Commodities (Integração Alpha Vantage ou similar)
- [ ] Webhook para atualizações de status de containers

---

## 🇧🇷 Módulo 2: Brasil Food Transport
> Foco: Logística Nacional e Compliance

### Frontend
- [ ] Migrar UI com identidade visual verde/amarela
- [ ] Integração de consulta de CNPJ (ReceitaWS)
- [ ] Dashboard de rotas rodoviárias

### Backend
- [ ] Validação de documentos fiscais (CT-e)
- [ ] API de Fretes Nacionais

---

## 🌎 Módulo 3: LATAM Export
> Foco: Regionalização e Multimoeda

### Frontend
- [ ] Sistema de seleção de país (Argentina, Chile, Uruguai...)
- [ ] Conversor de moedas em tempo real
- [ ] Interface bilíngue (Espanhol/Português)

### Backend
- [ ] Tabela de tarifas alfandegárias Mercosul
- [ ] API de Câmbio em tempo real

---

## 🛡️ Módulo 4: Military Food Development
> Foco: Segurança e Rastreabilidade Extrema

### Frontend
- [ ] UI "Dark Mode" obrigatória
- [ ] Login com 2FA (Dois Fatores)
- [ ] Dashboards de Supply Chain criptografados

### Backend
- [ ] Banco de dados segregado (Schema separado)
- [ ] Audit Log imutável (todas as ações registradas)

---

## 📅 Próximos Passos Imediatos
1. Configurar o **Prisma ORM** para definir os modelos de dados.
2. Escolher um provedor de mapas (Mapbox ou Google Maps).
3. Migrar o componente de "Notícias Dinâmicas" para uma API Server-Side.
