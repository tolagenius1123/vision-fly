import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const USER_CONFIRMATION_SUBJECT = "We received your request - Vision Fly";

const USER_CONFIRMATION_BODY = `Hello,

Thank you for choosing Vision Fly. We have successfully received your request.

Our flight operations team is currently scanning our network to secure the most competitive rate for your journey. We are dedicated to providing you with premium air travel at the best possible value, so please allow us a brief moment to finalize the most affordable options for your specific route.

We will be in touch shortly.

Safe travels,
The Vision Fly Team`;

export async function POST(request: Request) {
  try {
    const { 
      contactName,
      contactEmail,
      contactPhone,
      tripType,
      origin,
      destination,
      departureDate,
      returnDate,
      passengerCount,
      passengerList
    } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: contactEmail,
      subject: `[Vision Fly Booking] New Inquiry from ${contactName}`,
      text: `
FLIGHT BOOKING INQUIRY

Contact Information:
- Name: ${contactName}
- Email: ${contactEmail}
- Phone: ${contactPhone}

Flight Details:
- Trip Type: ${tripType}
- Origin: ${origin}
- Destination: ${destination}
- Departure Date: ${departureDate}
- Return Date: ${returnDate || 'N/A (One-way)'}
- Passenger Count: ${passengerCount}

Passenger Manifest:
${passengerList || 'Not provided'}
      `,
      html: `
        <h2>Flight Booking Inquiry</h2>
        
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${contactEmail}</p>
        <p><strong>Phone:</strong> ${contactPhone}</p>
        
        <hr />
        
        <h3>Flight Details</h3>
        <p><strong>Trip Type:</strong> ${tripType}</p>
        <p><strong>Origin:</strong> ${origin}</p>
        <p><strong>Destination:</strong> ${destination}</p>
        <p><strong>Departure Date:</strong> ${departureDate}</p>
        <p><strong>Return Date:</strong> ${returnDate || 'N/A (One-way)'}</p>
        <p><strong>Passenger Count:</strong> ${passengerCount}</p>
        
        <hr />
        
        <h3>Passenger Manifest</h3>
        <p>${(passengerList || 'Not provided').replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    if (contactEmail && contactEmail.includes('@')) {
      try {
        const userMailOptions = {
          from: process.env.GMAIL_USER,
          to: contactEmail,
          subject: USER_CONFIRMATION_SUBJECT,
          text: USER_CONFIRMATION_BODY,
          html: USER_CONFIRMATION_BODY.replace(/\n/g, '<br>'),
        };
        await transporter.sendMail(userMailOptions);
      } catch (userEmailError) {
        console.error('Failed to send user confirmation email:', userEmailError);
      }
    }

    return NextResponse.json({ success: true, message: 'Booking inquiry submitted!' }, { status: 200 });

  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ success: false, message: 'Failed to send booking inquiry' }, { status: 500 });
  }
}
