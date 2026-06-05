import nodemailer from "nodemailer";

// Initialize email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send welcome email
export async function sendWelcomeEmail(userEmail, userName) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@seekremotejobs.com",
      to: userEmail,
      subject: "Welcome to SeekRemoteJobs! 🚀",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #667eea;">Welcome to SeekRemoteJobs, ${userName}!</h1>
          <p>You're now ready to find your dream remote job with AI-powered assistance.</p>
          
          <div style="background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Get Started:</h3>
            <ol>
              <li>Upload your resume</li>
              <li>Get AI-powered ATS optimization</li>
              <li>Find matching jobs</li>
              <li>Generate personalized cover letters</li>
            </ol>
          </div>
          
          <p><a href="${process.env.APP_URL}/dashboard" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">© 2026 SeekRemoteJobs. All rights reserved.</p>
        </div>
      `,
    });
    console.log(`✅ Welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error("Email send error:", error);
  }
}

// Send newsletter
export async function sendNewsletter(userEmail, userName, content) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@seekremotejobs.com",
      to: userEmail,
      subject: "Your Weekly Remote Jobs Digest 💼",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #667eea;">Your Weekly Remote Jobs Digest</h1>
          <p>Hi ${userName},</p>
          
          <p>Here are this week's top remote job opportunities matching your profile:</p>
          
          ${content}
          
          <p><a href="${process.env.APP_URL}/dashboard" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View More Jobs</a></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">© 2026 SeekRemoteJobs. All rights reserved.</p>
        </div>
      `,
    });
    console.log(`✅ Newsletter sent to ${userEmail}`);
  } catch (error) {
    console.error("Newsletter send error:", error);
  }
}

// Send job alerts
export async function sendJobAlerts(userEmail, userName, jobs) {
  if (!jobs || jobs.length === 0) {
    return;
  }

  try {
    const jobsList = jobs
      .slice(0, 5)
      .map(
        (job) => `
      <div style="border: 1px solid #e5e7eb; padding: 15px; margin: 10px 0; border-radius: 8px;">
        <h3 style="margin: 0 0 5px 0; color: #1f2937;">${job.title}</h3>
        <p style="margin: 0 0 10px 0; color: #6b7280;"><strong>${job.company}</strong></p>
        <p style="margin: 0 0 10px 0; color: #6b7280;">📍 ${job.location || "Remote"}</p>
        <a href="${job.url}" style="color: #667eea; text-decoration: none; font-weight: 600;">Apply Now →</a>
      </div>
    `
      )
      .join("");

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@seekremotejobs.com",
      to: userEmail,
      subject: `🎯 ${jobs.length} New Remote Jobs Match Your Profile`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #667eea;">New Job Opportunities!</h1>
          <p>Hi ${userName},</p>
          
          <p>We found ${jobs.length} remote jobs that match your resume and preferences:</p>
          
          ${jobsList}
          
          <p><a href="${process.env.APP_URL}/dashboard" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View All Matches</a></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">© 2026 SeekRemoteJobs. All rights reserved.</p>
        </div>
      `,
    });
    console.log(`✅ Job alerts sent to ${userEmail}`);
  } catch (error) {
    console.error("Job alert send error:", error);
  }
}

// Send ATS optimization report
export async function sendATSReport(userEmail, userName, score, recommendations) {
  try {
    const recList = recommendations
      .map((rec) => `<li style="margin: 5px 0; color: #374151;">${rec}</li>`)
      .join("");

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@seekremotejobs.com",
      to: userEmail,
      subject: `📊 Your ATS Score: ${Math.round(score)}%`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #667eea;">Your ATS Analysis Report</h1>
          <p>Hi ${userName},</p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <div style="font-size: 48px; font-weight: 700; margin-bottom: 10px;">${Math.round(score)}%</div>
            <div style="font-size: 18px;">ATS Score</div>
          </div>
          
          <h3 style="color: #1f2937;">Recommendations:</h3>
          <ul style="color: #374151;">
            ${recList}
          </ul>
          
          <p><a href="${process.env.APP_URL}/dashboard" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Optimize Your Resume</a></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">© 2026 SeekRemoteJobs. All rights reserved.</p>
        </div>
      `,
    });
    console.log(`✅ ATS report sent to ${userEmail}`);
  } catch (error) {
    console.error("ATS report send error:", error);
  }
}

export default {
  sendWelcomeEmail,
  sendNewsletter,
  sendJobAlerts,
  sendATSReport,
};
