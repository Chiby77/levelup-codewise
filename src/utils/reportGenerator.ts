import jsPDF from 'jspdf';
import bluewaveLogoUrl from '@/assets/bluewave-academy-logo.jpg';

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
  grade_details: Record<
    string,
    {
      score: number;
      maxScore: number;
      feedback: string;
      studentAnswer?: string;
      correctAnswer?: string;
      questionText?: string;
    }
  >;
}

const loadImageAsDataUrl = async (url: string): Promise<string> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load image: ${res.status}`);
  const blob = await res.blob();

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image blob'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
};

const addLogo = (pdf: jsPDF, imageDataUrl: string | null, x: number, y: number, size: number) => {
  // NOTE: jsPDF coords are in mm. x/y are top-left.
  if (imageDataUrl) {
    // JPG data URLs come back as data:image/jpeg;base64,...
    pdf.addImage(imageDataUrl, 'JPEG', x, y, size, size);
    return;
  }

  // Fallback if image fails to load
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(x, y, size, size, 2, 2, 'F');

  pdf.setTextColor(10, 35, 81);
  pdf.setFontSize(size * 0.55);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BW', x + size * 0.18, y + size * 0.68);
};

// Helper function to generate AI feedback comment based on answer correctness
const generateFeedbackComment = (isCorrect: boolean, hasPartialMarks: boolean, score: number, maxScore: number): string => {
  if (isCorrect) {
    const praises = [
      "Excellent! Your answer was correct.",
      "Well done! You answered this question correctly.",
      "Perfect! Your response demonstrates a strong understanding.",
      "Great work! Your answer was spot on."
    ];
    return praises[Math.floor(Math.random() * praises.length)];
  } else if (hasPartialMarks) {
    const percentage = Math.round((score / maxScore) * 100);
    if (percentage >= 70) {
      return `Good attempt! You earned ${score}/${maxScore} marks. Your answer was mostly correct with minor gaps.`;
    } else if (percentage >= 50) {
      return `Partial credit awarded (${score}/${maxScore} marks). Your answer showed understanding but was incomplete.`;
    } else {
      return `You received ${score}/${maxScore} marks. Review the correct answer to improve your understanding.`;
    }
  } else {
    const feedback = [
      "Incorrect. Please review the correct answer shown above to understand the expected response.",
      "Your answer was not correct. Study the correct answer carefully for future reference.",
      "This needs improvement. Compare your answer with the correct solution provided."
    ];
    return feedback[Math.floor(Math.random() * feedback.length)];
  }
};

// Helper to safely wrap text and calculate height
const wrapText = (pdf: jsPDF, text: string, maxWidth: number): string[] => {
  const cleanText = String(text || '').replace(/\s+/g, ' ').trim();
  return pdf.splitTextToSize(cleanText, maxWidth);
};

export const generatePDFReport = async (submission: Submission, questions?: Question[]) => {
  const pdf = new jsPDF();

  // Embed the real Bluewave Academy logo in the header (fallback to text if it can't load)
  const logoDataUrl = await loadImageAsDataUrl(bluewaveLogoUrl).catch(() => null);
  
  // Bluewave Academy color scheme
  const colors = {
    primary: [10, 35, 81] as const,       // Navy blue (Bluewave brand)
    secondary: [76, 175, 80] as const,    // Success green  
    accent: [255, 152, 0] as const,       // Warning orange
    danger: [220, 53, 69] as const,       // Error red
    dark: [33, 33, 33] as const,          // Near black
    light: [248, 249, 250] as const,      // Near white
    muted: [108, 117, 125] as const,      // Gray
    lightBlue: [230, 240, 255] as const,  // Light blue for backgrounds
  };

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = 0;

  // === HEADER SECTION ===
  pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.rect(0, 0, pageWidth, 55, 'F');

  // Logo area (top-left in the header)
  addLogo(pdf, logoDataUrl, 16, 14, 24);
  // Header text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BLUEWAVE ACADEMY', 52, 22);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('A Level Computer Science Excellence | Powered by Bluewave Technologies', 52, 32);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EXAMINATION RESULTS REPORT', 52, 46);

  // === STUDENT INFO SECTION ===
  yPos = 65;
  
  pdf.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
  pdf.roundedRect(margin, yPos, contentWidth, 38, 3, 3, 'F');
  pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(margin, yPos, contentWidth, 38, 3, 3, 'S');
  
  pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  
  // Left column
  pdf.text('Student Name:', margin + 5, yPos + 10);
  pdf.text('Email Address:', margin + 5, yPos + 19);
  pdf.text('Submission Date:', margin + 5, yPos + 28);
  
  // Right column
  pdf.text('Time Taken:', 115, yPos + 10);
  pdf.text('Report ID:', 115, yPos + 19);
  pdf.text('Status:', 115, yPos + 28);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(submission.student_name.toUpperCase(), margin + 45, yPos + 10);
  pdf.text(submission.student_email || 'Not provided', margin + 45, yPos + 19);
  pdf.text(new Date(submission.submitted_at).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }), margin + 50, yPos + 28);
  pdf.text(`${submission.time_taken_minutes || 0} minutes`, 145, yPos + 10);
  pdf.text(submission.id.substring(0, 8).toUpperCase(), 145, yPos + 19);
  
  pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text('GRADED', 145, yPos + 28);

  // === SCORE SECTION ===
  yPos = 110;
  const percentage = Math.round((submission.total_score / submission.max_score) * 100);
  
  let gradeColor: number[] = [...colors.danger];
  let gradeLetter = 'F';
  let gradeText = 'Needs Improvement';
  
  if (percentage >= 90) {
    gradeColor = [...colors.secondary];
    gradeLetter = 'A';
    gradeText = 'Excellent Performance!';
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
    gradeText = 'Satisfactory';
  } else if (percentage >= 50) {
    gradeColor = [...colors.accent];
    gradeLetter = 'E';
    gradeText = 'Pass';
  }

  // Score box
  pdf.setFillColor(gradeColor[0], gradeColor[1], gradeColor[2]);
  pdf.roundedRect(margin, yPos, contentWidth, 50, 4, 4, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FINAL SCORE', margin + 10, yPos + 14);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(gradeText, margin + 10, yPos + 24);
  
  pdf.setFontSize(36);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${percentage}%`, margin + 10, yPos + 44);
  
  pdf.setFontSize(11);
  pdf.text(`${submission.total_score} / ${submission.max_score} marks`, margin + 55, yPos + 44);
  
  // Grade letter display
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(150, yPos + 10, 35, 32, 3, 3, 'F');
  pdf.setTextColor(gradeColor[0], gradeColor[1], gradeColor[2]);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Grade`, 154, yPos + 22);
  pdf.setFontSize(28);
  pdf.text(gradeLetter, 160, yPos + 38);

  // === DETAILED QUESTION ANALYSIS ===
  yPos = 170;
  
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DETAILED QUESTION ANALYSIS', margin, yPos);
  
  pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPos + 3, margin + 80, yPos + 3);
  
  yPos += 12;
  
  if (submission.grade_details) {
    let questionNum = 1;
    
    for (const [questionId, details] of Object.entries(submission.grade_details)) {
      const isCorrect = details.score === details.maxScore;
      const hasPartialMarks = details.score > 0 && !isCorrect;
      
      // Calculate space needed for this question (estimate)
      const questionLines = details.questionText ? wrapText(pdf, details.questionText, contentWidth - 10) : [];
      const correctAnswerLines = details.correctAnswer ? wrapText(pdf, String(details.correctAnswer), contentWidth - 20) : [];
      const studentAnswerLines = details.studentAnswer ? wrapText(pdf, String(details.studentAnswer), contentWidth - 20) : [];
      const feedbackComment = generateFeedbackComment(isCorrect, hasPartialMarks, details.score, details.maxScore);
      const feedbackLines = wrapText(pdf, feedbackComment, contentWidth - 20);
      
      const estimatedHeight = 25 + 
        (questionLines.length * 4) + 
        (correctAnswerLines.length * 4) + 8 +
        (studentAnswerLines.length * 4) + 8 +
        (feedbackLines.length * 4) + 15;
      
      // Check if we need a new page
      if (yPos + estimatedHeight > pageHeight - 35) {
        pdf.addPage();
        yPos = 25;
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('DETAILED QUESTION ANALYSIS (Continued)', margin, yPos);
        yPos += 12;
      }
      
      const boxColor = isCorrect ? colors.secondary : (hasPartialMarks ? colors.accent : colors.danger);
      
      // Question header bar
      pdf.setFillColor(boxColor[0], boxColor[1], boxColor[2]);
      pdf.roundedRect(margin, yPos, contentWidth, 9, 2, 2, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Question ${questionNum}`, margin + 5, yPos + 6);
      
      const scoreText = `${details.score}/${details.maxScore} marks (${Math.round((details.score / details.maxScore) * 100)}%)`;
      pdf.text(scoreText, pageWidth - margin - pdf.getTextWidth(scoreText) - 5, yPos + 6);
      
      yPos += 13;
      
      // Question text
      if (details.questionText && questionLines.length > 0) {
        pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Question:', margin + 3, yPos);
        yPos += 5;
        
        pdf.setFont('helvetica', 'normal');
        questionLines.slice(0, 4).forEach((line: string) => {
          pdf.text(line, margin + 3, yPos);
          yPos += 4;
        });
        if (questionLines.length > 4) {
          pdf.text('...', margin + 3, yPos);
          yPos += 4;
        }
        yPos += 2;
      }
      
      // Correct Answer section
      if (details.correctAnswer) {
        pdf.setFillColor(232, 245, 233); // Light green
        const correctBoxHeight = Math.max(14, (correctAnswerLines.length * 4) + 8);
        pdf.roundedRect(margin + 2, yPos - 2, contentWidth - 4, correctBoxHeight, 2, 2, 'F');
        
        pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CORRECT ANSWER:', margin + 5, yPos + 4);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
        pdf.setFontSize(8);
        
        let answerY = yPos + 4;
        correctAnswerLines.slice(0, 3).forEach((line: string, index: number) => {
          if (index === 0) {
            pdf.text(line, margin + 45, answerY);
          } else {
            answerY += 4;
            pdf.text(line, margin + 5, answerY);
          }
        });
        
        yPos += correctBoxHeight + 3;
      }
      
      // Student Answer section
      const studentAnswer = details.studentAnswer || '(No answer provided)';
      const displayStudentLines = wrapText(pdf, studentAnswer, contentWidth - 20);
      
      const studentBgColor = isCorrect ? [232, 245, 233] : [255, 235, 238]; // Light green or light red
      pdf.setFillColor(studentBgColor[0], studentBgColor[1], studentBgColor[2]);
      const studentBoxHeight = Math.max(14, (displayStudentLines.length * 4) + 8);
      pdf.roundedRect(margin + 2, yPos - 2, contentWidth - 4, studentBoxHeight, 2, 2, 'F');
      
      const labelColor = isCorrect ? colors.secondary : colors.danger;
      pdf.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text('YOUR ANSWER:', margin + 5, yPos + 4);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
      pdf.setFontSize(8);
      
      let studentY = yPos + 4;
      displayStudentLines.slice(0, 3).forEach((line: string, index: number) => {
        if (index === 0) {
          pdf.text(line, margin + 40, studentY);
        } else {
          studentY += 4;
          pdf.text(line, margin + 5, studentY);
        }
      });
      
      yPos += studentBoxHeight + 3;
      
      // AI Feedback Comment
      pdf.setFillColor(colors.lightBlue[0], colors.lightBlue[1], colors.lightBlue[2]);
      const feedbackBoxHeight = Math.max(12, (feedbackLines.length * 4) + 6);
      pdf.roundedRect(margin + 2, yPos - 2, contentWidth - 4, feedbackBoxHeight, 2, 2, 'F');
      
      pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      
      feedbackLines.forEach((line: string, index: number) => {
        pdf.text(line, margin + 5, yPos + 3 + (index * 4));
      });
      
      yPos += feedbackBoxHeight + 8;
      questionNum++;
    }
  }

  // === FOOTER ON ALL PAGES ===
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    
    // Footer line
    pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    pdf.setLineWidth(0.5);
    pdf.line(margin, pageHeight - 28, pageWidth - margin, pageHeight - 28);
    
    pdf.setTextColor(colors.muted[0], colors.muted[1], colors.muted[2]);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Bluewave Academy | Founded by Tinodaishe M. Chibi | Powered by Bluewave Technologies', margin, pageHeight - 21);
    pdf.text(`Generated: ${new Date().toLocaleString('en-GB')}`, margin, pageHeight - 14);
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 14);
    
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    pdf.text(`Report ID: BWA-${submission.id.substring(0, 8).toUpperCase()}`, margin, pageHeight - 7);
    
    // Small logo in footer
    pdf.setFontSize(8);
    pdf.text('BW', pageWidth - margin - 8, pageHeight - 7);
  }

  // Save the PDF
  const cleanName = submission.student_name.replace(/[^a-zA-Z0-9]/g, '_');
  pdf.save(`${cleanName}_Bluewave_Academy_Report.pdf`);
};
