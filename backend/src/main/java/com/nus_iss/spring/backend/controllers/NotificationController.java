package com.nus_iss.spring.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nus_iss.spring.backend.dtos.NotificationDto;
import com.nus_iss.spring.backend.services.NotificationServiceImpl;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/notif")
public class NotificationController {

    @Autowired
    private NotificationServiceImpl notificationServiceImpl;

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome, the notification endpoint is working!";
    }

    @PostMapping("/createNotification")
    public ResponseEntity<String> createNotification(@RequestBody NotificationDto notificationDto) {
        try {
            return new ResponseEntity<>(notificationServiceImpl.createNotification(notificationDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.I_AM_A_TEAPOT);
        }
    }
    
    @PostMapping("/updateNotification")
    public ResponseEntity<String> updateNotification(@RequestBody NotificationDto notificationDto) {
        try {
            return new ResponseEntity<>(notificationServiceImpl.updateNotification(notificationDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.I_AM_A_TEAPOT);
        }
    }
}
