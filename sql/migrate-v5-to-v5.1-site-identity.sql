INSERT INTO settings(setting_key,setting_value) VALUES
('site_title','Landing CMS Pro'),
('site_name','Landing CMS Pro'),
('meta_description','Landing Page CMS'),
('favicon_url',''),
('site_logo_url','')
ON DUPLICATE KEY UPDATE setting_key=VALUES(setting_key);
