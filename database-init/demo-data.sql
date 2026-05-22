-- =============================================================
-- Hirevia — Portfolio Mockup Seed Data
-- =============================================================
-- Prerequisites:
--   1. Run init.sql first (creates tables & enums)
--   2. Run `python scripts/seed_admin.py` (creates head_admin)
--   3. Requires pgcrypto extension (enabled by default on Supabase)
-- Then run this file in Supabase SQL Editor or psql.
--
-- Note: applicant emails are fictional. On Resend free tier, email
-- notifications only deliver to your verified address — status changes
-- still work; undeliverable emails are silently ignored.
-- =============================================================

-- ============================================================
-- JOBS
-- ============================================================

INSERT INTO jobs (user_id, title, job_type, description, requirements, headcount, min_salary, max_salary, urgent, status, published_at, created_at, updated_at)
VALUES

-- Open jobs (visible on public site) ---------------------------

(1, 'Senior Software Engineer', 'full_time',
 'We are looking for a Senior Software Engineer to join our growing engineering team. You will design and build scalable backend systems, collaborate with cross-functional teams, and mentor junior engineers to help them grow.',
 '- Bachelor''s degree in Computer Science or related field
- 5+ years of software engineering experience
- Proficient in Python, Go, or Node.js
- Experience with cloud platforms (AWS, GCP, or Azure)
- Strong knowledge of SQL and NoSQL databases
- Experience with microservices and distributed systems',
 3, 80000, 120000, TRUE, 'open',
 NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

(1, 'Product Designer (UX/UI)', 'full_time',
 'Join our product team as a Product Designer. You will own the end-to-end design process — from user research and wireframes to high-fidelity prototypes and design system maintenance. Your work directly shapes how users experience our product.',
 '- Portfolio showcasing UX and UI work
- 3+ years of product design experience
- Expert in Figma and prototyping tools
- Experience conducting user research and usability testing
- Ability to communicate design decisions clearly to stakeholders
- Experience maintaining a design system is a plus',
 2, 55000, 80000, FALSE, 'open',
 NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

(1, 'Data Analyst', 'full_time',
 'We are seeking a Data Analyst to transform raw data into actionable insights. You will work closely with product and business teams to build dashboards, run analyses, and support data-driven decisions that move the company forward.',
 '- Bachelor''s degree in Statistics, Mathematics, or related field
- 2+ years of experience in data analysis
- Proficient in SQL and Python (pandas, matplotlib, seaborn)
- Experience with BI tools such as Tableau, Looker, or Power BI
- Strong storytelling and communication skills
- Familiarity with A/B testing methodologies is a plus',
 1, 45000, 65000, FALSE, 'open',
 NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),

(1, 'Marketing Manager', 'full_time',
 'Lead our marketing efforts as a Marketing Manager. You will develop and execute go-to-market strategies, manage multi-channel campaigns, and grow our brand presence. You will work directly with the leadership team to shape company messaging.',
 '- 5+ years of marketing experience in a B2B or SaaS environment
- Proven track record of running successful digital campaigns
- Expertise in SEO, SEM, and social media marketing
- Strong analytical mindset with comfort reading data and dashboards
- Excellent written and verbal communication skills
- Experience with HubSpot or similar CRM is a plus',
 1, 60000, 90000, FALSE, 'open',
 NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

(1, 'Frontend Intern', 'internship',
 'Exciting internship opportunity for aspiring frontend developers. You will work alongside our engineering team to build and improve our web applications using React and modern frontend technologies. Real code shipped to production — not just toy projects.',
 '- Currently pursuing a degree in Computer Science or related field
- Solid foundation in HTML, CSS, and JavaScript
- Familiarity with React or another modern framework is a plus
- Eagerness to learn, ask questions, and collaborate
- Basic understanding of Git and version control',
 2, 15000, 20000, TRUE, 'open',
 NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),

(1, 'Backend Intern', 'internship',
 'Join our backend team and get hands-on experience building APIs, working with databases, and shipping features that reach real users. You will be paired with a senior engineer who will mentor you throughout the internship.',
 '- Currently pursuing a degree in Computer Science or related field
- Basic knowledge of Python, Node.js, or any backend language
- Familiarity with REST APIs and HTTP concepts
- Willingness to take ownership and learn from feedback
- Knowledge of SQL basics is a plus',
 2, 15000, 18000, FALSE, 'open',
 NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

(1, 'DevOps / Platform Engineer', 'full_time',
 'We are looking for a DevOps Engineer to own our infrastructure and deployment pipelines. You will improve reliability, reduce deployment friction, and work closely with engineering teams to build a platform they love.',
 '- 3+ years of DevOps or platform engineering experience
- Proficient with Kubernetes and Docker
- Experience with CI/CD tools (GitHub Actions, Jenkins, or CircleCI)
- Strong knowledge of AWS or GCP
- Infrastructure-as-Code experience (Terraform or Pulumi)
- On-call experience and comfort with incident response',
 1, 70000, 100000, FALSE, 'open',
 NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- Draft job (not visible on public site) ----------------------

(1, 'QA Engineer', 'full_time',
 'We are hiring a QA Engineer to raise the quality bar across all our products. You will design test plans, write automated tests, and work closely with developers to catch bugs before they reach users.',
 '- 2+ years of QA or SDET experience
- Experience with test automation frameworks (Selenium, Playwright, or Cypress)
- Strong skills in writing test cases, bug reports, and test plans
- Familiarity with Agile/Scrum workflows
- Experience with API testing (Postman or similar) is a plus',
 1, 40000, 60000, FALSE, 'draft',
 NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Closed job ---------------------------------------------------

(1, 'Data Science Intern', 'internship',
 'Work alongside our data team on machine learning projects and data pipelines. You will apply statistical methods and ML models to solve real business problems with real data.',
 '- Currently pursuing a degree in Data Science, Statistics, or Computer Science
- Proficient in Python (scikit-learn, pandas, numpy)
- Basic understanding of machine learning concepts and model evaluation
- Strong mathematical and statistical background
- Experience with Jupyter notebooks',
 1, 15000, 18000, FALSE, 'closed',
 NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days', NOW() - INTERVAL '5 days'),

-- Archived job -------------------------------------------------

(1, 'Full Stack Developer', 'full_time',
 'We were looking for a Full Stack Developer to help build our internal tooling and customer-facing features. This role has been filled.',
 '- 3+ years of full stack development experience
- Proficient in React and Python or Node.js
- Experience with PostgreSQL
- Comfortable working across the full stack independently',
 1, 60000, 90000, FALSE, 'closed',
 NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days', NOW() - INTERVAL '30 days');

-- Archive the Full Stack Developer job
UPDATE jobs
SET is_archived = TRUE, archived_at = NOW() - INTERVAL '30 days'
WHERE title = 'Full Stack Developer';

-- ============================================================
-- APPLICATIONS
-- ============================================================

INSERT INTO applications (job_id, email, first_name, last_name, phone, resume_url, portfolio_url, status, interview_date, created_at, updated_at)
VALUES

-- Senior Software Engineer ------------------------------------
((SELECT id FROM jobs WHERE title = 'Senior Software Engineer'),
 'alex.chen@gmail.com', 'Alex', 'Chen', '081-234-5678',
 'https://storage.supabase.co/resumes/alex_chen_resume.pdf',
 'https://github.com/alexchen',
 'offer', NULL,
 NOW() - INTERVAL '9 days', NOW() - INTERVAL '1 day'),

((SELECT id FROM jobs WHERE title = 'Senior Software Engineer'),
 'priya.sharma@gmail.com', 'Priya', 'Sharma', '082-345-6789',
 'https://storage.supabase.co/resumes/priya_sharma_resume.pdf',
 'https://linkedin.com/in/priyasharma',
 'interview', NOW() + INTERVAL '3 days',
 NOW() - INTERVAL '8 days', NOW() - INTERVAL '2 days'),

((SELECT id FROM jobs WHERE title = 'Senior Software Engineer'),
 'james.wilson@outlook.com', 'James', 'Wilson', '083-456-7890',
 'https://storage.supabase.co/resumes/james_wilson_resume.pdf',
 NULL,
 'screening', NULL,
 NOW() - INTERVAL '7 days', NOW() - INTERVAL '3 days'),

((SELECT id FROM jobs WHERE title = 'Senior Software Engineer'),
 'sofia.rodriguez@gmail.com', 'Sofia', 'Rodriguez', '084-567-8901',
 'https://storage.supabase.co/resumes/sofia_rodriguez_resume.pdf',
 'https://sofiadev.io',
 'rejected', NULL,
 NOW() - INTERVAL '9 days', NOW() - INTERVAL '4 days'),

((SELECT id FROM jobs WHERE title = 'Senior Software Engineer'),
 'kevin.park@gmail.com', 'Kevin', 'Park', '085-678-9012',
 'https://storage.supabase.co/resumes/kevin_park_resume.pdf',
 'https://github.com/kevinpark',
 'applied', NULL,
 NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Product Designer (UX/UI) ------------------------------------
((SELECT id FROM jobs WHERE title = 'Product Designer (UX/UI)'),
 'emma.johnson@gmail.com', 'Emma', 'Johnson', '086-789-0123',
 'https://storage.supabase.co/resumes/emma_johnson_resume.pdf',
 'https://emma.design',
 'interview', NOW() + INTERVAL '5 days',
 NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 day'),

((SELECT id FROM jobs WHERE title = 'Product Designer (UX/UI)'),
 'liam.nguyen@gmail.com', 'Liam', 'Nguyen', '087-890-1234',
 'https://storage.supabase.co/resumes/liam_nguyen_resume.pdf',
 'https://behance.net/liamnguyen',
 'screening', NULL,
 NOW() - INTERVAL '6 days', NOW() - INTERVAL '2 days'),

((SELECT id FROM jobs WHERE title = 'Product Designer (UX/UI)'),
 'nara.kim@gmail.com', 'Nara', 'Kim', '088-901-2345',
 'https://storage.supabase.co/resumes/nara_kim_resume.pdf',
 'https://dribbble.com/narakim',
 'applied', NULL,
 NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- Data Analyst ------------------------------------------------
((SELECT id FROM jobs WHERE title = 'Data Analyst'),
 'michael.brown@gmail.com', 'Michael', 'Brown', '089-012-3456',
 'https://storage.supabase.co/resumes/michael_brown_resume.pdf',
 NULL,
 'offer', NULL,
 NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),

((SELECT id FROM jobs WHERE title = 'Data Analyst'),
 'isabella.martin@gmail.com', 'Isabella', 'Martin', '081-123-4567',
 'https://storage.supabase.co/resumes/isabella_martin_resume.pdf',
 'https://github.com/isabellamartin',
 'rejected', NULL,
 NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'),

-- Marketing Manager -------------------------------------------
((SELECT id FROM jobs WHERE title = 'Marketing Manager'),
 'oliver.thompson@gmail.com', 'Oliver', 'Thompson', '082-234-5678',
 'https://storage.supabase.co/resumes/oliver_thompson_resume.pdf',
 'https://linkedin.com/in/oliverthompson',
 'screening', NULL,
 NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day'),

((SELECT id FROM jobs WHERE title = 'Marketing Manager'),
 'charlotte.white@gmail.com', 'Charlotte', 'White', '083-345-6789',
 'https://storage.supabase.co/resumes/charlotte_white_resume.pdf',
 NULL,
 'applied', NULL,
 NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

-- Frontend Intern ---------------------------------------------
((SELECT id FROM jobs WHERE title = 'Frontend Intern'),
 'ethan.lee@gmail.com', 'Ethan', 'Lee', '084-456-7890',
 'https://storage.supabase.co/resumes/ethan_lee_resume.pdf',
 'https://github.com/ethanlee',
 'interview', NOW() + INTERVAL '2 days',
 NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),

((SELECT id FROM jobs WHERE title = 'Frontend Intern'),
 'mia.garcia@gmail.com', 'Mia', 'Garcia', '085-567-8901',
 'https://storage.supabase.co/resumes/mia_garcia_resume.pdf',
 NULL,
 'screening', NULL,
 NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),

((SELECT id FROM jobs WHERE title = 'Frontend Intern'),
 'noah.anderson@gmail.com', 'Noah', 'Anderson', '086-678-9012',
 'https://storage.supabase.co/resumes/noah_anderson_resume.pdf',
 'https://github.com/noahanderson',
 'applied', NULL,
 NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Backend Intern ----------------------------------------------
((SELECT id FROM jobs WHERE title = 'Backend Intern'),
 'ava.martinez@gmail.com', 'Ava', 'Martinez', '087-789-0123',
 'https://storage.supabase.co/resumes/ava_martinez_resume.pdf',
 'https://github.com/avamartinez',
 'screening', NULL,
 NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),

((SELECT id FROM jobs WHERE title = 'Backend Intern'),
 'william.taylor@gmail.com', 'William', 'Taylor', '088-890-1234',
 'https://storage.supabase.co/resumes/william_taylor_resume.pdf',
 NULL,
 'applied', NULL,
 NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- DevOps / Platform Engineer ----------------------------------
((SELECT id FROM jobs WHERE title = 'DevOps / Platform Engineer'),
 'chloe.evans@gmail.com', 'Chloe', 'Evans', '089-901-2345',
 'https://storage.supabase.co/resumes/chloe_evans_resume.pdf',
 'https://linkedin.com/in/chloeevans',
 'applied', NULL,
 NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Data Science Intern (closed — historical) -------------------
((SELECT id FROM jobs WHERE title = 'Data Science Intern'),
 'sophia.jackson@gmail.com', 'Sophia', 'Jackson', '081-234-5670',
 'https://storage.supabase.co/resumes/sophia_jackson_resume.pdf',
 'https://kaggle.com/sophiajackson',
 'offer', NULL,
 NOW() - INTERVAL '55 days', NOW() - INTERVAL '30 days'),

((SELECT id FROM jobs WHERE title = 'Data Science Intern'),
 'benjamin.harris@gmail.com', 'Benjamin', 'Harris', '082-345-6780',
 'https://storage.supabase.co/resumes/benjamin_harris_resume.pdf',
 NULL,
 'rejected', NULL,
 NOW() - INTERVAL '54 days', NOW() - INTERVAL '35 days');

-- Stamp rejected_at on all rejected applications
UPDATE applications
SET rejected_at = updated_at
WHERE status = 'rejected';

-- ============================================================
-- APPLICATION TOKENS (magic links)
-- ============================================================

INSERT INTO application_tokens (application_id, token, created_at, expires_at)
SELECT
    a.id,
    encode(digest(a.email || a.id::text || random()::text, 'sha256'), 'hex'),
    a.created_at,
    a.created_at + INTERVAL '30 days'
FROM applications a;
