CREATE TABLE IF NOT EXISTS media (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes INT UNSIGNED NOT NULL,
  file_data LONGBLOB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_media_created (created_at)
);

INSERT INTO settings(setting_key,setting_value) VALUES
('header_enabled','0'),
('header_html',''),
('header_css',''),
('footer_enabled','0'),
('footer_sticky','0'),
('footer_html',''),
('footer_css','')
ON DUPLICATE KEY UPDATE setting_key=VALUES(setting_key);
