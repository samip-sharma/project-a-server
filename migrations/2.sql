CREATE TABLE one_time_passwords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(15) NOT NULL,
  value VARCHAR(6) NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS one_time_passwords_on_phone_number_idx ON one_time_passwords (phone_number);
CREATE INDEX IF NOT EXISTS one_time_passwords_on_created_at_idx ON one_time_passwords (created_at);
CREATE INDEX IF NOT EXISTS one_time_passwords_on_value_idx ON one_time_passwords (value);
