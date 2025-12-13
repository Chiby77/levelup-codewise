import jsPDF from 'jspdf';

interface Question {
  id: string;
  question_text: string;
  correct_answer?: string;
  marks: number;
}

interface Submission {
  id: string;
  student_name: string;
  student_email?: string;
  submitted_at: string;
  total_score: number;
  max_score: number;
  time_taken_minutes?: number;
  answers: Record<string, any>;
  grade_details: Record<string, {
    score: number;
    maxScore: number;
    feedback: string;
    studentAnswer?: string;
    correctAnswer?: string;
    questionText?: string;
  }>;
}

export const generatePDFReport = async (submission: Submission, questions?: Question[]) => {
  const pdf = new jsPDF();
  
  // Professional color scheme
  const colors = {
    primary: [25, 118, 210] as const,     // Professional blue
    secondary: [76, 175, 80] as const,    // Success green  
    accent: [255, 152, 0] as const,       // Warning orange
    danger: [244, 67, 54] as const,       // Error red
    dark: [33, 33, 33] as const,          // Near black
    light: [250, 250, 250] as const,      // Near white
    muted: [117, 117, 117] as const,      // Gray
  };

  let yPos = 0;

  // === HEADER SECTION ===
  pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.rect(0, 0, 210, 50, 'F');
  
  // Logo circle
  pdf.setFillColor(255, 255, 255);
  pdf.circle(25, 25, 12, 'F');
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CSE', 17, 28);
  
  // Header text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CS EXPERTS ZIMBABWE', 45, 22);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('A Level Computer Science Excellence', 45, 32);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EXAMINATION RESULTS REPORT', 45, 44);

  // === STUDENT INFO SECTION ===
  yPos = 60;
  
  pdf.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
  pdf.roundedRect(15, yPos, 180, 35, 3, 3, 'F');
  pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(15, yPos, 180, 35, 3, 3, 'S');
  
  pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Student Name:', 20, yPos + 10);
  pdf.text('Email:', 20, yPos + 18);
  pdf.text('Submission Date:', 20, yPos + 26);
  
  pdf.text('Time Taken:', 115, yPos + 10);
  pdf.text('Report ID:', 115, yPos + 18);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(submission.student_name.toUpperCase(), 55, yPos + 10);
  pdf.text(submission.student_email || 'Not provided', 55, yPos + 18);
  pdf.text(new Date(submission.submitted_at).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }), 55, yPos + 26);
  pdf.text(`${submission.time_taken_minutes || 0} minutes`, 145, yPos + 10);
  pdf.text(submission.id.substring(0, 8).toUpperCase(), 145, yPos + 18);

  // === SCORE SECTION ===
  yPos = 105;
  const percentage = Math.round((submission.total_score / submission.max_score) * 100);
  
  let gradeColor: number[] = [...colors.danger];
  let gradeLetter = 'F';
  let gradeText = 'Needs Improvement';
  
  if (percentage >= 90) {
    gradeColor = [...colors.secondary];
    gradeLetter = 'A';
    gradeText = 'Excellent Performance';
  } else if (percentage >= 80) {
    gradeColor = [...colors.secondary];
    gradeLetter = 'B';
    gradeText = 'Very Good Performance';
  } else if (percentage >= 70) {
    gradeColor = [0, 150, 136];
    gradeLetter = 'C';
    gradeText = 'Good Performance';
  } else if (percentage >= 60) {
    gradeColor = [...colors.accent];
    gradeLetter = 'D';
    gradeText = 'Satisfactory Performance';
  } else if (percentage >= 50) {
    gradeColor = [...colors.accent];
    gradeLetter = 'E';
    gradeText = 'Pass';
  }

  // Score box
  pdf.setFillColor(gradeColor[0], gradeColor[1], gradeColor[2]);
  pdf.roundedRect(15, yPos, 180, 45, 4, 4, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FINAL SCORE', 25, yPos + 15);
  
  pdf.setFontSize(40);
  pdf.text(`${percentage}%`, 25, yPos + 38);
  
  pdf.setFontSize(12);
  pdf.text(`${submission.total_score} / ${submission.max_score} marks`, 75, yPos + 38);
  
  // Grade display
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(145, yPos + 8, 40, 30, 3, 3, 'F');
  pdf.setTextColor(gradeColor[0], gradeColor[1], gradeColor[2]);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text(gradeLetter, 157, yPos + 30);
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.text(gradeText, 25, yPos + 20);

  // === DETAILED QUESTION ANALYSIS ===
  yPos = 160;
  
  pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DETAILED QUESTION ANALYSIS', 15, yPos);
  
  yPos += 10;
  
  if (submission.grade_details) {
    let questionNum = 1;
    
    for (const [questionId, details] of Object.entries(submission.grade_details)) {
      // Check if we need a new page
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('DETAILED QUESTION ANALYSIS (Continued)', 15, yPos);
        yPos += 10;
      }
      
      const isCorrect = details.score === details.maxScore;
      const boxColor = isCorrect ? colors.secondary : (details.score > 0 ? colors.accent : colors.danger);
      
      // Question box header
      pdf.setFillColor(boxColor[0], boxColor[1], boxColor[2]);
      pdf.roundedRect(15, yPos, 180, 8, 2, 2, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Question ${questionNum}`, 20, yPos + 6);
      pdf.text(`${details.score}/${details.maxScore} marks (${Math.round((details.score / details.maxScore) * 100)}%)`, 150, yPos + 6);
      
      yPos += 12;
      
      // Question text
      if (details.questionText) {
        pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Question:', 20, yPos);
        yPos += 5;
        
        pdf.setFont('helvetica', 'normal');
        const questionLines = pdf.splitTextToSize(details.questionText, 165);
        pdf.text(questionLines.slice(0, 3), 20, yPos);
        yPos += Math.min(questionLines.length, 3) * 4 + 3;
      }
      
      // Correct Answer
      if (details.correctAnswer) {
        pdf.setFillColor(232, 245, 233);
        pdf.roundedRect(18, yPos - 2, 175, 14, 2, 2, 'F');
        
        pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Correct Answer:', 22, yPos + 4);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
        const correctLines = pdf.splitTextToSize(String(details.correctAnswer), 130);
        pdf.text(correctLines[0], 60, yPos + 4);
        if (correctLines.length > 1) {
          pdf.text(correctLines[1], 22, yPos + 9);
        }
        yPos += 16;
      }
      
      // Student Answer
      if (details.studentAnswer !== undefined) {
        const studentAnswerColor = isCorrect ? [232, 245, 233] : [255, 235, 238];
        pdf.setFillColor(studentAnswerColor[0], studentAnswerColor[1], studentAnswerColor[2]);
        pdf.roundedRect(18, yPos - 2, 175, 14, 2, 2, 'F');
        
        const answerLabelColor = isCorrect ? colors.secondary : colors.danger;
        pdf.setTextColor(answerLabelColor[0], answerLabelColor[1], answerLabelColor[2]);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Your Answer:', 22, yPos + 4);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
        const studentAnswer = details.studentAnswer || '(No answer provided)';
        const answerLines = pdf.splitTextToSize(String(studentAnswer).substring(0, 200), 130);
        pdf.text(answerLines[0], 55, yPos + 4);
        if (answerLines.length > 1) {
          pdf.text(answerLines[1], 22, yPos + 9);
        }
        yPos += 16;
      }
      
      // Status indicator
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      if (isCorrect) {
        pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        pdf.text('✓ CORRECT', 20, yPos);
      } else if (details.score > 0) {
        pdf.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        pdf.text('◐ PARTIAL MARKS AWARDED', 20, yPos);
      } else {
        pdf.setTextColor(colors.danger[0], colors.danger[1], colors.danger[2]);
        pdf.text('✗ NEEDS REVIEW', 20, yPos);
      }
      
      yPos += 12;
      questionNum++;
    }
  }

  // === FOOTER ===
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    const pageHeight = pdf.internal.pageSize.height;
    
    pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    pdf.setLineWidth(0.5);
    pdf.line(15, pageHeight - 25, 195, pageHeight - 25);
    
    pdf.setTextColor(colors.muted[0], colors.muted[1], colors.muted[2]);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('CS Experts Zimbabwe | Founded by Tinodaishe M Chibi | Powered by Intellix Inc', 15, pageHeight - 18);
    pdf.text(`Generated: ${new Date().toLocaleString('en-GB')}`, 15, pageHeight - 12);
    pdf.text(`Page ${i} of ${pageCount}`, 175, pageHeight - 12);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Verification: CSE-${submission.id.substring(0, 8).toUpperCase()}`, 15, pageHeight - 6);
  }

  // Save the PDF
  const cleanName = submission.student_name.replace(/[^a-zA-Z0-9]/g, '_');
  pdf.save(`${cleanName}_Exam_Report.pdf`);
};
