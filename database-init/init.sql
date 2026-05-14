CREATE TYPE user_status AS ENUM ('active', 'suspended');
CREATE TYPE user_role AS ENUM ('head_admin', 'admin');
CREATE TYPE job_type AS ENUM ('full_time', 'internship', 'contract');
CREATE TYPE job_status AS ENUM ('open', 'closed', 'draft');
CREATE TYPE application_status AS ENUM ('applied', 'screening', 'interview', 'offer', 'rejected', 'declined');

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status user_status NOT NULL DEFAULT 'active',
    suspended_at TIMESTAMPTZ NULL,
    token_version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    role user_role NOT NULL DEFAULT 'admin'
);

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    job_type job_type DEFAULT 'full_time',
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    headcount INT NOT NULL DEFAULT 1 CHECK (headcount > 0),
    min_salary INT NOT NULL,
    max_salary INT,
    CHECK (min_salary >= 0 AND (max_salary IS NULL OR max_salary >= min_salary)),
    urgent BOOLEAN NOT NULL DEFAULT FALSE,
    status job_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    archived_at TIMESTAMPTZ,
    CHECK (is_archived = FALSE OR archived_at IS NOT NULL),

    CONSTRAINT fk_jobs_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    resume_url TEXT NOT NULL,
    portfolio_url TEXT,
    status application_status DEFAULT 'applied',
    interview_date TIMESTAMPTZ,
    CHECK (interview_date IS NULL OR interview_date >= created_at),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rejected_at TIMESTAMPTZ,

    CONSTRAINT fk_applications_job
        FOREIGN KEY (job_id)
        REFERENCES jobs(id)
        ON DELETE CASCADE,

    UNIQUE (job_id, email)
);

CREATE TABLE IF NOT EXISTS application_tokens (
    id SERIAL PRIMARY KEY,
    application_id INT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_application_tokens
        FOREIGN KEY (application_id)
        REFERENCES applications(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    job_id INT,
    application_id INT,
    action VARCHAR(255) NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_activity_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_activity_job
        FOREIGN KEY (job_id)
        REFERENCES jobs(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_activity_application
        FOREIGN KEY (application_id)
        REFERENCES applications(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(job_id, status);
CREATE INDEX idx_application_tokens_application_id ON application_tokens(application_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_application_id ON activity_logs(application_id);