---
name: Project Issue List
about: Master list of open issues for onboarding and tracking
labels: help-wanted, discussion
---

# Project Issue List

## Bugs
- **bug, core, beginner, priority:high, proposal-required, help-wanted**
  - No error handling for missing/failed image loads in `SequenceController`. If an image fails to load, the sequence may break or show a blank frame.
- **bug, scroll, intermediate, priority:medium, proposal-required**
  - `SmoothScroll` disables native scroll (`body.style.overflow = "hidden"`) but does not restore it on destroy if errors occur or if the class is not properly cleaned up.
- **bug, ui, beginner, priority:low**
  - The progress bar (`.scroll-hud-bar`) may not be visible on all backgrounds due to low contrast, especially for users with vision impairments.
- **bug, animation, intermediate, core**
  - `transitionSpeed` in `SequenceController` is inverted: lower values make transitions slower, higher values make them faster. This is counterintuitive and should be fixed so higher values mean slower transitions.

## Features
- **feature, animation, intermediate, animations, proposal-required, help-wanted**
  - Add GSAP-based scene transitions (fade, slide, etc.) between sections for a more cinematic experience.
- **feature, accessibility, advanced, core, proposal-required, discussion**
  - Add keyboard navigation and ARIA roles for all interactive elements. Currently, the scroll experience is not accessible for keyboard-only users.
- **feature, video-sync, intermediate, modules, proposal-required**
  - Integrate real video or image sequences in `public/frames/` instead of placeholder images from `picsum.photos`.

## Enhancements
- **enhancement, performance, intermediate, core**
  - Optimize image preloading in `SequenceController` to avoid blocking the main thread and improve initial load time.
- **enhancement, styles, beginner, styles**
  - Add dark/light mode toggle for better UX in different environments.
- **enhancement, ui, beginner, styles**
  - Improve mobile responsiveness for `.feature-grid` and `.scene__title` on very small screens.

## Refactor
- **refactor, core, intermediate**
  - Separate animation logic from scroll logic in `main.js` for better maintainability and testability.
- **refactor, modules, intermediate**
  - Move inline styles in HTML to CSS for consistency and easier theming.

## Docs
- **docs, core, good-first-issue**
  - Add a `README.md` with project overview, setup instructions, and contribution guidelines.
- **docs, modules, good-first-issue**
  - Document the public API for `SmoothScroll` and `SequenceController` in code comments or a separate file.

## Test
- **test, core, intermediate**
  - Add unit tests for `SmoothScroll` and `SequenceController` to ensure scroll and frame logic work as expected.

## Discussion
- **discussion, animation, proposal-required**
  - Should we support reduced motion for users with `prefers-reduced-motion`? How should animations degrade?
