# Miyona.ai Redesign Progress

## Objective
Redesign the landing page to be more "seductive," elegant, and high-end. Remove the generic "AI" look, improve typography/layout/animations, and move pricing to its own section.

## Completed Changes
- [x] **Global Styles (`src/app/globals.css`)**: 
    - Implemented a "Midnight Passion" (dark) and "Champagne Blush" (light) color palette using OKLCH.
    - Added glassmorphism (`bg-glass`), text glows (`text-glow`), and seductive gradients.
    - Defined custom animations (`pulse-slow`, `float`).
    - Integrated refined typography foundations (Playfair Display for headings, Lato for sans).

## Pending Tasks
- [ ] **Navbar Redesign (`src/components/landing/Navbar.tsx`)**:
    - Remove generic "AI/Sparkle" icons.
    - Use elegant serif typography (Playfair Display) for the logo.
    - Implement a minimal, high-end navigation style (wide letter spacing, thin borders).
- [ ] **Hero Section Redesign (`src/components/landing/Hero.tsx`)**:
    - Replace generic "next gen intimacy" copy with more evocative, seductive language.
    - Improve typography hierarchy.
    - Replace the "Chat UI" mock with something more abstract or visually striking (e.g., silk-like animations or high-end character silhouettes).
- [ ] **Features Section Redesign (`src/components/landing/Features.tsx`)**:
    - Update icons and visuals to match the new "Midnight Passion" aesthetic.
    - Improve layout flow for a more immersive experience.
- [ ] **Cleanup**:
    - Ensure no pricing references remain on the landing page (already confirmed they are not in the main `page.tsx`).
    - Verify consistency across the dashboard and onboarding if applicable.

## Design Direction
- **Typography**: Playfair Display (Headings), Lato (Body). High letter-spacing for UI elements.
- **Aesthetic**: Luxury, Intimacy, Velvet, Gold, Crimson.
- **Animations**: Slow, fluid, easing-heavy transitions using Framer Motion.
