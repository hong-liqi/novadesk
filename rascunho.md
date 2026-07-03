Leia novamente toda a documentação do projeto.

Antes de implementar qualquer aplicação de negócio, quero construir a plataforma base reutilizável do ecossistema.

Objetivo:

Criar TODOS os packages compartilhados que serão utilizados por todas as aplicações futuras.

NÃO implemente HelpDesk.

NÃO implemente Dashboard.

NÃO implemente Chat.

NÃO implemente telas.

NÃO implemente regras de negócio.

Implemente apenas a fundação reutilizável.

Crie completamente:

packages/

ui/
shared/
logger/
config/
auth/
sdk/
eslint-config/
tsconfig/

Cada package deve possuir:

- package.json
- README profissional
- testes
- documentação
- exportações organizadas
- exemplos de uso
- tipagem completa
- lint
- build
- cobertura preparada

Requisitos específicos:

packages/ui
- Design System
- Componentes base
- Tokens de design
- Tema
- Dark/Light Mode
- Tipografia
- Espaçamentos
- Ícones
- Estrutura para Storybook (sem criar componentes complexos)

packages/shared
- Tipos compartilhados
- DTOs
- Helpers
- Utils
- Constantes
- Erros padronizados

packages/logger
- Logger estruturado
- Integração preparada para OpenTelemetry
- Logs em desenvolvimento e produção
- Correlação por Request ID

packages/config
- Gerenciamento centralizado de configurações
- Variáveis de ambiente tipadas
- Validação com Zod

packages/auth
- Tipos
- Interfaces
- Middlewares
- Guards
- Helpers
- Estratégia preparada para JWT, Refresh Token e RBAC
- Não implementar autenticação definitiva

packages/sdk
- Cliente HTTP reutilizável
- Tratamento de erros
- Retry
- Timeout
- Interceptors
- Tipagem completa

packages/eslint-config

packages/tsconfig

Todos os packages devem ser independentes.

Todos devem possuir documentação.

Todos devem possuir README.

Todos devem compilar.

Todos devem ser reutilizáveis.

Objetivo principal:

Quando esta etapa terminar, qualquer aplicação futura do monorepo deve conseguir utilizar esses packages sem necessidade de refatoração.

Ao final:

1. Revise toda a arquitetura.
2. Procure duplicações.
3. Procure dependências desnecessárias.
4. Simplifique onde possível.
5. Garanta que os packages permaneçam desacoplados.