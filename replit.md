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
- Complete inquiry form with fields for:
  - Full Name, Email, Phone
  - Number of Passengers
  - Origin & Destination locations
  - **Special Requests & Route Notes** textarea
- Dialog-based submission flow

### 3. Empty Leg Subscription (empty-leg/page.tsx)
- Enhanced subscription modal with:
  - Full Name input field
  - Email input field
  - **Consent checkbox** (must be checked to enable Subscribe button)
  - Clear consent message about mailing list
- Form validation and reset on successful subscription

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
- **Email**: EmailJS integration

## File Structure
```
src/
├── app/
│   ├── page.tsx (Home/Landing page)
│   ├── private-charter/page.tsx
│   └── empty-leg/page.tsx
├── components/
│   └── landing-page/
│       ├── BookFlight.tsx (Main search component)
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

## TypeScript Status
✅ No LSP errors - all code compiles successfully

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
