# Vision Fly - Private Jet Charter Booking Website

## Project Overview
Vision Fly is a modern, Air Canada-inspired private jet charter booking website built with Next.js. The platform features flight search, private charter inquiry, and empty leg subscriptions with a horizontal search layout and full mobile responsiveness.

## Current Status
✅ **COMPLETE** - All MVP features implemented and compiled successfully

## Key Features Implemented

### 1. Flight Search Component (BookFlight.tsx)
- **Horizontal white card layout** with airport code displays
- **Trip type selector** (One-way / Round-trip with conditional rendering)
- **Unified date picker system**:
  - One-way trips: Single departure date
  - Round-trip: Departure + Return date pickers
- **Passenger counter** with +/- controls (adults & children)
- **Swap button** (shows ArrowRight for one-way, ArrowLeftRight for round-trip)
- **Booking inquiry modal** that triggers on search submit with:
  - Dynamic passenger name inputs based on total count
  - Email and phone fields
  - Success message

### 2. Private Charter Page (private-charter/page.tsx)
- **Redesigned to match BookFlight style** with Air Canada-inspired UI
- **Hero Section**: "Your Schedule, Your Rules." headline with luxury subheadline
- **Search Card Interface**:
  - Airport autocomplete for origin/destination (same GitHub API as BookFlight)
  - Date picker with calendar
  - Passengers dropdown (1-16 passengers)
  - "Request Charter" CTA button
- **Charter Request Modal** ("Customize Your Private Journey"):
  - Full Name, Email, Phone fields
  - "Additional Travel Needs" textarea with placeholder for catering, pets, aircraft preference
  - "Receive Quote" submit button
  - Trust message: "Our charter team will send a bespoke quote within 2 hours"
- **Nodemailer Integration**: Uses server-side API route for dual-email system (admin + user confirmation)

### 3. Empty Leg Subscription (empty-leg/page.tsx)
- Enhanced subscription modal with:
  - Full Name input field
  - Email input field
  - **Consent checkbox** (must be checked to enable Subscribe button)
  - Clear consent message about mailing list
- Form validation and reset on successful subscription
- **Dynamic date generation**: Flight dates calculated relative to current date (today, tomorrow, +3 days, etc.)
- **EmailJS Integration**: Inquiry forms now send via unified EmailJS service

### 4. Mobile Responsiveness
- Vertical stack layout on mobile devices
- Horizontal layout on desktop (md breakpoint)
- Full-width inputs on mobile, auto-width on desktop
- Responsive font sizes and spacing

## Technical Stack
- **Framework**: Next.js 14.2.5
- **Styling**: Tailwind CSS + Emotion
- **UI Components**: Radix UI (Dialog, Popover, Select, Tabs)
- **Form Management**: React Hook Form + Zod validation
- **Date Handling**: date-fns, dayjs, react-day-picker
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Email**: Nodemailer (server-side) + EmailJS (client-side for BookFlight)

## File Structure
```
src/
├── app/
│   ├── page.tsx (Home/Landing page)
│   ├── private-charter/page.tsx
│   ├── empty-leg/page.tsx
│   └── api/
│       ├── booking/route.ts (Booking inquiry email handler)
│       ├── contact/route.ts (Contact form email handler)
│       └── private-charter/route.ts (Charter request email handler)
├── components/
│   └── landing-page/
│       ├── BookFlight.tsx (Main search component)
│       ├── ContactUs.tsx (Contact form with API integration)
│       └── [other components]
├── lib/
│   └── utils.ts
└── styles/
    └── globals.css
```

## State Management
**BookFlight.tsx** uses local React state for:
- `tripType`: "one-way" | "round-trip"
- `adults`, `children`: Passenger counts
- `date`, `returnDate`: Selected dates
- `originAirport`, `destinationAirport`: Airport selections
- `showBookingModal`: Modal visibility
- `passengerNames`: Array of passenger names
- `bookingEmail`, `bookingPhone`: Contact info

## Design Patterns
- **Air Canada-inspired**: Large airport code displays, clean white cards
- **Responsive grid**: Flexbox with mobile-first breakpoints
- **Modal dialogs**: Radix UI for accessibility
- **Form validation**: React Hook Form with Zod schemas
- **Toast notifications**: User feedback on actions

## Recent Changes (Turn 5)
- ✅ Fixed duplicate `returnDate` variable by renaming round-trip version to `roundTripReturnDate`
- ✅ Added booking inquiry modal with passenger name inputs
- ✅ Implemented conditional return date picker (shows only for round-trip)
- ✅ Updated swap button icon logic (ArrowRight vs ArrowLeftRight)
- ✅ Added mobile responsive classes to search layout
- ✅ Enhanced Private Charter with Special Requests field
- ✅ Enhanced Empty Leg with Full Name and consent checkbox
- ✅ Added button disabled state when consent not checked

## Recent Changes (Turn 6 - Visual & UX Refinements)
- ✅ **Removed obsolete buttons**: Deleted 'One Way' and 'Round Trip' toggle buttons from top of search card
- ✅ **Unified dropdown styling**: 
  - Trip Type dropdown now uses customBlue (#065777) background with white text
  - Passenger button styled to match with customBlue background, white text, rounded corners
  - Both components are now visually consistent primary interactive elements
- ✅ **Enabled input editing**: 
  - Airport fields (Departing from / Arriving in) now fully editable
  - Selected airports display with "Click to change" hint
  - Clicking on selected airport clears it and allows new search
  - User can type/backspace/delete freely in input mode
- ✅ **Preserved state management**:
  - Trip Type dropdown still correctly toggles Return Date visibility
  - One-way trips: Show only Departure date
  - Round-trip: Show both Departure and Return dates
- ✅ **Mobile responsive layout**: Top row (Trip Type & Passengers) now stacks on mobile with gap adjustments

## Recent Changes (Turn 7 - Air Canada UX Redesign with GitHub Airports API)
- ✅ **GitHub Airports API**: Refactored fetchAirports to use https://raw.githubusercontent.com/mwgg/Airports/master/airports.json instead of OpenPoint API
- ✅ **Client-side filtering**: Implemented filterAirports function that searches across IATA code, city, country, and airport name
- ✅ **Empty state icons**: 
  - Departure field displays large PlaneTakeoff icon (light gray) when empty
  - Arrival field displays large PlaneLanding icon (light gray) when empty
- ✅ **Selected state (Big Code Display)**:
  - Shows 3-letter airport code in large (text-4xl) bold blue text
  - Displays city and country underneath in smaller text
  - Shows "Click to change" hint with clickable interaction
  - Clicking reverts to edit mode with pre-filled text for easy modification
- ✅ **Rich autocomplete dropdown** with three-level hierarchy:
  - Left: Blue badge with 3-letter IATA code (bold, white text on customBlue background)
  - Right (Top): City, Country (e.g., "Lagos, Nigeria") in bold text
  - Right (Bottom): Full airport name in smaller gray text (e.g., "Murtala Muhammed International Airport")
  - Clean separation with hover effects on blue background
- ✅ **Mobile responsiveness**:
  - Airport input boxes stack vertically on mobile
  - All elements (Trip Type, Passengers, Dates) stack below airports for seamless mobile UX
  - Larger touch targets for mobile usability (p-6, min-h-28)
- ✅ **Vertical layout**: Changed from horizontal md:flex-row to flex-col for proper mobile-first stacking

## Recent Changes (Turn 8 - Private Charter Redesign & Bug Fixes)
- ✅ **Completely redesigned Private Charter page** to match BookFlight component:
  - Added One-Way/Round-Trip toggle dropdown
  - Added passenger counter with +/- controls for Adults and Children
  - PlaneTakeoff icon for departure field when empty
  - PlaneLanding icon for arrival field when empty
  - Large 3-letter IATA code display when airport selected
  - "Click to change" hint on selected airports
  - Blue badge autocomplete dropdown with city, country, and airport name
  - Swap button (ArrowRight for one-way, ArrowLeftRight for round-trip)
  - Conditional Return Date picker (only shows for round-trip)
  - Uses same GitHub Airports API as BookFlight
- ✅ **Fixed duplicate button text bug** on Empty Leg page:
  - Removed duplicate "Send Inquiry" text from hero CTA button
  - Removed duplicate "Send Inquiry" text from Subscribe button
  - Removed duplicate "Send Inquiry" text from mobile flight cards
  - All buttons now display correctly on both mobile and desktop
- ✅ **Mobile responsive button text**: Request Charter button shows "Request" on mobile

## Recent Changes (Turn 9 - EmailJS Multiple Passenger Support)
- ✅ **Updated EmailJS template variables** for both BookFlight and Private Charter:
  - `contact_name`: Main contact's full name (first passenger in BookFlight, form fullName in Charter)
  - `contact_email`: Main contact's email address
  - `contact_phone`: Main contact's phone number
  - `passenger_count`: Total number of passengers (adults + children)
  - `passenger_list`: Newline-separated list of ALL passenger names for Passenger Manifest
- ✅ **Added Passenger Manifest to Private Charter modal**:
  - Dynamically generates input fields based on passenger count
  - Each passenger gets their own named input field
  - Validation ensures all passenger names are filled before submission
  - Clear labeling with "Passenger Manifest *" section
- ✅ **Unified template structure**: Both BookFlight and Private Charter now use consistent variable naming

## Recent Changes (Turn 12 - Request Quote Auto-Fill Integration)
- ✅ **Updated Route Page Buttons**:
  - "Request Quote" button now links to /private-charter with query params
  - Passes origin, originCode, destination, destinationCode in URL
  - "Request Quote Now" CTA section also updated with same linking
- ✅ **Private Charter URL Param Reading**:
  - Added useSearchParams hook to read URL parameters
  - Wrapped component in Suspense boundary for Next.js compliance
  - Auto-fills origin and destination airports from URL params
  - Uses paramsApplied state to prevent re-applying on re-renders
- ✅ **Seamless User Flow**:
  - User clicks "Request Quote" on any route page (e.g., Lagos to Abuja)
  - Redirected to Private Charter with origin/destination pre-filled
  - User only needs to select date, passengers, and submit

## Recent Changes (Turn 11 - Programmatic SEO for Nigerian Routes)
- ✅ **Routes Data Source** (`lib/routesData.ts`):
  - 12 popular Nigerian flight routes with SEO-optimized descriptions
  - Each route includes: slug, origin/destination, price, duration, description
  - Helper functions: getRouteBySlug(), getAllRouteSlugs()
- ✅ **Dynamic Route Pages** (`app/routes/[slug]/page.tsx`):
  - Professional landing page design with hero section and pricing
  - SEO metadata via generateMetadata in layout.tsx
  - Route details, contact info, and related routes sidebar
  - Call-to-action buttons linking to contact/quote forms
  - 404 not-found page for invalid slugs
- ✅ **Footer Internal Linking**:
  - "Popular Nigerian Routes" section with links to all route pages
  - Grid layout with 10 route links for SEO crawlability
  - Copyright section with navigation links

## Recent Changes (Turn 10 - Dual Email System with Nodemailer)
- ✅ **Contact Form API Route** (`/api/contact/route.ts`):
  - Sends dual emails on form submission
  - Email 1 (Admin): Full inquiry details to `process.env.GMAIL_USER`
  - Email 2 (User): Confirmation with Vision Fly branding
- ✅ **Private Charter API Route** (`/api/private-charter/route.ts`):
  - New server-side route replacing client-side EmailJS
  - Sends dual emails (admin notification + user confirmation)
  - Includes passenger manifest, trip details, and notes
- ✅ **Booking Inquiry API Route** (`/api/booking/route.ts`):
  - New server-side route for BookFlight component
  - Sends dual emails (admin notification + user confirmation)
  - Includes flight details and passenger manifest
- ✅ **User Confirmation Email Template**:
  - Subject: "We received your request - Vision Fly"
  - Body: Thank you message with flight operations scanning notification
  - Same template used for Contact, Private Charter, and Booking
- ✅ **Error Handling**: User confirmation email failure doesn't block admin email
- ✅ **Removed EmailJS dependency** from Private Charter and BookFlight (now uses fetch to API)

## TypeScript Status
✅ All code compiles successfully (minor type assertions for filtered airports)
✅ All components render correctly with Fast Refresh enabled
✅ GitHub API data populates airport details with rich information

## Next Steps (If Needed)
- Backend API integration for flight search
- Payment processing integration
- User authentication system
- Admin dashboard for managing flights
- Database integration for storing inquiries

## Running the Project
```bash
npm run dev
```
Server runs on: http://0.0.0.0:5000

## Deployment
Project is ready for Replit publishing with production-optimized Next.js server.
