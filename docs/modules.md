# Módulos do frontend

| Domínio | Principais áreas | Responsabilidade |
| --- | --- | --- |
| Requisições | Pastas `requisicoes` | Requisições, itens, status, anexos e cotações |
| Patrimônio | Pastas `patrimonios` | Patrimônios, acessórios, movimentações, calibração e checklists |
| Oportunidades | Pastas `oportunidades` | CRM, kanban, comentários, anexos e pendências |
| Apontamentos | Pastas `apontamentos` | Apontamentos, pontos, problemas e filtros |
| Ordens de compra | Pastas `ordensCompra` | Ordens de compra e relação com requisições |
| Mercado Livre | Pastas `mercadoLivre` | Contas, autorização, pedidos e rastreamento |
| Administração | `pages/admin`, `components/admin` e módulos relacionados | Usuários, projetos e configurações |

## Áreas transversais

No fluxo de compras, a criação envia o faturamento e a API determina o escopo e o status inicial. O stepper usa a lista do escopo e reconhece aprovação, troca de modalidade e revisão de estoque por nomes de status, sem fixar IDs de Dolphin ou Direto. O destaque de urgência também usa o nome do status.

- `src/components/shared`: componentes reutilizáveis entre domínios.
- `src/redux`: store e slices.
- `src/utils`: auxiliares realmente genéricos.
- `src/styles`: estilos compartilhados ou complexos.
- `src/assets`: recursos estáticos.

## Código novo

- Mantenha código específico dentro da pasta do domínio.
- Use `shared` apenas quando houver reutilização real.
- Encapsule chamadas HTTP em services.
- Use estado local para comportamento restrito e Redux para estado realmente compartilhado.
- Mantenha tipos específicos próximos ao domínio.
