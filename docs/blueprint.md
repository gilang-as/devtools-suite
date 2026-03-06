# **App Name**: DevTools Suite

## Core Features:

- Homepage Tool Listing: Displays all available tools in a responsive grid of cards, dynamically loaded from a configuration file, with each card linking to its respective tool page.
- Base64 Encode Tool: Provides an interface to encode text to Base64 with textarea input, encode button, output textarea, copy to clipboard, and optional live encoding.
- Base64 Decode Tool: Offers an interface to decode Base64 strings back to text, including textarea input, decode button, output textarea, and copy to clipboard.
- Theme Management: Allows users to switch between Light, Dark, and System theme modes, persisting their preference in localStorage using a theme provider.
- Internationalization (i18n): Supports multiple languages (English and Indonesian) with a language switcher, ensuring all UI text is translatable from external JSON files.
- Modular Tool Structure: Implements a highly modular and scalable architecture where new tools can be added by simply updating a configuration file, ensuring easy future expansion.
- SEO and Metadata: Automatically generates sitemap.xml and robots.txt, and provides unique title, description, and Open Graph tags for each page using Next.js metadata API.

## Style Guidelines:

- Based on a digital and technical aesthetic, the dark color scheme is designed for focus and reduced eye strain. The primary color, a bright yet balanced blue (#308CE8), provides clear calls to action and highlights, evoking reliability. The background is a very dark, subtle blue-gray (#161C1E), offering a professional canvas. An analogous aqua accent color (#63DBDB) is used for secondary interactive elements, ensuring visual hierarchy and energy.
- For clarity and a modern developer aesthetic, 'Inter' (sans-serif) will be used for all headlines and body text. For code snippets and the input/output text areas of the tools, 'Source Code Pro' (monospace sans-serif) will ensure readability and consistent formatting.
- Clean, crisp, and minimalistic line icons will be used throughout the application to complement the modern developer tool aesthetic. Icons should be clear and immediately recognizable for their function (e.g., copy, encode, decode, settings).
- A responsive and organized layout with a clear Header, persistent Navigation (sidebar or top, adaptable for mobile), Main Content area for tools, and a concise Footer. Elements like tool cards will utilize Radix UI components for consistent styling and accessibility.
- Subtle and functional animations will be incorporated to enhance user experience, such as smooth transitions for theme changes, gentle hover effects on tool cards, and clear loading indicators for asynchronous operations. These animations will be minimal to maintain a fast and unobtrusive UI.