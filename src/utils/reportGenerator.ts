import jsPDF from 'jspdf';

interface Submission {
  id: string;
  student_name: string;
  student_email?: string;
  submitted_at: string;
  total_score: number;
  max_score: number;
  time_taken_minutes?: number;
  answers: any;
  grade_details: any;
}

export const generatePDFReport = async (submission: Submission) => {
  const pdf = new jsPDF();
  
  // Colors and styling
  const primaryColor = [41, 128, 185]; // Blue
  const textColor = [52, 73, 94]; // Dark gray
  const successColor = [39, 174, 96]; // Green
  const warningColor = [243, 156, 18]; // Orange
  
  // Header with logo area
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(0, 0, 210, 40, 'F');
  
  // Logo placeholder (you can add actual logo later)
  pdf.setFillColor(255, 255, 255);
  pdf.circle(25, 20, 10, 'F');
  
  // Header text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CS EXPERTS ZIMBABWE', 45, 20);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Digital Examination Certificate', 45, 30);
  
  // Decorative line
  pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setLineWidth(2);
  pdf.line(20, 50, 190, 50);
  
  // Certificate content
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CERTIFICATE OF COMPLETION', 20, 70);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('This is to certify that', 20, 85);
  
  // Student name with decorative border
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text(submission.student_name.toUpperCase(), 20, 100);
  pdf.setLineWidth(0.5);
  pdf.line(20, 102, 20 + pdf.getTextWidth(submission.student_name.toUpperCase()), 102);
  
  // Reset text color
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('has successfully completed the digital examination', 20, 115);
  
  // Exam details box
  pdf.setFillColor(245, 245, 245);
  pdf.rect(20, 125, 170, 40, 'F');
  pdf.setDrawColor(200, 200, 200);
  pdf.rect(20, 125, 170, 40, 'S');
  
  pdf.setFontSize(11);
  pdf.text('Examination Details:', 25, 135);
  if (submission.student_email) {
    pdf.text(`Email: ${submission.student_email}`, 25, 145);
  }
  pdf.text(`Date: ${new Date(submission.submitted_at).toLocaleDateString()}`, 25, 155);
  pdf.text(`Duration: ${submission.time_taken_minutes || 0} minutes`, 100, 155);
  
  // Score section with visual elements
  const percentage = Math.round((submission.total_score / submission.max_score) * 100);
  const scoreColor = percentage >= 70 ? successColor : percentage >= 50 ? warningColor : [231, 76, 60];
  
  pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  pdf.rect(20, 180, 170, 35, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FINAL SCORE', 25, 195);
  
  pdf.setFontSize(28);
  pdf.text(`${percentage}%`, 130, 195);
  pdf.setFontSize(12);
  pdf.text(`${submission.total_score}/${submission.max_score} marks`, 130, 205);
  
  // Grade level
  const gradeText = percentage >= 80 ? 'EXCELLENT' : 
                   percentage >= 70 ? 'VERY GOOD' :
                   percentage >= 60 ? 'GOOD' :
                   percentage >= 50 ? 'SATISFACTORY' : 'NEEDS IMPROVEMENT';
  
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Grade: ${gradeText}`, 20, 230);
  
  // Question breakdown if available
  if (submission.grade_details) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Question Breakdown:', 20, 245);
    
    let yPos = 255;
    Object.entries(submission.grade_details).forEach(([questionId, details]: [string, any], index) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      const score = `Q${index + 1}: ${details.score}/${details.maxScore}`;
      const feedback = details.feedback.length > 50 ? 
        details.feedback.substring(0, 50) + '...' : details.feedback;
      
      pdf.text(score, 20, yPos);
      pdf.text(feedback, 60, yPos);
      yPos += 8;
    });
  }
  
  // Footer
  const pageHeight = pdf.internal.pageSize.height;
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Powered by Intellix Inc | Founded by Tinodaishe M Chibi', 20, pageHeight - 20);
  pdf.text('CS Experts Zimbabwe - Excellence in Computer Science Education', 20, pageHeight - 10);
  
  // Verification code (simple)
  const verificationCode = `CE-${submission.id.substring(0, 8).toUpperCase()}`;
  pdf.text(`Verification Code: ${verificationCode}`, 120, pageHeight - 10);
  
  // Download
  pdf.save(`${submission.student_name.replace(/\s+/g, '_')}_Exam_Certificate.pdf`);
};