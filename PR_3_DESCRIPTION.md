# PR: feat: added recursive UI components and Zustand store

## What problem it solves
This PR implements the most critical visual engineering requirement of the challenge: the recursive query builder UI and its accompanying state management. It allows users to infinitely nest condition groups (AND/OR) and individual rules without breaking the application, translating the previously built TypeScript types into a fully interactive React component tree.

## Key technical decisions
- **Zustand for State Management:** Chosen for its lightweight, boilerplate-free approach compared to Redux, making it ideal for deeply nested recursive updates. Implemented `recursivelyUpdateNode` to safely and immutably traverse the tree for updates and deletions.
- **Recursive React Components:** Built `GroupNode.tsx` which maps over its `children` and conditionally renders either a `ConditionNode` or another `GroupNode` (calling itself). This pattern supports unlimited nesting depth cleanly.
- **Bakery Theme Integration:** Applied the "Query Patisserie" color palette and visual metaphors (pink dashed borders, glassmorphism) using Tailwind classes directly within the components to maintain the premium Studio Ghibli/SaaS aesthetic.

## Screenshots / GIFs
*(To be generated upon assembling the full layout, but individual Cake Box / Macaron nodes render perfectly in isolation.)*

## Testing done
- Verified that adding a new Group inside a Group works and updates the Zustand store correctly.
- Verified that throwing away (deleting) a Macaron or Cake Box removes it from the tree and all its descendants are garbage collected.
- Verified that updating logic toggles (AND <-> OR) updates the UI instantly.

## Any trade-offs
- Deeply nested recursive updates currently traverse the entire tree on every update. While Zustand + React handles this fine for normal query depths (1-10 levels), extreme depths (100+ levels) might require flattening the normalized state tree or using `immer` for optimal performance. We stuck to pure immutable recursion here for readability and architectural clarity.
