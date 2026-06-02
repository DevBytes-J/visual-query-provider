#  Query Patisserie (Visual Query Builder)

**Live Demo:** [https://visual-query-provider.vercel.app/](https://visual-query-provider.vercel.app/)

Welcome to the **Query Patisserie**, a beautifully themed, highly interactive visual query builder! 
This project allows users to visually construct complex data filters (like choosing ingredients and baking rules) and instantly translates them into SQL, MongoDB, and GraphQL queries.

##  Features

- ** Intuitive Drag-and-Drop Interface:** Easily drag ingredients (fields) and drop them into Cake Boxes (logic groups) to build nested query trees.
- ** Smooth Animations:** Powered by Framer Motion, every interaction—from collapsing groups to deleting nodes—feels buttery smooth and "SaaS-tier."
- ** Magic Receipt Printer:** As you build your query visually, the receipt printer translates your logic into production-ready **SQL**, **MongoDB**, or **GraphQL** syntax in real-time.
- ** Strict Type-Safety & Validation:** Built with TypeScript, ensuring that queries cannot be evaluated or built with missing fields or invalid data types. Inline validation guides the user with clear visual feedback.
- ** Time-Travel (Undo/Redo):** Made a mistake? Seamlessly step back or forward through your query-building history with robust Zustand state management.
- **Fully Responsive:** The layout elegantly adapts to mobile devices with a sticky, scrollable ingredient carousel.

##  Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start baking queries!

## Technologies Used

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** Tailwind CSS
- **State Management:** Zustand (with persist middleware)
- **Animations:** Framer Motion
- **Drag and Drop:** @dnd-kit/core
- **Icons:** Lucide React

##  How to Use

1. **Pick an Ingredient:** Open the left sidebar (or top carousel on mobile) and drag an ingredient onto the canvas.
2. **Set the Rule:** Choose how you want to filter the ingredient (e.g., Equals, Greater Than, Between).
3. **Type the Value:** Enter the specific amount or status you are filtering for.
4. **Group Them:** Add a "Cake Box" (Group) to combine multiple rules using `AND` or `OR` logic.
5. **View Translation:** Check the Magic Receipt Printer at the bottom to see how computers read your query!
