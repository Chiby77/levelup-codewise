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
  
  // Set Times New Roman font (use built-in fonts for compatibility)
  pdf.setFont('times', 'normal');
  
  // Professional color scheme
  const primaryColor = [0, 51, 102]; // Navy blue
  const textColor = [33, 37, 41]; // Dark text
  const successColor = [25, 135, 84]; // Green
  const warningColor = [255, 193, 7]; // Yellow
  const dangerColor = [220, 53, 69]; // Red
  
  // Header section with professional styling
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(0, 0, 210, 45, 'F');
  
  // Institution logo area
  pdf.setFillColor(255, 255, 255);
  pdf.circle(25, 22.5, 12, 'F');
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setFontSize(10);
  pdf.setFont('times', 'bold');
  pdf.text('CS', 20, 25);
  
  // Header text with proper hierarchy
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('times', 'bold');
  pdf.text('CS EXPERTS ZIMBABWE', 45, 20);
  
  pdf.setFontSize(12);
  pdf.setFont('times', 'italic');
  pdf.text('Excellence in Computer Science Education', 45, 28);
  
  pdf.setFontSize(14);
  pdf.setFont('times', 'bold');
  pdf.text('DIGITAL EXAMINATION REPORT', 45, 38);
  
  // Decorative professional line
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(1);
  pdf.line(20, 55, 190, 55);
  
  // Certificate section with proper typography
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFontSize(16);
  pdf.setFont('times', 'bold');
  pdf.text('EXAMINATION COMPLETION CERTIFICATE', 20, 70);
  
  pdf.setFontSize(12);
  pdf.setFont('times', 'normal');
  pdf.text('This document certifies that', 20, 85);
  
  // Student name section with elegant presentation
  pdf.setFontSize(18);
  pdf.setFont('times', 'bold');
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  const studentName = submission.student_name.toUpperCase();
  pdf.text(studentName, 20, 100);
  
  // Underline with proper spacing
  const nameWidth = pdf.getTextWidth(studentName);
  pdf.setLineWidth(0.8);
  pdf.line(20, 103, 20 + nameWidth, 103);
  
  // Achievement statement
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFontSize(12);
  pdf.setFont('times', 'normal');
  pdf.text('has successfully completed the digital examination with the following results:', 20, 115);
  
  // Examination details in a clean table format
  pdf.setFillColor(248, 249, 250);
  pdf.rect(20, 125, 170, 45, 'F');
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.5);
  pdf.rect(20, 125, 170, 45, 'S');
  
  // Table headers and content
  pdf.setFontSize(11);
  pdf.setFont('times', 'bold');
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text('EXAMINATION DETAILS', 25, 135);
  
  pdf.setFont('times', 'normal');
  pdf.setFontSize(10);
  
  // Left column
  pdf.text('Student Email:', 25, 145);
  pdf.text('Examination Date:', 25, 152);
  pdf.text('Time Allocated:', 25, 159);
  pdf.text('Time Taken:', 25, 166);
  
  // Right column values
  pdf.text(submission.student_email || 'Not provided', 80, 145);
  pdf.text(new Date(submission.submitted_at).toLocaleDateString('en-GB'), 80, 152);
  pdf.text('As per examination requirements', 80, 159);
  pdf.text(`${submission.time_taken_minutes || 0} minutes`, 80, 166);
  
  // Score section with professional presentation
  const percentage = Math.round((submission.total_score / submission.max_score) * 100);
  let scoreColor = dangerColor;
  let gradeText = 'NEEDS IMPROVEMENT';
  let gradeDescription = 'Additional study required';
  
  if (percentage >= 80) {
    scoreColor = successColor;
    gradeText = 'EXCELLENT';
    gradeDescription = 'Outstanding performance';
  } else if (percentage >= 70) {
    scoreColor = successColor;
    gradeText = 'VERY GOOD';
    gradeDescription = 'Commendable achievement';
  } else if (percentage >= 60) {
    scoreColor = [40, 167, 69];
    gradeText = 'GOOD';
    gradeDescription = 'Satisfactory performance';
  } else if (percentage >= 50) {
    scoreColor = warningColor;
    gradeText = 'SATISFACTORY';
    gradeDescription = 'Meets minimum requirements';
  }
  
  // Score display box
  pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  pdf.rect(20, 185, 170, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('times', 'bold');
  pdf.text('FINAL EXAMINATION SCORE', 25, 200);
  
  // Large percentage display
  pdf.setFontSize(32);
  pdf.setFont('times', 'bold');
  pdf.text(`${percentage}%`, 135, 205);
  
  // Score breakdown
  pdf.setFontSize(11);
  pdf.setFont('times', 'normal');
  pdf.text(`Marks: ${submission.total_score} / ${submission.max_score}`, 135, 215);
  
  // Grade assessment
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFontSize(14);
  pdf.setFont('times', 'bold');
  pdf.text(`GRADE: ${gradeText}`, 20, 240);
  
  pdf.setFontSize(11);
  pdf.setFont('times', 'italic');
  pdf.text(gradeDescription, 20, 248);
  
  // Question-by-question breakdown
  if (submission.grade_details) {
    pdf.setFontSize(13);
    pdf.setFont('times', 'bold');
    pdf.text('DETAILED QUESTION ANALYSIS', 20, 265);
    
    let yPos = 275;
    let questionNumber = 1;
    
    Object.entries(submission.grade_details).forEach(([questionId, details]: [string, any]) => {
      // Check if we need a new page
      if (yPos > 270) {
        pdf.addPage();
        yPos = 30;
        pdf.setFont('times', 'bold');
        pdf.setFontSize(13);
        pdf.text('DETAILED QUESTION ANALYSIS (Continued)', 20, 20);
      }
      
      // Question header
      pdf.setFont('times', 'bold');
      pdf.setFontSize(10);
      pdf.text(`Question ${questionNumber}:`, 20, yPos);
      
      // Score display
      const questionScore = `${details.score}/${details.maxScore} marks`;
      const scorePercentage = Math.round((details.score / details.maxScore) * 100);
      
      pdf.setFont('times', 'normal');
      pdf.text(questionScore, 70, yPos);
      pdf.text(`(${scorePercentage}%)`, 120, yPos);
      
      yPos += 6;
      
      // Clean feedback text (remove emojis and format properly)
      let feedbackText = details.feedback
        .replace(/[📝📊⚡✅❌🌟👍]/g, '') // Remove emojis
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
      
      // Word wrap for feedback
      const maxWidth = 170;
      const words = feedbackText.split(' ');
      let line = '';
      
      pdf.setFont('times', 'italic');
      pdf.setFontSize(9);
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const testWidth = pdf.getTextWidth(testLine);
        
        if (testWidth > maxWidth && line !== '') {
          pdf.text(line.trim(), 25, yPos);
          line = word + ' ';
          yPos += 4;
        } else {
          line = testLine;
        }
      });
      
      if (line.trim() !== '') {
        pdf.text(line.trim(), 25, yPos);
        yPos += 4;
      }
      
      yPos += 6; // Space between questions
      questionNumber++;
    });
  }
  
  // Professional footer
  const pageHeight = pdf.internal.pageSize.height;
  
  // Footer separator line
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.line(20, pageHeight - 25, 190, pageHeight - 25);
  
  // Footer content
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(8);
  pdf.setFont('times', 'normal');
  pdf.text('This document was generated electronically by CS Experts Zimbabwe digital examination system.', 20, pageHeight - 18);
  pdf.text('Founded by Tinodaishe M Chibi | Powered by Intellix Inc', 20, pageHeight - 13);
  
  // Verification section
  const verificationCode = `CSE-${submission.id.substring(0, 8).toUpperCase()}-${new Date().getFullYear()}`;
  pdf.setFont('times', 'bold');
  pdf.text(`Document Verification Code: ${verificationCode}`, 20, pageHeight - 8);
  
  // Generation timestamp
  pdf.setFont('times', 'italic');
  pdf.text(`Generated: ${new Date().toLocaleString('en-GB')}`, 130, pageHeight - 8);
  
  // Download with corrected filename
  const cleanName = submission.student_name.replace(/[^a-zA-Z0-9]/g, '_');
  pdf.save(`${cleanName}_Examination_Report.pdf`);
};