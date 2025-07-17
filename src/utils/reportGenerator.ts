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
  
  // Header
  pdf.setFontSize(20);
  pdf.text('CS Experts Zimbabwe', 20, 30);
  pdf.setFontSize(16);
  pdf.text('Digital Examination Report', 20, 45);
  pdf.setFontSize(12);
  pdf.text('Powered by Intellix Inc | Founded by Tinodaishe M Chibi', 20, 55);
  
  // Student Info
  pdf.setFontSize(14);
  pdf.text('Student Information:', 20, 75);
  pdf.setFontSize(12);
  pdf.text(`Name: ${submission.student_name}`, 20, 85);
  if (submission.student_email) {
    pdf.text(`Email: ${submission.student_email}`, 20, 95);
  }
  pdf.text(`Submission Date: ${new Date(submission.submitted_at).toLocaleString()}`, 20, 105);
  pdf.text(`Time Taken: ${submission.time_taken_minutes || 0} minutes`, 20, 115);
  
  // Score
  pdf.setFontSize(16);
  const percentage = Math.round((submission.total_score / submission.max_score) * 100);
  pdf.text(`Final Score: ${submission.total_score}/${submission.max_score} (${percentage}%)`, 20, 135);
  
  // Download
  pdf.save(`${submission.student_name}_exam_report.pdf`);
};