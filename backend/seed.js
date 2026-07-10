require('dotenv').config();
const mongoose = require('mongoose');
const Person = require('./models/Person');

const DUMMY = [
  {
    fullName: 'مينا سمير جرجس',
    dateOfBirth: new Date('1995-03-14'),
    age: 29,
    education: 'بكالوريوس هندسة',
    job: 'مهندس مدني',
    fatherOfConfession: 'الأب بولس سمعان',
    phone: '01012345678',
    neighborhood: 'شبرا',
    visitNotes: 'شاب ملتزم بيحتاج متابعة روحية منتظمة',
  },
  {
    fullName: 'مريم وليم عزيز',
    dateOfBirth: new Date('2000-07-22'),
    age: 24,
    education: 'طالبة طب',
    job: 'طالبة',
    fatherOfConfession: 'الأب تادرس حنا',
    phone: '01098765432',
    neighborhood: 'مصر الجديدة',
    visitNotes: 'بتشارك في خدمة الأحد بانتظام',
  },
  {
    fullName: 'أنطوان فادي نصيف',
    dateOfBirth: new Date('1988-11-05'),
    age: 36,
    education: 'دبلوم تجارة',
    job: 'محاسب',
    fatherOfConfession: 'الأب بيشوي رفعت',
    phone: '01155544433',
    neighborhood: 'عين شمس',
    visitNotes: 'متجوز وعنده أولاد، محتاج دعم أسري',
  },
  {
    fullName: 'فيرونيكا جورج قلدس',
    dateOfBirth: new Date('2003-01-30'),
    age: 21,
    education: 'طالبة إعلام',
    job: 'طالبة',
    fatherOfConfession: 'الأب ميخائيل عزيز',
    phone: '01223344556',
    neighborhood: 'المطرية',
    visitNotes: 'جديدة في الخدمة، محتاجة توجيه',
  },
  {
    fullName: 'بيشوي نادر شنودة',
    dateOfBirth: new Date('1992-08-18'),
    age: 32,
    education: 'بكالوريوس تجارة',
    job: 'موظف حكومي',
    fatherOfConfession: 'الأب بولس سمعان',
    phone: '01067788990',
    neighborhood: 'شبرا',
    visitNotes: 'انقطع عن الكنيسة فترة، بيرجع تاني',
    isVisited: true,
    lastVisitedAt: new Date('2026-07-05'),
    visitLogs: [
      {
        visitedBy: 'خادم ميخائيل',
        visitDate: new Date('2026-07-05'),
        notes: 'الزيارة كانت كويسة، وعد إنه يرجع للاجتماعات',
      },
    ],
  },
  {
    fullName: 'مارينا رامي سعد',
    dateOfBirth: new Date('1998-05-11'),
    age: 26,
    education: 'بكالوريوس تربية',
    job: 'مدرسة ابتدائي',
    fatherOfConfession: 'الأب تادرس حنا',
    phone: '01099887766',
    neighborhood: 'المرج',
    visitNotes: 'بتخدم في فئة الأطفال، محتاجة تشجيع',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  await Person.insertMany(DUMMY);
  console.log(`✅ Inserted ${DUMMY.length} dummy records`);

  await mongoose.disconnect();
  console.log('✅ Done');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
