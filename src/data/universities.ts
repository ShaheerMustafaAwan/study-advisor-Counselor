export interface University {
  id: string;
  name: string;
  country: string;
  ranking: number;
  programs: string[];
  budget: number;
  partnered: boolean;
  requirements: string;
  description: string;
  website: string;
}

export const universities: University[] = [
  {
    id: "1",
    name: "University of Toronto",
    country: "Canada",
    ranking: 18,
    programs: ["Computer Science", "Engineering", "Business"],
    budget: 45000,
    partnered: true,
    requirements: "GPA 3.5+, IELTS 7.0+, SOP, 2 LORs",
    description: "A world-renowned public research university located in Toronto, Ontario. Known for cutting-edge research and diverse academic programs.",
    website: "https://www.utoronto.ca",
  },
  {
    id: "2",
    name: "University of Melbourne",
    country: "Australia",
    ranking: 14,
    programs: ["Data Science", "Medicine", "Law"],
    budget: 38000,
    partnered: true,
    requirements: "GPA 3.3+, IELTS 6.5+, SOP, Academic References",
    description: "Australia's leading university with a strong global reputation for research excellence and graduate employability.",
    website: "https://www.unimelb.edu.au",
  },
  {
    id: "3",
    name: "Imperial College London",
    country: "UK",
    ranking: 6,
    programs: ["Engineering", "Medicine", "Natural Sciences"],
    budget: 52000,
    partnered: false,
    requirements: "GPA 3.7+, IELTS 7.0+, Research Proposal, 3 LORs",
    description: "A world-class university specializing in science, engineering, medicine, and business in the heart of London.",
    website: "https://www.imperial.ac.uk",
  },
  {
    id: "4",
    name: "ETH Zurich",
    country: "Switzerland",
    ranking: 7,
    programs: ["Computer Science", "Physics", "Architecture"],
    budget: 3000,
    partnered: true,
    requirements: "GPA 3.6+, German/English Proficiency, Entrance Exam",
    description: "One of the world's leading universities for technology and natural sciences, consistently ranked among the top globally.",
    website: "https://ethz.ch",
  },
  {
    id: "5",
    name: "National University of Singapore",
    country: "Singapore",
    ranking: 8,
    programs: ["Business Analytics", "Engineering", "Computing"],
    budget: 30000,
    partnered: true,
    requirements: "GPA 3.4+, IELTS 6.5+, SOP, Portfolio",
    description: "Asia's top-ranked university offering world-class education with a focus on innovation and entrepreneurship.",
    website: "https://www.nus.edu.sg",
  },
  {
    id: "6",
    name: "University of British Columbia",
    country: "Canada",
    ranking: 34,
    programs: ["Environmental Science", "Business", "Arts"],
    budget: 40000,
    partnered: true,
    requirements: "GPA 3.3+, IELTS 6.5+, SOP, 2 LORs",
    description: "A global center for research and teaching, consistently ranked among the top 40 universities in the world.",
    website: "https://www.ubc.ca",
  },
  {
    id: "7",
    name: "Technical University of Munich",
    country: "Germany",
    ranking: 37,
    programs: ["Mechanical Engineering", "Informatics", "Management"],
    budget: 5000,
    partnered: false,
    requirements: "GPA 3.2+, German B2/English C1, Aptitude Test",
    description: "Germany's top technical university with strong industry connections and cutting-edge research facilities.",
    website: "https://www.tum.de",
  },
  {
    id: "8",
    name: "University of Sydney",
    country: "Australia",
    ranking: 19,
    programs: ["Medicine", "Law", "Engineering"],
    budget: 42000,
    partnered: true,
    requirements: "GPA 3.4+, IELTS 7.0+, Personal Statement, References",
    description: "Australia's first university, renowned for its research impact and beautiful campus in the heart of Sydney.",
    website: "https://www.sydney.edu.au",
  },
  {
    id: "9",
    name: "University of Amsterdam",
    country: "Netherlands",
    ranking: 53,
    programs: ["Social Sciences", "Economics", "AI"],
    budget: 15000,
    partnered: false,
    requirements: "GPA 3.0+, IELTS 6.5+, Motivation Letter",
    description: "A leading research university in Europe's most multicultural city, offering a wide range of English-taught programs.",
    website: "https://www.uva.nl",
  },
  {
    id: "10",
    name: "Korea Advanced Institute of Science and Technology",
    country: "South Korea",
    ranking: 42,
    programs: ["AI", "Robotics", "Electrical Engineering"],
    budget: 12000,
    partnered: true,
    requirements: "GPA 3.5+, TOEFL 80+/IELTS 6.5+, Research Plan",
    description: "South Korea's premier science and technology university, known for groundbreaking research and innovation.",
    website: "https://www.kaist.ac.kr",
  },
];

export const countries = [...new Set(universities.map((u) => u.country))];
export const allPrograms = [...new Set(universities.flatMap((u) => u.programs))];
