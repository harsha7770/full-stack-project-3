const users = [
  { id: 1, email: 'alice@example.com', password: 'password123', name: 'Alice Smith', role: 'mentor', expertise: ['Web Development', 'React', 'Node.js'], experience: 10, hourlyRate: 100, bio: 'Senior Engineer with 10 years experience.' },
  { id: 2, email: 'bob@example.com', password: 'password123', name: 'Bob Johnson', role: 'mentor', expertise: ['Data Science', 'Python', 'Machine Learning'], experience: 5, hourlyRate: 75, bio: 'Data Scientist passionate about AI with 5 years experience.' },
  { id: 3, email: 'charlie@example.com', password: 'password123', name: 'Charlie Williams', role: 'mentee', interests: ['Web Development', 'UI/UX'], goals: 'Become a full-stack developer.' },
  { id: 4, email: 'diana@example.com', password: 'password123', name: 'Diana Prince', role: 'mentee', interests: ['Data Science', 'SQL'], goals: 'Transition to a data analysis role.' },
  { id: 5, email: 'admin@example.com', password: 'admin', name: 'System Admin', role: 'admin', expertise: [], bio: 'Platform Administrator.' },
  { id: 6, email: 'emily@example.com', password: 'password123', name: 'Emily Chen', role: 'mentor', expertise: ['Cybersecurity', 'Cloud Security'], experience: 8, hourlyRate: 90, bio: 'Helping protect modern cloud infrastructures.' },
  { id: 7, email: 'michael@example.com', password: 'password123', name: 'Michael Brown', role: 'mentor', expertise: ['Cloud Architecture', 'AWS'], experience: 12, hourlyRate: 120, bio: 'AWS certified architect with a focus on scalability.' },
  { id: 8, email: 'sarah@example.com', password: 'password123', name: 'Sarah Davis', role: 'mentor', expertise: ['UI/UX Design', 'Figma'], experience: 6, hourlyRate: 85, bio: 'Designing intuitive and beautiful user journeys.' },
  { id: 9, email: 'james@example.com', password: 'password123', name: 'James Wilson', role: 'mentor', expertise: ['Mobile Development', 'Flutter'], experience: 5, hourlyRate: 80, bio: 'Cross-platform mobile developer.' },
  { id: 10, email: 'jessica@example.com', password: 'password123', name: 'Jessica Taylor', role: 'mentor', expertise: ['Career Coaching', 'Interviews'], experience: 15, hourlyRate: 150, bio: 'Helping you land your dream tech job.' },
  { id: 11, email: 'david@example.com', password: 'password123', name: 'David Anderson', role: 'mentor', expertise: ['Frontend Engineering', 'Vue.js'], experience: 7, hourlyRate: 95, bio: 'Focused on creating performant web applications.' },
  { id: 12, email: 'linda@example.com', password: 'password123', name: 'Linda Martinez', role: 'mentor', expertise: ['Backend Systems', 'Go'], experience: 9, hourlyRate: 110, bio: 'Building reliable and scalable backend services.' },
  { id: 13, email: 'robert@example.com', password: 'password123', name: 'Robert Thomas', role: 'mentor', expertise: ['Product Management', 'Strategy'], experience: 11, hourlyRate: 140, bio: 'Bridging the gap between business and technology.' },
  { id: 14, email: 'patricia@example.com', password: 'password123', name: 'Patricia Garcia', role: 'mentor', expertise: ['Data Analytics', 'Tableau'], experience: 10, hourlyRate: 100, bio: 'Turning complex data into actionable insights.' },
  { id: 15, email: 'richard@example.com', password: 'password123', name: 'Richard Moore', role: 'mentor', expertise: ['Technical Writing', 'Documentation'], experience: 8, hourlyRate: 70, bio: 'Making technical concepts simple and clear.' },
  { id: 16, email: 'barbara@example.com', password: 'password123', name: 'Barbara Miller', role: 'mentor', expertise: ['DevOps', 'Docker', 'K8s'], experience: 9, hourlyRate: 130, bio: 'Optimizing deployment pipelines for speed.' },
  { id: 17, email: 'joseph@example.com', password: 'password123', name: 'Joseph Jackson', role: 'mentor', expertise: ['AI Research', 'PyTorch'], experience: 6, hourlyRate: 180, bio: 'Exploring the boundaries of deep learning.' },
  { id: 18, email: 'susan@example.com', password: 'password123', name: 'Susan White', role: 'mentor', expertise: ['Management', 'Agile'], experience: 20, hourlyRate: 200, bio: 'Expert in leading high-performing software teams.' },
];

const sessions = [
  { id: 1, mentorId: 1, menteeId: 3, date: '2026-04-10T10:00:00Z', time: '10:00 AM', duration: '60', status: 'scheduled', mode: 'Virtual', topic: 'React Best Practices', estimatedCost: 100 },
  { id: 2, mentorId: 2, menteeId: 4, date: '2026-03-12T14:30:00Z', time: '02:30 PM', duration: '30', status: 'completed', mode: 'Phone Call', topic: 'Intro to Pandas', estimatedCost: 38 },
  { id: 3, mentorId: 1, menteeId: 4, date: '2026-03-25T09:00:00Z', time: '09:00 AM', duration: '90', status: 'completed', mode: 'In Person', topic: 'System Design deep dive', estimatedCost: 150 },
  { id: 4, mentorId: 6, menteeId: 3, date: '2026-04-15T11:00:00Z', time: '11:00 AM', duration: '60', status: 'scheduled', mode: 'Virtual', topic: 'Network Security Audit', estimatedCost: 90 }
];

const matchings = [
  { id: 1, mentorId: 1, menteeId: 3, status: 'active', startDate: '2026-03-01T00:00:00Z' },
  { id: 2, mentorId: 2, menteeId: 4, status: 'active', startDate: '2026-03-15T00:00:00Z' }
];

const progress = [
  { id: 1, menteeId: 3, description: 'Completed a small React app for learning purposes.', date: '2026-03-20T00:00:00Z' },
  { id: 2, menteeId: 4, description: 'Finished a Pandas tutorial online.', date: '2026-03-25T00:00:00Z' }
];

module.exports = { users, sessions, matchings, progress };
