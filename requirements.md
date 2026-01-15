# Contrib Cycle (Front-end) — Documentação Completa (UI/UX + Contrato de API)

> Tema visual obrigatório: **homens e mulheres do espaço** — **cosmo, planetas, sistemas solares, nebulosas**, “vibe cockpit/astronauta”, porém **ultra legível** e **simples de usar**.

---

## 1) Objetivo do produto

Criar um front-end em React que consome integralmente o back-end Laravel já feito, entregando:

- **Tela inicial** listando \`Projetos Coletivos\`.
- **Fluxo público** (visitante): entrar num projeto e **logar só com telefone**, ou **cadastrar** (telefone + nome + sobrenome).
- **Confirmação de participação**: ao entrar pela primeira vez em um projeto, o usuário deve clicar em **“Aceito participar”** (confirmação explícita).
- **Dentro do projeto** (participante): ver **pagamentos realizados** e **registrar novo pagamento** (comprovante opcional).
- **Dashboard Admin**: criar projetos, gerenciar membros (remover), gerenciar métodos de pagamento (PIX/conta bancária), ver estatísticas.

---

## 2) Stack obrigatória (somente libs de runtime)

Dependências runtime permitidas (as mesmas que você listou):
- \`react\`, \`react-dom\`
- \`react-router\`
- \`@tanstack/react-query\`
- \`clsx\`
- \`tailwind-merge\`
- \`lucide-react\`

> Observação: TailwindCSS (build) é permitido como ferramenta de estilo (você já usa \`tailwind-merge\`), mas o runtime não terá biblioteca de UI pronta. Tudo será “na mão”, com componentes simples e consistentes.

---

## 3) Fonte (tipografia) e identidade visual

### 3.1 Fonte recomendada (tema “space/cockpit” + legibilidade)
Use:
- **B612** para texto e UI
- **B612 Mono** para trechos técnicos, IDs, pequenos detalhes, dados “numéricos”

### 3.2 Adição da fonte (CSS global)
No seu \`src/styles/globals.css\` (ou equivalente), adicione:

\`\`\`css
@import url("https://fonts.googleapis.com/css2?family=B612:wght@400;700&family=B612+Mono:wght@400;700&display=swap");

:root {
  --font-sans: "B612", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  --font-mono: "B612 Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
\`\`\`

### 3.3 Paleta e “Space Theme” (Tailwind)
Diretriz visual:
- Backgrounds: gradientes escuros (azul profundo / roxo / carvão), leve ruído (opcional) e “glow”.
- Cards: vidro fosco (blur) + borda sutil.
- Ações primárias: botões com “glow” controlado e estados claros (hover/focus/disabled).
- Ícones: \`lucide-react\` (foguete, órbita, estrelas, etc.)

Sugestão de tokens (conceitual):
- Fundo: \`#050712\` ~ \`#090B18\`
- Destaque 1: \`#7C3AED\` (violeta)
- Destaque 2: \`#22D3EE\` (ciano)
- Texto: branco com opacidade (ex.: 0.90 / 0.70 / 0.55)

Acessibilidade:
- Contraste mínimo consistente.
- Foco sempre visível (outline).
- Texto nunca abaixo de 14px em mobile.

---

## 4) Regras de UX (essenciais)

### 4.1 Princípios
- “Qualquer pessoa consegue usar sem pensar”.
- O usuário sempre entende:
  1) onde está,
  2) o que falta fazer,
  3) qual o próximo passo.

### 4.2 Estados de UI obrigatórios em todas telas
- Loading (skeleton / shimmer leve)
- Empty state (mensagem clara + CTA)
- Error state (mensagem humana + “tentar novamente”)
- Sucesso (toast leve ou banner inline)

### 4.3 Microcopy (texto) — padrão
- Evitar termos técnicos (“token”, “payload”).
- Frases curtas.
- Sempre mostrar o motivo quando algo falhar:
  - Projeto lotado
  - Você foi removido
  - Telefone não encontrado (sugere cadastro)
  - Pagamento duplicado para o período

---

## 5) Contrato de API (Back-end) — Base e Auth

### 5.1 Base URL
- Defina no front: \`VITE_API_BASE_URL\`
  - Ex.: \`http://localhost:8000\`
- Todas rotas abaixo consideram prefixo: \`/api/v1\` (ou \`/v1\` dependendo do seu \`APP_URL\` / config do Laravel).
  - Pelo seu \`routes/api.php\`, o caminho é \`/api/v1/...\` no padrão Laravel (pois \`routes/api.php\` normalmente fica sob \`/api\`).
  - **Recomendação**: no front, trate como \`\${VITE_API_BASE_URL}/api/v1\`.

### 5.2 Autenticação (Sanctum Bearer Token)
Header:
- \`Authorization: Bearer <token>\`
- \`Accept: application/json\`

Tokens por perfil:
- Admin: token com habilidade \`admin\`
- Participante: token com habilidade \`participant\`

### 5.3 Erros — padrão prático
Você receberá geralmente:
- \`401\` inválido / não autenticado
- \`403\` proibido (ex.: removido, não aceitou participação)
- \`404\` não encontrado
- \`409\` conflito (ex.: projeto cheio; pagamento duplicado)
- \`422\` validação (campos inválidos)

Formato típico:
- \`{ "message": "..." }\`
ou validação:
- \`{ "message": "...", "errors": { "field": ["..."] } }\`

---

## 6) Modelos de dados (TypeScript) — referências

> Estes tipos representam o que o front deve esperar receber.

\`\`\`ts
export type Role = "admin" | "participant";

export type PaymentInterval = "week" | "month" | "year";
export type PaymentMethodType = "pix" | "bank_transfer";

export type MembershipStatus = "pending" | "accepted" | "removed" | null;

export interface ApiMessage {
  message: string;
}

export interface AuthTokenResponse {
  token: string;
}

export interface MeResponse {
  id: number;
  role: Role;
  username: string | null;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethodPayloadPix {
  pix_key: string;
  pix_holder_name: string;
}

export interface PaymentMethodPayloadBankTransfer {
  bank_name: string;
  bank_code?: string | null;
  agency: string;
  account_number: string;
  account_type?: "checking" | "savings" | null;
  account_holder_name: string;
  document?: string | null;
}

export type PaymentMethodPayload =
  | PaymentMethodPayloadPix
  | PaymentMethodPayloadBankTransfer;

export interface CollectiveProjectPaymentMethod {
  id: number;
  type: PaymentMethodType;
  label: string | null;
  sort_order: number;
  is_active: boolean;
  payload?: PaymentMethodPayload; // só vem quando permitido e carregado
}

export interface CollectiveProjectPublic {
  id: number;
  title: string;
  slug: string;
  participant_limit: number;
  amount_per_participant: string; // vem como decimal castado
  payment_interval: PaymentInterval;
  payments_per_interval: number;
  payment_methods: CollectiveProjectPaymentMethod[];
}

export interface CollectiveProjectDetails extends CollectiveProjectPublic {
  description?: string | null;

  // extras do show (participant)
  membership?: {
    status: MembershipStatus;
    accepted_at: string | null;
    removed_at: string | null;
    blocked: boolean;
  };

  stats?: {
    accepted_count: number;
    available_slots: number;
    is_full: boolean;
  };

  is_active?: boolean;
  created_by_user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ParticipantRegisterRequest {
  phone: string;
  first_name: string;
  last_name: string;
}

export interface ParticipantRegisterResponse {
  user_id: number;
  message: string;
}

export interface MembershipShowResponse {
  is_member: boolean;
  status: MembershipStatus;
  accepted_at: string | null;
  removed_at: string | null;
}

export interface MembershipJoinResponse {
  message: string;
  membership_id: number;
}

export interface PaymentPeriod {
  year: number;
  month: number | null;
  week_of_month: number | null;
  sequence: number;
}

export interface CollectiveProjectPayment {
  id: number;
  amount: string;
  paid_at: string | null;
  receipt_path: string | null;
  period: PaymentPeriod;
  created_at: string | null;
}

export interface PaymentOptionsResponse {
  payment_interval: PaymentInterval;
  payments_per_interval: number;
  sequence_range: { min: number; max: number };

  // apenas quando intervalo = week e month é informado
  weeks_in_month?: number;
  weeks?: Array<{ value: number; label: string }>;
  hint?: string;
}

export interface Paginated<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: {
    first?: string;
    last?: string;
    prev?: string | null;
    next?: string | null;
  };
}

// Admin
export interface AdminProjectMember {
  membership_id: number;
  status: "pending" | "accepted" | "removed";
  accepted_at: string | null;
  removed_at: string | null;
  user: {
    id: number;
    phone: string | null;
    first_name: string | null;
    last_name: string | null;
  };
}
\`\`\`

---

## 7) Endpoints — documentação completa (requests, responses, UX)

> Prefixo assumido: \`/api/v1\`. Ajuste no front via \`VITE_API_BASE_URL\`.

### 7.1 Auth Admin

#### POST \`/auth/admin/login\`
Body (JSON):
- \`username\`: string (min 3, max 50)
- \`password\`: string (min 8)

Resposta 200:
\`\`\`json
{ "token": "..." }
\`\`\`

Erros:
- 401 \`{ "message": "Invalid credentials." }\`

UX:
- Form simples (2 campos).
- Botão “Entrar” com loading.
- Erro inline abaixo do form (não só toast).

---

### 7.2 Auth Participante

#### POST \`/auth/participant/register\`
Body (JSON):
- \`phone\`: string (max 20, unique)
- \`first_name\`: string (max 100)
- \`last_name\`: string (max 100)

Resposta 201:
\`\`\`json
{
  "user_id": 123,
  "message": "Registered. Now you can join a project and confirm participation."
}
\`\`\`

Erros:
- 422 validação (ex.: telefone já existe)
UX:
- Após sucesso: automaticamente direcionar para “Confirmar participação” do projeto.
- Ideal: após register, faça login automático (mesmo telefone) para obter token.

#### POST \`/auth/participant/login\`
Body (JSON):
- \`phone\`: string (max 20)

Resposta 200:
\`\`\`json
{ "token": "..." }
\`\`\`

Erros:
- 404 \`{ "message": "User not found." }\`

UX:
- Se 404: sugerir imediatamente aba “Cadastrar”, com botão “Criar cadastro”.

---

### 7.3 Logout e Me

#### POST \`/auth/logout\` (auth)
Resposta 200:
\`\`\`json
{ "message": "Logged out." }
\`\`\`

#### GET \`/me\` (auth)
Resposta 200 (exemplo):
\`\`\`json
{
  "id": 1,
  "role": "participant",
  "username": null,
  "phone": "+55...",
  "first_name": "Ana",
  "last_name": "Silva"
}
\`\`\`

UX:
- Use \`/me\` para:
  - decidir qual dashboard mostrar (admin vs participante)
  - validar token salvo (se falhar, limpar sessão)

---

### 7.4 Projetos Públicos

#### GET \`/projects\`
Retorna lista pública de projetos ativos.
- **Não deve expor dados sensíveis do método** (payload não vem).

Resposta 200:
\`\`\`json
{
  "data": [
    {
      "id": 10,
      "title": "Projeto Saturno",
      "slug": "projeto-saturno",
      "participant_limit": 50,
      "amount_per_participant": "50.00",
      "payment_interval": "week",
      "payments_per_interval": 1,
      "payment_methods": [
        {
          "id": 5,
          "type": "pix",
          "label": "Primary",
          "sort_order": 1,
          "is_active": true
        }
      ]
    }
  ]
}
\`\`\`

UX na Home:
- Grid com cards grandes clicáveis.
- Mostrar:
  - título
  - “R$ X por participante”
  - “Semanal / Mensal / Anual” + “1x, 2x…”
  - “Limite: N participantes”
- CTA claro: “Abrir”

---

## 8) Fluxo Participante (regras do seu esboço)

### 8.1 Tela do Projeto (rota pública)
Ao abrir um projeto:
- Se NÃO autenticado: mostrar **preview** (descrição se existir) e um CTA **“Entrar / Cadastrar”** que abre modal com 2 abas:
  - Aba 1 (primária): **Entrar** — pede **apenas telefone**
  - Aba 2 (secundária): **Cadastrar** — pede **telefone + nome + sobrenome**

### 8.2 Confirmar participação (obrigatório)
Depois do usuário autenticar:
- Se ainda não aceitou, mostrar um passo claro:
  - “Você está prestes a participar do Projeto X.”
  - Botão grande: **“Aceito participar”**
  - Texto menor: “Ao aceitar, você passa a registrar seus pagamentos.”

---

## 9) Endpoints Participante (auth + abilities:participant)

### 9.1 Detalhes do projeto

#### GET \`/projects/{slug}\`
- Se usuário **aceito**: payload dos métodos pode vir.
- Se usuário **não aceito**: payload não vem.

Resposta 200:
\`\`\`json
{
  "data": {
    "id": 10,
    "title": "Projeto Saturno",
    "slug": "projeto-saturno",
    "description": "....",
    "participant_limit": 50,
    "amount_per_participant": "50.00",
    "payment_interval": "week",
    "payments_per_interval": 2,
    "payment_methods": [
      {
        "id": 5,
        "type": "pix",
        "label": "Primary",
        "sort_order": 1,
        "is_active": true,
        "payload": {
          "pix_key": "....",
          "pix_holder_name": "...."
        }
      }
    ]
  },
  "membership": {
    "status": "accepted",
    "accepted_at": "2026-01-14T12:00:00.000000Z",
    "removed_at": null,
    "blocked": false
  },
  "stats": {
    "accepted_count": 12,
    "available_slots": 38,
    "is_full": false
  }
}
\`\`\`

UX:
- Se \`blocked=true\` ou status \`removed\`: bloquear a tela e mostrar mensagem + instrução “contate o administrador”.
- Se \`is_full=true\`: mostrar “Projeto lotado” e não permitir confirmar participação.

---

### 9.2 Estado da participação

#### GET \`/projects/{slug}/membership\`
Resposta:
\`\`\`json
{
  "is_member": true,
  "status": "accepted",
  "accepted_at": "....",
  "removed_at": null
}
\`\`\`

UX:
- Use isso para decidir se mostra “Aceito participar” ou o conteúdo do projeto.

---

### 9.3 Confirmar participação

#### POST \`/projects/{slug}/join\`
Respostas possíveis:

201 (confirmou):
\`\`\`json
{ "message": "Participation confirmed.", "membership_id": 99 }
\`\`\`

200 (já participando):
\`\`\`json
{ "message": "Already participating." }
\`\`\`

403 (removido):
\`\`\`json
{ "message": "You were removed from this project." }
\`\`\`

409 (lotado):
\`\`\`json
{ "message": "Project is full." }
\`\`\`

UX:
- Botão “Aceito participar” com loading.
- Ao confirmar: transição suave para área de pagamentos (scroll + animação leve).
- Em 409: oferecer voltar para home.

---

### 9.4 Listar pagamentos do participante

#### GET \`/projects/{slug}/payments\`
- Só funciona se status \`accepted\`.
- Retorna pagamentos do usuário no projeto, ordenados por \`paid_at desc\`.

Resposta 200:
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "amount": "50.00",
      "paid_at": "2026-01-14T10:00:00.000000Z",
      "receipt_path": "project-receipts/10/7/arquivo.png",
      "period": { "year": 2026, "month": 1, "week_of_month": 2, "sequence": 1 },
      "created_at": "2026-01-14T10:00:10.000000Z"
    }
  ]
}
\`\`\`

UX:
- Se vazio: estado “Nenhum pagamento registrado ainda” + CTA “Registrar primeiro pagamento”.
- Cada item deve ser um card:
  - valor
  - data/hora
  - período (semana/mês/ano + sequência)
  - botão “Ver comprovante” se existir

Comprovante:
- Você tem \`receipt_path\`. Para abrir:
  - URL padrão: \`\${VITE_API_BASE_URL}/storage/\${receipt_path}\`
  - (Pressupõe que você fez \`php artisan storage:link\` e o host serve \`/storage\`)

---

### 9.5 Opções de pagamento (para montar Semana/Mês/Ano)

#### GET \`/projects/{slug}/payment-options\`
Query:
- \`year\` (opcional; default ano atual)
- \`month\` (opcional; usado para intervalo \`week\`)

Resposta:
\`\`\`json
{
  "payment_interval": "week",
  "payments_per_interval": 2,
  "sequence_range": { "min": 1, "max": 2 },
  "weeks_in_month": 5,
  "weeks": [
    { "value": 1, "label": "Primeira Semana" },
    { "value": 2, "label": "Segunda Semana" },
    { "value": 3, "label": "Terceira Semana" },
    { "value": 4, "label": "Quarta Semana" },
    { "value": 5, "label": "Quinta Semana" }
  ]
}
\`\`\`

UX:
- No modal de “Novo pagamento”, sempre chame \`payment-options\` ao selecionar ano/mês (para \`week\`).
- Para \`month\` e \`year\`, use principalmente \`payments_per_interval\` e \`sequence_range\`.

---

### 9.6 Registrar pagamento

#### POST \`/projects/{slug}/payments\`
- Requer status \`accepted\`.
- Comprovante \`receipt\` é **opcional**.
- Enviar como \`multipart/form-data\`.

Campos (variáveis por intervalo):
- Sempre:
  - \`year\` (int)
  - \`sequence\` (int 1..payments_per_interval)
  - \`paid_at\` (date string)
  - \`receipt\` (file opcional: jpg/jpeg/png/pdf, max 10MB)
- Se \`week\`:
  - \`month\` (1..12)
  - \`week_of_month\` (1..maxWeeksDoMês)
- Se \`month\`:
  - \`month\` (1..12)
  - \`week_of_month\` proibido
- Se \`year\`:
  - \`month\` proibido
  - \`week_of_month\` proibido

Resposta 201:
\`\`\`json
{
  "data": {
    "id": 10,
    "amount": "50.00",
    "paid_at": "....",
    "receipt_path": null,
    "period": { "year": 2026, "month": 1, "week_of_month": 2, "sequence": 1 },
    "created_at": "...."
  }
}
\`\`\`

Erros:
- 409 duplicado:
\`\`\`json
{ "message": "Payment already registered for this period/sequence." }
\`\`\`

UX:
- Ao enviar: manter modal aberto com loading.
- Sucesso: fechar modal + toast “Pagamento registrado” + invalidar query de listagem.
- Erro 409: mostrar erro exatamente no contexto do período selecionado.

---

## 10) Admin — Endpoints e UX (auth + abilities:admin)

### 10.1 Listar projetos (admin)

#### GET \`/admin/projects\`
Resposta 200:
- Retorna array cru do Model (sem Resource), então pode vir com campos extras.

UX:
- Grid/Tabela com:
  - título
  - limite
  - intervalo + frequencia
  - ativo/inativo
  - botão “Gerenciar”

---

### 10.2 Criar projeto

#### POST \`/admin/projects\`
Body (JSON):
- \`title\` (string)
- \`description\` (string, opcional)
- \`participant_limit\` (int)
- \`amount_per_participant\` (numeric)
- \`payment_interval\` (\`week\`|\`month\`|\`year\`)
- \`payments_per_interval\` (int >=1)
- \`payment_method_type\` (\`pix\`|\`bank_transfer\`)
- \`payment_method_payload\` (object) — depende do tipo

PIX payload:
- \`pix_key\` (string)
- \`pix_holder_name\` (string)

Bank transfer payload:
- \`bank_name\` (string)
- \`bank_code\` (string opcional)
- \`agency\` (string)
- \`account_number\` (string)
- \`account_type\` (\`checking\`|\`savings\` opcional)
- \`account_holder_name\` (string)
- \`document\` (string opcional)

Resposta 201:
- Resource do projeto com \`payment_methods\` (inclui payload, pois admin pode ver).

UX:
- Form guiado em passos:
  1) “Sobre o projeto”
  2) “Participantes e valores”
  3) “Frequência de pagamento”
  4) “Método de pagamento”
- Preview ao lado (card) pra admin ver como ficará na Home.

---

### 10.3 Detalhar projeto (admin)

#### GET \`/admin/projects/{projectId}\`
Resposta 200:
Inclui:
- \`data\` do projeto
- \`counts\`: pending/accepted/removed
- \`stats\`: available_slots/is_full

UX:
- Header do projeto com contadores (chips).
- Tabs:
  - “Membros”
  - “Métodos de pagamento”
  - (Opcional) “Configuração” (somente leitura ou futura)

---

### 10.4 Listar membros

#### GET \`/admin/projects/{projectId}/members\`
Query:
- \`status\` (pending|accepted|removed)
- \`q\` (busca por phone/nome)
- \`per_page\` (default 20)

Resposta paginada:
\`\`\`json
{
  "data": [
    {
      "membership_id": 1,
      "status": "accepted",
      "accepted_at": "...",
      "removed_at": null,
      "user": { "id": 7, "phone": "+55...", "first_name": "Ana", "last_name": "Silva" }
    }
  ],
  "meta": { "current_page": 1, "last_page": 3, "per_page": 20, "total": 45 }
}
\`\`\`

UX:
- Tabela mobile-first:
  - Linha vira card em telas pequenas.
- Ações:
  - “Remover” (confirmação modal)
- Filtros persistem na URL (boa UX).

---

### 10.5 Remover membro

#### DELETE \`/admin/projects/{projectId}/members/{userId}\`
Resposta 200:
\`\`\`json
{ "message": "Member removed." }
\`\`\`

UX:
- Confirmação: “Tem certeza? Ele não poderá voltar a participar.”
- Após remover: invalidar listagem e atualizar contadores.

---

### 10.6 Métodos de pagamento (admin)

#### GET \`/admin/projects/{projectId}/payment-methods\`
Resposta:
- collection de métodos (admin vê payload)

#### POST \`/admin/projects/{projectId}/payment-methods\`
Cria novo método.

#### PATCH \`/admin/projects/{projectId}/payment-methods/{paymentMethodId}\`
Atualiza.

#### DELETE \`/admin/projects/{projectId}/payment-methods/{paymentMethodId}\`
Desativa (soft):
- Pode dar 422 se for o último ativo:
\`\`\`json
{ "message": "Project must have at least one active payment method." }
\`\`\`

UX:
- Lista ordenável visualmente (não precisa drag, mas campos \`sort_order\`).
- Sempre mostrar “Ativo/Inativo”.
- Ao desativar: avisar claramente regra de “precisa ter 1 ativo”.

---

## 11) Mapeamento de telas (Front-end) — rotas e chamadas

### Rotas públicas
1) \`/\` — Home (Projetos Coletivos)
- chama: GET \`/projects\`
- UI:
  - hero “cosmic”
  - cards com CTA “Abrir”

2) \`/projects/:slug\` — Página do Projeto (pública, mas com modos)
- Se não logado:
  - chama: (opcional) GET \`/projects\` cacheado e filtra pelo slug, ou apenas mostra skeleton e pega detalhes quando logar
  - mostra CTA “Entrar / Cadastrar”
- Se logado (participant):
  - chama: GET \`/projects/:slug\`
  - chama: GET \`/projects/:slug/membership\`
  - se aceito: GET \`/projects/:slug/payments\`

### Rotas admin
3) \`/admin/login\`
- POST \`/auth/admin/login\`

4) \`/admin\` (layout)
- Guard: exige token admin

5) \`/admin/projects\`
- GET \`/admin/projects\`

6) \`/admin/projects/new\`
- POST \`/admin/projects\`

7) \`/admin/projects/:projectId\`
- GET \`/admin/projects/:projectId\`

8) \`/admin/projects/:projectId/members\`
- GET \`/admin/projects/:projectId/members\`
- DELETE \`/admin/projects/:projectId/members/:userId\`

9) \`/admin/projects/:projectId/payment-methods\`
- GET/POST/PATCH/DELETE conforme acima

---

## 12) Componentes de UI (sem libs externas)

### 12.1 Componentes base
- \`Button\`
- \`Input\`
- \`Select\` (simples)
- \`Tabs\` (para modal “Entrar / Cadastrar”)
- \`Modal\` (acessível, foco preso)
- \`Toast\` (mínimo, opcional)
- \`Card\`
- \`Badge\`
- \`Skeleton\`

### 12.2 Padrão de classes (\`clsx\` + \`tailwind-merge\`)
Crie \`cn\`:

\`\`\`ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
\`\`\`

---

## 13) Arquitetura do front (pastas sugeridas)

\`\`\`
src/
  app/
    router.tsx
    providers.tsx
  api/
    client.ts
    endpoints.ts
    types.ts
  auth/
    auth.store.ts
    auth.hooks.ts
    guards.tsx
  ui/
    Button.tsx
    Input.tsx
    Modal.tsx
    Tabs.tsx
    Toast.tsx
    Skeleton.tsx
  pages/
    Home/
      HomePage.tsx
    Project/
      ProjectPage.tsx
      JoinConfirmPanel.tsx
      PaymentsList.tsx
      NewPaymentModal.tsx
      AuthModal.tsx
    Admin/
      AdminLoginPage.tsx
      AdminLayout.tsx
      AdminProjectsPage.tsx
      AdminProjectNewPage.tsx
      AdminProjectDetailsPage.tsx
      AdminMembersPage.tsx
      AdminPaymentMethodsPage.tsx
  styles/
    globals.css
\`\`\`

---

## 14) Cliente HTTP (fetch) + React Query

### 14.1 Regras
- Sempre enviar \`Accept: application/json\`
- Quando autenticado, anexar \`Authorization\`
- JSON por padrão; \`FormData\` para upload

### 14.2 Client (exemplo)
\`\`\`ts
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_V1 = `${API_BASE}/api/v1`;

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export async function apiRequest<T>(
  path: string,
  opts: {
    method?: HttpMethod;
    token?: string | null;
    body?: any;
    isFormData?: boolean;
    query?: Record<string, string | number | undefined | null>;
  } = {}
): Promise<T> {
  const method = opts.method ?? "GET";

  const url = new URL(`${API_V1}${path}`);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  let body: BodyInit | undefined;

  if (opts.body !== undefined) {
    if (opts.isFormData) {
      body = opts.body as FormData;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(opts.body);
    }
  }

  const res = await fetch(url.toString(), { method, headers, body });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.message ?? `HTTP ${res.status}`;
    const err: any = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as T;
}
\`\`\`

---

## 15) Auth Store (admin e participant)

### 15.1 Tokens separados
- \`auth_admin_token\`
- \`auth_participant_token\`
- A UI deve permitir “Sair” de cada um.

### 15.2 Regras de sessão
- Se token inválido (401), limpar e redirecionar.
- Ao login, substituir token anterior (back já apaga tokens).

---

## 16) Fluxos detalhados (passo a passo)

### 16.1 Visitante → entrar em projeto existente
1) Home → clicar projeto
2) ProjectPage (modo público) → abrir modal “Entrar / Cadastrar”
3) Aba “Entrar”:
   - digita telefone
   - POST \`/auth/participant/login\`
4) Se login OK:
   - carregar GET \`/projects/:slug\`
   - carregar GET \`/projects/:slug/membership\`
5) Se não aceito:
   - mostrar painel “Aceito participar”
   - POST \`/projects/:slug/join\`
6) Ao confirmar:
   - mostrar pagamentos (GET \`/projects/:slug/payments\`)
   - habilitar “Novo pagamento”

### 16.2 Visitante → cadastrar e participar
1) Home → projeto
2) Modal → Aba “Cadastrar”
3) POST \`/auth/participant/register\`
4) Login automático:
   - POST \`/auth/participant/login\`
5) Exigir confirmação:
   - POST \`/projects/:slug/join\`

### 16.3 Registrar pagamento
1) Dentro do projeto → “Novo pagamento”
2) Abrir modal:
   - Selecionar ano
   - Se intervalo semanal/mensal: selecionar mês
   - Se semanal: selecionar semana (via \`payment-options\`)
   - Selecionar sequência (1..N)
   - (Opcional) alterar \`paid_at\`
   - (Opcional) anexar comprovante
3) POST \`/projects/:slug/payments\` (FormData)
4) Sucesso:
   - fechar modal
   - invalidar GET payments
   - toast de sucesso

---

## 17) UX do “Novo Pagamento” (muito importante)

### 17.1 Controles por intervalo

#### Intervalo = \`week\`
- Inputs:
  - Ano (select)
  - Mês (select)
  - Semana do mês (select com labels: Primeira, Segunda, ...)
  - Sequência (1..payments_per_interval)
  - Data/hora do pagamento (default agora)
  - Comprovante (file opcional)

A cada mudança em Ano/Mês:
- chamar \`payment-options\` para recalcular semanas.

#### Intervalo = \`month\`
- Inputs:
  - Ano
  - Mês
  - Sequência
  - Data/hora
  - Comprovante

#### Intervalo = \`year\`
- Inputs:
  - Ano
  - Sequência
  - Data/hora
  - Comprovante

### 17.2 Pré-visualização (delícia de UX)
Antes de confirmar, mostrar um card:
- “Você está registrando:”
  - Projeto: X
  - Período: “2026 / Janeiro / Segunda Semana / #1”
  - Valor: “R$ 50,00”
- Botão: “Confirmar pagamento”

---

## 18) Checklist final (para você considerar o front “concluído”)

### Público
- [ ] Home lista projetos e abre detalhes
- [ ] Modal com 2 abas funciona perfeitamente em mobile
- [ ] Login por telefone funciona
- [ ] Cadastro funciona
- [ ] Confirmar participação obrigatório e claro
- [ ] Removido/lotado tratados com mensagens específicas

### Participante
- [ ] Lista pagamentos
- [ ] Novo pagamento por semana/mês/ano com UX correta
- [ ] Upload opcional
- [ ] Erro 409 (duplicado) tratado de forma humana
- [ ] Comprovante abre quando existir

### Admin
- [ ] Login admin
- [ ] Criar projeto completo (com método inicial)
- [ ] Listar projetos
- [ ] Ver detalhes (counts/stats)
- [ ] Listar membros com filtro e busca
- [ ] Remover membro
- [ ] Gerenciar métodos (criar/editar/desativar, respeitar regra do último ativo)

---

## 19) Observações práticas de integração (Laravel)

- Você já fez \`php artisan storage:link\` ✅
- Para o front acessar comprovantes:
  - garantir que o host sirva \`/storage\`
  - em produção, validar CORS e URL base

---

## 20) Próximo passo (implementação)
Com essa documentação, a execução ideal é:
1) criar estrutura do front + router + providers (React Query)
2) implementar Home
3) implementar ProjectPage + modal “Entrar/Cadastrar”
4) implementar confirmação de participação
5) implementar pagamentos + novo pagamento (modal)
6) implementar Admin

Fim.
