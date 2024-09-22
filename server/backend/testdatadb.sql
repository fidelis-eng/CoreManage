-- Insert users data into the users table
INSERT INTO users (name, email, role, position, department, join_date, profile_image, phone, username, password, created_at, updated_at) VALUES
('Nicole Lopez', 'nicole.lopez@example.com', 'Admin', 'Lead Frontend Developer', 'Product', '2021-03-12T23:59:00+07:00', '/images/nicole-lopez.jpg', '+1-555-1347', 'nicole.lopez', '$2a$10$n.8JmXrOfCdSuBIiTNKdbu6w5sMegegoCt1TE93Rr4mgRYmvJqkXS', NOW(), NOW()), -- password: Nicole123
('Adrienne Fox', 'adrienne.fox@example.com', 'Admin', 'Senior Frontend Developer', 'Design', '2020-07-24T23:59:00+07:00', '/images/adrienne-fox.jpg', '+1-555-5678', 'adrienne.fox', '$2a$10$ksNhXynbOHgYxp08o/j8Mek/HcyX4Knd8NLAebqHHqnrZLT6yB8MW', NOW(), NOW()), -- password: Adrienne456
('Zachary Garcia', 'zachary.garcia@example.com', 'Staff', 'Frontend Developer', 'Engineering', '2022-01-15T23:59:00+07:00', '/images/zachary-garcia.jpg', '+1-555-8765', 'zachary.garcia', '$2a$10$ZAUz.BlSA8k9044cbeyhA.PNFMFDWclOgwoR5uRjJjKKCs.RYKILC', NOW(), NOW()), -- password: Zachary789
('Elizabeth Lopez', 'elizabeth.lopez@example.com', 'Staff', 'Junior Frontend Developer', 'Marketing', '2021-10-03T23:59:00+07:00', '/images/elizabeth-lopez.jpg', '+1-555-4321', 'elizabeth.lopez', '$2a$10$ij/3vQkji2tSeuIlGXXGr.T6Df8yfvWy6fAl6yM5nuf6whiDV94BS', NOW(), NOW()), -- password: Elizabeth101
('Amanda Foster', 'amanda.foster@example.com', 'Staff', 'Backend Developer', 'Sales', '2022-06-19T23:59:00+07:00', '/images/amanda-foster.jpg', '+1-555-1928', 'amanda.foster', '$2a$10$msh4DjC2pAMFwH3EngZIsOrYPNPFUs9DdPhRG0rUl58gZh1I2IB86', NOW(), NOW()), -- password: Amanda202
('Tiffany Hernandez', 'tiffany.hernandez@example.com', 'Staff', 'Senior Backend Developer', 'Product', '2021-04-14T23:59:00+07:00', '/images/tiffany-hernandez.jpg', '+1-555-2839', 'tiffany.hernandez', '$2a$10$Unlg45UIvv9.Z1vLGMaSP.E8qRjo/erl3ZCTEDpZfP9F2ZHaqBHNS', NOW(), NOW()), -- password: Tiffany303
('Michael Pierce', 'michael.pierce@example.com', 'Staff', 'QA Engineer', 'Design', '2020-11-11T23:59:00+07:00', '/images/michael-pierce.jpg', '+1-555-3456', 'michael.pierce', '$2a$10$Etuxn7px8Sukp7he/IvemOqZ5oI7KmyYwOZXg6yccyguLAEUOs.ba', NOW(), NOW()), -- password: Michael404
('Zachary Bullock', 'zachary.bullock@example.com', 'Staff', 'Junior QA Engineer', 'Marketing', '2023-02-22T23:59:00+07:00', '/images/zachary-bullock.jpg', '+1-555-6543', 'zachary.bullock', '$2a$10$S.OHDv4UFgAsI3cIEZreoO0lqnCA4GG/k69CXRmV98DMFy8oaLHTm', NOW(), NOW()), -- password: Zachary505
('Emma Rodriguez', 'emma.rodriguez@example.com', 'Staff', 'Database Designer', 'Sales', '2021-09-05T23:59:00+07:00', '/images/emma-rodriguez.jpg', '+1-555-9876', 'emma.rodriguez', '$2a$10$.oltb06YU3ZK2eZUBSIcB.UWSnbS5idiyS.AWiigLShlXcOneryLG', NOW(), NOW()), -- password: Emma606
('Liam Chen', 'liam.chen@example.com', 'Staff', 'Senior Database Designer', 'Product', '2020-12-08T23:59:00+07:00', '/images/liam-chen.jpg', '+1-555-1357', 'liam.chen', '$2a$10$O3L97x4IRtVihKEM2wP8L.By4NIKFxz03Wb3aI9v2/X4ouk2PBB2O', NOW(), NOW()), -- password: Liam707
('Sophia Patel', 'sophia.patel@example.com', 'Staff', 'Database Administrator', 'Design', '2022-05-16T23:59:00+07:00', '/images/sophia-patel.jpg', '+1-555-2468', 'sophia.patel', '$2a$10$cMp7PsHDr5.TA3iD7wuqV.FuEkgJsRhl8xrhA7W2H1at0WuAA6gSC', NOW(), NOW()), -- password: Sophia808
('Noah Kim', 'noah.kim@example.com', 'Staff', 'Junior Database Administrator', 'Marketing', '2021-08-25T23:59:00+07:00', '/images/noah-kim.jpg', '+1-555-3698', 'noah.kim', '$2a$10$8d8eGHz/D0q71Xki0b.jIeePBSa78mh4n3c4aNkEVIClARYE8MDEK', NOW(), NOW()), -- password: Noah909
('Blue Linda', 'blue.linda@example.com', 'Staff', 'Data Analyst', 'Analytics', '2023-08-01T23:59:00+07:00', '/images/blue-linda.jpg', '+1-555-7890', 'blue.linda', '$2a$10$34d/11T5h682l7lsWd3Oreernxb0cGuMjCW1ysvjw8xWoRmga25B2', NOW(), NOW()); -- password: Blue1010

INSERT INTO organizations (name, location, industry, established, employees, created_at, updated_at) VALUES
('Tech Innovations', 'Jakarta, Indonesia', 'Technology', '2015', 150, NOW(), NOW()),
('Creative Solutions', 'Bandung, Indonesia', 'Design', '2018', 50, NOW(), NOW()),
('Data Insights', 'Surabaya, Indonesia', 'Analytics', '2020', 30, NOW(), NOW()),
('nicole.lopez', '', '', '', 0, NOW(), NOW()),
('adrienne.fox', '', '', '', 0, NOW(), NOW()),
('zachary.garcia', '', '', '', 0, NOW(), NOW()),
('elizabeth.lopez', '', '', '', 0, NOW(), NOW()),
('amanda.foster', '', '', '', 0, NOW(), NOW()),
('tiffany.hernandez', '', '', '', 0, NOW(), NOW()),
('michael.pierce', '', '', '', 0, NOW(), NOW()),
('zachary.bullock', '', '', '', 0, NOW(), NOW()),
('emma.rodriguez', '', '', '', 0, NOW(), NOW()),
('liam.chen', '', '', '', 0, NOW(), NOW()),
('sophia.patel', '', '', '', 0, NOW(), NOW()),
('noah.kim', '', '', '', 0, NOW(), NOW()),
('blue.linda', '', '', '', 0, NOW(), NOW());

INSERT INTO user_organizations (user_id, organization_id, organization_name, user_name) VALUES
(1, 1, 'Tech Innovations', 'Nicole Lopez'), 
(1, 4, 'nicole.lopez', 'Nicole Lopez'), 
(2, 1, 'Tech Innovations', 'Adrienne Fox'), 
(2, 5, 'adrienne.fox', 'Adrienne Fox'), 
(3, 1, 'Tech Innovations', 'Zachary Garcia'), 
(3, 6, 'zachary.garcia', 'Zachary Garcia'), 
(4, 1, 'Tech Innovations', 'Elizabeth Lopez'), 
(4, 7, 'elizabeth.lopez', 'Elizabeth Lopez'), 
(5, 1, 'Tech Innovations', 'Amanda Foster'), 
(5, 8, 'amanda.foster', 'Amanda Foster'), 
(6, 1, 'Tech Innovations', 'Tiffany Hernandez'),
(6, 9, 'tiffany.hernandez', 'Tiffany Hernandez'), 
(7, 1, 'Tech Innovations', 'Michael Pierce'), 
(7, 10, 'michael.pierce', 'Michael Pierce'), 
(8, 1, 'Tech Innovations', 'Zachary Bullock'), 
(8, 11, 'zachary.bullock', 'Zachary Bullock'), 
(9, 1, 'Tech Innovations', 'Emma Rodriguez'),
(9, 12, 'emma.rodriguez', 'Emma Rodriguez'), 
(10, 1, 'Tech Innovations', 'Liam Chen'), 
(10, 13, 'liam.chen', 'Liam Chen'), 
(11, 1, 'Tech Innovations', 'Sophia Patel'), 
(11, 14, 'sophia.patel', 'Sophia Patel'), 
(12, 1, 'Tech Innovations', 'Noah Kim'), 
(12, 15, 'noah.kim', 'Noah Kim'), 
(13, 1, 'Tech Innovations', 'Blue Linda'),
(13, 16, 'blue.linda', 'Blue Linda');


INSERT INTO group_tasks (organization_id, title, created_at, updated_at) VALUES
(1, 'Frontend Team', NOW(), NOW()),
(1, 'Backend Team', NOW(), NOW()),
(1, 'QA Team', NOW(), NOW()),
(1, 'Database Design Team', NOW(), NOW()),
(1, 'Database Administration Team', NOW(), NOW());

INSERT INTO tasks (title, description, status, deadline, group_task_id, created_at, updated_at) VALUES
('Implement login UI', 'Develop the user login page using React and Chakra UI.', 'In Progress', '2024-09-15 23:59:00+07:00', 1, NOW(), NOW()),
('Design registration page', 'Create a responsive registration page with input validation.', 'To Do', '2024-09-12 23:59:00+07:00', 1, NOW(), NOW()),
('Set up OAuth UI', 'Design and integrate OAuth login buttons for Google and Facebook.', 'In Progress', '2024-09-16 23:59:00+07:00', 1, NOW(), NOW()),
('Add password reset UI', 'Design forgot password and reset password forms.', 'To Do', '2024-09-20 23:59:00+07:00', 1, NOW(), NOW()),
('Create user authentication API', 'Develop login, registration, and JWT-based authentication APIs.', 'To Do', '2024-09-25 23:59:00+07:00', 2, NOW(), NOW()),
('Integrate data analytics API', 'Build APIs for capturing user activity and generating analytics data.', 'In Progress', '2024-09-23 23:59:00+07:00', 2, NOW(), NOW()),
('Test authentication flow', 'Write and execute test cases for login, registration, and password reset features.', 'In Progress', '2024-09-30 23:59:00+07:00', 3, NOW(), NOW()),
('Test UI responsiveness', 'Ensure the frontend UI is responsive across various devices and screen sizes.', 'To Do', '2024-10-05 23:59:00+07:00', 3, NOW(), NOW()),
('Normalize customer data schema', 'Analyze and normalize the existing customer data schema to reduce redundancy and improve data integrity.', 'In Progress', '2024-10-15 23:59:00+07:00', 4, NOW(), NOW()),
('Design index strategy', 'Develop an efficient indexing strategy for frequently queried columns to optimize query performance.', 'To Do', '2024-10-20 23:59:00+07:00', 4, NOW(), NOW()),
('Implement automated backups', 'Set up and test an automated backup system for all production databases, ensuring data recoverability.', 'In Progress', '2024-10-10 23:59:00+07:00', 5, NOW(), NOW()),
('Optimize query performance', 'Analyze slow-running queries and implement optimizations to improve overall database performance.', 'To Do', '2024-10-25 23:59:00+07:00', 5, NOW(), NOW());

INSERT INTO user_tasks (task_id, user_id, user_name) VALUES
(1, 1, 'Nicole Lopez'),  -- Nicole Lopez for "Implement login UI"
(2, 2, 'Adrienne Fox'),  -- Adrienne Fox for "Design registration page"
(3, 3, 'Zachary Garcia'),  -- Zachary Garcia for "Set up OAuth UI"
(4, 4, 'Elizabeth Lopez'),  -- Elizabeth Lopez for "Add password reset UI"
(5, 5, 'Amanda Foster'),  -- Amanda Foster for "Create user authentication API"
(6, 6, 'Tiffany Hernandez'),  -- Tiffany Hernandez for "Integrate data analytics API"
(6, 13,'Blue Linda'), -- Blue Linda for "Integrate data analytics API"
(7, 7, 'Michael Pierce'),  -- Michael Pierce for "Test authentication flow"
(8, 8, 'Zachary Bullock'),  -- Zachary Bullock for "Test UI responsiveness"
(9, 9, 'Emma Rodriguez'),  -- Emma Rodriguez for "Normalize customer data schema"
(10, 10, 'Liam Chen'),-- Liam Chen for "Design index strategy"
(11, 11, 'Sophia Patel'),-- Sophia Patel for "Implement automated backups"
(12, 12, 'Noah Kim');-- Noah Kim for "Optimize query performance"