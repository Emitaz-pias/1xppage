exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, name, country, phone, message } = JSON.parse(event.body);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email address' }) };
    }

    // Send email using Postmark
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': process.env.POSTMARK_API_TOKEN
      },
      body: JSON.stringify({
        From: process.env.POSTMARK_SENDER,
        To: email,
        Subject: 'Your Agent Application Has Been Received - 1xBet Support',
        HtmlBody: `
          <p>Dear ${name},</p>
          <p>Thank you for your interest in becoming a 1xBet agent. Your application has been received and is being reviewed.</p>
          <p><strong>Application Details:</strong></p>
          <ul>
            <li>Name: ${name}</li>
            <li>Email: ${email}</li>
            <li>Country: ${country}</li>
            <li>Phone: ${phone}</li>
            ${message ? `<li>Message: ${message}</li>` : ''}
          </ul>
          <p>We will contact you soon with more information.</p>
          <p>Best regards,<br>1xBet Support Team</p>
        `
      })
    });

    if (response.ok) {
      return { statusCode: 200, body: JSON.stringify({ message: 'Email sent successfully' }) };
    } else {
      const errorData = await response.json();
      console.error('Postmark error:', errorData);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send email', details: errorData }) };
    }
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
