# UI Design System

## Overview

This document defines the UI design guidelines for the Travel AI platform.

The design goal is to create a modern, clean, and visually engaging travel website inspired by modern travel platforms.

The interface should feel:

modern
minimal
interactive
mobile friendly
visually rich

---

# Design Style

Design inspiration:

modern SaaS dashboards
travel booking platforms
AI assistant style UI

Key UI principles:

clean layouts
large hero images
soft gradients
rounded components
minimal text
strong visual hierarchy

---

# Color Palette

Primary Color

#4F46E5

Usage

buttons
primary highlights
navigation active states

---

Secondary Color

#06B6D4

Usage

links
hover effects
accent UI elements

---

Background Color

#F8FAFC

Usage

main page background

---

Dark Background

#0F172A

Usage

footer
dark sections

---

Card Background

#FFFFFF

Usage

destination cards
content sections

---

Text Colors

Primary text

#111827

Secondary text

#6B7280

---

Error / Validation Colors

Error Red

#DC2626

Usage

form validation error text
invalid input borders
error alert banners

Error Background

#FEF2F2

Usage

error alert banner background

Error Border

#FECACA

Usage

error alert banner border

---

Success Colors

Success Green

#16A34A

Usage

success messages
toast notifications

Success Background

#F0FDF4

Usage

success toast background

---

Example Color System

Primary: Indigo
Accent: Cyan
Background: Light Gray
Cards: White
Error: Red (#DC2626)
Success: Green (#16A34A)

---

# Typography

Primary Font

Inter

Fallback

system-ui
sans-serif

---

Font Sizes

Heading 1

48px

Heading 2

32px

Heading 3

24px

Body Text

16px

Small Text

14px

Error Text

14px (color: #DC2626, displayed below input fields)

---

# Layout Structure

Main layout structure

Navbar
Hero Section
Destination Explorer
AI Trip Planner
Map Visualization
Featured Destinations
Footer

---

# Navbar

Sticky navigation bar

Content

Logo
Destinations
AI Planner
Map
Login / Signup

Style

transparent background
blur effect on scroll

Height

72px

---

# Hero Section

Full width section at top

Content

background travel image
headline
search input
CTA button

Example headline

"Discover Your Next Adventure"

CTA button

Plan Trip

Hero height

80vh

---

# Destination Cards

Grid layout showing travel destinations

Card structure

Image
Place Name
Location
Rating
Explore Button

Style

rounded corners
soft shadow
hover animation

Card size

320px width

---

# AI Trip Planner Section

User input area for generating itinerary

Fields (managed by Formik, validated by Yup)

destination
budget
trip duration
interests

Button

Generate Trip (uses LoadingButton component with spinner during API call)

Output

AI generated itinerary cards

---

# Map Visualization

Interactive map showing travel route

Features

markers for locations
route lines between destinations
zoom controls

Technology

Mapbox GL JS

---

# Destination Detail Page

Layout

Large banner image
Destination description
Ratings
Map location
Nearby attractions

Sections

Overview
Things to do
Best time to visit
Travel tips

---

# Grid System

Container width

1200px

Responsive breakpoints

Mobile

<640px

Tablet

640px to 1024px

Desktop

>1024px

---

# UI Components

## Buttons

Primary button

indigo background
white text
rounded

Secondary button

border style
indigo text

LoadingButton (reusable)

extends primary button
shows spinner icon when isLoading={true}
disables click during loading
text changes (e.g. "Sign in" → "Signing in...")

---

## Cards

rounded-lg
shadow-md
padding 16px

---

## Inputs

rounded
border gray
focus border indigo
**error state: border #DC2626, error text #DC2626 below field**

---

## FormField Component (reusable)

A shared component rendering:
- Label (text-sm, font-medium, text-[#111827])
- Input (styled per design system)
- Error message (text-sm, text-[#DC2626], visible only when touched + invalid)

Used across all forms (Login, Register, AI Search) to enforce consistent styling.

---

## Toast / Notification Component (reusable)

A lightweight popup notification appearing at the top-right of the screen.

Variants:
- **Success**: green left border, green icon, light green background
- **Error**: red left border, red icon, light red background
- **Info**: indigo left border, indigo icon, light indigo background

Auto-dismisses after 4 seconds. Can be manually dismissed via close button.

---

# Animations

Use subtle animations

hover scale

card lift

fade transitions

Recommended library

Framer Motion

---

# Mobile Design

Mobile layout priorities

stacked components
larger tap targets
collapsible navigation

Menu

hamburger menu

---

# Form Validation UX Patterns

**Validation Timing**:
- Validate on blur (when user leaves the field)
- Validate on submit (all fields at once)
- Do NOT validate on every keystroke (too aggressive)

**Error Display**:
- Inline error text appears immediately below the invalid field
- Input border changes to #DC2626 (error red) when invalid
- Error text uses 14px, color #DC2626
- Errors clear automatically when the user corrects the input

**Empty State**:
- Required fields show "Required" or "[Field name] is required" on empty blur
- Email fields show "Invalid email address" for format errors
- Password fields show "Password must be at least 6 characters" for length errors

---

# Accessibility

Ensure:

contrast ratio above 4.5
keyboard navigation
aria labels for buttons
aria-describedby linking inputs to their error messages (for screen readers)
aria-invalid on inputs with validation errors

---

# UI Libraries

Recommended stack

TailwindCSS
Headless UI
Framer Motion
Mapbox GL
Formik (form state management)
Yup (schema-based validation)

---

# Example Page Flow

Homepage

Hero section
Destination grid
AI trip generator
Featured trips
Map preview
Footer

---

# Design Goals

modern travel experience
clean UI
fast loading
mobile friendly
engaging visuals
consistent form validation UX
reusable component library