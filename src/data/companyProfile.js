// Options and fictional defaults for the recruiter's Company Profile. Defaults extend the existing
// TechFlow Inc. demo company; contact details use example.com addresses and are not real.
import { RECRUITER_COMPANY } from './recruiterJobs.js'

export const INDUSTRIES = [
  'SaaS / Software',
  'FinTech',
  'EdTech',
  'HealthTech',
  'E-commerce',
  'IT Services & Consulting',
  'Manufacturing',
  'Media & Entertainment',
  'Other',
]
export const COMPANY_SIZES = ['1–10', '11–50', '51–200', '201–500', '501–1,000', '1,001–5,000', '5,000+']
export const COMPANY_TYPES = ['Startup', 'Private limited', 'Public company', 'MNC', 'Non-profit', 'Government']
export const WORK_MODES = ['Remote', 'Hybrid', 'On-site']
export const BENEFITS = [
  'Health insurance',
  'Remote work',
  'Flexible hours',
  'Learning budget',
  'ESOPs',
  'Paid parental leave',
  'Wellness allowance',
  'Free meals',
  'Relocation support',
  'Annual bonus',
]

export const MAX_LOGO_BYTES = 1024 * 1024
export const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']

export function createDefaultCompanyProfile() {
  return {
    logo: null, // data URL of an uploaded image, kept in this browser only
    name: RECRUITER_COMPANY.name,
    tagline: 'Developer tools and analytics for growing SaaS teams',
    industry: RECRUITER_COMPANY.industry,
    size: '201–500',
    type: 'Private limited',
    founded: '2016',
    overview: RECRUITER_COMPANY.overview,
    mission: 'Help every product team ship faster with clear, trustworthy data.',
    values: ['Ownership', 'Customer first', 'Learn fast', 'Inclusive by default'],
    website: 'https://techflow.example.com',
    hrEmail: 'careers@techflow.example.com',
    phone: '+91 80 4000 1234',
    headquarters: RECRUITER_COMPANY.location,
    address: '4th Floor, Demo Tech Park, Outer Ring Road, Bengaluru 560103',
    offices: ['Pune, India', 'Hyderabad, India'],
    benefits: ['Health insurance', 'Remote work', 'Flexible hours', 'Learning budget', 'ESOPs'],
    workModes: ['Hybrid', 'Remote'],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    departments: ['Engineering', 'Data', 'Design'],
    interviewProcess: 'Application review → Online assessment → Technical interview → Culture-fit chat → Offer',
    gstin: '',
    cin: '',
  }
}

// Fields that count towards profile completeness, with the label shown when one is missing.
export const COMPLETENESS_FIELDS = [
  ['logo', 'Logo'],
  ['tagline', 'Tagline'],
  ['overview', 'About the company'],
  ['mission', 'Mission'],
  ['values', 'Values'],
  ['website', 'Website'],
  ['hrEmail', 'HR email'],
  ['phone', 'Phone'],
  ['address', 'Address'],
  ['benefits', 'Benefits'],
  ['techStack', 'Tech stack'],
  ['interviewProcess', 'Interview process'],
  ['gstin', 'GSTIN (verification)'],
]
