CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(15) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS users_on_phone_number_idx ON users (phone_number);
