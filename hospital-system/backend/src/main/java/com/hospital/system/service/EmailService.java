package com.hospital.system.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    public void sendEmail(String to, String subject, String body) {
        // Mock email sending
        log.info("Sending email to: {}", to);
        log.info("Subject: {}", subject);
        log.info("Body: {}", body);
    }
}
