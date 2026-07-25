require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const SiteDetails = require('../models/SiteDetails');
const CMS = require('../models/CMS');
const PsychologicalTest = require('../models/PsychologicalTest');
const Workshop = require('../models/Workshop');
const Event = require('../models/Event');
const connectDB = require('../config/db');

const seed = async () => {
  await connectDB();

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    SiteDetails.deleteMany({}),
    CMS.deleteMany({}),
    PsychologicalTest.deleteMany({}),
    Workshop.deleteMany({}),
    Event.deleteMany({})
  ]);

  // Create admin user
  const admin = await User.create({
    fullName: 'Admin Counselor',
    email: 'admin@wakeupcounseling.com',
    password: 'Admin123@#$',
    phone: '+919876543210',
    role: 'admin'
  });

  // Create demo user
  await User.create({
    fullName: 'Demo User',
    email: 'demo@example.com',
    password: 'Demo123456',
    phone: '+919876543211',
    role: 'user'
  });

  // Site details
  await SiteDetails.create({
    title: 'Wake Up Counselling',
    tagline: 'Jabalpur',
    about: 'Wake Up Counselling is a professional counseling center in Jabalpur dedicated to mental health awareness, emotional well-being, and psychological support. We provide individual counseling, family therapy, career guidance, and psychological assessments.',
    address: 'Jabalpur, Madhya Pradesh, India',
    phone: '+919876543210',
    email: 'info@wakeupcounseling.com',
    whatsapp: '919876543210',
    facebook: 'https://facebook.com/wakeupcounseling',
    instagram: 'https://instagram.com/wakeupcounseling',
    linkedin: 'https://linkedin.com/company/wakeupcounseling'
  });

  // CMS Content
  const cmsData = [
    { key: 'home_panel_1', title: 'Individual Counseling', subtitle: '', body: 'Professional one-on-one counseling sessions to help you navigate life challenges, manage stress, and achieve personal growth.' },
    { key: 'home_panel_2', title: 'Family Therapy', subtitle: '', body: 'Strengthen family bonds and resolve conflicts through guided therapy sessions designed to improve communication and understanding.' },
    { key: 'home_panel_3', title: 'Career Guidance', subtitle: '', body: 'Expert career counseling to help you make informed decisions about your professional path and achieve your career goals.' },
    { key: 'about', title: 'About Wake Up Counselling', subtitle: 'Your Mental Health Matters', body: 'Wake Up Counselling Jabalpur is a premier counseling center dedicated to providing comprehensive mental health services. Our experienced counselor offers a safe, confidential, and supportive environment for individuals seeking professional guidance.\n\nWe believe in the power of counseling to transform lives. Whether you are dealing with anxiety, depression, relationship issues, career confusion, or simply want to understand yourself better, we are here to help.\n\nOur approach is client-centered, evidence-based, and tailored to meet your unique needs. We use proven therapeutic techniques to help you develop coping strategies, build resilience, and lead a more fulfilling life.' },
    { key: 'mission', title: 'To provide accessible, compassionate, and effective mental health services that empower individuals and families to lead healthier, more fulfilling lives.', subtitle: '', body: 'We are committed to breaking the stigma around mental health and making professional counseling accessible to everyone in Jabalpur and surrounding areas.' },
    { key: 'vision', title: 'To be the leading counseling center in Central India, recognized for excellence in mental health services and community impact.', subtitle: '', body: 'We envision a society where mental health is prioritized, stigma is eliminated, and every individual has access to the support they need to thrive.' },
    { key: 'testimonial_section', title: 'What Our Clients Say', body: 'Our clients have experienced transformative changes through our counseling services. Their stories inspire us to continue making a difference in the community.' }
  ];
  await CMS.insertMany(cmsData);

  // Psychological Tests
  await PsychologicalTest.create({
    title: 'Depression Screening (PHQ-9)',
    description: 'This screening helps assess the severity of depression symptoms. Answer each question based on how you have felt over the past 2 weeks.',
    category: 'Mental Health',
    duration: 10,
    questions: [
      { text: 'Little interest or pleasure in doing things', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 1 },
      { text: 'Feeling down, depressed, or hopeless', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 2 },
      { text: 'Trouble falling or staying asleep, or sleeping too much', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 3 },
      { text: 'Feeling tired or having little energy', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 4 },
      { text: 'Poor appetite or overeating', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 5 },
      { text: 'Feeling bad about yourself or that you are a failure', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 6 },
      { text: 'Trouble concentrating on things', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 7 },
      { text: 'Moving or speaking slowly, or being fidgety/restless', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 8 },
      { text: 'Thoughts that you would be better off dead or of hurting yourself', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 9 }
    ],
    scoringRules: [
      { minScore: 0, maxScore: 4, result: 'Minimal Depression', description: 'No treatment action needed. Monitor and follow up as clinically indicated.' },
      { minScore: 5, maxScore: 9, result: 'Mild Depression', description: 'Use clinical judgment about treatment, based on patient history and duration of symptoms. Consider counseling and self-help strategies.' },
      { minScore: 10, maxScore: 14, result: 'Moderate Depression', description: 'Treatment plan using antidepressant, psychotherapy, and/or combination. Counseling is recommended.' },
      { minScore: 15, maxScore: 19, result: 'Moderately Severe Depression', description: 'Active treatment with pharmacotherapy and/or psychotherapy is recommended. Please consult a counselor.' },
      { minScore: 20, maxScore: 27, result: 'Severe Depression', description: 'Immediate initiation of pharmacotherapy and referral for psychotherapy. Please seek professional help immediately.' }
    ],
    createdBy: admin._id
  });

  await PsychologicalTest.create({
    title: 'Generalized Anxiety Disorder (GAD-7)',
    description: 'This screening helps assess anxiety levels. Answer based on how you have felt over the past 2 weeks.',
    category: 'Mental Health',
    duration: 8,
    questions: [
      { text: 'Feeling nervous, anxious, or on edge', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 1 },
      { text: 'Not being able to stop or control worrying', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 2 },
      { text: 'Worrying too much about different things', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 3 },
      { text: 'Trouble relaxing', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 4 },
      { text: 'Being so restless that it is hard to sit still', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 5 },
      { text: 'Becoming easily annoyed or irritable', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 6 },
      { text: 'Feeling afraid as if something awful might happen', options: [{ text: 'Not at all', score: 0 }, { text: 'Several days', score: 1 }, { text: 'More than half the days', score: 2 }, { text: 'Nearly every day', score: 3 }], order: 7 }
    ],
    scoringRules: [
      { minScore: 0, maxScore: 4, result: 'Minimal Anxiety', description: 'No treatment action needed. This is a normal level of anxiety.' },
      { minScore: 5, maxScore: 9, result: 'Mild Anxiety', description: 'Monitor and consider self-help strategies, relaxation techniques, and counseling.' },
      { minScore: 10, maxScore: 14, result: 'Moderate Anxiety', description: 'Counseling recommended. Consider psychotherapy and discuss treatment options.' },
      { minScore: 15, maxScore: 21, result: 'Severe Anxiety', description: 'Active treatment recommended. Please consult a counselor for professional support.' }
    ],
    createdBy: admin._id
  });

  await PsychologicalTest.create({
    title: 'Stress Assessment Scale',
    description: 'Evaluate your current stress levels with this comprehensive assessment.',
    category: 'Stress',
    duration: 10,
    questions: [
      { text: 'How often do you feel overwhelmed by daily responsibilities?', options: [{ text: 'Never', score: 0 }, { text: 'Rarely', score: 1 }, { text: 'Sometimes', score: 2 }, { text: 'Often', score: 3 }, { text: 'Always', score: 4 }], order: 1 },
      { text: 'How often do you experience physical symptoms of stress (headaches, muscle tension)?', options: [{ text: 'Never', score: 0 }, { text: 'Rarely', score: 1 }, { text: 'Sometimes', score: 2 }, { text: 'Often', score: 3 }, { text: 'Always', score: 4 }], order: 2 },
      { text: 'How often do you have difficulty sleeping due to stress?', options: [{ text: 'Never', score: 0 }, { text: 'Rarely', score: 1 }, { text: 'Sometimes', score: 2 }, { text: 'Often', score: 3 }, { text: 'Always', score: 4 }], order: 3 },
      { text: 'How often do you feel irritable or short-tempered?', options: [{ text: 'Never', score: 0 }, { text: 'Rarely', score: 1 }, { text: 'Sometimes', score: 2 }, { text: 'Often', score: 3 }, { text: 'Always', score: 4 }], order: 4 },
      { text: 'How often do you find it hard to concentrate?', options: [{ text: 'Never', score: 0 }, { text: 'Rarely', score: 1 }, { text: 'Sometimes', score: 2 }, { text: 'Often', score: 3 }, { text: 'Always', score: 4 }], order: 5 },
      { text: 'How often do you feel emotionally drained?', options: [{ text: 'Never', score: 0 }, { text: 'Rarely', score: 1 }, { text: 'Sometimes', score: 2 }, { text: 'Often', score: 3 }, { text: 'Always', score: 4 }], order: 6 },
      { text: 'How often do you withdraw from social activities?', options: [{ text: 'Never', score: 0 }, { text: 'Rarely', score: 1 }, { text: 'Sometimes', score: 2 }, { text: 'Often', score: 3 }, { text: 'Always', score: 4 }], order: 7 },
      { text: 'How often do you use unhealthy coping mechanisms (overeating, substance use)?', options: [{ text: 'Never', score: 0 }, { text: 'Rarely', score: 1 }, { text: 'Sometimes', score: 2 }, { text: 'Often', score: 3 }, { text: 'Always', score: 4 }], order: 8 }
    ],
    scoringRules: [
      { minScore: 0, maxScore: 8, result: 'Low Stress', description: 'Your stress levels are within a healthy range. Continue maintaining your current coping strategies.' },
      { minScore: 9, maxScore: 16, result: 'Moderate Stress', description: 'You are experiencing moderate stress. Consider stress management techniques and self-care practices.' },
      { minScore: 17, maxScore: 24, result: 'High Stress', description: 'Your stress levels are elevated. Counseling is recommended to develop effective coping strategies.' },
      { minScore: 25, maxScore: 32, result: 'Very High Stress', description: 'You are experiencing very high stress levels. Professional counseling support is strongly recommended.' }
    ],
    createdBy: admin._id
  });

  // Sample Workshops
  await Workshop.insertMany([
    { title: 'Stress Management Workshop', body: '<p>Learn effective techniques to manage daily stress. This workshop covers breathing exercises, mindfulness practices, time management strategies, and cognitive behavioral techniques to help you cope with stress in a healthy way.</p><p><strong>Topics Covered:</strong></p><ul><li>Understanding stress triggers</li><li>Breathing and relaxation techniques</li><li>Mindfulness meditation</li><li>Time management skills</li><li>Building resilience</li></ul>', isFeatured: true, status: 'published' },
    { title: 'Anger Management Workshop', body: '<p>This workshop helps participants understand anger, identify triggers, and develop healthy ways to express and manage anger. Learn communication skills and emotional regulation techniques.</p><p><strong>Topics Covered:</strong></p><ul><li>Understanding anger cycles</li><li>Identifying personal triggers</li><li>Healthy expression of emotions</li><li>De-escalation techniques</li><li>Building emotional intelligence</li></ul>', isFeatured: true, status: 'published' },
    { title: 'Parenting Skills Workshop', body: '<p>Designed for parents who want to improve their relationship with their children. Learn positive parenting techniques, effective communication, and how to set healthy boundaries.</p><p><strong>Topics Covered:</strong></p><ul><li>Positive discipline strategies</li><li>Effective parent-child communication</li><li>Age-appropriate expectations</li><li>Building strong family bonds</li><li>Managing parental stress</li></ul>', isFeatured: true, status: 'published' },
    { title: 'Self-Esteem Building Workshop', body: '<p>Boost your self-confidence and develop a positive self-image. This workshop focuses on identifying negative thought patterns and replacing them with empowering beliefs.</p>', isFeatured: false, status: 'published' },
    { title: 'Relationship Counseling Workshop', body: '<p>Improve your interpersonal relationships through better communication, empathy, and conflict resolution skills. Suitable for couples and individuals.</p>', isFeatured: false, status: 'published' }
  ]);

  // Sample Events/Services
  await Event.insertMany([
    { title: 'Free Mental Health Awareness Camp', body: '<p>Join us for a free mental health awareness camp where you can learn about common mental health issues, get basic screening, and understand when to seek professional help.</p>', date: '2025-02-15', status: 'published' },
    { title: 'World Mental Health Day Event', body: '<p>Celebrating World Mental Health Day with talks, activities, and resources focused on mental well-being. Open to all members of the community.</p>', date: '2025-10-10', status: 'published' },
    { title: 'Youth Counseling Seminar', body: '<p>A special seminar addressing mental health challenges faced by young people including academic pressure, peer relationships, and career anxiety.</p>', date: '2025-03-20', status: 'published' },
    { title: 'Women Empowerment Workshop', body: '<p>A workshop dedicated to women mental health, self-care, work-life balance, and building supportive communities.</p>', date: '2025-03-08', status: 'published' }
  ]);

  console.log('Database seeded successfully');
  console.log('Admin login: admin@wakeupcounseling.com / Admin123@#$');
  console.log('Demo user: demo@example.com / Demo123456');
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
