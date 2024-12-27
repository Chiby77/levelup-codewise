export interface SupportResponse {
  message: string;
  resources: string[];
  followUp: string;
}

export const mentalHealthResponses: Record<string, SupportResponse> = {
  "depression": {
    message: "I hear you, and I want you to know that feeling this way is completely valid. Depression can be overwhelming, but you're not alone in this journey. While I'm here to listen and support you, it's important to reach out to mental health professionals who can provide the help you deserve.",
    resources: [
      "Student Counseling Services at your university",
      "Zimbabwe National Crisis Helpline: +263 714 884 203",
      "Friendship Bench Zimbabwe",
      "CONTACT Family Counselling Centre: +263 4 721999"
    ],
    followUp: "Would you like to talk more about what you're experiencing, or would you prefer information about professional support services?"
  },
  "anxiety": {
    message: "I understand that anxiety can be really challenging to deal with, especially during your studies. Your feelings are valid, and it's brave of you to speak up about this.",
    resources: [
      "Student Wellness Center",
      "Zimbabwe Institute of Systemic Therapy",
      "Adult Rape Clinic (ARC) Trust Crisis Line: +263 775 672 770"
    ],
    followUp: "Would you like to learn about some coping strategies that might help, or would you prefer information about professional support?"
  },
  "stress": {
    message: "Academic pressure can be intense, and it's completely normal to feel stressed. Taking care of your mental well-being is just as important as your studies.",
    resources: [
      "University Health Services",
      "Study Skills Center",
      "Student Support Groups"
    ],
    followUp: "Would you like to explore some stress management techniques, or would you prefer to talk about what's causing your stress?"
  }
};